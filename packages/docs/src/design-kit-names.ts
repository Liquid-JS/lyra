/**
 * Names in the design kit: what a theme variable is called as a design tool's colour variable, how inputs read in
 * symbol and style names, and which typography and icon a captured text or icon is. The same in every tool, so a
 * design reads the same way whichever tool made it.
 */

const STATUSES = ['primary', 'success', 'info', 'warning', 'danger', 'basic', 'control', 'alternative']
const STATES = ['default', 'hover', 'focus', 'active', 'disabled']
const EFFECTS: Record<string, string> = {
    'outline-color': 'Effect/Outline',
    'divider-color': 'Effect/Divider',
    'shadow': 'Effect/Shadow',
    'scrollbar-color': 'Effect/Scrollbar',
    'scrollbar-background-color': 'Effect/Scrollbar Background',
    // A dialog's or a window's backdrop over the page.
    'overlay-backdrop-background-color': 'Effect/Backdrop'
}

/** A word as it shows in a name: `primary` → `Primary`, `semi-round` → `Semi-round`. */
export function title(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1)
}

const status = `(${STATUSES.join('|')})`
const state = `(${STATES.join('|')})`

const RULES: Array<[RegExp, (...parts: string[]) => string]> = [
    [new RegExp(`^color-${status}-(\\d+)$`), (s, n) => `Palette/${title(s)}/${n}`],
    [new RegExp(`^color-${status}-transparent-(\\d+)$`), (s, n) => `Palette/${title(s)}/Transparent/${n}`],
    [new RegExp(`^color-${status}-${status}-transparent-(\\d+)$`), (s, t, n) => `Palette/${title(s)}/${title(t)} Transparent/${n}`],
    [new RegExp(`^color-${status}-${state}$`), (s, st) => `State/${title(s)}/${title(st)}`],
    [new RegExp(`^color-${status}-${state}-border$`), (s, st) => `State/${title(s)}/${title(st)} Border`],
    [new RegExp(`^color-${status}-transparent-${state}$`), (s, st) => `State/${title(s)} Transparent/${title(st)}`],
    [new RegExp(`^color-${status}-transparent-${state}-border$`), (s, st) => `State/${title(s)} Transparent/${title(st)} Border`],
    [new RegExp(`^background-${status}-color-(\\d+)$`), (s, n) => `Background/${title(s)}/${n}`],
    [new RegExp(`^border-${status}-color-(\\d+)$`), (s, n) => `Border/${title(s)}/${n}`],
    [/^text-(basic|heading|control|alternate|hint|disabled)-color$/, (s) => `Text/${title(s)}`],
    [new RegExp(`^text-${status}-color$`), (s) => `Text/${title(s)}/Default`],
    [new RegExp(`^text-${status}-${state}-color$`), (s, st) => `Text/${title(s)}/${title(st)}`]
]

/** A theme variable's name as a colour variable, e.g. `color-primary-default` → `State/Primary/Default`. */
export function variableName(token: string): string | undefined {
    if (EFFECTS[token]) {
        return EFFECTS[token]
    }
    for (const [pattern, name] of RULES) {
        const match = pattern.exec(token)
        if (match) {
            return name(...match.slice(1))
        }
    }
    return undefined
}

/** The theme's typography categories, by their variables' prefix, as the kits name their text styles. */
export const TYPOGRAPHY: Record<string, string> = {
    'heading-1': 'Heading/H1',
    'heading-2': 'Heading/H2',
    'heading-3': 'Heading/H3',
    'heading-4': 'Heading/H4',
    'heading-5': 'Heading/H5',
    'heading-6': 'Heading/H6',
    'subtitle': 'Subtitle/S1',
    'subtitle-2': 'Subtitle/S2',
    'paragraph': 'Paragraph/P1',
    'paragraph-2': 'Paragraph/P2',
    'caption': 'Caption/C1',
    'caption-2': 'Caption/C2',
    'label': 'Label',
    'button-tiny': 'Button/Tiny',
    'button-small': 'Button/Small',
    'button-medium': 'Button/Medium',
    'button-large': 'Button/Large',
    'button-giant': 'Button/Giant'
}

/** The typography categories set in capitals: the theme sets it on the components, the kit on the text styles. */
export function typographyTransform(category: string): string {
    return category.startsWith('button-') ? 'uppercase' : 'none'
}

/** The text colours the typography text styles come in, by the colour variable they use. */
export const TYPOGRAPHY_COLOURS: Record<string, string> = {
    'Text/Basic': 'Basic',
    'Text/Alternate': 'Alternate',
    'Text/Control': 'Control',
    'Text/Hint': 'Hint',
    'Text/Disabled': 'Disabled',
    'Text/Primary/Default': 'Primary',
    'Text/Success/Default': 'Success',
    'Text/Info/Default': 'Info',
    'Text/Warning/Default': 'Warning',
    'Text/Danger/Default': 'Danger'
}

/** An icon's symbol: `close-outline` → `Icon/Outline/close`, `star` → `Icon/Fill/star`. */
export function iconSymbol(icon: string): string {
    return icon.endsWith('-outline') ? `Icon/Outline/${icon.slice(0, -'-outline'.length)}` : `Icon/Fill/${icon}`
}
