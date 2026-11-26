import { BASIC_SHADES, basicShades, SHADES, shades, TRANSPARENCIES, transparencies } from '../../../../docs/src/app/blocks/components/theme-editor-block/palette.ts'

/**
 * A theme's variables worked out as the browser and the Theme Editor work them out, without Sketch: the shades a
 * theme doesn't set, its variables' values, and its values as the Theme board shows them and Sketch takes them.
 */

/** A theme's variables, by name without the `--`: CSS values, which may follow others with `var()`. */
export type Variables = Record<string, string>

/**
 * The theme's values with the shades it doesn't set: a status's shades and transparent shades from its 500 shade, the
 * greys from basic 600 and the base theme's greys, as the Theme Editor makes them.
 */
export function derive(theme: Variables, base: Variables): Variables {
    const values = { ...theme }
    for (const status of ['primary', 'success', 'info', 'warning', 'danger']) {
        const colour = values[`color-${status}-500`]
        if (!colour) {
            continue
        }
        const palette = shades(colour)
        const transparent = transparencies(colour)
        SHADES.forEach((shade, index) => {
            if (palette[index] && values[`color-${status}-${shade}`] === undefined) {
                values[`color-${status}-${shade}`] = palette[index]
            }
        })
        TRANSPARENCIES.forEach((shade, index) => {
            if (transparent[index] && values[`color-${status}-transparent-${shade}`] === undefined) {
                values[`color-${status}-transparent-${shade}`] = transparent[index]
            }
        })
    }
    const grey = values['color-basic-600']
    if (grey) {
        const greys = basicShades(grey, BASIC_SHADES.map((shade) => base[`color-basic-${shade}`] ?? ''))
        BASIC_SHADES.forEach((shade, index) => {
            if (greys[index] && values[`color-basic-${shade}`] === undefined) {
                values[`color-basic-${shade}`] = greys[index]
            }
        })
        const transparent = transparencies(grey)
        TRANSPARENCIES.forEach((shade, index) => {
            if (transparent[index] && values[`color-basic-transparent-${shade}`] === undefined) {
                values[`color-basic-transparent-${shade}`] = transparent[index]
            }
        })
    }
    return values
}

/** Whether a text is one pair of brackets around the rest. */
function bracketed(text: string): boolean {
    if (!text.startsWith('(') || !text.endsWith(')')) {
        return false
    }
    let depth = 0
    for (let at = 0; at < text.length - 1; at++) {
        depth += text[at] === '(' ? 1 : text[at] === ')' ? -1 : 0
        if (depth === 0) {
            return false
        }
    }
    return true
}

/**
 * A value as the Theme board shows it: the variables it follows by their names, and its sums as written, e.g.
 * `border-radius * 3` or `control-medium-inset - button-filled-border-width`.
 */
export function display(css: string): string {
    let text = css.replace(/var\(--([\w-]+)\)/g, '$1').replace(/calc\(/g, '(')
    text = text.replace(/\+ \(([^()]*?) \* -1\)/g, '- $1')
    while (bracketed(text)) {
        text = text.slice(1, -1)
    }
    return text
}

/** A value from the Theme board as CSS: the theme's variables it names as `var()`s, a sum in a `calc()`. */
export function cssOf(text: string, formulas: Variables): string {
    const css = text.replace(/(^|[^\w-])([a-z][\w-]*)(?![\w(-])/gi, (whole, before: string, word: string) => (formulas[word] === undefined ? whole : `${before}var(--${word})`))
    return / [-+*/] /.test(css) && !css.startsWith('calc(') ? `calc(${css})` : css
}

/** A value's parts, split at spaces outside brackets, e.g. a padding's vertical and horizontal parts. */
export function partsOf(value: string): string[] {
    const parts: string[] = []
    let depth = 0
    let current = ''
    for (const character of value.trim()) {
        depth += character === '(' ? 1 : character === ')' ? -1 : 0
        if (/\s/.test(character) && depth === 0) {
            if (current) {
                parts.push(current)
            }
            current = ''
        } else {
            current += character
        }
    }
    return current ? parts.concat(current) : parts
}

/** A length or a number as pixels or units: a `calc()` worked out; an `em` or a percentage depends on where it's used. */
export function numberOf(part: string): number | undefined {
    const tokens: string[] = []
    const pattern = /\s*(calc\(|\(|\)|\*|\/|\+|-(?![\d.])|-?[\d.]+(?:e[-+]?\d+)?(?:px|rem|em|%)?)/y
    let match: RegExpExecArray | null
    while (pattern.lastIndex < part.length && (match = pattern.exec(part))) {
        tokens.push(match[1] ?? '')
    }
    if (part.slice(pattern.lastIndex).trim()) {
        return undefined
    }
    let at = 0
    const factor = (): number => {
        const token = tokens[at++]
        if (token === '(' || token === 'calc(') {
            const value = sum()
            at++
            return value
        }
        if (token === '-') {
            return -factor()
        }
        // An `em` or a percentage depends on where it's used; a `rem` doesn't.
        if (token === undefined || /(^|[^r])em$|%$/.test(token)) {
            return NaN
        }
        return parseFloat(token) * (token.endsWith('rem') ? 16 : 1)
    }
    const product = (): number => {
        let value = factor()
        while (tokens[at] === '*' || tokens[at] === '/') {
            value = tokens[at++] === '*' ? value * factor() : value / factor()
        }
        return value
    }
    const sum = (): number => {
        let value = product()
        while (tokens[at] === '+' || tokens[at] === '-') {
            value = tokens[at++] === '+' ? value + product() : value - product()
        }
        return value
    }
    const result = sum()
    return Number.isFinite(result) ? result : undefined
}

/** What a length comes to, in pixels, e.g. `12px` for `border-radius * 3`; else nothing. */
export function pixels(value: string | undefined): string {
    const parts = partsOf(value ?? '').map(numberOf)
    return parts.length && parts.every((part) => part !== undefined) && /rem|px|calc/.test(value ?? '') ? parts.map((part) => `${Math.round(part * 100) / 100}px`).join(' ') : ''
}

/** The variables' values as the browser works them out: each `var()` replaced by its variable's value or fallback. */
export function valuesOf(values: Variables): (name: string) => string | undefined {
    const cache = new Map<string, string>()
    const resolving = new Set<string>()
    const valueOf = (name: string): string | undefined => {
        if (cache.has(name)) {
            return cache.get(name)
        }
        const own = values[name]
        if (resolving.has(name) || own === undefined) {
            return undefined
        }
        resolving.add(name)
        const value = substitute(String(own))
        resolving.delete(name)
        cache.set(name, value)
        return value
    }
    const substitute = (text: string): string => {
        let out = ''
        let at = 0
        for (;;) {
            const start = text.indexOf('var(', at)
            if (start < 0) {
                return out + text.slice(at)
            }
            out += text.slice(at, start)
            let depth = 0
            let end = start + 3
            let comma = -1
            for (; end < text.length; end++) {
                const character = text[end]
                if (character === '(') {
                    depth++
                } else if (character === ')' && --depth === 0) {
                    break
                } else if (character === ',' && depth === 1 && comma < 0) {
                    comma = end
                }
            }
            const name = text.slice(start + 4, comma < 0 ? end : comma).trim().replace(/^--/, '')
            const value = valueOf(name)
            out += value !== undefined ? value : comma < 0 ? '' : substitute(text.slice(comma + 1, end).trim())
            at = end + 1
        }
    }
    return valueOf
}

/** A CSS colour as Sketch's `#rrggbbaa`. */
export function sketchColour(value: string): string | undefined {
    const text = value.trim()
    if (text === 'transparent') {
        return '#00000000'
    }
    const hex = /^#([0-9a-f]{3,8})$/i.exec(text)?.[1]
    if (hex) {
        const digits = hex.length <= 4 ? hex.split('').map((digit) => digit + digit).join('') : hex
        return `#${digits.length === 6 ? `${digits}ff` : digits}`.toLowerCase()
    }
    const rgb = /^rgba?\(([^)]*)\)$/i.exec(text)?.[1]
    if (rgb) {
        const [r = '0', g = '0', b = '0', a = '1'] = rgb.split(/[\s,/]+/).filter(Boolean)
        const byte = (number: number) => Math.round(Math.max(0, Math.min(255, number))).toString(16).padStart(2, '0')
        return `#${byte(+r)}${byte(+g)}${byte(+b)}${byte(parseFloat(a) * (a.endsWith('%') ? 2.55 : 255))}`
    }
    return undefined
}

/** The colour in a value, e.g. a shadow's, as Sketch's `#rrggbbaa`. */
export function colourIn(value: string | undefined): string | undefined {
    const colour = /#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|transparent/i.exec(value ?? '')
    return colour ? sketchColour(colour[0]) : undefined
}

export interface SketchShadow {
    color: string
    x: number
    y: number
    blur: number
    spread: number
    enabled: boolean
}

/** A CSS shadow as Sketch's shadows and inner shadows; `none` as none. */
export function shadowsOf(value: string | undefined): { outer: SketchShadow[], inner: SketchShadow[] } {
    const shadows = { outer: new Array<SketchShadow>(), inner: new Array<SketchShadow>() }
    let depth = 0
    let current = ''
    const parts: string[] = []
    for (const character of value ?? 'none') {
        depth += character === '(' ? 1 : character === ')' ? -1 : 0
        if (character === ',' && depth === 0) {
            parts.push(current)
            current = ''
        } else {
            current += character
        }
    }
    parts.push(current)
    for (const part of parts) {
        const tokens = partsOf(part)
        if (!tokens.length || tokens[0] === 'none') {
            continue
        }
        const colourToken = tokens.find((token) => colourIn(token))
        const lengths = tokens.filter((token) => token !== colourToken && token !== 'inset').map(numberOf)
        if (lengths.some((length) => length === undefined)) {
            continue
        }
        const [x = 0, y = 0, blur = 0, spread = 0] = lengths as number[]
        const shadow = { color: (colourToken && colourIn(colourToken)) ?? '#00000040', x, y, blur, spread, enabled: true }
        ;(tokens.includes('inset') ? shadows.inner : shadows.outer).push(shadow)
    }
    return shadows
}

/** Shadows as one text, to compare them: those that show, by colour, offset, blur and spread. */
export const shadowKey = (list: ReadonlyArray<{ color: string, x: number, y: number, blur: number, spread: number, enabled?: boolean }>): string =>
    JSON.stringify(list.filter((shadow) => shadow.enabled !== false).map((shadow) => [String(shadow.color).toLowerCase(), shadow.x, shadow.y, shadow.blur, shadow.spread]))

/** Sketch's font weights are an index of its own, by CSS's weights. */
export const WEIGHT_INDEX: Readonly<Record<number, number>> = { 100: 2, 200: 3, 300: 4, 400: 5, 500: 6, 600: 8, 700: 9, 800: 10, 900: 12 }
/** A CSS weight as Sketch's index, the nearest hundred's. */
export const weightOf = (value: number): number => WEIGHT_INDEX[Math.min(900, Math.max(100, Math.round(value / 100) * 100))] ?? 5

/** A font stack's first family, e.g. `Inter` for `Inter, sans-serif`. */
export const firstFamily = (value: string): string => value.split(',')[0]?.replace(/["']/g, '').trim() ?? ''
