import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

import { TYPOGRAPHY, TYPOGRAPHY_COLOURS, iconSymbol, title, typographyTransform, variableName } from '../../docs/src/design-kit-names.ts'
import type { BoundMeasure, Captured, CapturedNode } from './capture.ts'
import { COMPONENTS, type ComponentSpec } from './components.ts'
import type { Binding, Gradient, Kit, KitComponent, KitSymbol, Layer, LayerBindings, LayerStyle, Paint, Shadow, Starter, StyleBinding, StyleBindings, StyleMeasure, TextStyle } from './kit.ts'

/**
 * Turns the captured components into the design kit's model, the same for every design tool: symbols (one per
 * combination of the inputs that change a component's layout) as trees of layers, the layer and text styles their
 * overrides choose between, and the starter set. Run it after `capture.ts`:
 *
 *   yarn design-kit:model
 *
 * It checks what the kits rely on: that a symbol's combinations share one layout, and that each style's name, made of
 * the inputs that change it, always means the same look; it stops with the combinations that don't.
 */

const root = resolve(import.meta.dirname, '..', '..', '..')
const kitDir = join(root, 'dist', 'design-kit')
// Every component; those another holds are built first.
const chosen = Object.keys(COMPONENTS)

// ---- Reading the captured styles ----

const keyOf = (value: unknown) => JSON.stringify(value)

const px = (value: string | undefined) => (value === undefined || value === 'normal' ? 0 : parseFloat(value))

/** Splits a CSS value at its top-level commas, or spaces. */
function split(value: string, separator: ',' | ' '): string[] {
    const parts: string[] = []
    let depth = 0
    let current = ''
    for (const char of value) {
        if (char === '(') {
            depth++
        } else if (char === ')') {
            depth--
        }
        if (char === separator && depth === 0) {
            parts.push(current.trim())
            current = ''
        } else {
            current += char
        }
    }
    if (current.trim()) {
        parts.push(current.trim())
    }
    return parts.filter(Boolean)
}

function hex(rgb: string): string | undefined {
    const match = /^rgba?\(\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\s*\)$/.exec(rgb)
    if (!match) {
        return undefined
    }
    const channels = [match[1], match[2], match[3]].map((channel) => Math.round(Number(channel)).toString(16).padStart(2, '0'))
    const alpha = match[4] === undefined ? 1 : Number(match[4])
    return `#${channels.join('')}${alpha === 1 ? '' : Math.round(alpha * 255).toString(16).padStart(2, '0')}`
}

/** A colour as captured: `var(color-primary-default, rgb(…))` or a plain `rgb(…)`. */
function paintOf(value: string | undefined): Paint | undefined {
    if (!value) {
        return undefined
    }
    const named = /^var\(([\w-]+), (.+)\)$/.exec(value.trim())
    const color = hex(named ? named[2] : value.trim())
    if (!color) {
        return undefined
    }
    const variable = named ? variableName(named[1]) : undefined
    return variable ? { color, variable } : { color }
}

const transparent = (paint: Paint | undefined) => !paint || (paint.color.length === 9 && paint.color.endsWith('00'))

function shadowsOf(value: string | undefined): Shadow[] {
    if (!value || value === 'none') {
        return []
    }
    return split(value, ',').flatMap((shadow) => {
        const parts = split(shadow, ' ')
        const colour = parts.find((part) => /^(var|rgba?)\(/.test(part))
        const lengths = parts.filter((part) => /^-?[\d.]+px$/.test(part)).map(px)
        const paint = paintOf(colour)
        if (!paint || transparent(paint)) {
            return []
        }
        const [x = 0, y = 0, blur = 0, spread = 0] = lengths
        // A shadow of no size, e.g. a hero button's bevel in a theme without one, draws nothing in the browser; a
        // design tool draws its edge around rounded corners.
        if (!x && !y && !blur && !spread) {
            return []
        }
        return [{ x, y, blur, spread, paint, ...(parts.includes('inset') ? { inset: true } : {}) }]
    })
}

/** A hard-edged gradient band, e.g. a card's accent: a colour up to a length, then transparent. */
interface Band {
    side: 'top' | 'bottom' | 'left' | 'right'
    size: number
    paint: Paint
}

/** A conic gradient as an angular one: its stops' positions in turns, a stop at 0 where the one before it is. */
function conicOf(value: string): Gradient | undefined {
    const match = /^conic-gradient\((.+)\)$/.exec(value)
    if (!match) {
        return undefined
    }
    const args = split(match[1], ',')
    let angle = 0
    const from = /^from (-?[\d.]+)deg$/.exec(args[0])
    if (from) {
        args.shift()
        angle = Number(from[1])
    }
    let previous = 0
    const stops = args.flatMap((stop, index) => {
        const parts = split(stop, ' ')
        const paint = paintOf(parts[0])
        const at = parts[1]
        const position = at === undefined ? index / Math.max(1, args.length - 1) : at.endsWith('%') ? px(at) / 100 : at.endsWith('deg') ? px(at) / 360 : px(at)
        previous = Math.max(previous, Math.min(1, position))
        return paint ? [{ paint, position: previous }] : []
    })
    // The first colour runs from the start, the last to the end.
    if (stops.length && stops[0].position > 0) {
        stops.unshift({ paint: stops[0].paint, position: 0 })
    }
    if (stops.length && stops[stops.length - 1].position < 1) {
        stops.push({ paint: stops[stops.length - 1].paint, position: 1 })
    }
    return { angle, stops, angular: true }
}

function backgroundImageOf(value: string | undefined): { gradient?: Gradient, band?: Band } {
    const conic = value ? conicOf(value) : undefined
    if (conic) {
        return { gradient: conic }
    }
    const match = value ? /^linear-gradient\((.+)\)$/.exec(value) : null
    if (!match) {
        return {}
    }
    const args = split(match[1], ',')
    let angle = 180
    const direction = /^to (top|bottom|left|right)$/.exec(args[0]) ?? /^(-?[\d.]+)deg$/.exec(args[0])
    if (direction) {
        args.shift()
        angle = { top: 0, right: 90, bottom: 180, left: 270 }[direction[1]] ?? Number(direction[1])
    }
    const stops = args.map((stop) => {
        const parts = split(stop, ' ')
        const position = parts.length > 1 ? parts[parts.length - 1] : undefined
        return { paint: paintOf(parts[0]), position }
    })
    const side = ({ 180: 'top', 0: 'bottom', 90: 'left', 270: 'right' } as const)[angle]
    if (stops.length === 2 && side && stops[0].position?.endsWith('px') && stops[0].position === stops[1].position && transparent(stops[1].paint) && stops[0].paint) {
        return { band: { side, size: px(stops[0].position), paint: stops[0].paint } }
    }
    return {
        gradient: {
            angle,
            stops: stops.flatMap((stop, index) =>
                stop.paint ? [{ paint: stop.paint, position: stop.position?.endsWith('%') ? px(stop.position) / 100 : index / Math.max(1, stops.length - 1) }] : []
            )
        }
    }
}

const SIDES = ['Top', 'Right', 'Bottom', 'Left'] as const

/** What an element draws itself: fills, a border if it's even all round, shadows; uneven borders become bands. */
/**
 * What an element draws itself: fills, a border all round, shadows. A side whose border differs from the others', or
 * that is the only one drawn, is a band of its own, as is every side in `bandSides`: a part has the same bands in
 * every combination, so its symbol keeps one structure, e.g. a toggle's divider that only shows in some states.
 */
/** A pseudo-element's box once its parent's turn, about the parent's centre, is applied to where its styles put it. */
function turnedWithin(node: CapturedNode, parent: CapturedNode, turn: number): CapturedNode {
    const angle = (turn * Math.PI) / 180
    const dx = node.x + node.width / 2 - (parent.x + parent.width / 2)
    const dy = node.y + node.height / 2 - (parent.y + parent.height / 2)
    const x = parent.x + parent.width / 2 + dx * Math.cos(angle) - dy * Math.sin(angle)
    const y = parent.y + parent.height / 2 + dx * Math.sin(angle) + dy * Math.cos(angle)
    const quarter = Math.round(turn / 90) % 2 !== 0
    const width = quarter ? node.height : node.width
    const height = quarter ? node.width : node.height
    return { ...node, x: x - width / 2, y: y - height / 2, width, height }
}

/** An element's rotation in degrees, clockwise, from its computed transform, e.g. `matrix(-1, 0, 0, -1, 0, 0)`. */
function turnOf(transform: string | undefined): number {
    const matrix = /^matrix\(([^,]+),\s*([^,]+)/.exec(transform ?? '')
    return matrix ? (Math.atan2(parseFloat(matrix[2]), parseFloat(matrix[1])) * 180) / Math.PI : 0
}

/**
 * A box of borders alone, with one coloured side between transparent ones, e.g. a tooltip's arrow: the shape the
 * browser paints for that side, a triangle or a trapezoid, turned as the element is.
 */
function borderShapeOf(node: CapturedNode, turn: number): { path: string, paint: Paint } | undefined {
    const background = paintOf(node.style.backgroundColor)
    if ((background && !transparent(background)) || (node.style.backgroundImage ?? 'none') !== 'none') {
        return undefined
    }
    const widths = SIDES.map((edge) => ((node.style[`border${edge}Style`] ?? 'none') === 'none' ? 0 : px(node.style[`border${edge}Width`])))
    const paints = SIDES.map((edge) => paintOf(node.style[`border${edge}Color`]))
    const shown = SIDES.map((_, index) => index).filter((index) => widths[index] > 0 && !transparent(paints[index]))
    const [side] = shown
    const paint = paints[side]
    // Its neighbours cut the side's ends at an angle only where they're there, if unseen.
    if (shown.length !== 1 || !paint || !widths[(side + 1) % 4] || !widths[(side + 3) % 4]) {
        return undefined
    }
    const [top, right, bottom, left] = widths
    // Its own box, before it's turned: a quarter turn swaps its sides.
    const quarter = Math.round(turn / 90) % 2 !== 0
    const w = quarter ? node.height : node.width
    const h = quarter ? node.width : node.height
    // Nothing inside the borders.
    if (Math.abs(w - left - right) > 0.5 && Math.abs(h - top - bottom) > 0.5) {
        return undefined
    }
    const corners: Array<Array<[number, number]>> = [
        [[0, 0], [w, 0], [w - right, top], [left, top]],
        [[w, 0], [w, h], [w - right, h - bottom], [w - right, top]],
        [[w, h], [0, h], [left, h - bottom], [w - right, h - bottom]],
        [[0, h], [0, 0], [left, top], [left, h - bottom]]
    ]
    const angle = (turn * Math.PI) / 180
    const points = corners[side]
        .map(([x, y]): [number, number] => {
            const dx = x - w / 2
            const dy = y - h / 2
            return [node.width / 2 + dx * Math.cos(angle) - dy * Math.sin(angle), node.height / 2 + dx * Math.sin(angle) + dy * Math.cos(angle)]
        })
        .map(([x, y]) => `${round(x)} ${round(y)}`)
        .filter((point, index, all) => point !== all[(index + all.length - 1) % all.length])
    return { path: `M ${points.join(' L ')} Z`, paint }
}

function drawingOf(node: CapturedNode, bandSides: ReadonlySet<string> = new Set()): { style: LayerStyle, bands: Band[] } {
    const style: LayerStyle = { fills: [], shadows: shadowsOf(node.style.boxShadow) }
    const bands: Band[] = []
    const background = paintOf(node.style.backgroundColor)
    if (!transparent(background) && background) {
        style.fills.push(background)
    }
    // Each gradient of a background image is a fill, over the background colour, the first one on top as in CSS;
    // images, e.g. an alpha slider's checkerboard, aren't drawn.
    const layers = node.style.backgroundImage && node.style.backgroundImage !== 'none' ? split(node.style.backgroundImage, ',') : []
    for (const image of layers.map(backgroundImageOf).reverse()) {
        if (image.gradient) {
            style.fills.push(image.gradient)
        }
        if (image.band) {
            bands.push(image.band)
        }
    }
    const sides = SIDES.map((side) => ({
        side: side.toLowerCase() as Band['side'],
        width: (node.style[`border${side}Style`] ?? 'none') === 'none' ? 0 : px(node.style[`border${side}Width`]),
        paint: paintOf(node.style[`border${side}Color`])
    }))
    const shows = (side: (typeof sides)[number]) => side.width > 0 && !!side.paint && !transparent(side.paint)
    const sideKey = (side: (typeof sides)[number]) => keyOf([side.width, side.paint])
    // A circle, not a line, with sides of different colours, e.g. a spinner's arc, as a ring whose quarters have the
    // sides' colours: an angular gradient, the top side's quarter centred at the top.
    const circular = radiusOf(node, 'TopLeft') > 0 && radiusOf(node, 'TopLeft') >= Math.min(node.width, node.height) / 2 - 0.5
    const drawn = sides.filter(shows)
    const width = Math.max(...sides.map((side) => side.width))
    if (circular && drawn.length && drawn.length < 4 && width > 0 && drawn[0].paint) {
        const clear: Paint = { color: '#00000000' }
        const colour = (side: (typeof sides)[number]) => (shows(side) && side.paint ? side.paint : clear)
        const [top, right, bottom, left] = sides.map(colour)
        const quarters: Array<[Paint, number, number]> = [
            [top, 0, 0.125],
            [right, 0.125, 0.375],
            [bottom, 0.375, 0.625],
            [left, 0.625, 0.875],
            [top, 0.875, 1]
        ]
        const stops = quarters.flatMap(([paint, from, to]) => [
            { paint, position: from },
            { paint, position: to }
        ])
        style.border = { width, paint: drawn[0].paint, gradient: { angle: 0, stops, angular: true } }
        return finish()
    }
    // The border all round, where every side is drawn: the look most sides have.
    let common: (typeof sides)[number] | undefined
    if (sides.every(shows)) {
        const counts = new Map<string, number>()
        sides.forEach((side) => counts.set(sideKey(side), (counts.get(sideKey(side)) ?? 0) + 1))
        common = sides.reduce((most, side) => ((counts.get(sideKey(side)) ?? 0) > (counts.get(sideKey(most)) ?? 0) ? side : most))
        if (common.paint) {
            const dashed = ['dashed', 'dotted'].includes(node.style.borderTopStyle ?? '')
            style.border = { width: common.width, paint: common.paint, ...(dashed ? { dashed } : {}) }
        }
    }
    for (const side of sides) {
        const differs = shows(side) && (!common || sideKey(side) !== sideKey(common))
        if ((differs || (bandSides.has(side.side) && side.width > 0)) && side.paint) {
            bands.push({ side: side.side, size: side.width, paint: side.paint })
        }
    }
    return finish()

    function finish() {
        // A ring cut by a mask, e.g. a progress ring: its fill is the ring's border, as thick as the mask leaves it.
        const ring = /radial-gradient\(.*?calc\(100% - ([\d.]+)px\)/.exec(node.style.maskImage ?? '')
        const gradient = style.fills.find((fill): fill is Gradient => 'stops' in fill)
        if (ring && gradient) {
            style.border = { width: Number(ring[1]), paint: gradient.stops[0].paint, gradient }
            style.fills = style.fills.filter((fill) => fill !== gradient)
        }
        const opacity = node.style.opacity === undefined ? 1 : Number(node.style.opacity)
        if (opacity !== 1) {
            style.opacity = opacity
        }
        return { style, bands }
    }
}

/** A corner's radius in pixels, a percentage of the element's size worked out. */
function radiusOf(node: CapturedNode, corner: 'TopLeft' | 'TopRight' | 'BottomRight' | 'BottomLeft'): number {
    const value = node.style[`border${corner}Radius`] ?? '0'
    return value.endsWith('%') ? (px(value) / 100) * Math.min(node.width, node.height) : px(value)
}

const draws = (style: LayerStyle) => style.fills.length > 0 || !!style.border || style.shadows.length > 0

// ---- Typography ----

interface TokenNode {
    $type?: string
    $value?: unknown
    [key: string]: unknown
}

const tokens = JSON.parse(readFileSync(join(kitDir, 'tokens.json'), 'utf8')) as Record<string, Record<string, TokenNode>>
// The theme's variables as it defines them, e.g. `var(--text-subtitle-font-size)`, which capture wrote.
const { formulas } = JSON.parse(readFileSync(join(kitDir, 'theme.json'), 'utf8')) as { formulas: Record<string, string> }

/** A text token's value as CSS reports it, following aliases. */
function tokenValue(group: string, name: string): string | undefined {
    let token = tokens[group]?.[name]
    while (typeof token?.$value === 'string' && token.$value.startsWith('{')) {
        const [aliasGroup, aliasName] = token.$value.slice(1, -1).split('.')
        token = tokens[aliasGroup]?.[aliasName]
    }
    const value = token?.$value
    if (value && typeof value === 'object' && 'unit' in value && 'value' in value) {
        return `${Number(value.value) * (value.unit === 'rem' ? 16 : 1)}px`
    }
    return Array.isArray(value) ? value.join(', ') : value === undefined ? undefined : String(value)
}

/** The typography category a font is, if it's exactly one of the theme's. */
function typographyOf(font: TextStyle['font']): string | undefined {
    return Object.keys(TYPOGRAPHY).find((category) => {
        // A size's category shares the rest with its base, e.g. button-tiny's weight is button's.
        const value = (property: string) => tokenValue('text', `${category}-${property}`) ?? tokenValue('text', `${category.split('-')[0]}-${property}`)
        return (
            px(value('font-size')) === font.size &&
            Number(value('font-weight')) === font.weight &&
            px(value('line-height')) === font.lineHeight &&
            typographyTransform(category) === (font.transform ?? 'none')
        )
    })
}

/** The typography variable each text measure has, by its suffix, e.g. `text-heading-6-font-size`. */
const TYPOGRAPHY_SUFFIXES: Partial<Record<BoundMeasure, string>> = { fontSize: 'font-size', lineHeight: 'line-height', fontWeight: 'font-weight', fontFamily: 'font-family' }

/**
 * Whether a text's font follows a typography's variables, through its component's, e.g. a card's text through
 * `card-text-font-size`, which is `var(--text-paragraph-font-size)`: then a theme that changes the typography changes
 * the text, and only then the text is the typography's. A font that only looks like it, e.g. a giant input's, whose
 * size is heading 6's but whose family is the subtitle's, or with a text case of its own, e.g. a tab's, has a style of
 * its own, so the theme can change each apart, as in the app.
 */
function followsTypography(node: CapturedNode, category: string): boolean {
    const reaches = (variable: string, wanted: string[]) => {
        const seen = new Set<string>()
        for (let name: string | undefined = variable; name && !seen.has(name);) {
            if (wanted.includes(name)) {
                return true
            }
            seen.add(name)
            name = /^var\(--([\w-]+)\)$/.exec((formulas[name] ?? '').trim())?.[1]
        }
        return false
    }
    return TEXT_MEASURES.every(([, measure]) => {
        const binding = node.bindings?.[measure]
        if (!binding) {
            return true
        }
        const suffix = TYPOGRAPHY_SUFFIXES[measure]
        const variables = binding.variable ? [binding.variable] : (binding.terms ?? []).map((term) => term.variable)
        // A size's category shares the rest with its base, e.g. button-tiny's weight is button's.
        const wanted = suffix ? [`text-${category}-${suffix}`, `text-${category.split('-')[0]}-${suffix}`] : []
        return variables.length > 0 && variables.every((variable) => reaches(variable, wanted))
    })
}

function textStyleOf(node: CapturedNode): TextStyle {
    const transform = node.style.textTransform
    const font = {
        family: (node.style.fontFamily ?? '').split(',')[0].replace(/["']/g, '').trim(),
        size: px(node.style.fontSize),
        weight: Number(node.style.fontWeight ?? 400),
        lineHeight: px(node.style.lineHeight) || Math.round(px(node.style.fontSize) * 1.2),
        letterSpacing: px(node.style.letterSpacing),
        // Design tools set text in capitals or small letters; capitalised words are written so, see the text's layer.
        ...(transform === 'uppercase' || transform === 'lowercase' ? { transform } : {})
    }
    const paint = paintOf(node.style.color) ?? { color: '#000000' }
    const matching = typographyOf(font)
    const category = matching && followsTypography(node, matching) ? matching : undefined
    const colour = paint.variable ? TYPOGRAPHY_COLOURS[paint.variable] : undefined
    const shadows = shadowsOf(node.style.textShadow)
    return {
        font,
        paint,
        shadows,
        ...(category && colour && !shadows.length ? { typography: `${TYPOGRAPHY[category]}/${colour}` } : {})
    }
}

// ---- Layers ----

/** A captured node's layers: itself as a layer, with its bands as layers of their own on top. */
interface Draft {
    layer: Layer
    /** The look of each layer of the draft, by its path, to name styles by what changes them. */
    looks: Map<string, { kind: 'layer' | 'text', look: LayerStyle | TextStyle, part: string, bindings?: StyleBindings }>
    /**
     * Each icon's and text's colour, by its layer's name: a tint, not a style, so a look's colours carry over when a
     * symbol is swapped for another size, whose texts have their own fonts.
     */
    tints: Map<string, { part: string, paint: Paint, symbol?: string }>
    /** The sides each part has bands on. */
    bandSides: Map<string, Set<string>>
}

/** Whether the spec names an element's part, by its tag or a class, so it's kept even where it wraps another. */
function namedPart(spec: ComponentSpec, node: CapturedNode): boolean {
    const parts = spec.parts ?? {}
    return (
        !!parts[node.tag] ||
        Object.keys(parts).some(
            (key) => key.startsWith('.') && node.classes.some((name) => (key.endsWith('*') ? name.startsWith(key.slice(1, -1)) : name === key.slice(1)))
        )
    )
}

function partName(spec: ComponentSpec, node: CapturedNode, parent: string | undefined, isRoot: boolean): string {
    const parts = spec.parts ?? {}
    // A class says more than a tag, e.g. a pressed toggle among a group's buttons; `.name-*` matches a class
    // starting with `name-`, e.g. a size's.
    const classKey = Object.keys(parts).find(
        (key) => key.startsWith('.') && node.classes.some((name) => (key.endsWith('*') ? name.startsWith(key.slice(1, -1)) : name === key.slice(1)))
    )
    // `{parent}` stands for the parent's part, e.g. each kind of calendar cell's content.
    if (classKey) {
        return parts[classKey].replace('{parent}', parent ?? '')
    }
    if (parts[node.tag]) {
        return parts[node.tag].replace('{parent}', parent ?? '')
    }
    if (isRoot) {
        return parts['root'] ?? 'Body'
    }
    if (node.tag === '#text') {
        return parent && parent !== (parts['root'] ?? 'Body') ? `${parent} Text` : 'Text'
    }
    // A pseudo-element by its element's part, e.g. a tab's underline as Tab Before.
    if (node.tag.startsWith('::')) {
        return `${parent ?? ''} ${title(node.tag.slice(2))}`.trim()
    }
    if (node.tag === 'nb-icon') {
        return 'Icon'
    }
    if (node.ref) {
        // A component of the kit by its name, e.g. Input; a button by what it's for, e.g. Close Button.
        return COMPONENTS[node.ref.component]?.name ?? `${title(node.classes[0] ?? node.ref.component)} Button`
    }
    const prefix = `nb-${Object.keys(COMPONENTS).find((key) => COMPONENTS[key] === spec)}-`
    if (node.tag.startsWith(prefix)) {
        return node.tag.slice(prefix.length).split('-').map(title).join(' ')
    }
    // Else its first class that says what it is, not what inputs it has, or its tag, in words: `days-container` is
    // Days Container, `nb-calendar-days-names` Calendar Days Names.
    const named = node.classes.find((name) => !/^(appearance|size|status|shape|position|nb-overlay)-|^nb-transition$/.test(name)) ?? node.tag
    return named.replace(/^nb-/, '').split(/[-_]+/).filter(Boolean).map(title).join(' ')
}

const round = (value: number) => Math.round(value * 100) / 100

function layoutOf(node: CapturedNode, children: CapturedNode[]): Layer['layout'] {
    // A field lays its value out as a row, centred across; so does a block of one line of text and inline elements,
    // e.g. a label and its required mark.
    const field = node.tag === 'input' || node.tag === 'textarea'
    // A table cell lays its content out as a block does, e.g. a sortable header's button and arrow in a row.
    // So does a block that holds its floats, e.g. a validation error's.
    const shown = node.style.display === 'table-cell' || node.style.display === 'flow-root' ? 'block' : node.style.display
    const display = field ? 'flex' : shown ?? 'block'
    if (!['flex', 'block', 'inline-flex'].includes(display)) {
        return undefined
    }
    const flowing = children.filter((child) => child.style.position !== 'absolute' && child.tag[0] !== ':')
    const inline =
        display === 'block' &&
        flowing.length > 1 &&
        flowing.every((child) => child.tag === '#text' || (child.style.display ?? '').startsWith('inline')) &&
        flowing.every((child) => Math.abs(child.y - flowing[0].y) < 4 && (child.lines ?? 1) === 1)
    const direction = field || inline ? 'row' : display === 'block' ? 'column' : node.style.flexDirection?.startsWith('column') ? 'column' : 'row'
    const padding = (['Top', 'Right', 'Bottom', 'Left'] as const).map(
        (side) => px(node.style[`padding${side}`]) + ((node.style[`border${side}Style`] ?? 'none') === 'none' ? 0 : px(node.style[`border${side}Width`]))
    ) as [number, number, number, number]
    // An inline row's spacing is its elements' margins, read from where they are, if it's even.
    const spaces = inline ? flowing.slice(1).map((child, index) => child.x - (flowing[index].x + flowing[index].width)) : []
    const evenSpace = spaces.length && spaces.every((space) => Math.abs(space - spaces[0]) < 0.5) ? Math.max(0, round(spaces[0])) : 0
    const gap = inline ? evenSpace : px(direction === 'row' ? node.style.columnGap : node.style.rowGap)
    const inFlow = children.filter((child) => child.style.position !== 'absolute' && child.tag[0] !== ':')
    if (!inFlow.length) {
        return undefined
    }
    const flexValue = (value: string | undefined, fallback: string) =>
        !value || value === 'normal' ? fallback : value.replace(/^(flex|flow|self)-/, '').replace('space-between', 'between')
    // A reversed row or column is laid out from its end: its children are drafted in reverse, packed at the other end.
    const reversed = !field && !inline && display !== 'block' && !!node.style.flexDirection?.endsWith('-reverse')
    // Children that grow take the room the justification would spread, e.g. a stepper's connectors.
    const justify = flowing.some((child) => Number(child.style.flexGrow) > 0) ? 'start' : flexValue(node.style.justifyContent, 'start')
    const packed = reversed ? ({ start: 'end', end: 'start' } as Record<string, string>)[justify] ?? justify : justify
    // A block of centred (or end-aligned) text alone, e.g. an avatar's initials, centres it.
    const textAlign = node.style.textAlign ?? 'start'
    const aligned = display === 'block' && flowing.length > 0 && flowing.every((child) => child.tag === '#text') && /center|end|right/.test(textAlign)
    // Inline elements of different heights line up on their middles, e.g. a sortable header's button and arrow.
    const middle = (child: CapturedNode) => child.y + child.height / 2
    const centredLine = inline && flowing.every((child) => Math.abs(middle(child) - middle(flowing[0])) < 1)
    const align = field
        ? node.tag === 'textarea'
            ? 'start'
            : 'center'
        : inline
            ? centredLine ? 'center' : 'start'
            : aligned
                ? textAlign === 'center'
                    ? 'center'
                    : 'end'
                : display === 'block'
                    ? 'stretch'
                    : flexValue(node.style.alignItems, 'stretch')
    return {
        direction,
        gap,
        padding,
        align,
        justify: field || inline ? 'start' : packed,
        hug: { width: false, height: false },
        ...(field ? { fixed: true } : {})
    }
}

/**
 * Whether a frame's layout puts its children where the browser did: a design tool's stack has no negative margins
 * or overlaps, e.g. a card's status header drawn over the card's border, so such a frame keeps them where they are.
 */
/** The texts the browser wraps over more than one line, which keep the width they wrap at. */
const wrapping = new WeakSet<Layer>()

/** Layers of fixed elements, which no frame they're in clips, e.g. a drawer's backdrop over the page. */
const fixedLayers = new WeakSet<Layer>()
/** The fixed layers a clipping frame let out, which its parent places beside it. */
const escaping = new WeakMap<Layer, Layer[]>()

/**
 * A row that sizes to its content can't stretch what's in it, so a column in it sizes to its content too, e.g. a
 * user's name and title: its children don't stretch, and its texts of one line grow with their words.
 */
function hugInHuggingRows(layer: Layer, inHuggingRow = false) {
    const layout = layer.layout
    if (inHuggingRow && layout?.direction === 'column') {
        layout.hug.width = true
        // Its children keep their own widths, which its width comes from: stretched to it, they'd wrap at it.
        if (layout.align === 'stretch') {
            layout.align = 'start'
        }
        for (const child of layer.children.filter((candidate) => !candidate.absolute)) {
            delete child.fill
            if (child.kind === 'text' && child.textSizing === 'fixed' && !wrapping.has(child)) {
                child.textSizing = 'auto'
            }
        }
    }
    const hugsRow = layout?.direction === 'row' && layout.hug.width
    const contentSized = hugsRow || (inHuggingRow && layout?.direction === 'column')
    layer.children.forEach((child) => hugInHuggingRows(child, !child.absolute && contentSized))
}

/**
 * Siblings in the flow that overlap, e.g. a form field's addons over its input, as the browser draws them: the smaller
 * is placed on its own, so a stack doesn't lay it out beside the other, and it keeps to the edge it's at.
 */
function placeOverlaps(node: CapturedNode) {
    const flowing = node.children.filter((child) => child.style.position !== 'absolute' && child.tag[0] !== ':' && child.tag !== '#text' && child.width > 0 && child.height > 0)
    for (const a of flowing) {
        for (const b of flowing) {
            const across = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)
            const down = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y)
            if (a !== b && across > 1 && down > 1) {
                const smaller = a.width * a.height <= b.width * b.height ? a : b
                smaller.style = { ...smaller.style, position: 'absolute' }
            }
        }
    }
}

/**
 * Lines placed side by side that meet and look alike, e.g. a plain divider's two halves, as one: halves can't keep
 * meeting when the frame is resized, as a layer keeps to its edges.
 */
function mergeMeetingLines(layer: Layer, looks: Draft['looks']) {
    const look = (part: Layer): string => keyOf([part.y, part.height, looks.get(part.name)?.look ?? null, part.children.map(look)])
    const placed = layer.children.filter((child) => child.absolute).sort((a, b) => a.x - b.x)
    for (let at = 0; at < placed.length - 1; at++) {
        const [first, next] = [placed[at], placed[at + 1]]
        if (Math.abs(first.x + first.width - next.x) < 0.5 && look(first) === look(next)) {
            const width = first.width
            first.width = round(first.width + next.width)
            first.children.filter((child) => Math.abs(child.width - width) < 0.5).forEach((child) => (child.width = first.width))
            layer.children = layer.children.filter((child) => child !== next)
            placed.splice(at + 1, 1)
            at--
        }
    }
}

/**
 * A child that grows takes the room its parent leaves; a parent that sizes to its content along its layout leaves none,
 * e.g. a card that's as tall as its header, body and footer, so its body's `flex: 1` does nothing there.
 */
function growOnlyWithRoom(layer: Layer) {
    const layout = layer.layout
    const sized = layout && (layout.direction === 'row' ? layout.hug.width : layout.hug.height)
    for (const child of layer.children) {
        if (sized || !layout) {
            delete child.grow
        }
        growOnlyWithRoom(child)
    }
}

/**
 * Makes the texts in a part wrap in the room the component gives it, as code wraps a longer text, e.g. a toast's
 * message: the part takes the room its row leaves, or its column's width, and its columns and texts their width.
 */
function wrapIn(layer: Layer, part: string) {
    const index = layer.children.findIndex((child) => child.name === part)
    const found = layer.children[index]
    if (!found) {
        layer.children.forEach((child) => wrapIn(child, part))
        return
    }
    if (layer.layout?.direction === 'row') {
        found.grow = true
    } else if (layer.layout) {
        found.fill = true
    }
    const spread = (frame: Layer) => {
        if (!frame.layout || frame.layout.direction !== 'column') {
            return
        }
        frame.layout.hug.width = false
        for (const child of frame.children.filter((candidate) => !candidate.absolute)) {
            child.fill = true
            if (child.kind === 'text') {
                child.textSizing = 'fixed'
                child.width = round(frame.width - frame.layout.padding[1] - frame.layout.padding[3])
            }
            spread(child)
        }
    }
    spread(found)
}

/**
 * A screen's blocks take the width they're given: columns don't size to their content, their parts stretch across
 * them, and their texts wrap at that width, as in the browser; rows keep their parts' own sizes.
 */
function spreadFluid(layer: Layer, inRow = false) {
    const layout = layer.layout
    // A column in a row, e.g. a header's brand, sizes to its content, and one that centres its parts, e.g. a tab's icon
    // and title, keeps their sizes.
    if (layout?.direction === 'column' && !inRow && layout.align !== 'center') {
        layout.hug.width = false
        for (const child of layer.children.filter((candidate) => !candidate.absolute && candidate.kind !== 'ref')) {
            child.fill = true
            if (child.kind === 'text') {
                child.textSizing = 'fixed'
                child.width = round(layer.width - layout.padding[1] - layout.padding[3])
            }
        }
        if (layout.align === 'start' && layer.children.some((child) => child.fill)) {
            layout.align = 'stretch'
        }
    } else if (layout?.direction === 'row' && layout.hug.width) {
        // A row as wide as its container, e.g. a layout's, takes its width; its parts that grow take the room left.
        layout.hug.width = false
    }
    layer.children.forEach((child) => spreadFluid(child, layout?.direction === 'row'))
}

/**
 * A row stretched across its container whose parts are far apart, e.g. a calendar's title and its arrows, which an auto
 * margin keeps at the ends: they stay at the ends of whatever width it's given.
 */
function spreadApart(layer: Layer) {
    const layout = layer.layout
    const inFlow = layer.children.filter((child) => !child.absolute)
    if (layout?.direction === 'row' && layer.fill && inFlow.length === 2 && layout.gap >= 24 && layout.justify === 'start') {
        layout.justify = 'between'
        layout.gap = 0
        layout.hug.width = false
    }
    layer.children.forEach(spreadApart)
}

/** Whether a layer is a field, e.g. an input, or holds one. */
const holdsField = (layer: Layer): boolean => !!layer.layout?.fixed || layer.children.some(holdsField)

/**
 * A component that stretches like its field: it takes its container's width, and the part that holds the field, e.g.
 * a form field's control, the room its other parts leave, with the field stretched across it.
 */
function stretchToField(top: Layer) {
    if (!top.layout) {
        return
    }
    top.layout.hug.width = false
    for (const part of top.children.filter((child) => !child.absolute && holdsField(child))) {
        part.grow = true
        if (part.layout) {
            part.layout.hug.width = false
            part.layout.align = 'stretch'
            part.children.filter((child) => !child.absolute && child.kind !== 'text').forEach((child) => (child.fill = true))
        }
    }
}

function stacks(layer: Layer, retried = false): boolean {
    const layout = layer.layout
    if (!layout) {
        return false
    }
    const [top, right, bottom, left] = layout.padding
    const row = layout.direction === 'row'
    const inFlow = layer.children.filter((child) => !child.absolute)
    // Children stretch across, except text that sizes to its words, as in a badge.
    for (const child of inFlow) {
        child.fill = layout.align === 'stretch' && !(child.kind === 'text' && child.textSizing === 'auto')
    }
    const innerCross = row ? layer.height - top - bottom : layer.width - left - right
    const startCross = row ? top : left
    const mainSize = inFlow.reduce((total, child) => total + (row ? child.width : child.height), 0) + layout.gap * (inFlow.length - 1)
    const innerMain = row ? layer.width - left - right : layer.height - top - bottom
    const offsets: Record<string, number> = { center: (innerMain - mainSize) / 2, end: innerMain - mainSize }
    let main = (row ? left : top) + (offsets[layout.justify] ?? 0)
    // Spread out, e.g. a select's value and its chevron: the space left over between each two.
    const between = layout.justify === 'between' && inFlow.length > 1
    const spacing = between ? (innerMain - (mainSize - layout.gap * (inFlow.length - 1))) / (inFlow.length - 1) : layout.gap
    const fits = inFlow.every((child) => {
        // Text is placed by its line box, which the browser's glyph box only approximates.
        const tolerance = child.kind === 'text' ? 1.1 : 0.6
        const size = row ? child.width : child.height
        const cross = row ? child.y : child.x
        const crossSize = row ? child.height : child.width
        const expectedCross =
            layout.align === 'center' ? startCross + (innerCross - crossSize) / 2 : layout.align === 'end' ? startCross + innerCross - crossSize : startCross
        // A part of its own size across isn't stretched, e.g. a chat message's avatar beside its taller bubble.
        if (child.fill && child.kind !== 'text' && Math.abs(crossSize - innerCross) >= tolerance && Math.abs(cross - startCross) < tolerance) {
            child.fill = false
        }
        const placed =
            Math.abs((row ? child.x : child.y) - main) < tolerance &&
            Math.abs(cross - expectedCross) < tolerance &&
            (!child.fill || Math.abs(crossSize - innerCross) < tolerance)
        main += size + spacing
        return placed
    })
    if (!fits) {
        for (const child of inFlow) {
            delete child.fill
        }
        // Parts off the row's line across, e.g. a stepper's connectors level with its steps' numbers: each in a box as
        // tall as the row, where it keeps its place, so the row can stack the boxes.
        const crossAt = (child: Layer) => (row ? child.y : child.x)
        const offLine = inFlow.filter((child) => child.kind !== 'text' && !child.fill && layout.align === 'start' && Math.abs(crossAt(child) - startCross) > 0.6)
        const within = offLine.every((child) => crossAt(child) > startCross && crossAt(child) + (row ? child.height : child.width) <= startCross + innerCross + 0.6)
        if (!retried && offLine.length && within && !layer.children.some((child) => child.name.endsWith(' Box'))) {
            const children = layer.children
            layer.children = children.map((child) => {
                if (!offLine.includes(child)) {
                    return child
                }
                const box: Layer = {
                    name: `${child.name} Box`,
                    kind: 'frame',
                    x: row ? child.x : startCross,
                    y: row ? startCross : child.y,
                    width: row ? child.width : innerCross,
                    height: row ? innerCross : child.height,
                    children: [{ ...child, x: row ? 0 : round(child.x - startCross), y: row ? round(child.y - startCross) : 0, grow: false }],
                    ...(child.grow ? { grow: true } : {})
                }
                return box
            })
            if (stacks(layer, false)) {
                return true
            }
            layer.children = children
        }
        // Room before the first child, e.g. a validation message's top margin, as the frame's padding.
        // Not where something grows into that room, e.g. a divider's line before its label.
        const lead = inFlow.length && layout.justify === 'start' && !layer.children.some((child) => child.absolute && child.grow) && inFlow[0].width > 0 && inFlow[0].height > 0 ? (row ? inFlow[0].x - left : inFlow[0].y - top) : 0
        if (lead > 0.6) {
            const padding = [...layout.padding] as [number, number, number, number]
            layout.padding[row ? 3 : 0] = round(layout.padding[row ? 3 : 0] + lead)
            if (stacks(layer, retried)) {
                return true
            }
            layout.padding = padding
        }
        // Spacing from margins, e.g. a button's icon's, as a stack's gap, where it's even between the children.
        const spaces = inFlow.slice(1).map((child, index) => (row ? child.x - (inFlow[index].x + inFlow[index].width) : child.y - (inFlow[index].y + inFlow[index].height)))
        // Overlapping by a border at most, e.g. a button group's buttons, not laid over one another.
        if (!retried && layout.justify !== 'between' && spaces.length && spaces[0] > -2.1 && spaces.every((space) => Math.abs(space - spaces[0]) < 0.6) && Math.abs(spaces[0] - layout.gap) > 0.5) {
            const gap = layout.gap
            layout.gap = round(spaces[0])
            if (stacks(layer, true)) {
                return true
            }
            layout.gap = gap
        }
        // Uneven spacing, e.g. a field's label's margin above its input: the smallest as the gap, and the rest as the
        // padding at the end of the frame before it, where that's a frame with a layout of its own.
        const base = Math.max(0, Math.min(...spaces))
        const extra = spaces.map((space) => space - base)
        const absorbs = extra.every((space, index) => space < 0.6 || (inFlow[index].kind === 'frame' && !!inFlow[index].layout))
        if (!retried && spaces.length && spaces.every((space) => space > -0.6) && absorbs && extra.some((space) => space >= 0.6)) {
            const before = inFlow.map((child) => ({ width: child.width, height: child.height, padding: child.layout ? ([...child.layout.padding] as [number, number, number, number]) : undefined }))
            const gap = layout.gap
            layout.gap = round(base)
            extra.forEach((space, index) => {
                const child = inFlow[index]
                if (space >= 0.6 && child.layout) {
                    child.layout.padding[row ? 1 : 2] = round(child.layout.padding[row ? 1 : 2] + space)
                    if (row) {
                        child.width = round(child.width + space)
                    } else {
                        child.height = round(child.height + space)
                    }
                }
            })
            if (stacks(layer, true)) {
                return true
            }
            layout.gap = gap
            inFlow.forEach((child, index) => {
                child.width = before[index].width
                child.height = before[index].height
                if (child.layout && before[index].padding) {
                    child.layout.padding = before[index].padding
                }
            })
        }
        // A part that covers its parent's border, e.g. a status card's header: the column's padding as far as its
        // children reach, and the others a pixel or so inside it stretched to the same edges, so it stays a stack.
        if (!retried && !row && inFlow.length > 1 && layout.align === 'stretch') {
            const reachLeft = Math.min(...inFlow.map((child) => child.x))
            const reachRight = layer.width - Math.max(...inFlow.map((child) => child.x + child.width))
            const reachTop = inFlow[0].y
            const covers = reachLeft < left - 0.5 || reachRight < right - 0.5 || reachTop < top - 0.5
            const close = inFlow.every((child) => child.x - reachLeft <= 1.5 && layer.width - reachRight - (child.x + child.width) <= 1.5)
            if (covers && close && reachLeft >= 0 && reachRight >= 0 && reachTop >= 0) {
                const before = { padding: [...layout.padding] as [number, number, number, number], frames: inFlow.map((child) => ({ x: child.x, width: child.width })) }
                layout.padding = [round(reachTop), round(reachRight), bottom, round(reachLeft)]
                inFlow.forEach((child) => {
                    child.x = round(reachLeft)
                    child.width = round(layer.width - reachLeft - reachRight)
                })
                if (stacks(layer, true)) {
                    return true
                }
                layout.padding = before.padding
                inFlow.forEach((child, index) => Object.assign(child, before.frames[index]))
            }
        }
        // A row of parts each centred across, e.g. a tab's title and its count, rather than stretched.
        const middle = (child: Layer) => child.y + child.height / 2
        const centre = startCross + innerCross / 2
        const centred = inFlow.every((child) => Math.abs(middle(child) - centre) < 1) && inFlow.some((child) => Math.abs(child.height - innerCross) > 0.6)
        if (!retried && row && layout.align === 'stretch' && inFlow.length > 1 && centred) {
            layout.align = 'center'
            if (stacks(layer, false)) {
                return true
            }
            layout.align = 'stretch'
        }
        return false
    }
    // Room after the last child where children grow, e.g. a stepper's last step's margin, as the frame's padding: else
    // they'd grow into it.
    const last = inFlow[inFlow.length - 1]
    const trailing = last ? (row ? layer.width - right - (last.x + last.width) : layer.height - bottom - (last.y + last.height)) : 0
    if (inFlow.some((child) => child.grow) && trailing > 0.6) {
        layout.padding[row ? 1 : 2] = round(layout.padding[row ? 1 : 2] + trailing)
    }
    // A frame hugs its content where its size is its padding and its content's, unless children stretch to it.
    const along = mainSize + (row ? left + right : top + bottom)
    const across = Math.max(0, ...inFlow.map((child) => (row ? child.height : child.width))) + (row ? top + bottom : left + right)
    const stretched = inFlow.some((child) => child.fill)
    if (layout.align === 'stretch' && (!stretched || inFlow.some((child) => !child.fill && child.kind !== 'text'))) {
        // Nothing stretches, e.g. a badge's text that sizes to its words: stretching it would wrap it at a rounding. Or
        // a part keeps its own size, e.g. a chat message's avatar: the parts that stretch fill across instead.
        layout.align = 'start'
    }
    // Parts spread apart, e.g. a calendar's title and its arrows, keep to the ends of whatever width it's given.
    const hugsMain = layout.justify !== 'between' && Math.abs(along - (row ? layer.width : layer.height)) < 0.6
    const hugsCross = !stretched && Math.abs(across - (row ? layer.height : layer.width)) < 0.6
    layout.hug = layout.fixed ? { width: false, height: false } : row ? { width: hugsMain, height: hugsCross } : { width: hugsCross, height: hugsMain }
    return true
}

/** The SVG images of the component being built, by their URLs. */
let capturedImages: Record<string, string> = {}

/**
 * The image a background shows, stretched over the element, as the kit's images keep it: a flag, not a tiled
 * pattern such as a checkerboard, which isn't drawn.
 */
function imageOf(node: CapturedNode, kit: Kit): string | undefined {
    // A picture element's own picture, e.g. a QR code's SVG, or the image it or a background shows.
    const own = node.picture ?? (node.pictureUrl ? capturedImages[node.pictureUrl] : undefined)
    if (own) {
        const ownKey = createHash('sha256').update(own).digest('hex').slice(0, 12)
        kit.images[ownKey] = own
        return ownKey
    }
    const url = /url\("([^"]+)"\)/.exec(node.style.backgroundImage ?? '')?.[1]
    const svg = url ? capturedImages[url] : undefined
    const size = node.style.backgroundSize ?? 'auto'
    const fits = ['cover', 'contain', '100% 100%'].includes(size) || node.style.backgroundRepeat === 'no-repeat' || size === 'auto'
    const tiled = node.style.backgroundRepeat !== 'no-repeat' && !['cover', 'contain', '100% 100%'].includes(size) && /\d/.test(size)
    if (!url || !svg || !fits || tiled) {
        return undefined
    }
    const key = createHash('sha256').update(svg).digest('hex').slice(0, 12)
    kit.images[key] = svg
    return key
}

/** Where a component of the kit inside another was captured, and its part there, to draw it in place if need be. */
const refSources = new WeakMap<Layer, { node: CapturedNode, part: string }>()

const TEXT_MEASURES: Array<[StyleMeasure, BoundMeasure]> = [
    ['size', 'fontSize'],
    ['lineHeight', 'lineHeight'],
    ['weight', 'fontWeight'],
    ['letterSpacing', 'letterSpacing'],
    ['transform', 'textTransform'],
    ['family', 'fontFamily']
]

/** A style's measures as the kit draws them. */
function measuresOfStyle(look: LayerStyle | TextStyle): StyleBinding['at'] {
    if ('font' in look) {
        const { size, lineHeight, weight, letterSpacing, transform, family } = look.font
        return { size, lineHeight, weight, letterSpacing, transform: transform ?? 'none', family }
    }
    return look.border ? { borderWidth: look.border.width } : {}
}

/** How a text's font follows theme variables, as its text style's. */
function textBindingsOf(node: CapturedNode): StyleBindings | undefined {
    const bindings: StyleBindings = {}
    for (const [measure, bound] of TEXT_MEASURES) {
        const binding = node.bindings?.[bound]
        if (binding) {
            bindings[measure] = [binding]
        }
    }
    return Object.keys(bindings).length ? bindings : undefined
}

/**
 * How a layer style follows theme variables: its border width, as its sides' does, the first that follows any; its
 * fill's and border's colours, where a component's colour variable sets them, e.g. `header-background-color`; and its
 * shadow, e.g. `card-shadow`, even where the theme has none.
 */
function layerBindingsOfStyle(node: CapturedNode, style: LayerStyle): StyleBindings | undefined {
    const bindings: StyleBindings = {}
    const width = style.border ? SIDES.map((side) => node.bindings?.[`border${side}Width`]).find(Boolean) : undefined
    if (width) {
        bindings.borderWidth = [width]
    }
    const fill = style.fills[0]
    if (node.colourVariables?.fill && fill && 'color' in fill) {
        bindings.fill = [{ variable: node.colourVariables.fill }]
    }
    if (node.colourVariables?.border && style.border && !style.border.gradient) {
        bindings.borderColor = [{ variable: node.colourVariables.border }]
    }
    if (node.bindings?.boxShadow) {
        bindings.shadow = [node.bindings.boxShadow]
    }
    return Object.keys(bindings).length ? bindings : undefined
}

const CORNERS = ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'] as const
const INSETS = ['insetTop', 'insetRight', 'insetBottom', 'insetLeft'] as const

/**
 * How a frame's corners, padding and gap follow theme variables. A corner follows only where the frame has the
 * radius the browser drew, not a percentage or a pill's radius capped at half its height.
 */
function layerBindingsOf(node: CapturedNode, layer: Layer): LayerBindings | undefined {
    const bound = node.bindings
    if (!bound) {
        return undefined
    }
    const bindings: LayerBindings = {}
    CORNERS.forEach((corner, index) => {
        const binding = bound[`border${corner}Radius`]
        const value = node.style[`border${corner}Radius`] ?? '0'
        // A frame without corners has a radius of 0, which a theme can round, e.g. a menu item's.
        if (binding && !value.endsWith('%') && (layer.radius ?? [0, 0, 0, 0])[index] === round(px(value))) {
            bindings.radius = { ...bindings.radius, [index]: binding }
        }
    })
    if (layer.absolute) {
        if (bound.width) {
            bindings.width = bound.width
        }
        if (bound.height) {
            bindings.height = bound.height
        }
    }
    if (layer.layout) {
        INSETS.forEach((inset, index) => {
            const binding = bound[inset]
            if (binding) {
                bindings.padding = { ...bindings.padding, [index]: binding }
            }
        })
        const gap = bound[layer.layout.direction === 'row' ? 'columnGap' : 'rowGap']
        if (gap) {
            bindings.gap = gap
        }
    }
    return Object.keys(bindings).length ? bindings : undefined
}

function draftOf(
    spec: ComponentSpec,
    node: CapturedNode,
    bandSides: ReadonlyMap<string, ReadonlySet<string>> = new Map(),
    drawingParts: ReadonlySet<string> = new Set(),
    inlineParts: ReadonlySet<string> = new Set()
): Draft {
    const looks: Draft['looks'] = new Map()
    const tints: Draft['tints'] = new Map()
    const sidesBanded = new Map<string, Set<string>>()
    const names = new Map<string, number>()
    const unique = (name: string) => {
        const count = (names.get(name) ?? 0) + 1
        names.set(name, count)
        return count === 1 ? name : `${name} ${count}`
    }

    // How far each element is turned, with those it's in, e.g. a popover's arrow's inner triangle with the arrow.
    const turns = new Map<CapturedNode, number>()
    const visit = (element: CapturedNode, parent: CapturedNode | undefined, parentLayer: Layer | undefined, parentPart: string | undefined): Layer => {
        const parentTurn = (parent && turns.get(parent)) ?? 0
        // A pseudo-element is placed by its styles, in its turned parent's box as it was before turning.
        const current = element.tag[0] === ':' && parent && parentTurn ? turnedWithin(element, parent, parentTurn) : element
        const turn = parentTurn + turnOf(current.style.transform)
        turns.set(current, turn)
        // A wrapper that draws nothing and holds one element in its own box is that element, e.g. a select's spans
        // around its text, or its host around its button.
        const only = current.children.length === 1 ? current.children[0] : undefined
        // A component inside another isn't, but the root is, as it is when drafted on its own.
        if (
            only &&
            (!current.ref || !parent) &&
            !namedPart(spec, current) &&
            !current.icon &&
            current.style.position !== 'absolute' &&
            ['x', 'y', 'width', 'height'].every((key) => Math.abs(only[key as 'x'] - current[key as 'x']) < 0.5) &&
            !draws(drawingOf(current).style) &&
            drawingOf(current).bands.length === 0
        ) {
            return visit(only, parent, parentLayer, parentPart)
        }
        // Content, e.g. markdown, repeats an element with different looks: there each element is a part of its own.
        const named = partName(spec, current, parentPart, !parent)
        const name = unique(named)
        const part = spec.uniqueParts ? name : named
        const origin = { x: parent?.x ?? current.x, y: parent?.y ?? current.y }
        const base = { name, x: round(current.x - origin.x), y: round(current.y - origin.y), width: round(current.width), height: round(current.height), children: [] as Layer[] }
        if (current.tag === '#text') {
            const textStyle = textStyleOf(current)
            looks.set(name, { kind: 'text', look: textStyle, part, bindings: textBindingsOf(current) })
            tints.set(name, { part, paint: textStyle.paint })
            const lineHeight = textStyle.font.lineHeight
            const lines = current.lines ?? 1
            const height = lineHeight * lines
            // Text wraps at its container's width, unless the container is as wide as the text, e.g. a badge's.
            const inner = parentLayer?.layout ? parentLayer.width - parentLayer.layout.padding[1] - parentLayer.layout.padding[3] : current.width
            const centred = /center|end|right/.test(current.style.textAlign ?? '') && lines === 1
            const fixed = lines > 1 || (parentLayer?.layout?.direction === 'column' && inner - current.width > 1 && !centred)
            const textLayer: Layer = {
                ...base,
                kind: 'text',
                // The line box, centred on the glyphs the browser measured.
                y: round(base.y + current.height / 2 - height / 2),
                height,
                // Capitalised words, e.g. a tree grid's headers, written so: design tools can't capitalise.
                text: current.style.textTransform === 'capitalize' ? (current.text ?? '').replace(/(^|\s)(\S)/g, (_, space: string, letter: string) => space + letter.toUpperCase()) : current.text,
                textSizing: fixed ? 'fixed' : 'auto',
                ...(fixed && parentLayer?.layout ? { width: round(parentLayer.width - parentLayer.layout.padding[1] - parentLayer.layout.padding[3]), x: parentLayer.layout.padding[3] } : {})
            }
            if (lines > 1) {
                wrapping.add(textLayer)
            }
            return textLayer
        }
        if (current.icon && !current.ref) {
            const paint = paintOf(current.style.color) ?? { color: '#000000' }
            const symbol = iconSymbol(current.icon.name)
            tints.set(name, { part, paint, symbol })
            const turned = Math.round(turn) % 360
            return { ...base, kind: 'icon', icon: { symbol, paint, ...(turned ? { turn: turned } : {}) } }
        }
        // A component inside this one is an instance of its symbol, unless it's drawn in place as part of this one; the
        // root is always drawn, e.g. when a nested component is drafted on its own to check it fits its symbol.
        if (current.ref && parentLayer && !inlineParts.has(part)) {
            const { component, inputs, text, texts, icon } = current.ref
            const iconName = icon ?? current.icon?.name
            const refLayer: Layer = {
                ...base,
                kind: 'ref',
                ref: { component, inputs, ...(text !== undefined ? { text } : {}), ...(texts ? { texts } : {}), ...(iconName ? { icon: iconSymbol(iconName) } : {}) },
                absolute: current.style.position === 'absolute'
            }
            refSources.set(refLayer, { node: current, part })
            if (Number(current.style.flexGrow) > 0) {
                refLayer.grow = true
            }
            return refLayer
        }
        const shape = borderShapeOf(current, turn)
        if (shape) {
            const placed = current.style.position === 'absolute' || current.tag[0] === ':' ? { absolute: true } : {}
            const look = { fills: [shape.paint], shadows: [] }
            if (!current.children.length) {
                looks.set(name, { kind: 'layer', look, part })
                return { ...base, kind: 'path', path: shape.path, ...placed }
            }
            // A shape can't hold layers, so one that holds elements, e.g. a popover's arrow its inner triangle, is
            // a frame with the shape under them.
            const shapeName = unique(`${named} Shape`)
            looks.set(shapeName, { kind: 'layer', look, part: `${part} Shape` })
            const holder: Layer = { ...base, kind: 'frame', ...placed }
            holder.children = [
                { name: shapeName, kind: 'path', path: shape.path, x: 0, y: 0, width: base.width, height: base.height, absolute: true, children: [] },
                ...current.children.map((child) => visit(child, current, holder, part))
            ]
            return holder
        }
        const { style, bands } = drawingOf(current, bandSides.get(part))
        for (const band of bands) {
            sidesBanded.set(part, (sidesBanded.get(part) ?? new Set()).add(band.side))
        }
        const radius = (['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'] as const).map((corner) => round(radiusOf(current, corner))) as Layer['radius']
        const layer: Layer = {
            ...base,
            kind: 'frame',
            ...(radius?.some(Boolean) ? { radius } : {}),
            ...(current.style.position === 'absolute' || current.tag[0] === ':' ? { absolute: true } : {}),
            ...(current.style.overflow && current.style.overflow !== 'visible' ? { clip: true } : {})
        }
        const image = imageOf(current, result)
        if (image) {
            layer.image = image
        }
        if (Number(current.style.flexGrow) > 0) {
            layer.grow = true
        }
        // A part that draws in any combination has a style in all of them, so choosing one undoes the others',
        // e.g. a pressed ghost toggle's, which draws nothing, the filled one's.
        if (draws(style) || drawingParts.has(part)) {
            looks.set(name, { kind: 'layer', look: style, part, bindings: layerBindingsOfStyle(current, style) })
        }
        placeOverlaps(current)
        layer.layout = layoutOf(current, current.children)
        // Children are drawn in the order the browser stacks them: by z-index, then as they come.
        const z = (child: CapturedNode) => (child.style.zIndex === undefined ? 0 : Number(child.style.zIndex) || 0)
        if (current.style.position === 'fixed' && parent) {
            fixedLayers.add(layer)
            layer.absolute = true
        }
        const drafted = current.children.map((child, index) => ({ z: z(child), index, layer: visit(child, current, layer, part) }))
        layer.children = drafted.map((entry) => entry.layer)
        // A fixed part that a child clipping its content let out goes beside that child, just before it, e.g. a
        // drawer's backdrop: over the page, under the drawer.
        for (const entry of [...drafted]) {
            const out = escaping.get(entry.layer) ?? []
            if (out.length) {
                out.forEach((escaped) => Object.assign(escaped, { x: round(escaped.x + entry.layer.x), y: round(escaped.y + entry.layer.y), absolute: true }))
                const at = layer.children.indexOf(entry.layer)
                layer.children.splice(at, 0, ...out)
                drafted.splice(drafted.indexOf(entry), 0, ...out.map((escaped) => ({ z: entry.z, index: entry.index, layer: escaped })))
            }
        }
        if (layer.clip) {
            const out = layer.children.filter((child) => fixedLayers.has(child))
            if (out.length) {
                escaping.set(layer, out)
                layer.children = layer.children.filter((child) => !out.includes(child))
                drafted.splice(0, drafted.length, ...drafted.filter((entry) => !out.includes(entry.layer)))
            }
        }
        // A reversed row or column, e.g. a chat's reply, lists its children as they show.
        if (layer.layout && current.style.flexDirection?.endsWith('-reverse') && ['flex', 'inline-flex'].includes(current.style.display ?? '')) {
            layer.children.reverse()
        }
        // An inline element of one line of text, e.g. a toast's title, is as tall as its line, as its block lays it out,
        // not as its glyphs: else a column can't stack it.
        const lineBox = Math.max(0, ...layer.children.map((child) => (child.kind === 'text' ? child.height : 0)))
        if (current.style.display === 'inline' && layer.children.length && layer.children.every((child) => child.kind === 'text' && !wrapping.has(child)) && lineBox > layer.height) {
            const y = round(layer.y + layer.height / 2 - lineBox / 2)
            layer.children.forEach((child) => (child.y = round(child.y + layer.y - y)))
            layer.y = y
            layer.height = lineBox
        }
        // A shadow on a part that draws nothing else, over its parent's box that does, e.g. a layout header's bar: the
        // parent's, as a design tool draws a shadow only under what a layer draws.
        const own = looks.get(name)
        for (const child of layer.children) {
            const childLook = looks.get(child.name)
            const sameBox = Math.abs(child.x) < 0.5 && Math.abs(child.y) < 0.5 && Math.abs(child.width - layer.width) < 0.5 && Math.abs(child.height - layer.height) < 0.5
            if (own?.kind !== 'layer' || childLook?.kind !== 'layer' || child.kind !== 'frame' || !sameBox) {
                continue
            }
            const [parentStyle, childStyle] = [own.look as LayerStyle, childLook.look as LayerStyle]
            if (childStyle.shadows.length && !childStyle.fills.length && !childStyle.border && parentStyle.fills.length && !parentStyle.shadows.length) {
                parentStyle.shadows = childStyle.shadows
                childStyle.shadows = []
                if (childLook.bindings?.shadow) {
                    own.bindings = { ...own.bindings, shadow: childLook.bindings.shadow }
                    delete childLook.bindings.shadow
                }
                if (!draws(childStyle)) {
                    looks.delete(child.name)
                }
            }
        }
        // A part at a share of its parent's width scales with it, which a design tool does outside a stack only.
        for (const child of layer.children) {
            if (spec.relative?.includes(child.name)) {
                child.relative = true
                delete layer.layout
            }
        }
        if (layer.layout && !stacks(layer)) {
            delete layer.layout
        }
        // In a stack the order is the layout; else children are reordered as they're stacked, e.g. a form field's
        // addons over its input.
        if (!layer.layout) {
            layer.children = drafted.sort((a, b) => a.z - b.z || a.index - b.index).map((entry) => entry.layer)
        }
        if (!layer.layout) {
            mergeMeetingLines(layer, looks)
        }
        const layerBindings = layerBindingsOf(current, layer)
        if (layerBindings) {
            layer.bindings = layerBindings
        }
        // Bands over the element's content, clipped to its corners where they run along a rounded edge.
        for (const band of bands) {
            const bandName = unique(`${part} ${title(band.side)}`)
            const horizontal = band.side === 'top' || band.side === 'bottom'
            const sizeBinding = current.bindings?.[`border${title(band.side)}Width` as BoundMeasure]
            const r = layer.radius ?? [0, 0, 0, 0]
            const bandRadius: Layer['radius'] =
                band.side === 'top' ? [r[0], r[1], 0, 0] : band.side === 'bottom' ? [0, 0, r[2], r[3]] : band.side === 'left' ? [r[0], 0, 0, r[3]] : [0, r[1], r[2], 0]
            layer.children.push({
                name: bandName,
                kind: 'frame',
                x: band.side === 'right' ? round(current.width - band.size) : 0,
                y: band.side === 'bottom' ? round(current.height - band.size) : 0,
                width: horizontal ? round(current.width) : band.size,
                height: horizontal ? band.size : round(current.height),
                ...(bandRadius.some(Boolean) ? { radius: bandRadius.map((corner) => Math.min(corner, band.size)) as Layer['radius'] } : {}),
                // As thick as its border, e.g. an accent alert's, which follows `alert-border-radius`.
                ...(sizeBinding ? { bindings: horizontal ? { height: sizeBinding } : { width: sizeBinding } } : {}),
                absolute: true,
                children: []
            })
            const colour = current.colourVariables?.border
            looks.set(bandName, {
                kind: 'layer',
                look: { fills: [band.paint], shadows: [] },
                part: `${part} ${title(band.side)}`,
                ...(colour ? { bindings: { fill: [{ variable: colour }] } } : {})
            })
        }
        return layer
    }
    const top = visit(node, undefined, undefined, undefined)
    // A component wider than its content takes its container's width, e.g. a list item or a form field: it doesn't
    // size to its content, whatever its content's sizes add up to.
    if (top.layout && node.contentWidth !== undefined && node.width - node.contentWidth > 0.6) {
        top.layout.hug.width = false
    }
    // Room after a root column's last part, e.g. a dialog's card's margin, as its padding: it's as tall as its
    // content then, and grows with it. Not after text, where it's a minimum height, e.g. an alert's.
    const flowing = top.children.filter((child) => !child.absolute)
    const last = flowing[flowing.length - 1]
    if (top.layout && top.layout.direction === 'column' && top.layout.justify === 'start' && !top.layout.fixed && !top.layout.hug.height && last && last.kind !== 'text') {
        const room = top.height - top.layout.padding[2] - (last.y + last.height)
        if (room > 0.5 && Math.abs(flowing[0].y - top.layout.padding[0]) < 0.6) {
            top.layout.padding[2] = round(top.layout.padding[2] + room)
            top.layout.hug.height = true
        }
    }
    // A screen shows what's in the window, e.g. not the end of a drawer taller than it.
    spreadApart(top)
    if (spec.fluid) {
        spreadFluid(top)
        top.clip = true
    }
    hugInHuggingRows(top)
    growOnlyWithRoom(top)
    for (const part of spec.wraps ?? []) {
        wrapIn(top, part)
    }
    if (spec.stretches && top.layout) {
        stretchToField(top)
    }
    // A container for a design's own content, e.g. a layout's footer, resizes freely, its parts with it.
    if (spec.container && top.layout) {
        top.layout.hug = { width: false, height: false }
        for (const child of top.children.filter((candidate) => !candidate.absolute)) {
            child.fill = true
            child.grow = true
        }
    }
    // The root is the symbol itself, never placed on its own, even where it's an overlay, e.g. a spinner's.
    delete top.absolute
    return { layer: top, looks, tints, bandSides: sidesBanded }
}

// ---- Comparing combinations ----

/** A text style's colour as it reads in its name: as typography's, else its variable's, e.g. `Basic 800`. */
function colourLabel(look: TextStyle): string {
    const variable = look.paint.variable
    const colour = variable ? TYPOGRAPHY_COLOURS[variable] ?? variable.replace(/^(Palette|State|Text)\//, '').split('/').join(' ') : look.paint.color
    return look.shadows.length ? `${colour} Shadow` : colour
}

function labelOf(spec: ComponentSpec, input: string, value: unknown): string {
    const label = spec.labels?.[input]?.[String(value)]
    if (label !== undefined) {
        return label
    }
    // A symbol input that changes a style reads as it does in the symbol's name, e.g. `Closable`.
    if (spec.symbol[input] && !spec.style.includes(input)) {
        return spec.symbol[input](value)
    }
    return String(value).split('-').map(title).join(' ')
}

/** The layer of a tree with the name, if any. */
function layerNamed(layer: Layer | undefined, name: string): Layer | undefined {
    if (!layer || layer.name === name) {
        return layer
    }
    for (const child of layer.children) {
        const found = layerNamed(child, name)
        if (found) {
            return found
        }
    }
    return undefined
}

/** A layer tree's icons' symbols, by their layers' names. */
function iconsOf(layer: Layer | undefined, icons = new Map<string, string>()): Map<string, string> {
    if (layer?.icon) {
        icons.set(layer.name, layer.icon.symbol)
    }
    layer?.children.forEach((child) => iconsOf(child, icons))
    return icons
}

/** A layer tree's texts, by their layers' names. */
function textsOf(layer: Layer | undefined, texts = new Map<string, string>()): Map<string, string> {
    if (layer?.kind === 'text' && layer.text !== undefined) {
        texts.set(layer.name, layer.text)
    }
    layer?.children.forEach((child) => textsOf(child, texts))
    return texts
}

/** Differences in layout between two drafts of one symbol, as paths, or none. */
function layoutDifferences(a: Layer, b: Layer, path = a.name, resized = false, reflowed = false, centred = false): string[] {
    const differences: string[] = []
    if (a.kind !== b.kind || a.children.length !== b.children.length) {
        return [`${path}: ${a.kind}/${a.children.length} vs ${b.kind}/${b.children.length}`]
    }
    // An instance with another text, in a row that sizes to its content, e.g. a button's label, lays its row out again:
    // the row's width and its children's places along it follow the text.
    const reflows = resized && path === a.name && a.layout?.direction === 'row' && !!a.layout.hug.width
    for (const property of ['x', 'y', 'width', 'height'] as const) {
        // An instance drawn larger or smaller than its symbol, where the symbol doesn't hug its content, e.g. a
        // full-width input, lays out alike if its text starts where it did: a text that sizes to its words needn't match.
        const sized = property === 'width' || property === 'height'
        // Nor need a part that sizes to its content, e.g. a step's label, where the text is another.
        const stretched = resized && sized && (path === a.name ? !a.layout?.hug?.[property] : (a.kind === 'text' && a.textSizing === 'auto') || !!a.layout?.hug?.[property])
        // A text centred across its row, e.g. a calendar cell's day, starts where its words' width puts it.
        const centredText = centred && property === 'x' && ((a.kind === 'text' && a.textSizing === 'auto') || !!a.layout?.hug?.width)
        const followsText = (reflows && property === 'width') || (reflowed && property === 'x') || centredText
        if (!stretched && !followsText && Math.abs(a[property] - b[property]) > 0.6) {
            differences.push(`${path}.${property}: ${a[property]} vs ${b[property]}`)
        }
    }
    // Children by their names, as their order can change with how they're stacked, e.g. a raised toggle's.
    a.children.forEach((child, index) => {
        const other = b.children.find((candidate) => candidate.name === child.name) ?? b.children[index]
        const centres = !!a.layout && (a.layout.direction === 'row' ? a.layout.justify === 'center' : a.layout.align === 'center')
        differences.push(...layoutDifferences(child, other, `${path}/${child.name}`, resized, reflows, centres))
    })
    return differences
}

/** How a component of the kit inside another is placed: its symbol and the overrides that give it its look. */
type Resolver = (inputs: Record<string, string>, text?: string, icon?: string, texts?: string[]) => { symbol: string, overrides: Starter['overrides'], layer: Layer } | undefined

/** The layers in a tree that are components of the kit, not inside one another. */
function refsOf(layer: Layer, found: Layer[] = []): Layer[] {
    if (layer.kind === 'ref') {
        found.push(layer)
    }
    layer.children.forEach((child) => refsOf(child, found))
    return found
}

function build(component: string, spec: ComponentSpec, captured: Captured[], kit: Kit, known: ReadonlyMap<string, Resolver>): Omit<KitComponent, 'follows'> & { resolve: Resolver } {
    const symbolInputs = Object.keys(spec.symbol)
    // Drafted twice: a part gets a band on every side it has one in any combination, so its symbol has one structure,
    // and a style in every combination where it draws in any.
    const draftAll = (inlineParts: ReadonlySet<string>) => {
        const bandSides = new Map<string, Set<string>>()
        const drawingParts = new Set<string>()
        for (const capture of captured) {
            const first = draftOf(spec, capture.node, new Map(), new Set(), inlineParts)
            for (const [part, sides] of first.bandSides) {
                sides.forEach((side) => bandSides.set(part, (bandSides.get(part) ?? new Set()).add(side)))
            }
            first.looks.forEach(({ kind, part }) => kind === 'layer' && drawingParts.add(part))
        }
        return captured.map((capture) => ({ capture, draft: draftOf(spec, capture.node, bandSides, drawingParts, inlineParts) }))
    }
    // Components of the kit inside this one are instances of their symbols, with the look they had, where the symbol
    // lays out as the component did; else they're drawn in place, e.g. an input a form field pads for its icons.
    const resolveAll = (drafts: ReturnType<typeof draftAll>) => {
        const found = new Map<string, string>()
        for (const { draft } of drafts) {
            for (const layer of refsOf(draft.layer)) {
                const resolver = layer.ref && known.get(layer.ref.component)
                const resolved = layer.ref && resolver?.(layer.ref.inputs, layer.ref.text, layer.ref.icon, layer.ref.texts)
                const source = refSources.get(layer)
                if (!layer.ref || !resolved || !source) {
                    continue
                }
                const inPlace = draftOf(COMPONENTS[layer.ref.component], source.node).layer
                if (layoutDifferences(resolved.layer, inPlace, resolved.layer.name, true).length) {
                    found.set(source.part, layer.ref.component)
                }
                layer.ref.symbol = resolved.symbol
                if (resolved.layer.layout) {
                    layer.ref.hug = { ...resolved.layer.layout.hug }
                }
                layer.ref.overrides = resolved.overrides
            }
        }
        return found
    }
    let entries = draftAll(new Set())
    const misfits = resolveAll(entries)
    if (misfits.size) {
        entries = draftAll(new Set(misfits.keys()))
        resolveAll(entries)
    }
    // Components drawn in place keep their own styles where they look the same, e.g. a form field's input.
    const owners = [...new Set([...misfits.values(), ...(spec.sharesStyles ? [spec.sharesStyles] : [])])].map((key) => COMPONENTS[key].name)
    const reuse = (kind: 'layer' | 'text', look: LayerStyle | TextStyle): string | undefined => {
        const store: Record<string, LayerStyle | TextStyle> = kind === 'layer' ? kit.layerStyles : kit.textStyles
        const wanted = keyOf(look)
        return Object.keys(store).find(
            (name) => owners.some((owner) => name.startsWith(`${owner}/`) || name.startsWith(`${owner} `)) && keyOf(store[name]) === wanted
        )
    }
    // An empty label leaves its input out of the name, e.g. a closed select's state.
    const symbolName = (inputs: Record<string, unknown>) =>
        [spec.name, ...symbolInputs.map((input) => spec.symbol[input](inputs[input]))].filter(Boolean).join('/')

    // Every look a part has, by the combination it was captured in: a style is named by the inputs that change it.
    const parts = new Map<string, { kind: 'layer' | 'text', looks: Array<{ inputs: Record<string, unknown>, look: LayerStyle | TextStyle, bindings?: StyleBindings }> }>()
    for (const { capture, draft } of entries) {
        for (const { kind, look, part, bindings } of draft.looks.values()) {
            const entry = parts.get(part) ?? { kind, looks: [] }
            entry.looks.push({ inputs: capture.inputs, look, bindings })
            parts.set(part, entry)
        }
    }
    const register = (kind: 'layer' | 'text', name: string, look: LayerStyle | TextStyle, combination: Record<string, unknown>, bindings?: StyleBindings) => {
        const store = (kind === 'layer' ? kit.layerStyles : kit.textStyles) as Record<string, LayerStyle | TextStyle>
        if (store[name] && keyOf(store[name]) !== keyOf(look)) {
            throw new Error(`${component}: the style "${name}" looks different in ${keyOf(combination)}; an input that changes it is missing from its name`)
        }
        store[name] = look
        bindStyle(name, look, bindings)
    }
    /** Adds every way a style's measures follow the theme, e.g. a label's text case in each appearance. */
    const bindStyle = (name: string, look: LayerStyle | TextStyle, bindings: StyleBindings | undefined) => {
        for (const [measure, list] of Object.entries(bindings ?? {}) as Array<[StyleMeasure, Binding[]]>) {
            const merged = (kit.styleBindings[name] ??= { at: measuresOfStyle(look), follows: {} })
            const listed = (merged.follows[measure] ??= [])
            listed.push(...list.filter((binding) => !listed.some((other) => keyOf(other) === keyOf(binding))))
        }
    }
    // Style inputs read first in a style's name, e.g. Select/Outline/Basic/Default, then those that only make symbols.
    const allInputs = [...new Set([...spec.style, ...symbolInputs])]
    const styleNames = new Map<string, (combination: Record<string, unknown>, look: LayerStyle | TextStyle) => string>()
    for (const [part, { kind, looks: allLooks }] of parts) {
        // Typography text styles have names of their own, so a part's own styles are named by what changes them alone.
        const own = allLooks.filter(({ look }) => !(look as TextStyle).typography)
        const looks = own.length ? own : allLooks
        // A text's own styles are named by what changes its font and by its colour, as typography's are, so texts
        // that look alike share a style; a layer's by what changes its look.
        const aspect = (look: LayerStyle | TextStyle) => (kind === 'text' ? (look as TextStyle).font : look)
        const changing = allInputs.filter((input) =>
            looks.some((a) =>
                looks.some(
                    (b) =>
                        a.inputs[input] !== b.inputs[input] &&
                        allInputs.every((other) => other === input || a.inputs[other] === b.inputs[other]) &&
                        keyOf(aspect(a.look)) !== keyOf(aspect(b.look))
                )
            )
        )
        // A word once where the component's and the part's names meet, e.g. a calendar's `Calendar View Mode Text`.
        const base = part === (spec.main ?? spec.parts?.['root'] ?? 'Body') ? spec.name : `${spec.name} ${part}`.replace(/\b(\w+)( \1\b)+/g, '$1')
        styleNames.set(part, (combination, look) =>
            [base, ...changing.map((input) => labelOf(spec, input, combination[input])), ...(kind === 'text' ? [colourLabel(look as TextStyle)] : [])]
                .filter(Boolean)
                .join('/')
        )
        // A text's styles are made as the symbols and looks use them: its colour in other looks is a tint.
        for (const { inputs: combination, look, bindings } of kind === 'layer' ? allLooks : []) {
            register(kind, reuse(kind, look) ?? styleNames.get(part)?.(combination, look) ?? base, look, combination, bindings)
        }
    }
    // Parts styled by the style inputs are the symbols' parameters: a text's font and shadow, as its colour is a tint.
    const lookKey = (kind: 'layer' | 'text', look: LayerStyle | TextStyle) => (kind === 'text' ? keyOf({ font: (look as TextStyle).font, shadows: (look as TextStyle).shadows }) : keyOf(look))
    const styled = new Set(
        [...parts]
            .filter(([, { kind, looks }]) => spec.style.some((input) => new Set(looks.map((look) => keyOf(look.inputs[input]))).size > 1 && new Set(looks.map((look) => lookKey(kind, look.look))).size > 1))
            .map(([part]) => part)
    )

    // Icons and texts whose colour the style inputs change are tinted by the symbols' overrides.
    const tintsByPart = new Map<string, Array<{ inputs: Record<string, unknown>, paint: Paint }>>()
    for (const { capture, draft } of entries) {
        draft.tints.forEach(({ part, paint }) => tintsByPart.set(part, [...(tintsByPart.get(part) ?? []), { inputs: capture.inputs, paint }]))
    }
    const tinted = new Set(
        [...tintsByPart]
            .filter(([, tints]) => spec.style.some((input) => new Set(tints.map((tint) => keyOf(tint.inputs[input]))).size > 1) && new Set(tints.map((tint) => keyOf(tint.paint))).size > 1)
            .map(([part]) => part)
    )

    const styleFor = (draft: Draft, combination: Record<string, unknown>, layerName: string) => {
        const entry = draft.looks.get(layerName)
        if (!entry) {
            return {}
        }
        const text = entry.look as TextStyle
        const name = entry.kind === 'text' && text.typography ? text.typography : reuse(entry.kind, entry.look) ?? styleNames.get(entry.part)?.(combination, entry.look) ?? spec.name
        if (entry.kind === 'text' && !text.typography) {
            register('text', name, entry.look, combination, entry.bindings)
        } else if (entry.kind === 'text') {
            // A typography style is the theme's, made once; how its measures follow the theme comes from its texts.
            bindStyle(name, entry.look, entry.bindings)
        }
        return entry.kind === 'layer' ? { layerStyle: name } : { textStyle: name }
    }
    // An icon in its text's colour, e.g. a button's, takes the text's colour in every look: the specimens needn't
    // show each look with an icon.
    const followersOf = (draft: Draft) => {
        const texts = [...draft.tints].filter(([, tint]) => !tint.symbol)
        const followers = new Map<string, string>()
        for (const [layerName, tint] of draft.tints) {
            const text = tint.symbol ? texts.find(([, candidate]) => keyOf(candidate.paint) === keyOf(tint.paint) && tinted.has(candidate.part)) : undefined
            if (text) {
                followers.set(layerName, text[0])
            }
        }
        return followers
    }
    const applyStyles = (layer: Layer, draft: Draft, combination: Record<string, unknown>, followers = followersOf(draft)) => {
        Object.assign(layer, styleFor(draft, combination, layer.name))
        const entry = draft.looks.get(layer.name)
        const tint = draft.tints.get(layer.name)
        if (layer.kind === 'text') {
            if (entry && styled.has(entry.part)) {
                layer.styled = true
            }
            if (tint && tinted.has(tint.part)) {
                layer.tinted = true
            }
        } else if ((entry && styled.has(entry.part)) || (tint && (tinted.has(tint.part) || followers.has(layer.name)))) {
            layer.styled = true
        }
        layer.children.forEach((child) => applyStyles(child, draft, combination, followers))
    }

    // One symbol per combination of the symbol inputs, drawn in the starter's style where it has it.
    const groups = new Map<string, typeof entries>()
    for (const entry of entries) {
        const name = symbolName(entry.capture.inputs)
        groups.set(name, [...(groups.get(name) ?? []), entry])
    }
    // An input can make symbols and name styles too, e.g. an appearance that changes a border's width.
    const ownStyleInputs = spec.style.filter((input) => !symbolInputs.includes(input))
    const ownSymbolInputs = symbolInputs.filter((input) => !spec.style.includes(input))
    const matchesStarter = (inputs: Record<string, unknown>) => ownStyleInputs.every((input) => inputs[input] === spec.starter[input])
    const symbols: KitSymbol[] = []
    const templates = new Map<string, Draft>()
    for (const [name, group] of groups) {
        const template = group.find((entry) => matchesStarter(entry.capture.inputs)) ?? group[0]
        for (const entry of group) {
            const differences = layoutDifferences(template.draft.layer, entry.draft.layer)
            if (differences.length) {
                throw new Error(`${component}: ${name} lays out differently in ${keyOf(entry.capture.inputs)} than in ${keyOf(template.capture.inputs)}, so an input that changes the layout is missing from the symbol inputs:\n  ${differences.slice(0, 8).join('\n  ')}`)
            }
        }
        const layer = template.draft.layer
        templates.set(name, template.draft)
        applyStyles(layer, template.draft, template.capture.inputs)
        // A root that draws nothing covers what's placed on its own around it, e.g. an open select's option list, so
        // the symbol is the whole of what shows.
        if (!layer.layerStyle) {
            const left = Math.min(0, ...layer.children.map((child) => child.x))
            const top = Math.min(0, ...layer.children.map((child) => child.y))
            const right = Math.max(layer.width, ...layer.children.map((child) => child.x + child.width))
            const bottom = Math.max(layer.height, ...layer.children.map((child) => child.y + child.height))
            // A column of centred parts that one overruns on both sides alike, e.g. a step's label wider than its number,
            // keeps its size, as the component does, so it fits where another holds it.
            const centred = layer.layout?.direction === 'column' && layer.layout.align === 'center' && Math.abs(-left - (right - layer.width)) < 1 && top > -0.5 && bottom < layer.height + 0.5
            if (!centred && (left < -0.5 || top < -0.5 || right > layer.width + 0.5 || bottom > layer.height + 0.5)) {
                // An overlay can open to the left or above, e.g. a datepicker's calendar: everything moves with it.
                for (const child of layer.children) {
                    child.x = round(child.x - left)
                    child.y = round(child.y - top)
                }
                layer.width = round(right - left)
                layer.height = round(bottom - top)
                if (layer.layout) {
                    // In a stack the children's places come from the stack, so it's kept only where nothing moved.
                    if (left < -0.5 || top < -0.5) {
                        delete layer.layout
                    } else {
                        layer.layout.hug = { width: false, height: false }
                    }
                }
            }
        }
        symbols.push({ name, inputs: Object.fromEntries(symbolInputs.map((input) => [input, template.capture.inputs[input]])), width: layer.width, height: layer.height, layer })
    }

    // The starters: each style combination, at the starter's symbol inputs where it was captured there.
    const starters: Starter[] = []
    const seen = new Set<string>()
    const atStarter = (inputs: Record<string, unknown>) => Number(ownSymbolInputs.every((input) => inputs[input] === spec.starter[input]))
    const ordered = [...entries].sort((a, b) => atStarter(b.capture.inputs) - atStarter(a.capture.inputs))
    /**
     * The overrides that give a symbol a combination's look: its styles, icon colours and texts, and those of the
     * components of the kit inside it, by their layers' names, e.g. `Input/Body`.
     */
    // A symbol's icons that follow a text's colour take the colour a look gives that text.
    const follow = (overrides: Starter['overrides'], symbol: string) => {
        const template = templates.get(symbol)
        for (const [icon, text] of template ? followersOf(template) : []) {
            const colour = overrides[text]?.tint
            if (colour && !overrides[icon]?.tint) {
                overrides[icon] = { ...overrides[icon], tint: colour }
            }
        }
    }
    const overridesOf = (capture: Captured, draft: Draft) => {
        const overrides: Starter['overrides'] = {}
        const own = templates.get(symbolName(capture.inputs))
        for (const [layerName, entry] of draft.looks) {
            // A text's style only where its font or shadow isn't the symbol's, e.g. a hero button's shadowed label: a
            // look's colour is a tint, so it stays when the symbol is swapped for another size.
            const symbolLook = own?.looks.get(layerName)?.look
            const sameFont = entry.kind === 'text' && symbolLook && lookKey('text', symbolLook) === lookKey('text', entry.look)
            if (styled.has(entry.part) && !sameFont) {
                overrides[layerName] = styleFor(draft, capture.inputs, layerName)
            } else if (sameFont) {
                // The symbol's text style stands for this text too, so it follows its variables as well, e.g. an
                // outline button's text case as well as a filled one's.
                const textStyle = layerNamed(symbols.find((symbol) => symbol.name === symbolName(capture.inputs))?.layer, layerName)?.textStyle
                if (textStyle) {
                    bindStyle(textStyle, entry.look, entry.bindings)
                }
            }
        }
        // Colours: icons' and texts', and the icons that follow their text's.
        // Icons the combination shows another of, e.g. each toast status's, by their glyph's layer.
        const symbolIcons = iconsOf(symbols.find((symbol) => symbol.name === symbolName(capture.inputs))?.layer)
        for (const [layerName, { part, paint, symbol }] of draft.tints) {
            if (tinted.has(part)) {
                overrides[layerName] = { ...overrides[layerName], tint: paint }
            }
            if (symbol && symbolIcons.get(layerName) && symbolIcons.get(layerName) !== symbol) {
                overrides[`${layerName} Glyph`] = { symbol }
            }
        }
        follow(overrides, symbolName(capture.inputs))
        // Texts that differ from the symbol's, e.g. an input's value where the symbol shows its placeholder.
        const symbolTexts = textsOf(symbols.find((symbol) => symbol.name === symbolName(capture.inputs))?.layer)
        for (const [layerName, text] of textsOf(draft.layer)) {
            if (symbolTexts.get(layerName) !== text) {
                overrides[layerName] = { ...overrides[layerName], text }
            }
        }
        for (const layer of refsOf(draft.layer)) {
            if (layer.ref?.symbol) {
                overrides[layer.name] = { symbol: layer.ref.symbol }
                for (const [inner, choice] of Object.entries(layer.ref.overrides ?? {})) {
                    overrides[`${layer.name}/${inner}`] = choice
                }
            }
        }
        return overrides
    }
    // A component without style inputs, e.g. a calendar, is its symbols alone.
    for (const { capture, draft } of spec.style.length ? ordered : []) {
        const styleKey = keyOf(spec.style.map((input) => capture.inputs[input]))
        if (seen.has(styleKey)) {
            continue
        }
        seen.add(styleKey)
        const overrides = overridesOf(capture, draft)
        starters.push({
            name: [spec.name, ...spec.style.map((input) => labelOf(spec, input, capture.inputs[input]))].join('/'),
            symbol: symbolName(capture.inputs),
            inputs: capture.inputs,
            labels: Object.fromEntries(spec.style.map((input) => [input, labelOf(spec, input, capture.inputs[input])])),
            overrides
        })
    }
    // Where another component holds this one: the captured combination that has its inputs, as a symbol and overrides.
    const resolveRef: Resolver = (inputs, text, icon, texts) => {
        const fits = (capture: Captured, keys: string[]) => keys.every((input) => inputs[input] === undefined || String(capture.inputs[input]) === inputs[input])
        // The symbol of the captured combination with its symbol inputs, and the look of the one with its style
        // inputs: the specimens needn't capture every combination of both, e.g. buttons' sizes only at rest.
        const shape = entries.find(({ capture }) => fits(capture, [...symbolInputs, ...spec.style])) ?? entries.find(({ capture }) => fits(capture, symbolInputs))
        const look = entries.find(({ capture }) => fits(capture, [...symbolInputs, ...spec.style])) ?? entries.find(({ capture }) => fits(capture, ownStyleInputs)) ?? shape
        if (!shape || !look) {
            return undefined
        }
        const overrides = overridesOf(look.capture, look.draft)
        const textLayers = [...textsOf(shape.draft.layer)]
        const textLayer = textLayers[0]?.[0]
        if (text !== undefined && textLayer) {
            overrides[textLayer] = { ...overrides[textLayer], text }
        }
        // All its texts, where it shows as many as its symbol, e.g. a calendar cell's day.
        if (texts?.length === textLayers.length) {
            textLayers.forEach(([layerName, shown], index) => {
                if (texts[index] !== shown) {
                    overrides[layerName] = { ...overrides[layerName], text: texts[index] }
                }
            })
        }
        const iconLayer = [...iconsOf(shape.draft.layer).keys()][0]
        if (icon && iconLayer) {
            overrides[`${iconLayer} Glyph`] = { symbol: icon }
        }
        follow(overrides, symbolName(shape.capture.inputs))
        return { symbol: symbolName(shape.capture.inputs), overrides, layer: shape.draft.layer }
    }
    // A starter named like a symbol would replace it and hold an instance of itself, which draws nothing.
    const clash = starters.find((starter) => symbols.some((symbol) => symbol.name === starter.name))
    if (clash) {
        throw new Error(`${component}: the starter "${clash.name}" has a symbol's name; label its inputs apart`)
    }
    return { name: spec.name, key: component, symbols, starters, resolve: resolveRef }
}

/** The theme variables a component's own nodes follow, as captured; not those of the components it holds. */
function followsOfCaptured(captured: Captured[]): string[] {
    const followed = new Set<string>()
    const visit = (node: CapturedNode) => {
        if (node.ref) {
            return
        }
        for (const binding of Object.values(node.bindings ?? {})) {
            ;(binding.variable ? [binding.variable] : (binding.terms ?? []).map((term) => term.variable)).forEach((variable) => followed.add(variable))
        }
        node.children.forEach(visit)
    }
    captured.forEach((entry) => visit(entry.node))
    return [...followed].sort()
}

const kitFile = join(kitDir, 'kit.json')
const resolvers = new Map<string, Resolver>()
const result: Kit = { theme: '', images: {}, layerStyles: {}, textStyles: {}, styleBindings: {}, components: [] }
const captures = new Map(
    chosen.map((component) => [
        component,
        JSON.parse(readFileSync(join(kitDir, 'components', `${component}.json`), 'utf8')) as { theme: string, captured: Captured[], images?: Record<string, string> }
    ])
)
// The components of the kit a component holds, e.g. a layout's users.
const holds = (component: string) => {
    const found = new Set<string>()
    const visit = (node: CapturedNode) => {
        if (node.ref && node.ref.component !== component) {
            found.add(node.ref.component)
        }
        node.children.forEach(visit)
    }
    captures.get(component)?.captured.forEach((entry) => visit(entry.node))
    return found
}
// Each component after those it holds, so they're its symbols' instances; else in the order components.ts lists them.
const buildOrder: string[] = []
const enqueue = (component: string, path: string[] = []) => {
    if (buildOrder.includes(component)) {
        return
    }
    if (path.includes(component)) {
        throw new Error(`Components hold each other: ${[...path, component].join(' → ')}`)
    }
    holds(component).forEach((held) => COMPONENTS[held] && enqueue(held, [...path, component]))
    buildOrder.push(component)
}
chosen.forEach((component) => enqueue(component))
for (const component of buildOrder) {
    const spec = COMPONENTS[component]
    const { theme, captured, images = {} } = captures.get(component) ?? { theme: '', captured: [] }
    result.theme = theme
    capturedImages = images
    // A page can show other components too, e.g. the menu's a context menu.
    const own = captured.filter((entry) => entry.component === component)
    const { resolve: resolver, ...built } = build(component, spec, own, result, resolvers)
    resolvers.set(component, resolver)
    result.components.push({ ...built, follows: followsOfCaptured(own) })
    console.log(`${spec.name}: ${built.symbols.length} symbols, ${built.starters.length} starters`)
}
writeFileSync(kitFile, JSON.stringify(result, null, 1))
console.log(`${Object.keys(result.layerStyles).length} layer styles, ${Object.keys(result.textStyles).length} text styles → ${kitFile}`)
