import { NbComponentDefaults } from '@liquid-js/lyr-core'

import { NgdThemeValues } from '../../../docs.model'
import {
    basicShades,
    BASIC_SHADES,
    contrast,
    MINIMUM_CONTRAST,
    readableHint,
    readableShades,
    shades,
    SHADES,
    TRANSPARENCIES,
    transparencies
} from './palette'
import { NgdThemeDraft, NgdThemeStatus, THEME_STATUSES } from './theme-editor-state'

const value = (theme: NgdThemeValues, key: string) => String(theme[key]?.value ?? '')
const rem = (text: string) => (text.endsWith('rem') ? parseFloat(text) : undefined)
const round = (number: number) => Math.round(number * 10000) / 10000

/** A draft with its base theme's own values, which change nothing. */
export function draftFromBase(id: string, name: string, base: string, theme: NgdThemeValues): NgdThemeDraft {
    const colors = Object.fromEntries(
        THEME_STATUSES.map((status) => [status, value(theme, `color-${status}-500`)])
    ) as Record<NgdThemeStatus, string>
    return {
        id,
        name,
        base,
        colors,
        fontPrimary: value(theme, 'font-family-primary'),
        fontSecondary: value(theme, 'font-family-secondary'),
        radius: rem(value(theme, 'border-radius')) ?? 0.25,
        textScale: 1,
        // Material 3's buttons are fully round: the round shape, as a default.
        ...(base.startsWith('material') ? { defaults: { button: { shape: 'round' } } } : {})
    }
}

/**
 * The theme variables a draft changes from its base: each changed status's shades and transparent variants, the fonts,
 * the corner radius, and the text sizes scaled. Everything else follows them, as it refers to them.
 */
export function themeVariables(draft: NgdThemeDraft, theme: NgdThemeValues): Record<string, string> {
    const variables: Record<string, string> = {}
    for (const status of THEME_STATUSES) {
        const color = draft.colors[status]
        if (color.toLowerCase() === value(theme, `color-${status}-500`).toLowerCase()) {
            continue
        }
        const palette = shades(color)
        const transparent = transparencies(color)
        if (!palette.length) {
            continue
        }
        SHADES.forEach((shade, index) => (variables[`color-${status}-${shade}`] = palette[index]))
        TRANSPARENCIES.forEach((shade, index) => (variables[`color-${status}-transparent-${shade}`] = transparent[index]))
    }
    // The greys, tinted by the basic colour, and their transparent variants, which follow the 600 shade.
    if (draft.basic && draft.basic.toLowerCase() !== value(theme, 'color-basic-600').toLowerCase()) {
        const greys = basicShades(
            draft.basic,
            BASIC_SHADES.map((shade) => value(theme, `color-basic-${shade}`))
        )
        const transparent = transparencies(draft.basic)
        if (greys.length) {
            BASIC_SHADES.forEach((shade, index) => (variables[`color-basic-${shade}`] = greys[index]))
            TRANSPARENCIES.forEach((shade, index) => (variables[`color-basic-transparent-${shade}`] = transparent[index]))
        }
    }
    if (draft.fontPrimary.trim() && draft.fontPrimary !== value(theme, 'font-family-primary')) {
        variables['font-family-primary'] = draft.fontPrimary
    }
    if (draft.fontSecondary.trim() && draft.fontSecondary !== value(theme, 'font-family-secondary')) {
        variables['font-family-secondary'] = draft.fontSecondary
    }
    if (draft.radius !== rem(value(theme, 'border-radius'))) {
        variables['border-radius'] = `${round(draft.radius)}rem`
    }
    if (draft.textScale !== 1) {
        for (const key of Object.keys(theme)) {
            const size = /^text-.*-(font-size|line-height)$/.test(key) ? rem(value(theme, key)) : undefined
            if (size !== undefined) {
                variables[key] = `${round(size * draft.textScale)}rem`
            }
        }
    }
    // A basic shade of the theme's own: its transparent basic shades follow it, as a base theme's follow its own.
    const own = Object.keys(draft.variables ?? {})
    if (own.includes('color-basic-600') && !own.some((key) => key.startsWith('color-basic-transparent-'))) {
        const transparent = transparencies(valueIn(draft, theme, 'color-basic-600'))
        TRANSPARENCIES.forEach((shade, index) => {
            if (transparent[index]) {
                variables[`color-basic-transparent-${shade}`] = transparent[index]
            }
        })
    }
    // The theme's other variables, over the ones its controls make.
    return { ...variables, ...draft.variables }
}

/** The draft's backgrounds 1 to 3, which its text is read on. */
export function themeBackgrounds(variables: Record<string, string>, theme: NgdThemeValues): string[] {
    return [1, 2, 3].map((index) => themeValue(variables, theme, `background-basic-color-${index}`))
}

/**
 * How a status's text reads in the draft: the lowest contrast of `text-<status>-color` on the backgrounds 1 to 3, the
 * shades that would reach the `target` contrast when it doesn't, and how the control text (a filled button's) reads on
 * the status colour itself, for the editor's hint by the status colour. `undefined` when a colour can't be read.
 */
export function statusTextContrast(
    variables: Record<string, string>,
    theme: NgdThemeValues,
    status: NgdThemeStatus,
    target = MINIMUM_CONTRAST
): { ratio: number, control?: number, readable?: ReturnType<typeof readableShades> } | undefined {
    const backgrounds = themeBackgrounds(variables, theme)
    const text = themeValue(variables, theme, `text-${status}-color`)
    const ratios = backgrounds.map((background) => contrast(text, background))
    if (ratios.includes(undefined)) {
        return undefined
    }
    const ratio = Math.min(...(ratios as number[]))
    const palette = SHADES.map((shade) => themeValue(variables, theme, `color-${status}-${shade}`))
    const readable = ratio < target ? readableShades(palette, backgrounds, target) : undefined
    const fill = themeValue(variables, theme, `color-${status}-500`)
    const control = contrast(themeValue(variables, theme, 'text-control-color'), fill)
    return { ratio, control, readable }
}

/**
 * The variables that give a status the text shades that read on the draft's backgrounds, for a theme that wants
 * them: the editor's helper, which the theme author applies, as the defaults keep each status's own colour.
 */
export function readableStatusText(
    variables: Record<string, string>,
    theme: NgdThemeValues,
    status: NgdThemeStatus,
    target = MINIMUM_CONTRAST
): Record<string, string> {
    const picked = statusTextContrast(variables, theme, status, target)?.readable
    if (!picked) {
        return {}
    }
    return {
        [`text-${status}-color`]: `var(--color-${status}-${picked.text})`,
        [`text-${status}-hover-color`]: `var(--color-${status}-${picked.hover})`,
        [`text-${status}-focus-color`]: `var(--color-${status}-${picked.hover})`,
        [`text-${status}-active-color`]: `var(--color-${status}-${picked.active})`
    }
}

/** How the hint text reads in the draft, and the hint grey that would read, for the editor's hint by the basic colour. */
export function hintTextContrast(
    variables: Record<string, string>,
    theme: NgdThemeValues,
    target = MINIMUM_CONTRAST
): { ratio: number, readable?: string } | undefined {
    const backgrounds = themeBackgrounds(variables, theme)
    const hint = themeValue(variables, theme, 'text-hint-color')
    const ratios = backgrounds.map((background) => contrast(hint, background))
    if (ratios.includes(undefined)) {
        return undefined
    }
    const ratio = Math.min(...(ratios as number[]))
    const grey = (shade: number) => themeValue(variables, theme, `color-basic-${shade}`)
    const readable = ratio < target ? readableHint(grey(600), grey(700), grey(500), backgrounds, target) : undefined
    return { ratio, readable }
}

/**
 * A variable's value in a theme: its own, from the variables a draft changes, following a `var(--name)`; else what it
 * refers to in the base theme, so a background follows the greys it's one of; else the base theme's value.
 */
export function themeValue(
    variables: Record<string, string>,
    theme: NgdThemeValues,
    key: string,
    seen = new Set<string>()
): string {
    if (seen.has(key)) {
        return value(theme, key)
    }
    seen.add(key)
    const own = variables[key]
    if (own !== undefined) {
        const reference = /^var\(--([a-z0-9-]+)\)$/.exec(own.trim())
        return reference ? themeValue(variables, theme, reference[1], seen) : own
    }
    // The variable it refers to.
    const parent = theme[key]?.parent
    return parent ? themeValue(variables, theme, parent, seen) : value(theme, key)
}

// A value of the draft's theme, from its own variables, which the controls' don't change.
function valueIn(draft: NgdThemeDraft, theme: NgdThemeValues, key: string): string {
    return themeValue(draft.variables ?? {}, theme, key)
}

const slug = (name: string) =>
    name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'custom'

/** The draft as a theme to register in an app's `themes.scss`. */
/** The Google Fonts stylesheet that serves the given families, as the API's family specs. */
export function googleFontsUrl(fonts: string[]): string {
    return `https://fonts.googleapis.com/css2?${fonts.map((font) => `family=${font.replace(/ /g, '+')}`).join('&')}&display=swap`
}

// How a theme's fonts are loaded, for its code: a stylesheet link for the page's head.
function fontsComment(draft: NgdThemeDraft, comment: (text: string) => string): string[] {
    const { fonts } = draft
    return fonts?.length
        ? [comment('The fonts, from Google Fonts; in the page\'s head:'), comment(`<link rel="stylesheet" href="${googleFontsUrl(fonts)}">`), '']
        : []
}

/** Whether a value is a list, e.g. `"IBM Plex Mono", monospace`: a comma outside parentheses. */
function hasTopLevelComma(text: string): boolean {
    let depth = 0
    for (const char of text) {
        depth += char === '(' ? 1 : char === ')' ? -1 : 0
        if (char === ',' && depth === 0) {
            return true
        }
    }
    return false
}

export function themeScss(draft: NgdThemeDraft, variables: Record<string, string>): string {
    const entries = Object.entries(variables).map(([key, entry]) =>
        // A font's name, or a list, e.g. a font stack or several shadows, which a Sass map would read as its own
        // entries, as a string the CSS gets as it is.
        key.includes('font-family') || hasTopLevelComma(entry) ? `    ${key}: string.unquote('${entry.replace(/'/g, "\\'")}'),` : `    ${key}: ${entry},`
    )
    return [
        `// ${draft.name} as a theme of its own: the app's themes.scss, with provideNbTheme({ name: '${slug(draft.name)}' }).`,
        ...fontsComment(draft, (text) => `// ${text}`),
        "@use 'sass:string';",
        "@forward '@liquid-js/lyr-core/styles/theming';",
        "@use '@liquid-js/lyr-core/styles/theming' as *;",
        `@use '@liquid-js/lyr-core/styles/themes/${draft.base}';`,
        '',
        '$nb-themes: nb-register-theme(',
        '  (',
        ...entries,
        '  ),',
        `  ${slug(draft.name)},`,
        `  ${draft.base}`,
        ');',
        ''
    ].join('\n')
}

/** The draft as CSS variables over its base theme. */
export function themeCss(draft: NgdThemeDraft, variables: Record<string, string>): string {
    const entries = Object.entries(variables).map(([key, entry]) => `  --${key}: ${entry};`)
    return [
        `/* ${draft.name} as CSS variables over Lyra's ${draft.base} theme: after its prebuilt CSS, with provideNbTheme({ name: '${draft.base}' }). */`,
        ...fontsComment(draft, (text) => `/* ${text} */`),
        `.nb-theme-${draft.base} {`,
        ...entries,
        '}',
        ''
    ].join('\n')
}

/** How a theme card draws a theme in its own colours. */
export interface NgdThemeSwatches {
    background: string
    border: string
    text: string
    hint: string
    radius: string
    /** The theme's backgrounds, then its status colours. */
    colors: string[]
}

/** A draft's colours for its card: its backgrounds and text, its status colours, and its radius. */
export function themeSwatches(draft: NgdThemeDraft, theme: NgdThemeValues): NgdThemeSwatches {
    const variables = themeVariables(draft, theme)
    const valueOf = (key: string) => themeValue(variables, theme, key)
    return {
        background: valueOf('background-basic-color-1'),
        border: valueOf('border-basic-color-3'),
        text: valueOf('text-basic-color'),
        hint: valueOf('text-hint-color'),
        radius: `${round(Math.min(draft.radius, 1))}rem`,
        colors: [
            ...[2, 3, 4].map((level) => valueOf(`background-basic-color-${level}`)),
            ...THEME_STATUSES.map((status) => draft.colors[status])
        ]
    }
}

/** A draft's component defaults, without the ones left unset. */
export function themeDefaults(draft: NgdThemeDraft): NbComponentDefaults {
    const entries = Object.entries(draft.defaults ?? {})
        .map(([key, entry]): [string, unknown] => [key, isRecord(entry) ? withoutUnset(entry) : entry])
        .filter(([, entry]) => entry !== undefined && entry !== '' && !(isRecord(entry) && !Object.keys(entry).length))
    return Object.fromEntries(entries) as NbComponentDefaults
}

/** The component defaults as a provider for an app's config. */
export function defaultsTs(defaults: NbComponentDefaults): string {
    const entries = Object.entries(defaults).map(([key, entry]) =>
        isRecord(entry)
            ? `    ${key}: { ${Object.entries(entry).map(([name, item]) => `${name}: '${String(item)}'`).join(', ')} },`
            : `    ${key}: '${String(entry)}',`
    )
    return [
        "import { ApplicationConfig } from '@angular/core';",
        "import { provideNbComponentDefaults } from '@liquid-js/lyr-core';",
        '',
        'export const appConfig: ApplicationConfig = {',
        '  providers: [',
        '    provideNbComponentDefaults({',
        ...entries.map((entry) => `  ${entry}`),
        '    }),',
        '  ],',
        '};',
        ''
    ].join('\n')
}

function isRecord(entry: unknown): entry is Record<string, unknown> {
    return typeof entry === 'object' && entry !== null
}

function withoutUnset(entry: Record<string, unknown>): Record<string, unknown> {
    return Object.fromEntries(Object.entries(entry).filter(([, item]) => item !== undefined && item !== ''))
}

/**
 * Where Sketch keeps the design kit's plugin, as double-clicking it installs it, under the user's home folder: its theme
 * script applies a theme to the kit as Lyra › Apply theme does.
 */
const KIT_PLUGIN = '/Library/Application Support/com.bohemiancoding.sketch3/Plugins/Lyra design kit.sketchplugin/Contents/Sketch/theme.js'

/**
 * A script for Sketch that gives the draft to the Lyra design kit, through the kit's plugin: in the kit, its colour
 * variables, styles and symbols take the theme, as the app does; in a design made with the kit, the theme is recorded
 * for the app, on its Theme page and in its settings (`lyra-theme`). Without the plugin, it records the theme for the
 * plugin's Lyra › Apply theme. Run from Plugins › Run Script or a Sketch MCP server's run-code tool.
 */
export function designKitScript(draft: NgdThemeDraft, variables: Record<string, string>): string {
    const record = { name: draft.name, base: draft.base, variables, css: themeCss(draft, variables), scss: themeScss(draft, variables) }
    return `// ${draft.name}, for the Lyra design kit. Run it in Sketch from Plugins › Run Script, in your copy of the kit, then in
// your design files: with the kit's plugin installed, the kit takes the theme as the app does, and a design records it
// for whoever builds it. Without the plugin, it records the theme for the plugin's Lyra › Apply theme.
const sketch = require('sketch')
const theme = ${JSON.stringify(record, null, 2)}
const doc = sketch.getSelectedDocument()
let apply
try {
  apply = require(require('os').homedir() + ${JSON.stringify(KIT_PLUGIN)})
} catch (error) {
  apply = undefined
}
if (apply) {
  // It works in turns, so Sketch stays responsive meanwhile.
  sketch.UI.message('Applying the theme…')
  Promise.resolve()
    .then(() => apply({ document: doc.path ? decodeURIComponent(String(doc.path)) : doc.id, name: theme.name, base: theme.base, theme: theme.variables }))
    .then((json) => {
      const result = JSON.parse(json)
      sketch.UI.message('Theme applied: ' + result.counts.colours + ' colours, ' + (result.counts.layerStyles + result.counts.textStyles) + ' styles and ' + result.counts.layers + ' symbols changed.')
      if (result.warningCount) {
        sketch.UI.alert('Lyra theme', result.warnings.join('\\n'))
      }
    })
    .catch((error) => sketch.UI.alert('Lyra theme', 'The theme could not be applied: ' + error))
} else {
  // Recorded for the plugin, which shows it on the Theme page as it applies it; the page's old values go.
  sketch.Settings.setDocumentSettingForKey(doc, 'lyra-theme', theme)
  doc.pages.filter((page) => page.name === 'Theme').forEach((page) => page.layers.filter((layer) => layer.name === 'Theme').forEach((layer) => layer.remove()))
  sketch.UI.alert('Lyra theme', 'The theme is recorded in this document. Install the Lyra design kit plugin, then choose Lyra › Apply theme.')
}
`
}
