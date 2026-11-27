import sketch = require('sketch')

import type { InspectOptions, InspectedLayer } from '../kit.ts'
import { childrenOf, fileFormatOf, openDocument, unmirrored } from './document.ts'

/**
 * A design's screens as JSON, for whoever builds them, e.g. an agent: each layer's place in its screen, its frame's
 * stack, its styles and colour variables, and each instance's symbol, the kit's component it is, and its overrides by
 * the names of the layers they change, e.g. `Label` or `Input/Body`, with styles, colour variables and symbols by name.
 * Instances aren't opened up: their symbols are the kit's, which `lyra-kit.json` maps to code.
 */

const DIRECTIONS = ['row', 'column']
const ALIGN = ['start', 'center', 'end', 'stretch']
const JUSTIFY = ['start', 'center', 'end', 'between', 'around', 'evenly']

const round = (value: number) => Math.round(value * 100) / 100

export function inspectDesign(components: string[], options: InspectOptions): string {
    const doc = openDocument(options.document)
    const componentOf = (name: string) => {
        const kitName = unmirrored(name)
        return name.startsWith('Icon/') ? 'Icon' : components.filter((component) => kitName === component || kitName.startsWith(`${component}/`)).sort((a, b) => b.length - a.length)[0]
    }

    /** The colour variable a paint is linked to, else its colour; a gradient as CSS, an image fill as `image`. */
    const paintOf = (paint: sketch.Fill) => {
        if (paint.fillType === 'Gradient' && paint.gradient) {
            const { from, to, stops } = paint.gradient
            const colours = stops.map((stop) => `${stop.swatch?.name ?? stop.color} ${round(stop.position * 100)}%`).join(', ')
            if (paint.gradient.gradientType === 'Radial') {
                return `radial-gradient(${colours})`
            }
            if (paint.gradient.gradientType === 'Angular') {
                return `conic-gradient(${colours})`
            }
            // CSS's angle: 0 points up, 90 right, from the gradient's start to its end in the layer's box.
            const angle = Math.round(((Math.atan2(to.x - from.x, from.y - to.y) * 180) / Math.PI + 360) % 360)
            return `linear-gradient(${angle}deg, ${colours})`
        }
        if (paint.fillType === 'Pattern') {
            return 'image'
        }
        return paint.swatch ? paint.swatch.name : paint.color
    }

    /** An override's value as a designer reads it: a style's, a colour variable's or a symbol's name, or the value. */
    const valueOf = (override: sketch.Override): unknown => {
        if (override.property === 'layerStyle') {
            return doc.getSharedLayerStyleWithID(override.value)?.name ?? override.value
        }
        if (override.property === 'textStyle') {
            return doc.getSharedTextStyleWithID(override.value)?.name ?? override.value
        }
        if (override.property === 'symbolID') {
            return doc.getSymbolMasterWithID(String(override.value))?.name ?? override.value
        }
        if (override.swatchValue) {
            return override.swatchValue.name
        }
        return typeof override.value === 'object' ? undefined : override.value
    }

    /** The names of the layers on an override's way, e.g. `Input/Body`. */
    const pathOf = (instance: sketch.SymbolInstance, override: sketch.Override) => {
        const names: string[] = []
        let master = instance.master
        const ids = override.path.split('/')
        for (let depth = 0; depth < ids.length && master; depth++) {
            const find = (container: sketch.Layer): sketch.Layer | undefined => {
                for (const child of childrenOf(container)) {
                    const hit = child.id === ids[depth] ? child : find(child)
                    if (hit) {
                        return hit
                    }
                }
                return undefined
            }
            const found = find(master)
            names.push(found?.name ?? ids[depth])
            const path = ids.slice(0, depth + 1).join('/')
            const swap = instance.overrides.find((candidate) => candidate.property === 'symbolID' && candidate.path === path && !candidate.isDefault)
            master = swap ? doc.getSymbolMasterWithID(String(swap.value)) : (found as sketch.SymbolInstance | undefined)?.master
        }
        return names.join('/')
    }

    /** Whether a layer is a drawing and nothing else: a shape or a picture, or a group of them, e.g. a logo. */
    const isDrawing = (layer: sketch.Layer): boolean =>
        layer.type === 'ShapePath' || layer.type === 'Shape' || layer.type === 'Image' || (layer.type === 'Group' && childrenOf(layer).length > 0 && childrenOf(layer).every(isDrawing))
    /** A drawing of the design's own, written to the `svg` folder: a picture as PNG, the others as SVG. */
    const exported = (layer: sketch.Layer): string | undefined => {
        const folder = options.svg
        if (!folder || !isDrawing(layer)) {
            return undefined
        }
        const format = layer.type === 'Image' ? 'png' : 'svg'
        sketch.export(layer, { 'formats': format, 'output': folder, 'use-id-for-name': true, 'overwriting': true, ...(format === 'png' ? { scales: '2' } : {}) })
        return `${folder.replace(/\/$/, '')}/${layer.id}${format === 'png' ? '@2x' : ''}.${format}`
    }

    const visit = (layer: sketch.Layer, origin: { x: number, y: number }, depth = 0): InspectedLayer | undefined => {
        if (layer.hidden) {
            return undefined
        }
        const frame = { x: round(origin.x + layer.frame.x), y: round(origin.y + layer.frame.y), width: round(layer.frame.width), height: round(layer.frame.height) }
        const inspected: InspectedLayer = { name: layer.name, type: layer.type, frame }
        if (layer.sharedStyle) {
            inspected.style = layer.sharedStyle.name
        }
        const look = layer.style as sketch.Style | undefined
        const fills = (look?.fills ?? []).filter((fill) => fill.enabled !== false).map(paintOf)
        const borders = (look?.borders ?? []).filter((border) => border.enabled !== false).map((border) => ({ paint: paintOf(border), width: border.thickness }))
        if (fills.length && layer.type !== 'Text') {
            inspected.fills = fills
        }
        if (borders.length && layer.type !== 'Text') {
            inspected.borders = borders
        }
        const radii = look?.corners?.radii?.filter(Boolean)
        if (radii?.length) {
            inspected.radius = look?.corners.radii
        }
        if (look && look.opacity < 1) {
            inspected.opacity = round(look.opacity)
        }
        if (look?.blendingMode && look.blendingMode !== 'Normal') {
            inspected.blend = look.blendingMode.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
        }
        if (layer.type === 'Text') {
            const text = layer as sketch.Text
            inspected.text = text.text
            inspected.color = text.style.textSwatch?.name ?? text.style.textColor
            // As the file has it: the API's size and weight can read null, e.g. for a style's text.
            const attributes = fileFormatOf(layer).style?.textStyle?.encodedAttributes
            const font = attributes?.MSAttributedStringFontAttribute?.attributes
            const transform = ['', 'uppercase', 'lowercase'][attributes?.MSAttributedStringTextTransformAttribute ?? 0]
            inspected.font = {
                family: text.style.fontFamily,
                ...(font ? { postscript: font.name, size: round(font.size) } : {}),
                ...(text.style.fontWeight ? { weight: text.style.fontWeight } : {}),
                ...(attributes?.paragraphStyle?.minimumLineHeight ? { lineHeight: attributes.paragraphStyle.minimumLineHeight } : {}),
                ...(attributes?.kerning ? { letterSpacing: round(attributes.kerning) } : {}),
                ...(transform ? { transform } : {}),
                alignment: text.style.alignment
            }
            return inspected
        }
        if (layer.type === 'SymbolInstance') {
            const instance = layer as sketch.SymbolInstance
            const name = instance.master?.name ?? ''
            inspected.symbol = name
            const component = componentOf(name)
            if (component) {
                inspected.component = component
            }
            const overrides: NonNullable<InspectedLayer['overrides']> = {}
            for (const override of instance.overrides) {
                if (override.isDefault) {
                    continue
                }
                const value = valueOf(override)
                if (value !== undefined) {
                    overrides[`${pathOf(instance, override)} ${override.property}`] = value
                }
            }
            if (Object.keys(overrides).length) {
                inspected.overrides = overrides
            }
            return inspected
        }
        const stack = layer.stackLayout
        if (stack) {
            const direction = DIRECTIONS[stack.direction] ?? String(stack.direction)
            const align = ALIGN[stack.alignItems] ?? String(stack.alignItems)
            const justify = JUSTIFY[stack.justifyContent] ?? String(stack.justifyContent)
            const padding = typeof stack.padding === 'number' ? `${stack.padding}px` : [stack.padding.top, stack.padding.right, stack.padding.bottom, stack.padding.left].map((side) => `${side}px`).join(' ')
            const flexValue = (value: string) => (value === 'start' || value === 'end' ? `flex-${value}` : ['between', 'around', 'evenly'].includes(value) ? `space-${value}` : value)
            inspected.stack = {
                direction,
                gap: stack.gap,
                padding: stack.padding,
                align,
                justify,
                css: `display: flex; flex-direction: ${direction}; gap: ${stack.gap}px; padding: ${padding}; align-items: ${flexValue(align)}; justify-content: ${flexValue(justify)}`
            }
        }
        const file = depth > 0 ? exported(layer) : undefined
        if (file) {
            inspected.file = file
            return inspected
        }
        if (options.depth !== undefined && depth >= options.depth) {
            const count = childrenOf(layer).length
            if (count) {
                inspected.more = count
            }
            return inspected
        }
        const children = childrenOf(layer)
            .map((child) => visit(child, layer.type === 'Artboard' ? { x: 0, y: 0 } : frame, depth + 1))
            .filter((child): child is InspectedLayer => !!child)
        if (children.length) {
            inspected.layers = children
        }
        return inspected
    }

    // A layer in a screen, in the screen's coordinates.
    if (options.layer) {
        const layer = doc.getLayerWithID(options.layer)
        if (!layer) {
            throw new Error(`No layer ${options.layer} in the document`)
        }
        let origin = { x: 0, y: 0 }
        for (let at = layer.parent as sketch.Layer | sketch.Page; at.type !== 'Page' && at.type !== 'Artboard'; at = at.parent as sketch.Layer) {
            origin = { x: origin.x + at.frame.x, y: origin.y + at.frame.y }
        }
        const inspected = visit(layer, origin, 1)
        return options.outline ? (inspected ? outlineOf(inspected) : '') : JSON.stringify(inspected ?? null)
    }
    const wanted = options.boards
    const boards = doc.pages
        .filter((page) => page.name !== 'Symbols' && page.name !== 'Theme' && page.name !== 'Check' && page.name !== 'Right to left')
        .flatMap((page) => page.layers.filter((layer) => layer.type === 'Artboard' && (!wanted || wanted.includes(layer.name) || wanted.includes(layer.id))).map((board) => ({ page: page.name, board })))
    const read = boards.map(({ page, board }) => ({ page, ...visit(board, { x: 0, y: 0 }) }))
    return options.outline ? read.map((board) => outlineOf(board as InspectedLayer)).join('\n') : JSON.stringify(read)
}

/**
 * A layer and what's in it as lines, indented by depth: its name and type, its frame, its style or symbol with its
 * overrides, its text and font, and its stack as CSS, e.g. `Card · Group · 24,120 384×260 · Card/Outline`.
 */
function outlineOf(layer: InspectedLayer, depth = 0): string {
    const parts = [
        `${layer.name} · ${layer.type}`,
        `${layer.frame.x},${layer.frame.y} ${layer.frame.width}×${layer.frame.height}`,
        layer.symbol,
        layer.style,
        layer.fills?.length ? `fills ${layer.fills.join(', ')}` : undefined,
        layer.blend ? `blend ${layer.blend}` : undefined,
        layer.text !== undefined ? `"${layer.text.replace(/\s+/g, ' ').slice(0, 60)}"` : undefined,
        layer.font ? [layer.font.postscript ?? layer.font.family, layer.font.size && `${layer.font.size}px`, layer.font.lineHeight && `/${layer.font.lineHeight}`, layer.font.transform].filter(Boolean).join(' ') : undefined,
        layer.color,
        layer.stack?.css,
        layer.overrides ? Object.entries(layer.overrides).map(([key, value]) => `${key}=${String(value)}`).join('; ') : undefined,
        layer.more ? `${layer.more} more` : undefined,
        layer.file
    ]
    const line = `${'  '.repeat(depth)}${parts.filter(Boolean).join(' · ')}`
    return [line, ...(layer.layers ?? []).map((child) => outlineOf(child, depth + 1))].join('\n')
}
