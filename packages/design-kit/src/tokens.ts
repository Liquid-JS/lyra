import { mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

import { exportThemes, type ThemeValue } from '../../../scripts/docs/themes.ts'

/**
 * Writes a theme's variables as design tokens in the W3C Design Tokens Format (DTCG 2025.10), the file the design
 * kit is made from, for Sketch, Figma and Penpot, and that design tools import:
 *
 *   yarn design-kit:tokens [theme, by default "default"] [output, by default dist/design-kit/tokens.json]
 *
 * Tokens are grouped by the component or theme area their CSS variable starts with, and a token's group and name
 * joined by a hyphen are its CSS variable: `button` › `filled-primary-background-color` is
 * `--button-filled-primary-background-color`. A variable that follows another is an alias of it, so the design
 * tools keep the same links as the theme. Values the format can't hold (paddings with several sides, `calc()` with
 * units it can't add up, keywords such as `uppercase`) are kept as CSS in their group's `$extensions`, under
 * `io.github.liquid-js.lyra`, by the CSS variable's name, which design tools ignore and developers and agents read,
 * e.g. `--layout-padding`.
 */

const root = resolve(import.meta.dirname, '..', '..', '..')
const themeName = process.argv[2] ?? 'default'
// A path given relative to where the command was run, which Yarn passes on as INIT_CWD.
const output = resolve(process.env['INIT_CWD'] ?? process.cwd(), process.argv[3] ?? join(root, 'dist', 'design-kit', 'tokens.json'))

const { themeValues } = exportThemes(join(root, 'packages', 'docs', 'src', 'themes.scss'))
const theme = themeValues[themeName]
if (!theme) {
    throw new Error(`No theme "${themeName}"; the themes are ${Object.keys(themeValues).join(', ')}`)
}

/** Areas of the theme itself, before the components'. */
const THEME_AREAS = ['color', 'background', 'border', 'text', 'font', 'shadow', 'outline', 'divider', 'scrollbar', 'link', 'control']

/** Components whose name has a hyphen, so the first word alone would group them under another component. */
const COMPOUND_COMPONENTS = [
    'button-group',
    'icon-button',
    'option-list',
    'tag-input',
    'tag-list',
    'flip-card',
    'reveal-card',
    'route-tabset',
    'tree-grid',
    'context-menu',
    'progress-bar',
    'page-indicator',
    'file-drop',
    'input-group',
    'form-field',
    'theme-select',
    'color-picker',
    'phone-input',
    'qr-code',
    'markdown-editor',
    'markdown-viewer'
]

const components = [
    ...readdirSync(join(root, 'packages', 'core'), { withFileTypes: true }),
    ...readdirSync(join(root, 'packages', 'extras'), { withFileTypes: true })
]
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
const GROUPS = [...new Set([...COMPOUND_COMPONENTS, ...components, ...THEME_AREAS])].sort((a, b) => b.length - a.length)

/** The group a variable belongs to: the longest component or area its name starts with, else its first word. */
function groupOf(name: string): string {
    return GROUPS.find((group) => name.startsWith(`${group}-`)) ?? name.split('-')[0]
}

interface Token { $type: string, $value: unknown }

const REM = 16

function parseColor(value: string): Token['$value'] | undefined {
    let red: number; let green: number; let blue: number
    let alpha = 1
    const hex = /^#([\da-f]{6})([\da-f]{2})?$/i.exec(value)
    const rgb = /^rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\s*\)$/.exec(value)
    if (hex) {
        ;[red, green, blue] = [0, 2, 4].map((at) => parseInt(hex[1].slice(at, at + 2), 16))
        alpha = hex[2] ? parseInt(hex[2], 16) / 255 : 1
    } else if (rgb) {
        ;[red, green, blue] = [1, 2, 3].map((at) => Number(rgb[at]))
        alpha = rgb[4] === undefined ? 1 : Number(rgb[4])
    } else {
        return undefined
    }
    const toHex = (channel: number) => channel.toString(16).padStart(2, '0')
    return {
        colorSpace: 'srgb',
        components: [red, green, blue].map((channel) => Math.round((channel / 255) * 10000) / 10000),
        ...(alpha === 1 ? {} : { alpha }),
        hex: `#${toHex(red)}${toHex(green)}${toHex(blue)}`
    }
}

/** A length in rem or px, or a `calc()` adding up such lengths, as a DTCG dimension. */
function parseDimension(value: unknown): Token['$value'] | undefined {
    if (value === 0 || value === '0') {
        return { value: 0, unit: 'px' }
    }
    if (typeof value !== 'string') {
        return undefined
    }
    const single = /^(-?[\d.]+)(rem|px)$/.exec(value)
    if (single) {
        return { value: Number(single[1]), unit: single[2] }
    }
    const calc = /^calc\((.+)\)$/.exec(value)
    if (!calc) {
        return undefined
    }
    // Only sums and differences of rem and px lengths, which add up to px.
    const terms = calc[1].match(/[+-]?\s*[\d.]+(?:rem|px)/g)
    if (!terms || terms.join('').replace(/\s/g, '') !== calc[1].replace(/\s/g, '')) {
        return undefined
    }
    const px = terms.reduce((total, term) => {
        const [, sign, amount, unit] = /^([+-]?)\s*([\d.]+)(rem|px)$/.exec(term.trim()) ?? []
        return total + (sign === '-' ? -1 : 1) * Number(amount) * (unit === 'rem' ? REM : 1)
    }, 0)
    return { value: Math.round(px * 1000) / 1000, unit: 'px' }
}

function parseShadow(value: unknown): Token['$value'] | undefined {
    if (!Array.isArray(value) || value.length < 3 || value.length > 5) {
        return undefined
    }
    const color = parseColor(String(value[value.length - 1]))
    const lengths = value.slice(0, -1).map(parseDimension)
    if (!color || lengths.some((length) => !length)) {
        return undefined
    }
    const zero = { value: 0, unit: 'px' }
    const [offsetX, offsetY, blur = zero, spread = zero] = lengths
    return { color, offsetX, offsetY, blur, spread }
}

function parseDuration(value: unknown): Token['$value'] | undefined {
    const duration = typeof value === 'string' ? /^([\d.]+)(ms|s)$/.exec(value) : null
    return duration ? { value: Number(duration[1]), unit: duration[2] } : undefined
}

/** A variable's value as a DTCG token, or undefined if the format can't hold it. */
function toToken(name: string, value: unknown): Token | undefined {
    const typed = (type: string, parsed: unknown) => (parsed === undefined ? undefined : { $type: type, $value: parsed })
    if (name.endsWith('shadow')) {
        // No shadow as one that draws nothing: design tools read a single shadow more reliably than an empty list.
        return typed('shadow', value === 'none' ? parseShadow([0, 0, 0, 0, 'rgba(0, 0, 0, 0)']) : parseShadow(value))
    }
    if (name.includes('font-family') && typeof value === 'string') {
        return typed('fontFamily', value.split(',').map((family) => family.trim().replace(/^["']|["']$/g, '')))
    }
    if (name.endsWith('font-weight') && typeof value === 'number') {
        return typed('fontWeight', value)
    }
    if (name.endsWith('duration')) {
        return typed('duration', parseDuration(value))
    }
    if (typeof value === 'string' && parseColor(value)) {
        return typed('color', parseColor(value))
    }
    if (name.endsWith('-style') && typeof value === 'string' && ['solid', 'dashed', 'dotted', 'double'].includes(value)) {
        return typed('strokeStyle', value)
    }
    const dimension = parseDimension(value)
    if (dimension) {
        return typed('dimension', dimension)
    }
    if (typeof value === 'number') {
        return typed('number', value)
    }
    return undefined
}

const tokens: Record<string, Token & { name: string, parent?: string }> = {}
const skipped: string[] = []
for (const [name, { value }] of Object.entries(theme.data)) {
    const token = toToken(name, value)
    if (token) {
        tokens[name] = { ...token, name }
    } else {
        skipped.push(name)
    }
}

/**
 * The nearest variable a token follows that is a token of the same type and value, so an alias always points at one:
 * a variable worked out from another, e.g. `calc(…  + 2px)`, follows it but keeps its own value.
 */
function aliasOf(name: string): string | undefined {
    const value = JSON.stringify(tokens[name].$value)
    let parent = (theme.data[name] as ThemeValue | undefined)?.parent
    while (parent) {
        if (tokens[parent]?.$type === tokens[name].$type && JSON.stringify(tokens[parent].$value) === value) {
            return parent
        }
        parent = (theme.data[parent] as ThemeValue | undefined)?.parent
    }
    return undefined
}

/** Where a token goes: its group and its name in it, or no group for a one-word variable such as `shadow`. */
function pathOf(name: string): string[] {
    const group = groupOf(name)
    return name.length > group.length ? [group, name.slice(group.length + 1)] : [name]
}

const document: Record<string, Record<string, unknown>> = {}
for (const name of Object.keys(tokens)) {
    const { $type, $value } = tokens[name]
    const alias = aliasOf(name)
    const token = { $type, $value: alias ? `{${pathOf(alias).join('.')}}` : $value }
    const [group, key] = pathOf(name)
    if (key === undefined) {
        if (document[group]) {
            throw new Error(`"${name}" is both a token and a group`)
        }
        document[group] = token
    } else {
        document[group] ??= {}
        document[group][key] = token
    }
}

// The values the format can't hold, as CSS, in their group's extensions.
const EXTENSION = 'io.github.liquid-js.lyra'
for (const name of skipped) {
    const [group, key] = pathOf(name)
    const value = (theme.data[name] as ThemeValue | undefined)?.value
    if (key === undefined || value === undefined || (document[group] && '$type' in document[group])) {
        continue
    }
    document[group] ??= {}
    const extensions = (document[group]['$extensions'] ??= { [EXTENSION]: { css: {} } }) as Record<string, { css: Record<string, unknown> }>
    // By the CSS variable's whole name, as it's searched for.
    extensions[EXTENSION].css[`--${name}`] = Array.isArray(value) ? value.join(' ') : value
}

const sortKeys = (object: Record<string, unknown>) => Object.fromEntries(Object.keys(object).sort().map((key) => [key, object[key]]))
const sorted = Object.fromEntries(
    Object.keys(document)
        .sort()
        .map((group) => [group, '$type' in document[group] ? document[group] : sortKeys(document[group])])
)
mkdirSync(dirname(output), { recursive: true })
writeFileSync(
    output,
    JSON.stringify(
        {
            $description: `Lyra's ${themeName} theme. A token's group and name joined by "-" is its CSS variable: color › primary-500 is --color-primary-500.`,
            ...sorted
        },
        null,
        2
    ) + '\n'
)
console.log(
    `Wrote ${Object.keys(tokens).length} tokens in ${Object.values(document).filter((group) => !('$type' in group)).length} groups to ${output}; kept ${skipped.length} the format can't hold as CSS in their groups' extensions`
)
