import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'

import { readIconSources } from './icon-sources.ts'

/**
 * Writes core's `essentials` pack, `packages/core/src/components/icon/essential-icons.ts`: the icons Lyra's own
 * components use, a subset of the icon pack's, drawn from the same SVG sources, so the two never differ. With
 * `--check`, it fails instead when the file isn't up to date.
 *
 * It takes the icons the components in core, auth and extras show, and fails on one whose name it can't tell, so none
 * is left out of the pack unnoticed. A component names its icons so the script sees them:
 * - in a template, an `<nb-icon>` with `pack="essentials"` and either `icon="name"`, or an `[icon]` binding whose results
 *   are quoted names (`open ? 'chevron-up-outline' : 'chevron-down-outline'`), or a method, `computed` or input of the
 *   component's (in its own file or its folder) whose `return`s, result or default are such names;
 * - in code, an icon setting written out whole: `{ icon: 'name', pack: 'essentials' }`.
 *
 * A component's own icon always comes from the `essentials` pack, so an app without `@liquid-js/lyr-icons`, or with
 * another default pack, still shows it; an `<nb-icon>` that names an icon without it fails the script too. Icons the
 * app gives a component (a menu item's, an action's) keep the pack the app says.
 */
const root = resolve(import.meta.dirname, '..')
const output = join(root, 'packages/core/src/components/icon/essential-icons.ts')
const libraries = ['packages/core/src', 'packages/auth/src', ...extrasSources()].map((folder) => join(root, folder))
const ESSENTIALS = 'essentials'

function extrasSources(): string[] {
    const extras = join(root, 'packages/extras')
    return readdirSync(extras)
        .filter((entry) => existsSync(join(extras, entry, 'src')))
        .map((entry) => `packages/extras/${entry}/src`)
}

function filesOf(folder: string): string[] {
    return readdirSync(folder).flatMap((entry) => {
        const path = join(folder, entry)
        if (statSync(path).isDirectory()) {
            return filesOf(path)
        }
        return /\.(ts|html)$/.test(entry) && !/\.spec\.ts$/.test(entry) ? [path] : []
    })
}

/** Code without its comments, whose examples name icons of an app's. */
const withoutComments = (code: string) => code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1')

const files = libraries.flatMap(filesOf)
const texts = new Map(files.map((file) => [file, file.endsWith('.ts') ? withoutComments(readFileSync(file, 'utf8')) : readFileSync(file, 'utf8')]))

/** Where a character is at the expression's top level: not in quotes or brackets. */
function topLevel(expression: string, at: (index: number) => boolean): number {
    let depth = 0
    let openQuote = ''
    for (let i = 0; i < expression.length; i++) {
        const char = expression[i]
        if (openQuote) {
            openQuote = char === openQuote && expression[i - 1] !== '\\' ? '' : openQuote
        } else if (!depth && at(i)) {
            return i
        } else if ('\'"`'.includes(char)) {
            openQuote = char
        } else if ('([{'.includes(char)) {
            depth++
        } else if (')]}'.includes(char)) {
            depth--
        }
    }
    return -1
}

/**
 * The icon names an expression gives, or nothing when it can't tell: a quoted name, a choice between such
 * (`a ? 'x' : b ? 'y' : 'z'`), or a member of the component's whose results are.
 */
function namesOf(expression: string, file: string): string[] | undefined {
    let text = expression.trim()
    while (text.startsWith('(') && topLevel(text.slice(1), (i) => text[i + 1] === ')') === text.length - 2) {
        text = text.slice(1, -1).trim()
    }
    const literal = /^'([a-z0-9-]+)'$/.exec(text) ?? /^"([a-z0-9-]+)"$/.exec(text)
    if (literal) {
        return [literal[1]]
    }
    // A choice: its condition, then what it gives either way. `?.` and `??` aren't one.
    const question = topLevel(text, (i) => text[i] === '?' && !'.?'.includes(text[i + 1]) && text[i - 1] !== '?')
    if (question >= 0) {
        let nested = 0
        const rest = text.slice(question + 1)
        const colon = topLevel(rest, (i) => {
            if (rest[i] === '?' && !'.?'.includes(rest[i + 1]) && rest[i - 1] !== '?') {
                nested++
            } else if (rest[i] === ':') {
                return nested-- === 0
            }
            return false
        })
        const yes = colon >= 0 ? namesOf(rest.slice(0, colon), file) : undefined
        const no = colon >= 0 ? namesOf(rest.slice(colon + 1), file) : undefined
        return yes && no ? [...yes, ...no] : undefined
    }
    // A member, or a call of one, with or without arguments: what it gives is what its returns name.
    const member = /^(?:this\.)?([A-Za-z_$][\w$]*)(?:\([^()]*\))?$/.exec(text)?.[1]
    return member ? memberNames(member, file) : undefined
}

/** Where a member is declared: at a line's start, after its modifiers, not where a template or code uses it. */
const DECLARATION = '^[ \\t]*(?:(?:public|protected|private|readonly|static|override)\\s+)*'

/**
 * The expressions a function body returns: each `return`'s, up to a top-level `;` or a line break the expression
 * doesn't continue past, so it reads code with or without semicolons.
 */
function returnedExpressions(body: string): string[] {
    return [...body.matchAll(/\breturn\s+/g)].map((match) => {
        const rest = body.slice((match.index ?? 0) + match[0].length)
        const end = topLevel(rest, (i) => {
            if (rest[i] === ';' || rest[i] === '}') {
                return true
            }
            if (rest[i] !== '\n') {
                return false
            }
            const before = rest.slice(0, i).trimEnd()
            const after = rest.slice(i).trimStart()
            return !/[?:.|&+\-*/,(=]$/.test(before) && !/^[?:.|&+\-*/,)]/.test(after)
        })
        return (end >= 0 ? rest.slice(0, end) : rest).trim()
    })
}

/** What a component member gives, from its file or another in its folder: an input's default, or its `return`s. */
function memberNames(member: string, file: string): string[] | undefined {
    const folder = dirname(file)
    const candidates = [file.replace(/\.html$/, '.ts'), ...files.filter((other) => dirname(other) === folder && other.endsWith('.ts'))]
    for (const candidate of [...new Set(candidates)]) {
        const code = texts.get(candidate)
        if (!code) {
            continue
        }
        const input = new RegExp(`${DECLARATION}${member}\\s*=\\s*input(?:<[^>]*>)?\\(\\s*('[^']*'|"[^"]*")`, 'm').exec(code)
        if (input) {
            return namesOf(input[1], candidate)
        }
        const start = new RegExp(
            `${DECLARATION}${member}\\s*(?:=\\s*computed(?:<[^>]*>)?\\(\\s*\\(\\)\\s*=>|\\([^)]*\\)\\s*(?::[^{;=]+)?)\\s*`,
            'm'
        ).exec(code)
        if (!start) {
            continue
        }
        const after = code.slice(start.index + start[0].length)
        if (!after.startsWith('{')) {
            // An arrow's expression: up to the `)` that closes `computed(`.
            const end = topLevel(after, (i) => after[i] === ')' || after[i] === ',')
            return end >= 0 ? namesOf(after.slice(0, end), candidate) : undefined
        }
        const close = topLevel(after.slice(1), (i) => after[i + 1] === '}')
        const body = after.slice(1, close + 1)
        const returns = returnedExpressions(body).map((value) => namesOf(value, candidate))
        return returns.length && returns.every(Boolean) ? returns.flatMap((names) => names ?? []) : undefined
    }
    return undefined
}

const sources = readIconSources()
const known = new Set(sources.map(({ name }) => name))
const used = new Map<string, Set<string>>()
const problems = new Array<string>()

const use = (name: string, file: string) => {
    if (!known.has(name)) {
        problems.push(`${file}: ${name} isn't an icon of packages/icons/svg.`)
        return
    }
    used.set(name, (used.get(name) ?? new Set()).add(file))
}

for (const file of files) {
    const shown = relative(root, file)
    const text = texts.get(file) ?? ''
    for (const [tag] of text.matchAll(/<nb-icon\b[^>]*>/g)) {
        const quoted = tag.replace(/\s+/g, ' ')
        const icon = /\sicon="([^"]+)"/.exec(tag)?.[1]
        const binding = /\[icon\]="([^"]+)"/.exec(tag)?.[1]
        const packBinding = /\[pack\]="([^"]+)"/.exec(tag)?.[1]
        const essentials =
            /\spack="essentials"/.test(tag) || (!!packBinding && !!namesOf(packBinding, file)?.includes(ESSENTIALS))
        const names = icon ? [icon] : binding ? namesOf(binding, file) : undefined
        if (!essentials) {
            // An icon the app gives the component has no name here; one the component names is its own.
            if (names) {
                problems.push(`${shown}: ${quoted} needs pack="essentials", as a component's own icon.`)
            }
            continue
        }
        if (!names) {
            problems.push(
                `${shown}: can't tell which icons ${quoted} shows. Have [icon] give quoted names (cond ? 'a' : 'b'), or bind ` +
                    'a method, computed or input whose returns, result or default are quoted names.'
            )
            continue
        }
        names.forEach((name) => use(name, shown))
    }
    if (file.endsWith('.ts') && !file.includes('/components/icon/')) {
    // An icon setting in code: written out whole, or the script can't tell which icon it is.
        const settings = /\{\s*icon:\s*'([a-z0-9-]+)',\s*pack:\s*(?:'essentials'|NB_ESSENTIAL_ICONS_PACK)\s*,?\s*\}/g
        for (const [, name] of text.matchAll(settings)) {
            use(name, shown)
        }
        // Inline templates' icons are the templates' rule's.
        const rest = text.replace(settings, '').replace(/<nb-icon\b[^>]*>/g, '').replace(/\binput(?:<[^>]*>)?\(\s*'essentials'\s*\)/g, '')
        if (/'essentials'|"essentials"|\bNB_ESSENTIAL_ICONS_PACK\b/.test(rest)) {
            problems.push(
                `${shown}: can't tell which icon it uses from the essentials pack. Write each as { icon: 'name', pack: ` +
                    '\'essentials\' }.'
            )
        }
    }
}

if (problems.length) {
    console.error(problems.join('\n'))
    process.exit(1)
}

const icons = sources.filter(({ name }) => used.has(name))
const quote = (text: string) => `'${text.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
/** The pack's keys: all quoted when one has to be, as the code style writes them. */
const key = icons.every(({ name }) => /^[a-z_$][\w$]*$/i.test(name)) ? (name: string) => name : quote
const svg = (markup: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">${markup}</svg>`

/** Object entries, one per line, separated by commas, as the code style writes them. */
const entries = (lines: string[]) => lines.map((line, i) => (i < lines.length - 1 ? `${line},` : line))

const content = [
    '// Written by scripts/essential-icons.ts from packages/icons/svg and the icons components use; run `yarn icons` after',
    '// changing either, don\'t edit this.',
    '',
    "import { NbIcons } from './icon-pack'",
    '',
    '/**',
    ' * The name of the pack with the icons Lyra\'s components use themselves, such as the select\'s chevron and the',
    ' * calendar\'s arrows. `NbIconLibraries` registers it; an app can replace some of its icons with',
    ' * `provideNbSvgIcons(\'essentials\', icons)`, or the whole pack with `registerSvgPack(\'essentials\', icons)`.',
    ' */',
    "export const NB_ESSENTIAL_ICONS_PACK = 'essentials'",
    '',
    '/** The `essentials` pack: the icons of `@liquid-js/lyr-icons` that Lyra\'s components use, as whole SVGs. */',
    'export const NB_ESSENTIAL_ICONS: NbIcons = {',
    ...entries(icons.map(({ name, markup }) => `    ${key(name)}: ${quote(svg(markup))}`)),
    '}',
    ''
].join('\n')

if (process.argv.includes('--check')) {
    const current = existsSync(output) ? readFileSync(output, 'utf8') : ''
    if (current !== content) {
        console.error(`${relative(root, output)} is out of date with packages/icons/svg or the components: run \`yarn icons\`.`)
        process.exit(1)
    }
} else {
    writeFileSync(output, content)
    console.log(`Wrote ${icons.length} essential icons to ${relative(root, output)}: ${icons.map(({ name }) => name).join(', ')}`)
}
