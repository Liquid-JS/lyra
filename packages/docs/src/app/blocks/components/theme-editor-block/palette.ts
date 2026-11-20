/**
 * Status palettes the way the design system draws them: shades 100 (lightest) to 900 (darkest) around a 500 that is
 * the picked colour, and six transparent variants of it.
 */

export const SHADES = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const
export const TRANSPARENCIES = [100, 200, 300, 400, 500, 600] as const

interface Hsl {
    h: number
    s: number
    l: number
}

// The design system's status ramps: the default theme's, Lyra's own primary and the web design system's statuses,
// then the earlier primary and the 1.3.0 mobile kit's ramps, whose light shades are livelier. A colour's shades step
// as the ramps nearest it in hue do, relative to their 500, so the design system's own colours give back their ramps.
const REFERENCES: string[][] = [
    ['#f2f5ff', '#cedcfb', '#a0baf5', '#5c89e4', '#3469d1', '#2955b1', '#1e4396', '#16347a', '#0c225b'],
    ['#f0fff5', '#ccfce3', '#8cfac7', '#3ae195', '#03ce86', '#02b184', '#00997a', '#007d6c', '#004a45'],
    ['#f2f8ff', '#c7e2ff', '#94cbff', '#42aaff', '#0095ff', '#006fd6', '#0057c2', '#0041a8', '#002885'],
    ['#fffdf2', '#fff1c2', '#ffe59e', '#ffc94d', '#ffaa00', '#db8b00', '#b86e00', '#945400', '#703c00'],
    ['#fff2f2', '#ffd6d9', '#ffa8b4', '#ff708d', '#ff3d71', '#db2c66', '#b81d5b', '#94124e', '#700940'],
    ['#f2f6ff', '#d9e4ff', '#a6c1ff', '#598bff', '#3366ff', '#274bdb', '#1a34b8', '#102694', '#091c7a'],
    ['#e2e7fc', '#c6d0fa', '#a6b3f0', '#8b98e2', '#6574cf', '#4957b2', '#323d95', '#202878', '#131964'],
    ['#d2fcd2', '#a5f9ac', '#75ee8b', '#51dd78', '#1ec760', '#17aa5d', '#0f8e5a', '#087351', '#035f4a'],
    ['#cdf9ff', '#99eeff', '#66ddff', '#3fc7ff', '#00a5ff', '#0080db', '#005fb8', '#004493', '#00317a'],
    ['#ffe8d6', '#ffcbad', '#ffa884', '#ff8665', '#ff4e32', '#db2f24', '#b7191c', '#940f1d', '#7a091e']
]
const BASE = 4

/** `#rrggbb` (or `#rgb`) as red, green and blue from 0 to 255; `undefined` for anything else. */
export function parseHex(hex: string): [number, number, number] | undefined {
    const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim())
    if (!match) {
        return undefined
    }
    const digits = match[1].length === 3 ? [...match[1]].map((digit) => digit + digit).join('') : match[1]
    return [0, 2, 4].map((start) => parseInt(digits.slice(start, start + 2), 16)) as [number, number, number]
}

function toHex([r, g, b]: [number, number, number]): string {
    return `#${[r, g, b].map((channel) => Math.round(channel).toString(16).padStart(2, '0')).join('')}`
}

function toHsl([r, g, b]: [number, number, number]): Hsl {
    const [red, green, blue] = [r / 255, g / 255, b / 255]
    const max = Math.max(red, green, blue)
    const min = Math.min(red, green, blue)
    const l = (max + min) / 2
    if (max === min) {
        return { h: 0, s: 0, l }
    }
    const d = max - min
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    let h = (red - green) / d + 4
    if (max === red) {
        h = (green - blue) / d + (green < blue ? 6 : 0)
    } else if (max === green) {
        h = (blue - red) / d + 2
    }
    return { h: h * 60, s, l }
}

function fromHsl({ h, s, l }: Hsl): [number, number, number] {
    const k = (n: number) => (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    return [f(0) * 255, f(8) * 255, f(4) * 255]
}

/** How a shade steps from its ramp's 500: hue offset, saturation ratio, and how much of the gap to white or black. */
interface Step {
    h: number
    s: number
    l: number
}

// A shade's step relative to its ramp's 500; lighter shades close the gap to white, darker ones to black.
function stepOf(shade: Hsl, base: Hsl, index: number): Step {
    const h = ((shade.h - base.h + 540) % 360) - 180
    const s = base.s ? shade.s / base.s : 1
    const l = index < BASE ? (shade.l - base.l) / (1 - base.l) : shade.l / base.l
    return { h, s, l }
}

function hueDistance(a: number, b: number) {
    const difference = Math.abs(a - b) % 360
    return Math.min(difference, 360 - difference)
}

const hslOf = (hex: string) => toHsl(parseHex(hex) as [number, number, number])

// Each ramp's 500 and its steps.
const references = REFERENCES.map((reference) => {
    const ramp = reference.map(hslOf)
    const base = ramp[BASE]
    return { base, steps: ramp.map((shade, index) => stepOf(shade, base, index)) }
})

// How sharply nearer ramps lead the mix.
const WEIGHT_POWER = 3

// The steps a colour's shades take: the ramp's own for one of the design system's colours; else a mix of the ramps',
// each weighing more the nearer it is in hue, so the nearest lead and a small change in the colour is a small change in
// its shades. A grey takes the primary's.
function stepsFor(color: Hsl): Step[] {
    if (color.s < 0.05) {
        return references[0].steps
    }
    const distances = references.map(({ base }) => hueDistance(base.h, color.h))
    const exact = distances.findIndex((distance) => distance < 0.5)
    if (exact >= 0) {
        return references[exact].steps
    }
    const weights = distances.map((distance) => 1 / distance ** WEIGHT_POWER)
    const total = weights.reduce((sum, weight) => sum + weight, 0)
    const mix = (index: number, key: keyof Step) =>
        references.reduce((sum, { steps }, ref) => sum + steps[index][key] * weights[ref], 0) / total
    return references[0].steps.map((_, index) => ({ h: mix(index, 'h'), s: mix(index, 's'), l: mix(index, 'l') }))
}

/** The nine shades of a colour, from 100 to 900, with the colour itself as 500. */
export function shades(hex: string): string[] {
    const rgb = parseHex(hex)
    if (!rgb) {
        return []
    }
    const base = toHsl(rgb)
    return stepsFor(base).map((step, index) => {
        if (index === BASE) {
            return toHex(rgb)
        }
        const l = index < BASE ? base.l + (1 - base.l) * step.l : base.l * step.l
        const s = Math.min(1, base.s * step.s)
        const h = (base.h + step.h + 360) % 360
        return toHex(fromHsl({ h, s, l: Math.max(0, Math.min(1, l)) }))
    })
}

/** The transparent variants 100 to 600 of a colour: 8% to 48% opaque. */
export function transparencies(hex: string): string[] {
    const rgb = parseHex(hex)
    if (!rgb) {
        return []
    }
    return TRANSPARENCIES.map((_, index) => `rgb(${rgb.join(', ')}, ${Math.round((index + 1) * 8) / 100})`)
}

/** The greys' shades, from 100 (white in light themes) to 1100. */
export const BASIC_SHADES = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100] as const
const BASIC_BASE = BASIC_SHADES.indexOf(600)

/**
 * The greys tinted by a colour, which is their 600: each of the base theme's greys keeps its lightness and takes the
 * colour's hue, with its saturation scaled as the colour's is to the base's 600, so white stays white and a dark theme's
 * backgrounds stay dark.
 */
export function basicShades(hex: string, base: string[]): string[] {
    const rgb = parseHex(hex)
    const greys = base.map(parseHex)
    if (!rgb || greys.some((grey) => !grey)) {
        return []
    }
    const color = toHsl(rgb)
    const reference = toHsl(greys[BASIC_BASE] as [number, number, number])
    return greys.map((grey, index) => {
        if (index === BASIC_BASE) {
            return toHex(rgb)
        }
        const shade = toHsl(grey as [number, number, number])
        const s = reference.s ? Math.min(1, shade.s * (color.s / reference.s)) : shade.l > 0 && shade.l < 1 ? color.s : 0
        // Each grey keeps its hue's offset from the 600, as the base theme's greys lean a little one way or the other.
        const h = reference.s && shade.s ? (color.h + shade.h - reference.h + 360) % 360 : color.h
        return toHex(fromHsl({ h, s, l: shade.l }))
    })
}

/** The contrast text is held to by default: 3:1, plenty for most people and what most UI kits settle on. */
export const MINIMUM_CONTRAST = 3
/** The stricter 4.5:1 of WCAG AA for small text, for a theme that asks for it. */
export const AA_CONTRAST = 4.5

/** A colour's relative luminance, as WCAG defines it; `undefined` for a colour that isn't `#rrggbb`. */
export function luminance(hex: string): number | undefined {
    const rgb = parseHex(hex)
    if (!rgb) {
        return undefined
    }
    const linear = (channel: number) => {
        const c = channel / 255
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    }
    const [r, g, b] = rgb.map(linear)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** The contrast ratio of two colours, 1 to 21; `undefined` when one isn't a hex colour. */
export function contrast(a: string, b: string): number | undefined {
    const la = luminance(a)
    const lb = luminance(b)
    if (la === undefined || lb === undefined) {
        return undefined
    }
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

const readable = (hex: string, backgrounds: string[], target: number) =>
    backgrounds.every((background) => (contrast(hex, background) ?? 0) >= target)

/** Whether text on the backgrounds is on a dark theme: the first background is dark. */
export function isDarkBackground(backgrounds: string[]): boolean {
    return (luminance(backgrounds[0]) ?? 1) < 0.5
}

/**
 * The text shades a status's palette gives on the backgrounds, as the theme registration derives them: the first
 * shade from the 500 one, away from the background, that reaches the `target` contrast on every background; hovered and
 * focused text the next shade, pressed text the one after. `shades` are the nine shades, 100 to 900; `undefined` when a shade
 * isn't a hex colour.
 */
export function readableShades(
    palette: string[],
    backgrounds: string[],
    target = MINIMUM_CONTRAST
): { text: number, hover: number, active: number } | undefined {
    if (palette.length !== SHADES.length || palette.some((shade) => !parseHex(shade))) {
        return undefined
    }
    const order = isDarkBackground(backgrounds) ? [500, 400, 300, 200, 100] : [500, 600, 700, 800, 900]
    const at = (shade: number) => palette[SHADES.indexOf(shade as (typeof SHADES)[number])]
    let picked = order.findIndex((shade) => readable(at(shade), backgrounds, target))
    if (picked < 0) {
    // No shade reads: the one farthest from the background.
        picked = order.length - 1
    }
    const last = order.length - 1
    return { text: order[picked], hover: order[Math.min(picked + 1, last)], active: order[Math.min(picked + 2, last)] }
}

/**
 * The hint grey the greys give on the backgrounds, as the theme registration derives it: the 600 shade, mixed towards
 * the 700 (the 500 on a dark background) in steps of 5% as far as it needs to reach the `target` on every background.
 */
export function readableHint(
    basic600: string,
    basic700: string,
    basic500: string,
    backgrounds: string[],
    target = MINIMUM_CONTRAST
): string | undefined {
    const from = parseHex(basic600)
    const to = parseHex(isDarkBackground(backgrounds) ? basic500 : basic700)
    if (!from || !to) {
        return undefined
    }
    for (let step = 0; step <= 20; step++) {
        const mix = (channel: number, i: number) => channel + (to[i] - channel) * (step / 20)
        const mixed = toHex(from.map(mix) as [number, number, number])
        if (readable(mixed, backgrounds, target) || step === 20) {
            return mixed
        }
    }
    return undefined
}
