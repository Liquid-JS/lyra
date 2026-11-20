import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

import { ICON_SOURCES, readIconSources } from './icon-sources.ts'

/**
 * Writes the icon pack's markup, `packages/icons/src/generated/icons.ts`, from the SVG sources in `packages/icons/svg`:
 * the upstream icons as published in `eva/`, and Lyra's own in `lyra/`. Each icon is the markup inside its file's
 * `<svg>`, which `NbAnimatedSvgIcon` wraps. With `--check`, it fails instead when the file isn't up to date.
 */
const root = resolve(import.meta.dirname, '..')
const output = join(root, 'packages/icons/src/generated/icons.ts')
const icons = readIconSources()

// Search keywords by icon name, without `-outline`: what each depicts, and what it's used for.
const keywords: Record<string, string[]> = JSON.parse(readFileSync(join(ICON_SOURCES, 'keywords.json'), 'utf8'))
const baseNames = [...new Set(icons.map(({ name }) => name.replace(/-outline$/, '')))]
const withoutKeywords = baseNames.filter((name) => !keywords[name]?.length)
const unknownKeywords = Object.keys(keywords).filter((name) => !baseNames.includes(name))
if (withoutKeywords.length || unknownKeywords.length) {
    throw new Error(
        'svg/keywords.json needs keywords for every icon, and only for them: ' +
            [
                withoutKeywords.length ? `missing ${withoutKeywords.join(', ')}` : '',
                unknownKeywords.length ? `no icon named ${unknownKeywords.join(', ')}` : ''
            ]
                .filter(Boolean)
                .join('; ') +
            '.'
    )
}

/** `star-outline` → `nbIconStarOutline`. */
const constantName = (name: string) =>
    'nbIcon' + name.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join('')
const quote = (text: string) => `'${text.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
/** An object's keys: all quoted when one has to be, as the code style writes them. */
const keysOf = (names: string[]) =>
    names.every((name) => /^[a-z_$][\w$]*$/i.test(name)) ? (name: string) => name : quote

/** Object entries, one per line, separated by commas, as the code style writes them. */
const entries = (lines: string[]) => lines.map((line, i) => (i < lines.length - 1 ? `${line},` : line))

const iconKey = keysOf(icons.map(({ name }) => name))
const keywordKey = keysOf(baseNames)

const content = [
    '// Written by scripts/icons.ts from packages/icons/svg; run `yarn icons` after changing those, don\'t edit this.',
    '',
    ...icons.map(({ name, markup }) => `export const ${constantName(name)} = ${quote(markup)}`),
    '',
    '/** Every icon of the pack, by name. */',
    'export const NB_ICONS: Readonly<Record<string, string>> = {',
    ...entries(icons.map(({ name }) => `    ${iconKey(name)}: ${constantName(name)}`)),
    '}',
    '',
    '/** Search keywords by icon name, without `-outline`: what each icon depicts, and what it\'s used for. */',
    'export const NB_ICON_KEYWORDS: Readonly<Record<string, ReadonlyArray<string>>> = {',
    ...entries(baseNames.sort().map((name) => `    ${keywordKey(name)}: [${keywords[name].map(quote).join(', ')}]`)),
    '}',
    ''
].join('\n')

if (process.argv.includes('--check')) {
    const current = existsSync(output) ? readFileSync(output, 'utf8') : ''
    if (current !== content) {
        console.error('packages/icons/src/generated/icons.ts is out of date with packages/icons/svg: run `yarn icons`.')
        process.exit(1)
    }
} else {
    writeFileSync(output, content)
    console.log(`Wrote ${icons.length} icons to packages/icons/src/generated/icons.ts`)
}
