import sketch = require('sketch')

import type { ComponentData, Gradient, Layer, LayerStyle, Paint, Starter, TextStyle } from '../kit.ts'
import { childrenOf, fileFormatOf, isLocal, openDocument } from './document.ts'
import type { FileLayer } from './file-format.ts'
import { WEIGHT_INDEX } from './theme/values.ts'

/**
 * Builds a component of the design kit in a Sketch document: its layer and text styles, its symbols, the starter set
 * and a review board, from the design kit's model. Running it again updates the styles and rebuilds the symbols,
 * keeping their layers' IDs, so instances keep their overrides. It logs what it made, as JSON.
 */
export function buildComponent(document: string, kit: ComponentData): void {
    new ComponentBuilder(openDocument(document), kit).build()
}

const hex8 = (color: string) => (color.length === 7 ? `${color}ff` : color)
const title = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)

const ALIGN: Record<string, number> = { start: 0, center: 1, end: 2, stretch: 3 }
const JUSTIFY: Record<string, number> = { start: 0, center: 1, end: 2, between: 3 }

/** A gradient's stops as Sketch draws them, for an angular one turned a quarter from CSS's. */
type SketchStops = Gradient['stops']

/** The colour a button's label and icons take, as the buttons in this kit set it. */
function buttonLabelSwatch(appearance: string, status: string): string {
    if (appearance === 'filled') {
        return status === 'basic' || status === 'control' ? 'Palette/Basic/800' : 'Text/Control'
    }
    if (appearance === 'hero') {
        return status === 'basic' ? 'Palette/Basic/600' : status === 'control' ? 'Palette/Basic/800' : 'Text/Control'
    }
    if (status === 'basic') {
        return 'Text/Basic'
    }
    if (status === 'control') {
        return appearance === 'ghost' ? 'Palette/Basic/100' : 'Text/Control'
    }
    return `Text/${title(status)}/Default`
}

/**
 * The IDs of the layers in a master by their path: each layer's name, with its place among the siblings of that name.
 * Instances' overrides are keyed by these IDs, in this document and in designs that use it as a library.
 */
const pathOf = (parentPath: string, name: string, seen: Record<string, number>) => {
    seen[name] = (seen[name] ?? 0) + 1
    return `${parentPath}/${name}#${seen[name]}`
}

class ComponentBuilder {
    private readonly warnings = new Array<string>()
    private readonly swatches = new Map<string, sketch.Swatch>()
    private readonly layerStyles = new Map<string, sketch.SharedStyle>()
    private readonly textStyles = new Map<string, sketch.SharedStyle>()
    private readonly masters = new Map<string, sketch.SymbolMaster>()
    private readonly previousIds = new Map<string, Record<string, string>>()
    private readonly counts = { layerStyles: 0, textStyles: 0, updated: 0 }
    private readonly symbolsPage: sketch.Page
    private readonly scratch: sketch.Page
    /** Where the component's symbols go: rows below everything on the Symbols page. */
    private rowTop: number
    private rowLeft = 0
    private rowHeight = 0

    constructor(
        private readonly doc: sketch.Document,
        private readonly kit: ComponentData
    ) {
        doc.swatches.forEach((swatch) => this.swatches.set(swatch.name, swatch))
        this.symbolsPage = sketch.Page.getSymbolsPage(doc)
        this.scratch = doc.pages.find((candidate) => candidate.name === 'Symbols') ?? doc.selectedPage
        doc.sharedLayerStyles.forEach((style) => this.layerStyles.set(style.name, style))
        doc.sharedTextStyles.forEach((style) => this.textStyles.set(style.name, style))
        doc.getSymbols().forEach((master) => this.masters.set(master.name, master))
        this.rowTop = this.symbolsPage.layers.reduce((bottom, layer) => Math.max(bottom, layer.frame.y + layer.frame.height), 0) + SPACING * 3
    }

    build(): void {
        this.buildStyles()
        this.adoptRenamed()
        const built: sketch.SymbolMaster[] = []
        const symbolsByName = new Map(this.kit.symbols.map((symbol) => [symbol.name, symbol]))
        for (const symbol of this.kit.symbols) {
            const made = this.symbolMaster(symbol.name, symbol.width, symbol.height)
            this.place(symbol.layer, made, undefined)
            made.stackLayout = { direction: sketch.StackLayout.Direction.Row, alignItems: 0, padding: 0, gap: 0 } as sketch.StackLayout
            const root = made.layers[0]
            if (root) {
                stretch(symbol.layer, root)
            }
            made.stackLayout.apply()
            // Before the overrides are locked, as which are locked is kept by layer ID too.
            this.keepIds(made)
            made.stackLayout.apply()
            lockOverrides(made, symbol.layer)
            built.push(made)
        }
        this.newRow()

        // A starter: a symbol of the base with the starter's styles chosen in its overrides.
        const starters: Array<{ made: sketch.SymbolMaster, starter: Starter }> = []
        for (const starter of this.kit.starters) {
            const base = this.masters.get(starter.symbol)
            if (!base) {
                this.warnings.push(`No symbol ${starter.symbol} for the starter ${starter.name}`)
                continue
            }
            const made = this.symbolMaster(starter.name, base.frame.width, base.frame.height)
            const instance = base.createNewInstance()
            instance.parent = made
            instance.frame = { x: 0, y: 0, width: base.frame.width, height: base.frame.height }
            this.applyChoices(instance, starter.overrides)
            // Resizes as its symbol does.
            made.stackLayout = { direction: sketch.StackLayout.Direction.Row, alignItems: 0, padding: 0, gap: 0 } as sketch.StackLayout
            const symbol = symbolsByName.get(starter.symbol)
            if (symbol) {
                stretch(symbol.layer, instance)
            }
            made.stackLayout.apply()
            this.keepIds(made)
            made.stackLayout.apply()
            // Its base's size and visibility in the stack aren't choices, unlike its symbol, styles and texts.
            for (const override of made.overrides) {
                if (['horizontalSizing', 'verticalSizing', 'isVisible', 'preservesSpaceWhenHidden'].includes(override.property) && !override.path.includes('/')) {
                    override.editable = false
                }
            }
            starters.push({ made, starter })
        }

        const board = this.reviewBoard(built, starters)
        const removed = this.removeOrphanStyles()
        // The component is drawn in the kit's theme again: the next theme applied changes all of it.
        sketch.Settings.setDocumentSettingForKey(this.doc, 'lyra-theme-applied', {})
        this.doc.processPendingChanges()
        console.log(
            JSON.stringify({
                component: this.kit.component,
                ...this.counts,
                removed,
                symbols: built.length,
                starters: starters.length,
                board: board.id,
                warnings: [...new Set(this.warnings)]
            })
        )
    }

    private swatchOf(paint: Paint | undefined): sketch.Swatch | undefined {
        if (!paint?.variable) {
            return undefined
        }
        const swatch = this.swatches.get(paint.variable)
        if (!swatch) {
            this.warnings.push(`No colour variable ${paint.variable}`)
        }
        return swatch
    }

    /** A CSS gradient angle as Sketch's start and end points, in the layer's unit square, and its stops as drawn. */
    private gradientOf(gradient: Gradient): { gradient: sketch.Gradient, stops: SketchStops } {
        if (gradient.angular) {
            // Sketch's angular gradients start at the right, a quarter turn after CSS's conic ones: the stops move back
            // a quarter, those before it wrapping round to the end, with the colour at the right at both ends.
            const at = (position: number) => [...gradient.stops].reverse().find((stop) => stop.position <= position) ?? gradient.stops[0]
            const edge = at(0.25)
            const stops: SketchStops = edge
                ? [
                    { position: 0, paint: edge.paint },
                    ...gradient.stops.filter((stop) => stop.position > 0.25).map((stop) => ({ position: stop.position - 0.25, paint: stop.paint })),
                    ...gradient.stops.filter((stop) => stop.position < 0.25).map((stop) => ({ position: stop.position + 0.75, paint: stop.paint })),
                    { position: 1, paint: edge.paint }
                ]
                : []
            return {
                gradient: {
                    gradientType: sketch.Style.GradientType.Angular,
                    from: { x: 0.5, y: 0 },
                    to: { x: 0.5, y: 1 },
                    stops: stops.map((stop) => ({ position: stop.position, color: hex8(stop.paint.color) }))
                },
                stops
            }
        }
        // Sketch draws stops that don't start at 0 and end at 1 as though they did, squeezing what's between them: its
        // ends go there, in the first and the last stops' colours, as CSS paints past them.
        const first = gradient.stops[0]
        const last = gradient.stops[gradient.stops.length - 1]
        const ends = [
            ...(first && first.position > 0 ? [{ position: 0, paint: first.paint }] : []),
            ...gradient.stops,
            ...(last && last.position < 1 ? [{ position: 1, paint: last.paint }] : [])
        ]
        // As long as CSS's gradient line, which reaches the box's corners: a diagonal one is longer than a side, in a
        // square by √2.
        const radians = (gradient.angle * Math.PI) / 180
        const reach = Math.abs(Math.sin(radians)) + Math.abs(Math.cos(radians))
        const dx = (Math.sin(radians) * reach) / 2
        const dy = (-Math.cos(radians) * reach) / 2
        return {
            gradient: {
                gradientType: sketch.Style.GradientType.Linear,
                from: { x: 0.5 - dx, y: 0.5 - dy },
                to: { x: 0.5 + dx, y: 0.5 + dy },
                stops: ends.map((stop) => ({ position: stop.position, color: hex8(stop.paint.color) }))
            },
            stops: ends
        }
    }

    /** Sets a layer style's fills, border and shadows, linked to the colour variables they come from. */
    private paintStyle(style: sketch.Style, look: LayerStyle) {
        const gradients = look.fills.map((fill) => ('stops' in fill ? this.gradientOf(fill) : undefined))
        style.fills = look.fills.map((fill, index) => {
            const gradient = gradients[index]
            return gradient
                ? { fillType: sketch.Style.FillType.Gradient, enabled: true, gradient: gradient.gradient }
                : { fillType: sketch.Style.FillType.Color, enabled: true, color: hex8((fill as Paint).color) }
        })
        // Colour variables link by setting them on the style's own fills and putting them back.
        const fills = style.fills
        look.fills.forEach((fill, index) => {
            const own = fills[index]
            const drawn = gradients[index]
            if (!own) {
                return
            }
            if (drawn && own.gradient) {
                const gradient = own.gradient
                drawn.stops.forEach((stop, at) => {
                    const swatch = this.swatchOf(stop.paint)
                    const target = gradient.stops[at]
                    if (swatch && target) {
                        target.swatch = swatch
                    }
                })
                own.gradient = gradient
            } else {
                const swatch = this.swatchOf(fill as Paint)
                if (swatch) {
                    own.swatch = swatch
                }
            }
        })
        style.fills = fills

        // A border is a colour, or a gradient, e.g. a progress ring's.
        const border = look.border
        const borderGradient = border?.gradient ? this.gradientOf(border.gradient) : undefined
        style.borders = border
            ? [
                borderGradient
                    ? { fillType: sketch.Style.FillType.Gradient, enabled: true, gradient: borderGradient.gradient, thickness: border.width, position: sketch.Style.BorderPosition.Inside }
                    : { fillType: sketch.Style.FillType.Color, enabled: true, color: hex8(border.paint.color), thickness: border.width, position: sketch.Style.BorderPosition.Inside }
            ]
            : []
        // A browser draws a dashed border's dashes and gaps about three times as long as it is wide.
        style.borderOptions = { dashPattern: border?.dashed ? [border.width * 3, border.width * 3] : [] }
        if (border && borderGradient) {
            const borders = style.borders
            const gradient = borders[0]?.gradient
            if (borders[0] && gradient) {
                borderGradient.stops.forEach((stop, at) => {
                    const swatch = this.swatchOf(stop.paint)
                    const target = gradient.stops[at]
                    if (swatch && target) {
                        target.swatch = swatch
                    }
                })
                borders[0].gradient = gradient
                style.borders = borders
            }
        } else if (border) {
            const swatch = this.swatchOf(border.paint)
            const borders = style.borders
            if (swatch && borders[0]) {
                borders[0].swatch = swatch
                style.borders = borders
            }
        }

        for (const [property, inset] of [['shadows', false], ['innerShadows', true]] as const) {
            const own = look.shadows.filter((shadow) => !!shadow.inset === inset)
            style[property] = own.map((shadow) => ({ enabled: true, color: hex8(shadow.paint.color), x: shadow.x, y: shadow.y, blur: shadow.blur, spread: shadow.spread }))
            const shadows = style[property]
            own.forEach((shadow, index) => {
                const swatch = this.swatchOf(shadow.paint)
                const target = shadows[index]
                if (swatch && target) {
                    target.swatch = swatch
                }
            })
            style[property] = shadows
        }
        style.opacity = look.opacity ?? 1
    }

    private paintText(style: sketch.Style, look: TextStyle) {
        style.fontFamily = look.font.family
        style.fontSize = look.font.size
        style.fontWeight = WEIGHT_INDEX[look.font.weight] ?? 5
        style.lineHeight = look.font.lineHeight
        style.kerning = look.font.letterSpacing || 0
        style.textTransform = (look.font.transform ?? 'none') as sketch.Style['textTransform']
        style.alignment = 'left'
        style.textColor = hex8(look.paint.color)
        const swatch = this.swatchOf(look.paint)
        if (swatch) {
            style.textSwatch = swatch
        }
        style.shadows = look.shadows.map((shadow) => ({ enabled: true, color: hex8(shadow.paint.color), x: shadow.x, y: shadow.y, blur: shadow.blur, spread: shadow.spread }))
        const shadows = style.shadows
        look.shadows.forEach((shadow, index) => {
            const shadowSwatch = this.swatchOf(shadow.paint)
            const target = shadows[index]
            if (shadowSwatch && target) {
                target.swatch = shadowSwatch
            }
        })
        style.shadows = shadows
    }

    // ---- Shared styles ----

    private buildStyles() {
        for (const [name, look] of Object.entries(this.kit.layerStyles)) {
            const shape = new sketch.ShapePath({ parent: this.scratch, frame: { x: -9999, y: -9999, width: 10, height: 10 } })
            this.paintStyle(shape.style, look)
            const existing = this.layerStyles.get(name)
            if (existing) {
                existing.style = shape.style
                this.counts.updated++
            } else {
                this.layerStyles.set(name, sketch.SharedStyle.fromStyle({ name, style: shape.style, document: this.doc }))
                this.counts.layerStyles++
            }
            shape.remove()
        }
        for (const [name, look] of Object.entries(this.kit.textStyles)) {
            const existing = this.textStyles.get(name)
            if (look.typography) {
                // The typography text styles are the kit's own, made with the foundations.
                if (!existing) {
                    this.warnings.push(`No typography text style ${name}`)
                }
                continue
            }
            const text = new sketch.Text({ parent: this.scratch, text: 'Aa', frame: { x: -9999, y: -9999, width: 100, height: 40 } })
            this.paintText(text.style, look)
            if (existing) {
                existing.style = text.style
                this.counts.updated++
            } else {
                this.textStyles.set(name, sketch.SharedStyle.fromStyle({ name, style: text.style, document: this.doc }))
                this.counts.textStyles++
            }
            text.remove()
        }
    }

    // ---- Symbols ----

    /**
     * Sets an instance's overrides to a choice of styles, icon colours, texts and nested symbols, by the names of the
     * layers they're for: `Body`, or `Input/Body` for a layer of a symbol inside the instance's.
     */
    private applyChoices(instance: sketch.SymbolInstance, choices: Starter['overrides']) {
        // The names of the symbols inside the instance's, by their IDs, which nested overrides' paths start with.
        const names = new Map<string, string>()
        const visit = (layer: sketch.Layer) => {
            names.set(layer.id, layer.name)
            childrenOf(layer).forEach(visit)
        }
        instance.master?.layers.forEach(visit)
        for (const override of instance.overrides) {
            const path = override.path.split('/')
            if (path.length > 2) {
                continue
            }
            const choice = choices[path.length === 2 ? `${names.get(path[0] ?? '')}/${override.affectedLayer.name}` : override.affectedLayer.name]
            if (!choice) {
                continue
            }
            const layerStyle = choice.layerStyle ? this.layerStyles.get(choice.layerStyle) : undefined
            const textStyle = choice.textStyle ? this.textStyles.get(choice.textStyle) : undefined
            const symbol = choice.symbol ? this.masters.get(choice.symbol) : undefined
            if (override.property === 'layerStyle' && layerStyle) {
                override.value = layerStyle.id
            } else if (override.property === 'textStyle' && textStyle) {
                override.value = textStyle.id
            } else if ((override.property === 'fillColor' || override.property === 'textColor') && choice.tint) {
                // An icon's or a text's colour: its colour variable, else the colour itself.
                const swatch = this.swatchOf(choice.tint)
                if (swatch) {
                    override.swatchValue = swatch
                } else {
                    override.value = choice.tint.color
                }
            } else if (override.property === 'stringValue' && choice.text !== undefined) {
                override.value = choice.text
            } else if (override.property === 'symbolID' && symbol) {
                override.value = symbol.symbolId
            }
        }
    }

    /** An instance of another component's symbol, e.g. an alert's close button, styled as captured. */
    private placeRef(layer: Layer, ref: NonNullable<Layer['ref']>, parent: sketch.Group): sketch.SymbolInstance | undefined {
        // A component of the kit: its symbol, with the captured look chosen in its overrides.
        if (ref.symbol) {
            const kitMaster = this.masters.get(ref.symbol)
            if (!kitMaster) {
                this.warnings.push(`No symbol ${ref.symbol}; build its component first`)
                return undefined
            }
            const placed = kitMaster.createNewInstance()
            placed.parent = parent
            placed.name = layer.name
            this.applyChoices(placed, ref.overrides ?? {})
            return placed
        }
        const inputs = ref.inputs
        const prefix = ref.component === 'icon-button' ? 'Icon Button' : 'Button'
        const shape = title(inputs['shape'] ?? 'rectangle')
        const heightOf = (name: string) => this.masters.get(`${prefix}/${name}/${shape}`)?.frame.height ?? Infinity
        // The size whose symbol is as tall as the button was drawn, as a component can resize its buttons, e.g. a
        // chat's send button; else the size its classes give.
        const sizes = ['Tiny', 'Small', 'Medium', 'Large', 'Giant'].filter((name) => this.masters.has(`${prefix}/${name}/${shape}`))
        const nearest = sizes.reduce((best, name) => (Math.abs(heightOf(name) - layer.height) < Math.abs(heightOf(best) - layer.height) ? name : best), title(inputs['size'] ?? 'medium'))
        const master = this.masters.get(`${prefix}/${nearest}/${shape}`)
        if (!master) {
            this.warnings.push(`No symbol for ${ref.component} ${JSON.stringify(inputs)}`)
            return undefined
        }
        const instance = master.createNewInstance()
        instance.parent = parent
        instance.name = layer.name
        const bodyStyle = this.layerStyles.get(`Button/${title(inputs['appearance'] ?? '')}/${title(inputs['status'] ?? '')}/Default`)
        const tint = this.swatches.get(buttonLabelSwatch(inputs['appearance'] ?? '', inputs['status'] ?? ''))
        const icon = ref.icon ? this.masters.get(ref.icon) : undefined
        for (const override of instance.overrides) {
            if (override.property === 'layerStyle' && bodyStyle) {
                override.value = bodyStyle.id
            } else if (override.property === 'fillColor' && tint) {
                override.swatchValue = tint
            } else if (override.property === 'symbolID' && icon) {
                override.value = icon.symbolId
            }
        }
        return instance
    }

    /** Places a layer of the model, and its children, in a parent frame. */
    private place(layer: Layer, parent: sketch.Group, parentLayer: Layer | undefined): sketch.Layer | undefined {
        const frame = { x: layer.x, y: layer.y, width: layer.width, height: layer.height }
        let made: sketch.Layer
        if (layer.kind === 'text') {
            const text = new sketch.Text({ parent, name: layer.name, text: layer.text ?? '' })
            const style = layer.textStyle ? this.textStyles.get(layer.textStyle) : undefined
            if (style) {
                // The style before the frame: Sketch keeps a text's baseline when its style changes.
                text.sharedStyle = style
                text.style.syncWithSharedStyle(style)
            } else {
                this.warnings.push(`No text style ${layer.textStyle}`)
            }
            text.fixedWidth = layer.textSizing === 'fixed'
            text.frame = frame
            size(text, layer, parentLayer)
            made = text
        } else if (layer.kind === 'ref' && layer.ref) {
            const placed = this.placeRef(layer, layer.ref, parent)
            if (!placed) {
                return undefined
            }
            // As big as the component was drawn, e.g. a chat's smaller send button.
            placed.frame = frame
            size(placed, layer, parentLayer)
            made = placed
        } else if (layer.kind === 'icon' && layer.icon) {
            const icon = layer.icon
            const box = new sketch.Group.Frame({ parent, name: layer.name, frame })
            box.style.fills = []
            box.style.borders = []
            size(box, layer, parentLayer)
            const master = this.masters.get(icon.symbol)
            if (master) {
                const instance = master.createNewInstance()
                instance.parent = box
                // Named after its icon, so a starter's override can swap it, e.g. each toast status's icon.
                instance.name = `${layer.name} Glyph`
                // Square and centred, as a browser draws an icon's SVG in a box of another shape.
                const side = Math.min(layer.width, layer.height)
                instance.frame = { x: (layer.width - side) / 2, y: (layer.height - side) / 2, width: side, height: side }
                // Turned as the browser turns it, e.g. a chevron pointing right.
                if (icon.turn) {
                    instance.transform.rotation = icon.turn
                }
            } else {
                this.warnings.push(`No icon ${icon.symbol}`)
            }
            // Its colour variable, else the colour itself.
            const swatch = this.swatchOf(icon.paint)
            box.style.tint = swatch ? { swatch } : { color: icon.paint.color }
            made = box
        } else if (layer.kind === 'path' && layer.path) {
            // A shape, e.g. a tooltip's arrow, where its outline is in the layer's box: Sketch sizes it to the outline.
            const shape = sketch.ShapePath.fromSVGPath(layer.path)
            shape.parent = parent
            shape.name = layer.name
            shape.frame = { x: layer.x + shape.frame.x, y: layer.y + shape.frame.y, width: shape.frame.width, height: shape.frame.height }
            shape.style.fills = []
            shape.style.borders = []
            const style = layer.layerStyle ? this.layerStyles.get(layer.layerStyle) : undefined
            if (style) {
                shape.sharedStyle = style
                shape.style.syncWithSharedStyle(style)
            }
            size(shape, layer, parentLayer)
            made = shape
        } else if (layer.kind === 'frame' && !layer.children.length && !layer.image && this.kit.layerStyles[layer.layerStyle ?? '']?.fills.some((fill) => 'stops' in fill)) {
            // A gradient on its own, e.g. an unavailable swatch's strike: Sketch spreads a frame's gradient over what the
            // frame holds, so one that holds nothing draws none, where a shape draws it over its box.
            const shape = new sketch.ShapePath({ parent, name: layer.name, frame })
            shape.style.fills = []
            shape.style.borders = []
            const style = this.layerStyles.get(layer.layerStyle ?? '')
            if (style) {
                shape.sharedStyle = style
                shape.style.syncWithSharedStyle(style)
            }
            // A shape's corners are its points', each no rounder than the shape allows, e.g. a round swatch's circle.
            const radius = layer.radius
            if (radius) {
                ;(shape as unknown as { points: Array<{ cornerRadius: number }> }).points.forEach((point, index) => {
                    point.cornerRadius = Math.min(radius[index] ?? 0, layer.width / 2, layer.height / 2)
                })
            }
            size(shape, layer, parentLayer)
            made = shape
        } else {
            made = this.placeFrame(layer, parent, parentLayer, frame)
        }
        // How its corners, padding and gap follow the theme, with what they are now, for the kit's theme script.
        if (layer.bindings && layer.kind === 'frame') {
            const at = { radius: layer.radius ?? [0, 0, 0, 0], padding: layer.layout?.padding, gap: layer.layout?.gap, width: layer.width, height: layer.height }
            sketch.Settings.setLayerSettingForKey(made, 'lyra-bindings', { ...layer.bindings, at })
        }
        if (parentLayer && (layer.absolute || !parentLayer.layout)) {
            // Placed on its own, or in a frame without a stack: kept to the edges it's at when the symbol is resized,
            // stretching with the parent where it spans more than half of it, e.g. a select's value or a layout's
            // header, or half of it, e.g. a plain divider's two lines, which meet; else at the nearer edge, e.g. a
            // select's chevron.
            const near = (at: number, extent: number, whole: number) => (extent >= whole / 2 - 0.5 ? sketch.Pin.All : at + extent / 2 > whole / 2 ? sketch.Pin.Max : sketch.Pin.Min)
            made.horizontalPins = near(layer.x, layer.width, parentLayer.width)
            made.verticalPins = near(layer.y, layer.height, parentLayer.height)
        }
        // At its share of its parent's width, e.g. a progress bar's value, as the instance is drawn wider or narrower.
        if (layer.relative) {
            made.horizontalPins = sketch.Pin.Min
            made.horizontalSizing = sketch.FlexSizing.Relative
        }
        return made
    }

    /** A frame of the model, with its look, image and children, and its stack. */
    private placeFrame(layer: Layer, parent: sketch.Group, parentLayer: Layer | undefined, frame: sketch.Rectangle): sketch.Group {
        const made = new sketch.Group.Frame({ parent, name: layer.name, frame })
        size(made, layer, parentLayer)
        made.style.fills = []
        made.style.borders = []
        const style = layer.layerStyle ? this.layerStyles.get(layer.layerStyle) : undefined
        if (layer.layerStyle && style) {
            made.sharedStyle = style
            made.style.syncWithSharedStyle(style)
        }
        if (layer.radius) {
            made.style.corners.radii = layer.radius
        }
        made.clipsContents = !!layer.clip
        // An image, e.g. a flag or a QR code, behind the frame's content, stretched over it: an SVG as its own layers,
        // a raster image as an image layer.
        const data = layer.image ? this.kit.images[layer.image] : undefined
        if (data) {
            const image = data.startsWith('data:') ? new sketch.Image({ image: { base64: data.slice(data.indexOf(',') + 1) } }) : sketch.createLayerFromData(data, 'svg')
            image.name = 'Image'
            image.parent = made
            image.frame = { x: 0, y: 0, width: layer.width, height: layer.height }
            image.ignoresStackLayout = true
            image.horizontalPins = sketch.Pin.All
            image.verticalPins = sketch.Pin.All
            image.moveToBack()
        }
        // A stack lays out its top layer first, so the children go in back to front; the ones placed on their own go
        // last, on top, as they are in the browser.
        const inFlow = layer.children.filter((child) => !child.absolute)
        const placedOnTheirOwn = layer.children.filter((child) => child.absolute)
        for (const child of [...(layer.layout ? inFlow.slice().reverse() : inFlow), ...placedOnTheirOwn]) {
            this.place(child, made, layer)
        }
        made.frame = frame
        if (layer.layout) {
            const [top, right, bottom, left] = layer.layout.padding
            made.stackLayout = {
                direction: layer.layout.direction === 'row' ? sketch.StackLayout.Direction.Row : sketch.StackLayout.Direction.Column,
                alignItems: ALIGN[layer.layout.align] ?? 0,
                justifyContent: JUSTIFY[layer.layout.justify] ?? 0,
                padding: { top, right, bottom, left },
                gap: layer.layout.gap
            } as sketch.StackLayout
            // A new stack resets the frame's sizing, e.g. an alert's fixed height to its content's.
            size(made, layer, parentLayer)
            made.frame = frame
            made.stackLayout.apply()
        }
        return made
    }

    private slot(width: number, height: number) {
        if (this.rowLeft > 0 && this.rowLeft + width > ROW_WIDTH) {
            this.rowTop += this.rowHeight + SPACING
            this.rowLeft = 0
            this.rowHeight = 0
        }
        const at = { x: this.rowLeft, y: this.rowTop }
        this.rowLeft += width + SPACING
        this.rowHeight = Math.max(this.rowHeight, height)
        return at
    }

    private newRow() {
        this.rowTop += this.rowHeight + SPACING * 2
        this.rowLeft = 0
        this.rowHeight = 0
    }

    /**
     * Gives a rebuilt master's layers the IDs its layers had at the same paths, so instances keep their overrides. The
     * API can't set an ID, so each layer is recreated from its Sketch JSON with the ID in it.
     */
    private keepIds(made: sketch.SymbolMaster) {
        const ids = this.previousIds.get(made.name)
        if (!ids || !Object.keys(ids).length) {
            return
        }
        const rename = (json: FileLayer, path: string) => {
            const id = ids[path]
            if (id) {
                json.do_objectID = id
            }
            const siblings: Record<string, number> = {}
            for (const child of json.layers ?? []) {
                rename(child, pathOf(path, child.name, siblings))
            }
        }
        const seen: Record<string, number> = {}
        for (const layer of made.layers.slice()) {
            const json = fileFormatOf(layer)
            rename(json, pathOf('', layer.name, seen))
            const index = layer.index
            // The built layer goes first: two layers with one ID would confuse Sketch.
            layer.remove()
            const kept = sketch.fromSketchJSON(json)
            kept.parent = made
            kept.index = index
        }
    }

    /** A symbol master, new or emptied for rebuilding, kept where it is. */
    /**
     * A symbol the kit has under a longer name since an input was added, e.g. `Progress Bar/Bar/Medium` now one per
     * value: the first of those takes it over, keeping its ID, so designs that use it stay linked. Others the kit no
     * longer has are kept for the designs that use them, with a warning.
     */
    private adoptRenamed() {
        const names = new Set([...this.kit.symbols, ...this.kit.starters].map((symbol) => symbol.name))
        const prefix = `${this.kit.component}/`
        for (const [name, master] of [...this.masters]) {
            // Its own name too, e.g. `Route Tabset` before its tabs were counted.
            if (!(name.startsWith(prefix) || name === this.kit.component) || names.has(name) || !isLocal(master)) {
                continue
            }
            const successor = this.kit.symbols.find((symbol) => symbol.name.startsWith(`${name}/`) && !this.masters.has(symbol.name))
            if (successor) {
                master.name = successor.name
                this.masters.delete(name)
                this.masters.set(successor.name, master)
            } else {
                this.warnings.push(`${name} isn't in the kit any more: remove it once no design uses it`)
            }
        }
    }

    private symbolMaster(name: string, width: number, height: number): sketch.SymbolMaster {
        let made = this.masters.get(name)
        if (made) {
            this.previousIds.set(name, idsOf(made))
            made.layers.slice().forEach((layer) => layer.remove())
            // One that grew, e.g. an open select once it shows its options, would overlap its neighbours: it moves to a
            // free slot.
            const grew = width > made.frame.width + 0.5 || height > made.frame.height + 0.5
            const at = grew ? this.slot(width, height) : made.frame
            made.frame = { x: at.x, y: at.y, width, height }
        } else {
            const at = this.slot(width, height)
            made = new sketch.SymbolMaster({ parent: this.symbolsPage, name, frame: { x: at.x, y: at.y, width, height } })
            this.masters.set(name, made)
        }
        made.background = { enabled: false }
        made.clipsContents = false
        return made
    }

    // ---- Review board ----

    private reviewBoard(built: sketch.SymbolMaster[], starters: Array<{ made: sketch.SymbolMaster, starter: Starter }>): sketch.Artboard {
        const kit = this.kit
        const page = this.doc.pages.find((candidate) => candidate.name === kit.page) ?? new sketch.Page({ name: kit.page, parent: this.doc })
        const boardName = `${kit.board} / Starters`
        const old = page.layers.find((layer) => layer.name === boardName)
        const PADDING = 64
        const LABEL = 160
        const GAP = 32
        // Columns by the input with the most values, e.g. status; rows by the others.
        const valuesOf = (input: string) => [...new Set(starters.map(({ starter }) => starter.labels[input]))]
        const columnInput = kit.style.reduce((most, input) => (valuesOf(input).length > valuesOf(most).length ? input : most), kit.style[0] ?? '')
        const rowInputs = kit.style.filter((input) => input !== columnInput)
        const rowOf = (starter: Starter) => rowInputs.map((input) => starter.labels[input]).join(' · ')
        const columns = valuesOf(columnInput)
        const rows = [...new Set(starters.map(({ starter }) => rowOf(starter)))]
        const cellWidth = Math.max(96, ...starters.map(({ made }) => made.frame.width)) + GAP
        // Each row as tall as its tallest starter, e.g. an open select's, and the rows' tops from those.
        const rowHeights = rows.map((row) => Math.max(...starters.filter(({ starter }) => rowOf(starter) === row).map(({ made }) => made.frame.height)) + GAP)
        const rowTops = rowHeights.map((_, index) => rowHeights.slice(0, index).reduce((total, height) => total + height, 0))
        const headerHeight = 96
        const boardWidth = PADDING * 2 + LABEL + columns.length * cellWidth
        const startersHeight = headerHeight + rowHeights.reduce((total, height) => total + height, 0)

        // Below the starters, every symbol of the component, named, in rows as wide as the starters.
        const SYMBOL_LABEL = 24
        // Without starters, e.g. a calendar's, the board is its symbols alone.
        const symbolsTop = starters.length ? PADDING + startersHeight + 48 : PADDING
        const flowWidth = Math.max(boardWidth - PADDING * 2, 960, ...built.map((made) => made.frame.width))
        const symbolPlaces: Array<{ made: sketch.SymbolMaster, x: number, y: number }> = []
        let flowX = 0
        let flowY = 48
        let flowRow = 0
        for (const made of built) {
            const width = Math.max(made.frame.width, 160)
            if (flowX > 0 && flowX + width > flowWidth) {
                flowX = 0
                flowY += flowRow + GAP
                flowRow = 0
            }
            symbolPlaces.push({ made, x: PADDING + flowX, y: symbolsTop + flowY })
            flowX += width + GAP
            flowRow = Math.max(flowRow, made.frame.height + SYMBOL_LABEL)
        }
        const boardHeight = symbolsTop + flowY + flowRow + PADDING
        const boardAt = old ? { x: old.frame.x, y: old.frame.y } : { x: page.layers.reduce((right, layer) => Math.max(right, layer.frame.x + layer.frame.width + 200), 0), y: 0 }
        old?.remove()
        const board = new sketch.Artboard({ parent: page, name: boardName, frame: { x: boardAt.x, y: boardAt.y, width: Math.max(boardWidth, flowWidth + PADDING * 2), height: boardHeight } })
        board.background = { enabled: true, includedInExport: true, color: '#ffffffff' }
        const caption = this.textStyles.get('Caption/C1/Hint')
        const heading = this.textStyles.get('Heading/H6/Basic')
        const label = (text: string, x: number, y: number, width: number, style: sketch.SharedStyle | undefined) => {
            const made = new sketch.Text({ parent: board, text })
            if (style) {
                made.sharedStyle = style
                made.style.syncWithSharedStyle(style)
            }
            made.fixedWidth = true
            made.frame = { x, y, width, height: made.frame.height }
            return made
        }
        label(`${kit.board} — starters`, PADDING, PADDING, boardWidth - PADDING * 2, heading)
        columns.forEach((column, index) => label(column ?? '', PADDING + LABEL + index * cellWidth, PADDING + 48, cellWidth - GAP, caption))
        if (!starters.length) {
            board.layers.filter((layer) => layer.type === 'Text').forEach((layer) => layer.remove())
        }
        if (rows.length > 1 || rows[0]) {
            rows.forEach((row, index) => label(row, PADDING, PADDING + headerHeight + (rowTops[index] ?? 0), LABEL - GAP, caption))
        }
        label('Symbols', PADDING, symbolsTop, flowWidth, heading)
        for (const { made, x, y } of symbolPlaces) {
            label(made.name.slice(kit.component.length + 1), x, y, Math.max(made.frame.width, 160), caption)
            const instance = made.createNewInstance()
            instance.parent = board
            instance.frame = { x, y: y + SYMBOL_LABEL, width: made.frame.width, height: made.frame.height }
        }
        for (const { made, starter } of starters) {
            const column = columns.indexOf(starter.labels[columnInput])
            const top = PADDING + headerHeight + (rowTops[rows.indexOf(rowOf(starter))] ?? 0)
            // The control status is for coloured backgrounds, so it's shown on the primary colour.
            if (Object.values(starter.inputs).includes('control')) {
                const backdrop = new sketch.ShapePath({
                    parent: board,
                    name: 'Control backdrop',
                    frame: { x: PADDING + LABEL + column * cellWidth - 12, y: top - 12, width: made.frame.width + 24, height: made.frame.height + 24 }
                })
                backdrop.style.borders = []
                backdrop.style.fills = [{ fillType: sketch.Style.FillType.Color, enabled: true, color: '#3469d1ff' }]
                const fills = backdrop.style.fills
                const primary = this.swatches.get('State/Primary/Default')
                if (primary && fills[0]) {
                    fills[0].swatch = primary
                }
                backdrop.style.fills = fills
                backdrop.style.corners.radii = [8, 8, 8, 8]
            }
            const instance = made.createNewInstance()
            instance.parent = board
            instance.frame = { x: PADDING + LABEL + column * cellWidth, y: top, width: made.frame.width, height: made.frame.height }
        }
        return board
    }

    // ---- Styles the model no longer has ----

    /**
     * A component's own styles are named after it; one the model no longer has, and nothing uses, is removed. Names of
     * every component's styles come with the model, so another component's, e.g. Tag Input's for Tag, are kept.
     */
    private removeOrphanStyles(): number {
        const component = this.kit.component
        const ownStyle = (name: string) => name === component || name.startsWith(`${component}/`) || name.startsWith(`${component} `)
        const modelStyles = new Set(this.kit.allStyles)
        let removed = 0
        for (const property of ['sharedLayerStyles', 'sharedTextStyles'] as const) {
            // Each read of a document's style list wraps every style, so it's read once; styles are removed from it in
            // place, from the end so the indexes stay valid.
            const styles = this.doc[property]
            const orphans: number[] = []
            styles.forEach((style, index) => {
                if (ownStyle(style.name) && !modelStyles.has(style.name) && style.getAllInstancesLayers().length === 0) {
                    orphans.push(index)
                }
            })
            for (const index of orphans.reverse()) {
                styles.splice(index, 1)
                removed++
            }
        }
        return removed
    }
}

const SPACING = 48
const ROW_WIDTH = 2400

/**
 * How a layer sizes: in its parent's stack (the symbol's own, for the root) stretched across, to its content, or as
 * captured; outside a stack, to its content where it hugs it. Set before its stack lays it out, or the stack sizes it
 * to its content first.
 */
function size(made: sketch.Layer, layer: Layer, parentLayer: Layer | undefined) {
    if (layer.absolute && parentLayer?.layout) {
        made.ignoresStackLayout = true
    }
    // An instance sizes as its symbol does, e.g. a button that grows with its label.
    const hug = layer.layout ? layer.layout.hug : layer.ref?.hug ?? { width: layer.kind === 'text' && layer.textSizing === 'auto', height: layer.kind === 'text' }
    const inStack = (!parentLayer || !!parentLayer.layout) && !layer.absolute
    const column = !parentLayer?.layout || parentLayer.layout.direction === 'column'
    const fill = inStack && !!layer.fill
    // One that grows takes the room its parent leaves along its main axis, e.g. a list item's title.
    const grow = inStack && !!parentLayer && !!layer.grow
    made.horizontalSizing = (fill && column) || (grow && !column) ? sketch.FlexSizing.Fill : hug.width ? sketch.FlexSizing.Fit : sketch.FlexSizing.Fixed
    made.verticalSizing = (fill && !column) || (grow && column) ? sketch.FlexSizing.Fill : hug.height ? sketch.FlexSizing.Fit : sketch.FlexSizing.Fixed
}

/**
 * A symbol's content fills it where it doesn't size to its content, so its instances can be drawn larger or smaller,
 * e.g. a full-width input; where it does, e.g. a button's, they grow with their text.
 */
function stretch(layer: Layer, made: sketch.Layer) {
    // A frame without a layout of its own keeps its size, e.g. a divider's, whose lines are placed in it.
    const hug = layer.layout ? layer.layout.hug : { width: false, height: false }
    made.horizontalSizing = hug.width ? sketch.FlexSizing.Fit : sketch.FlexSizing.Fill
    // A row centred across, e.g. a button or an input, keeps its height, so a symbol of another size brings its own;
    // one aligned to its top, e.g. a textarea, stretches to the height it's drawn at.
    const centredRow = layer.layout?.direction === 'row' && layer.layout.align === 'center'
    made.verticalSizing = hug.height ? sketch.FlexSizing.Fit : centredRow ? sketch.FlexSizing.Fixed : sketch.FlexSizing.Fill
}

/** Which overrides a symbol's users set: the styles that are its parameters, its texts and icons. */
function lockOverrides(made: sketch.SymbolMaster, root: Layer) {
    const layers = new Map<string, Layer>()
    const visit = (layer: Layer) => {
        layers.set(layer.name, layer)
        layer.children.forEach(visit)
    }
    visit(root)
    // The component of the kit inside this one, if any.
    const holdsKitSymbol = [...layers.values()].some((layer) => layer.kind === 'ref' && !!layer.ref?.symbol)
    for (const override of made.overrides) {
        const depth = override.path.split('/').length
        const layer = layers.get(override.affectedLayer.name)
        let editable = false
        if (depth === 1 && layer) {
            editable =
                (override.property === 'stringValue' && layer.kind === 'text') ||
                ((override.property === 'layerStyle' || override.property === 'textStyle') && !!layer.styled) ||
                (override.property === 'fillColor' && layer.kind === 'icon' && !!layer.styled) ||
                // A text's colour is its look; its font comes with the symbol's size.
                (override.property === 'textColor' && layer.kind === 'text' && !!layer.tinted) ||
                // A component of the kit inside this one can be swapped, e.g. for another size or shape.
                (override.property === 'symbolID' && layer.kind === 'ref' && !!layer.ref?.symbol)
        }
        // An icon's glyph can be swapped for another icon.
        if (depth === 1 && override.property === 'symbolID' && override.affectedLayer.name.endsWith(' Glyph')) {
            editable = true
        }
        // A picture, e.g. a user's, can be the design's own.
        if (depth === 1 && override.property === 'image' && override.affectedLayer.type === 'Image') {
            editable = true
        }
        // Inside a component of the kit: what its own symbol lets its users set, two levels deep at most.
        if (depth === 2) {
            editable = holdsKitSymbol && ['stringValue', 'layerStyle', 'textStyle', 'fillColor', 'textColor', 'image'].includes(override.property)
        }
        override.editable = editable
    }
}

function idsOf(made: sketch.SymbolMaster): Record<string, string> {
    const ids: Record<string, string> = {}
    const visit = (layers: sketch.Layer[], parentPath: string) => {
        const seen: Record<string, number> = {}
        for (const layer of layers) {
            const path = pathOf(parentPath, layer.name, seen)
            ids[path] = layer.id
            visit(childrenOf(layer), path)
        }
    }
    visit(made.layers, '')
    return ids
}
