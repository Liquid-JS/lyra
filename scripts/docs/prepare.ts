import { copyFileSync, cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import * as ts from 'typescript'
import { collectSourceFiles, extractApi, type DocClass } from './api.ts'
import { exportThemes } from './themes.ts'
import type { ExampleContent, OverviewNode } from './examples.ts'

/**
 * Prepares everything the docs app needs before `ng build docs`:
 *  - the API JSON extracted from the library sources,
 *  - the playground examples copied under the docs assets,
 *  - the theme variable tables exported from Sass,
 *  - the version metadata shown in the version switcher.
 */

const root = resolve(import.meta.dirname, '..', '..')
const docsSrc = join(root, 'packages', 'docs', 'src')
const playground = join(root, 'packages', 'playground', 'src', 'playground')
const docsPublic = join(root, 'packages', 'docs', 'public')
const examplesDir = join(docsPublic, 'assets', 'examples')
const output = join(docsPublic, 'output.json')
const themeValuesDir = join(docsPublic, 'theme-values')
const EXTENSIONS = ['ts', 'html', 'scss']

console.log('Extracting API documentation')
const classes = extractApi(root, collectSourceFiles(join(root, 'packages')))
validateStructure(classes)
validateNotes()

console.log('Copying playground examples')
rmSync(examplesDir, { recursive: true, force: true })
mkdirSync(examplesDir, { recursive: true })
for (const entry of readdirSync(playground, { withFileTypes: true })) {
    if (entry.isFile()) {
        copyFileSync(join(playground, entry.name), join(examplesDir, entry.name))
    }
}
for (const dir of ['with-layout', 'without-layout']) {
    cpSync(join(playground, dir), examplesDir, { recursive: true })
}
stripHeaders(examplesDir)
for (const cls of classes) {
    validateExamples(cls)
    cls.overview = cls.overview.map(unfold)
    cls.liveExamples = cls.liveExamples.map(unfold)
}

console.log('Exporting themes')
const { themes, completeThemes, themeValues } = exportThemes(join(docsSrc, 'themes.scss'))

// The style tables show each variable's value in the default theme and the variable it follows, so the app doesn't
// need the theme's data for them.
const defaultTheme = completeThemes['default'].data
for (const cls of classes) {
    for (const group of cls.styles) {
        for (const style of group.styles) {
            const prop = defaultTheme[style.name]
            if (prop?.value != null) {
                style.value = String(prop.value)
            }
            const parent = prop?.parents[0]?.prop
            if (parent) {
                style.parent = parent
            }
        }
    }
}

writeFileSync(
    output,
    JSON.stringify({ metadata: { language: 'typescript', generator: 'typedoc', framework: 'angular' }, classes, themes })
)
console.log(`Wrote ${classes.length} classes to ${output}`)

// A theme's values are only needed to start a theme from it, so each is a file of its own, loaded then.
rmSync(themeValuesDir, { recursive: true, force: true })
mkdirSync(themeValuesDir, { recursive: true })
for (const [name, values] of Object.entries(themeValues)) {
    writeFileSync(join(themeValuesDir, `${name}.json`), JSON.stringify(values))
}
console.log(`Wrote ${Object.keys(themeValues).length} themes' values to ${themeValuesDir}`)

// Lyra's version is the release's, in lerna.json; packages a release didn't change keep an earlier one.
const version = JSON.parse(readFileSync(join(root, 'lerna.json'), 'utf8')).version as string
writeFileSync(join(docsSrc, 'version.ts'), `export const VERSION_NAME = '${version}'\n`)
writeFileSync(
    join(docsPublic, 'versions.json'),
    JSON.stringify([{ checkoutTarget: 'master', name: version, path: '/lyra/', isCurrent: true }], null, 4) + '\n'
)

function stripHeaders(dir: string) {
    // Strip the licence header comment so examples read cleanly in the docs.
    for (const file of listFiles(dir)) {
        const content = readFileSync(file, 'utf8')
        const stripped = content.replace(/\/\*\*.*?\*\/\n\s*\n/s, '')
        if (stripped !== content) {
            writeFileSync(file, stripped)
        }
    }
}

function listFiles(dir: string): string[] {
    return readdirSync(dir, { recursive: true, withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map((entry) => join(entry.parentPath, entry.name))
}

function exampleFiles(id: string): string[] {
    if (EXTENSIONS.some((extension) => id.endsWith(`.${extension}`))) {
        return [id]
    }
    return EXTENSIONS.map((extension) => `${id}.${extension}`).filter((file) => existsSync(join(examplesDir, file)))
}

// A page whose `source` names a class the API doesn't have breaks the whole docs app at runtime, so fail here instead,
// e.g. when a statement between a class and its doc comment leaves the class undocumented.
function validateStructure(documented: DocClass[]) {
    const names = new Set(documented.map((cls) => cls.name))
    const file = join(docsSrc, 'structure.ts')
    const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest)
    const missing = new Array<string>()
    const visit = (node: ts.Node) => {
        const isSourceList =
            ts.isPropertyAssignment(node) &&
            node.name.getText(source) === 'source' &&
            ts.isArrayLiteralExpression(node.initializer)
        if (isSourceList) {
            for (const element of node.initializer.elements) {
                if (ts.isStringLiteral(element) && !names.has(element.text)) {
                    missing.push(element.text)
                }
            }
        }
        ts.forEachChild(node, visit)
    }
    visit(source)
    if (missing.length) {
        throw new Error(
            `structure.ts names classes without API documentation (is their doc comment right above them?):\n${missing.join('\n')}`
        )
    }
}

// The docs render an article's HTML as it is, so Markdown inside a note's HTML shows raw, e.g. a link's brackets, or
// vanishes, e.g. a tag in backticks: a note is written in HTML throughout.
function validateNotes() {
    const markdown = /\]\(|`|\*\*/
    const found = listFiles(join(docsPublic, 'articles'))
        .filter((file) => file.endsWith('.md'))
        .flatMap((file) =>
            [...readFileSync(file, 'utf8').matchAll(/<div class="note-body">([\s\S]*?)<\/div>/g)]
                .filter(([, body]) => markdown.test(body))
                .map(([, body]) => `${file.slice(docsPublic.length + 1)}: ${body.trim().slice(0, 60)}`)
        )
    if (found.length) {
        throw new Error(`These notes have Markdown inside their HTML, which shows raw; write it in HTML, e.g. <a href> and <code>:\n${found.join('\n')}`)
    }
}

function validateExamples(cls: DocClass) {
    const missing = cls.overview
        .filter((node) => node.type !== 'text')
        .map((node) => node.content as ExampleContent)
        .filter(({ id }) => exampleFiles(id).every((file) => !existsSync(join(examplesDir, file))))
    if (missing.length) {
        throw new Error(`Can't resolve examples referenced by ${cls.name}:\n${missing.map(({ name, id }) => `${name}, ${id}`).join('\n')}`)
    }
}

function unfold(node: OverviewNode): OverviewNode {
    if (node.type === 'text') {
        return node
    }
    const content = node.content as ExampleContent
    const files = exampleFiles(content.id)
    const id = EXTENSIONS.some((extension) => content.id.endsWith(`.${extension}`))
        ? content.id.replace(/\.(ts|html|scss)$/, '')
        : content.id
    return { ...node, content: { ...content, files, id } }
}
