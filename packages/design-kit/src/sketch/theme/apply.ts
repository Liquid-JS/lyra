import sketch = require('sketch')

import { contrast, MINIMUM_CONTRAST } from '../../../../docs/src/app/blocks/components/theme-editor-block/palette.ts'
import type { Binding, KitTheme, LayerBindings, StyleMeasure, ThemeOptions, ThemeOutcome } from '../../kit.ts'
import { childrenOf, fileFormatOf, hexOf, isLocal, isStack, openDocument, pacer, settingOf } from '../document.ts'
import type { FileLayer } from '../file-format.ts'
import { writeThemeBoard, writeThemeCode, type BoardValues } from './board.ts'
import { colourIn, cssOf, derive, display, firstFamily, numberOf, partsOf, shadowKey, shadowsOf, valuesOf, weightOf, type Variables } from './values.ts'

/**
 * Applies a theme to a Sketch document made with the Lyra design kit, the way the app applies it: the theme's
 * variables are worked out from Lyra's formulas, e.g. a semi-round button's radius from `border-radius`, with the
 * theme's own values over them; a status's shades and transparent shades come from its 500 shade, and the greys from
 * basic 600, as the Theme Editor makes them. Then every colour variable takes its variable's value, and each style's
 * border and font, and each symbol's corners, padding and gaps, move as the kit recorded they follow the variables.
 * Symbols keep how their frames follow theme variables in their layers' settings (`lyra-bindings`).
 *
 * It changes only what follows the variables whose values changed since the theme was last applied, which the
 * document records as `lyra-theme-applied`: the first theme applied to a kit, or one applied with `full`, changes
 * everything. It works in Sketch's turns, and records what it did in the document's settings as `lyra-theme-result`
 * once it's done, for a script that can't wait for its promise, e.g. an MCP server's run-code tool, which returns at
 * once: `finished` when it's done, `error` if it failed. Without a theme it applies the one the document recorded,
 * with what the designer changed on its Theme board, e.g. after the kit is rebuilt.
 */
export async function applyTheme(kit: KitTheme, options: ThemeOptions): Promise<string> {
    const doc = openDocument(options.document)
    const recordResult = (result: object) => sketch.Settings.setDocumentSettingForKey(doc, 'lyra-theme-result', result)
    recordResult({ started: new Date().toISOString() })
    try {
        const outcome = await apply(doc, kit, options)
        recordResult({ ...outcome, finished: new Date().toISOString() })
        return JSON.stringify(outcome)
    } catch (error) {
        recordResult({ error: String(error), finished: new Date().toISOString() })
        throw error
    }
}

/** What the document recorded of its theme, for the app, and to apply it again. */
interface RecordedTheme {
    name?: string
    base?: string
    variables?: Variables
    css?: string
    scss?: string
}

/** The variables' values the document's styles and symbols were last given, with the kit data they were given with. */
interface AppliedValues {
    stamp?: string
    values?: Record<string, string>
}

/** How a symbol's frame follows the theme, as the kit's build recorded it, with what it was then. */
interface FrameBindings extends LayerBindings {
    at: { radius: number[], padding?: number[], gap?: number, width: number, height: number }
}

/** A binding's variables. */
const variablesOf = (binding: Binding): string[] => (binding.variable ? [binding.variable] : binding.terms?.map((term) => term.variable) ?? [])

/** Whether two `#rrggbbaa` colours differ by more than the rounding of a channel. */
const differentColours = (a: string, b: string | undefined) => !b || [1, 3, 5, 7].some((at) => Math.abs(parseInt(a.slice(at, at + 2), 16) - parseInt(b.slice(at, at + 2), 16)) > 1)

async function apply(doc: sketch.Document, kit: KitTheme, options: ThemeOptions): Promise<ThemeOutcome> {
    const pace = pacer()
    const warnings: string[] = []
    const counts = { colours: 0, layerStyles: 0, textStyles: 0, layers: 0 }
    // The first symbols whose layers changed, and text styles, to see what a theme moved.
    const changedSymbols = new Set<string>()
    const changedStyles = new Set<string>()

    const recorded = (sketch.Settings.documentSettingForKey(doc, 'lyra-theme') ?? {}) as RecordedTheme
    // The Lyra theme the theme is made over, as the Theme Editor starts from one: the kit's, or another, e.g. dark. The
    // kit is drawn in its own; a theme given without a base is made over the kit's, one recorded over the base it
    // recorded.
    const baseTheme = options.base ?? (options.theme ? undefined : recorded.base) ?? kit.theme
    if (baseTheme !== kit.theme && !kit.bases[baseTheme]) {
        throw new Error(`No base theme ${baseTheme}: the themes are ${[kit.theme, ...Object.keys(kit.bases)].join(', ')}`)
    }
    // The base theme's formulas, which the theme's own values go over.
    const baseFormulas: Variables = { ...kit.formulas, ...kit.bases[baseTheme] }

    // ---- The theme's variables ----

    // The Theme board as the file format keeps it, read in one call: what the designer changed on it, and what it shows.
    const boardPage = doc.pages.find((candidate) => candidate.name === 'Theme')
    const board = boardPage?.layers.find((layer) => layer.name === 'Theme' && layer.type === 'Artboard') as sketch.Artboard | undefined
    const boardData = board ? fileFormatOf(board) : undefined

    // The theme's own values: those given, or those the document recorded with what the designer changed on its Theme
    // board: a value's text, empty for the theme's own again, or a colour's chip.
    const given: Variables = { ...(options.theme ?? recorded.variables ?? {}) }
    if (boardData && !options.theme) {
        // Each value and chip counts where it's no longer what the board showed: a row's chip and text both stand for
        // its variable, and the one the designer changed wins.
        const shownGiven = { ...given }
        const shown = valuesOf({ ...baseFormulas, ...derive(shownGiven, baseFormulas) })
        const visitBoard = (data: FileLayer) => {
            ;(data.layers ?? []).forEach(visitBoard)
            const match = /^--([\w-]+)( colour)?$/.exec(data.name)
            const variable = match?.[1]
            if (!variable) {
                return
            }
            if (match[2]) {
                const fill = data.style?.fills?.find((candidate) => candidate.isEnabled !== false)
                const colour = fill?.color ? hexOf(fill.color) : undefined
                if (colour && differentColours(colour, colourIn(shown(variable)))) {
                    given[variable] = colour.endsWith('ff') ? colour.slice(0, 7) : colour
                }
                return
            }
            const text = (data.attributedString?.string ?? '').trim()
            if (text === display(shownGiven[variable] ?? baseFormulas[variable] ?? '')) {
                return
            }
            if (text === '') {
                delete given[variable]
            } else {
                given[variable] = cssOf(text, kit.formulas)
            }
        }
        visitBoard(boardData)
    }
    // A value that's its variable's formula in the base theme, however it's written, isn't the theme's own.
    const flat = (value: string) => value.replace(/\s+/g, '')
    for (const variable of Object.keys(given)) {
        const formula = baseFormulas[variable]
        const value = given[variable] ?? ''
        if (formula !== undefined && (flat(value) === flat(formula) || flat(cssOf(display(formula), kit.formulas)) === flat(value))) {
            delete given[variable]
        }
    }
    const own = derive(given, baseFormulas)
    const themed = valuesOf({ ...baseFormulas, ...own })
    const plain = valuesOf(kit.formulas)

    // ---- What changed ----

    // The variables' values now, and those the document's styles and symbols were last given: only what follows a
    // variable whose value changed needs to change, unless the kit's data changed since, e.g. it was rebuilt.
    const current: Record<string, string> = {}
    for (const variable of new Set([...Object.keys(baseFormulas), ...Object.keys(own)])) {
        current[variable] = themed(variable) ?? ''
    }
    const applied = (sketch.Settings.documentSettingForKey(doc, 'lyra-theme-applied') ?? {}) as AppliedValues
    const previous = !options.full && applied.stamp === kit.stamp ? applied.values : undefined
    const moved = (variable: string) => !previous || previous[variable] !== (current[variable] ?? '')
    const bindingMoved = (binding: Binding) => variablesOf(binding).some(moved)

    // A typography text style, e.g. Heading/H1/Basic, by its typography's prefix, the longest that fits.
    const prefixes = Object.keys(kit.typography).sort((a, b) => b.length - a.length)
    const typographyOf = (name: string) => {
        const prefix = prefixes.find((candidate) => name === candidate || name.startsWith(`${candidate}/`))
        return prefix ? kit.typography[prefix] : undefined
    }
    /** Whether a variable a style follows changed: one the kit recorded, or its typography's. */
    const styleMoved = (name: string) => {
        const binding = kit.styles[name]
        if (binding && Object.values(binding.follows).some((bindings) => bindings.some(bindingMoved))) {
            return true
        }
        const category = typographyOf(name)
        return !!category && [...['font-size', 'line-height', 'font-weight', 'font-family'].map((suffix) => `text-${category}-${suffix}`), `text-${category.split('-')[0]}-font-family`].some(moved)
    }

    /**
     * Where a bound measure goes with the theme: as far from what the kit drew as its variables moved from the kit's
     * theme's values, or, for a keyword or a font, its variable's value. The first way a style follows the theme
     * counts; a theme that gives its others other values is noted, as the kit's style stands for all of them.
     */
    function follow(at: number | string | undefined, bindings: Binding[], label: string): number | string | undefined {
        const valueFor = (one: Binding): number | string | undefined => {
            if (one.variable) {
                return themed(one.variable)
            }
            let value = Number(at)
            for (const term of one.terms ?? []) {
                const now = numberOf(partsOf(themed(term.variable) ?? '')[term.part] ?? '')
                const then = numberOf(partsOf(plain(term.variable) ?? '')[term.part] ?? '')
                if (now === undefined || then === undefined) {
                    return undefined
                }
                value += term.per * (now - then)
            }
            return Math.round(value * 100) / 100
        }
        const [binding, ...others] = bindings
        const chosen = binding ? valueFor(binding) : undefined
        if (others.some((other) => valueFor(other) !== chosen)) {
            warnings.push(`${label}: the theme sets it differently for some of the parts it stands for; the kit shows ${chosen}`)
        }
        return chosen
    }
    /** A bound length, in pixels. */
    const followLength = (at: number | undefined, binding: Binding, label: string): number | undefined => {
        const value = follow(at, [binding], label)
        return typeof value === 'number' ? value : undefined
    }

    // The symbols whose layout may change: those with texts in a style that follows a variable that changed, or frames
    // laid out by one, and those that hold them, e.g. a dialog holding a button. Their instances are sized again once
    // the styles and frames have changed, and their content's reach is measured before.
    const symbols = doc.getSymbols()
    const localSymbols = symbols.filter(isLocal)
    const localByName = new Map(localSymbols.map((symbol) => [symbol.name, symbol]))
    const users = new Map<string, string[]>()
    for (const [name, symbol] of Object.entries(kit.symbols)) {
        for (const used of symbol.uses ?? []) {
            users.set(used, [...(users.get(used) ?? []), name])
        }
    }
    let mayMove: sketch.SymbolMaster[]
    if (previous) {
        const movedStyles = new Map<string, boolean>()
        const textMoved = (name: string) => {
            if (!movedStyles.has(name)) {
                movedStyles.set(name, styleMoved(name))
            }
            return movedStyles.get(name)
        }
        const names = new Set<string>()
        const add = (name: string) => {
            if (!names.has(name)) {
                names.add(name)
                ;(users.get(name) ?? []).forEach(add)
            }
        }
        for (const [name, symbol] of Object.entries(kit.symbols)) {
            if (symbol.textStyles?.some(textMoved) || symbol.layout?.some(moved)) {
                add(name)
            }
        }
        mayMove = [...names].flatMap((name) => localByName.get(name) ?? [])
    } else {
        mayMove = localSymbols
    }
    mayMove = innermostFirst(mayMove, kit)

    // Fixed-size symbols drawn at another size inside symbols, e.g. a 20 px icon in a button: Sketch sizes them to
    // their symbol again when the theme changes what they show, so they're kept as they were.
    const stackSymbols = new Set(mayMove.length ? symbols.filter((symbol) => !!symbol.stackLayout).map((symbol) => symbol.symbolId) : [])
    const drawnSizes = new Map<string, { width: number, height: number }>()
    const recordSizes = (data: FileLayer) => {
        if (data._class === 'symbolInstance' && !stackSymbols.has(data.symbolID ?? '')) {
            const binding = settingOf<FrameBindings>(data, 'lyra-bindings')
            if (!(binding && (binding.width || binding.height))) {
                drawnSizes.set(data.do_objectID, { width: data.frame.width, height: data.frame.height })
            }
        }
        ;(data.layers ?? []).forEach(recordSizes)
    }
    // How far each symbol's content ran past it before the theme, which a symbol's content can outgrow.
    const overflowsBefore = new Map<string, number>()
    for (const symbol of mayMove) {
        const data = fileFormatOf(symbol)
        recordSizes(data)
        if (isStack(data)) {
            overflowsBefore.set(symbol.id, overflowOf(data))
        }
        await pace()
    }

    // ---- Colours ----

    const localSwatches = doc.swatches.filter(isLocal)
    // The colour variables by the theme variable they stand for.
    const swatchOfVariable = new Map<string, sketch.Swatch>()
    for (const swatch of localSwatches) {
        const variable = kit.swatches[swatch.name]
        if (!variable) {
            continue
        }
        swatchOfVariable.set(variable, swatch)
        const next = moved(variable) ? colourIn(themed(variable)) : undefined
        if (next && String(swatch.color).toLowerCase() !== next) {
            swatch.color = next
            counts.colours++
        }
    }

    // ---- Styles ----

    // Where a style is drawn to read and change it.
    const scratchPage = () => {
        const page = doc.pages.find((candidate) => candidate.name === 'Symbols') ?? doc.pages[0]
        if (!page) {
            throw new Error('The document has no pages')
        }
        return page
    }
    /**
     * The colour variable a colour takes, where the theme variable that sets it follows one with that colour, e.g.
     * Palette/Basic/800 for a header on `var(--color-basic-800)`; else none, and the colour is the style's own.
     */
    const swatchFor = (variable: string, colour: string | undefined): sketch.Swatch | undefined => {
        const seen = new Set<string>()
        for (let name: string | undefined = variable; name && !seen.has(name);) {
            seen.add(name)
            const swatch = swatchOfVariable.get(name)
            if (swatch && colourIn(themed(name)) === colour) {
                return swatch
            }
            const value: string | undefined = own[name] ?? baseFormulas[name]
            name = /^var\(--([\w-]+)\)$/.exec((value ?? '').trim())?.[1]
        }
        return undefined
    }

    /** A paint, a fill or a border, in a colour, linked to its colour variable if it has one; whether it changed. */
    const paint = (paints: sketch.Fill[], colour: string | undefined, swatch: sketch.Swatch | undefined): boolean => {
        const first = paints[0]
        if (!first || !colour) {
            return false
        }
        const linked = first.swatch ? first.swatch.name : undefined
        if (String(first.color).toLowerCase() === colour && linked === swatch?.name) {
            return false
        }
        first.color = colour
        if (swatch) {
            first.swatch = swatch
        }
        return true
    }

    for (const shared of doc.sharedLayerStyles) {
        const binding = kit.styles[shared.name]
        if (!binding || !styleMoved(shared.name) || !isLocal(shared)) {
            continue
        }
        await pace()
        const { at, follows } = binding
        const shape = new sketch.ShapePath({ parent: scratchPage(), frame: { x: -9999, y: -9999, width: 10, height: 10 } })
        shape.sharedStyle = shared
        shape.style.syncWithSharedStyle(shared)
        let changed = false
        const borders = shape.style.borders
        if (follows.borderWidth) {
            const width = follow(at.borderWidth, follows.borderWidth, shared.name)
            if (typeof width === 'number' && borders.some((border) => border.thickness !== width)) {
                borders.forEach((border) => (border.thickness = width))
                changed = true
            }
        }
        // A component's own colours, e.g. a header's background, where a theme sets them apart from what they follow.
        const borderVariable = follows.borderColor?.[0]?.variable
        if (borderVariable) {
            const colour = colourIn(themed(borderVariable))
            changed = paint(borders, colour, swatchFor(borderVariable, colour)) || changed
        }
        if (changed) {
            shape.style.borders = borders
        }
        const fillVariable = follows.fill?.[0]?.variable
        if (fillVariable) {
            const fills = shape.style.fills
            const colour = colourIn(themed(fillVariable))
            if (paint(fills, colour, swatchFor(fillVariable, colour))) {
                shape.style.fills = fills
                changed = true
            }
        }
        const shadowVariable = follows.shadow?.[0]?.variable
        if (shadowVariable) {
            const { outer, inner } = shadowsOf(themed(shadowVariable))
            if (shadowKey(shape.style.shadows) !== shadowKey(outer) || shadowKey(shape.style.innerShadows) !== shadowKey(inner)) {
                shape.style.shadows = outer
                shape.style.innerShadows = inner
                changed = true
            }
        }
        if (changed) {
            shared.style = shape.style
            shared.getAllInstancesLayers().forEach((layer) => layer.style.syncWithSharedStyle(shared))
            counts.layerStyles++
            changedStyles.add(shared.name)
        }
        shape.remove()
    }

    /**
     * A typography's measure as its variables set it, e.g. `text-heading-1-font-size`; a size's font is its base's,
     * e.g. a tiny button's the button typography's.
     */
    const TYPOGRAPHY_VARIABLES: Partial<Record<StyleMeasure, string>> = { size: 'font-size', lineHeight: 'line-height', weight: 'font-weight', family: 'font-family' }
    const typographyValue = (category: string, measure: StyleMeasure): number | string | undefined => {
        const suffix = TYPOGRAPHY_VARIABLES[measure]
        const value = suffix ? themed(`text-${category}-${suffix}`) ?? (measure === 'family' ? themed(`text-${category.split('-')[0]}-font-family`) : undefined) : undefined
        if (value === undefined || measure === 'family') {
            return value
        }
        return measure === 'weight' ? Number(value) || undefined : numberOf(value)
    }

    /**
     * A text's font as the document keeps it: its font's name and size, and its paragraph's line height, letter
     * spacing and case. The style's own getters don't report a font's size or weight where the font is variable, e.g.
     * Inter's.
     */
    const textSignature = (text: sketch.Text) => {
        const attributes = fileFormatOf(text).style?.textStyle?.encodedAttributes
        const font = attributes?.MSAttributedStringFontAttribute?.attributes
        return JSON.stringify([font?.name, font?.size, attributes?.paragraphStyle?.minimumLineHeight, attributes?.kerning, attributes?.MSAttributedStringTextTransformAttribute])
    }

    // The text styles whose fonts changed, which lay out the symbols that use them.
    const changedTextStyles = new Set<string>()
    for (const shared of doc.sharedTextStyles) {
        const binding = kit.styles[shared.name] ?? { at: {}, follows: {} }
        const category = typographyOf(shared.name)
        if ((!kit.styles[shared.name] && !category) || !styleMoved(shared.name) || !isLocal(shared)) {
            continue
        }
        await pace()
        const text = new sketch.Text({ parent: scratchPage(), text: 'Aa', frame: { x: -9999, y: -9999, width: 100, height: 40 } })
        text.sharedStyle = shared
        text.style.syncWithSharedStyle(shared)
        const style = text.style
        const before = textSignature(text)
        const { at, follows } = binding
        // What the kit recorded the style follows; else, for a typography style, its typography's variables.
        const value = (measure: StyleMeasure) => {
            const bindings = follows[measure]
            return bindings ? follow(at[measure], bindings, shared.name) : category ? typographyValue(category, measure) : undefined
        }
        const size = value('size')
        const lineHeight = value('lineHeight')
        const weight = value('weight')
        const letterSpacing = value('letterSpacing')
        const transform = value('transform')
        const family = value('family')
        // The family first: a weight is one of its faces, e.g. Inter's Bold, which a weight set before would look for in
        // the family it replaces.
        if (family) {
            style.fontFamily = firstFamily(String(family))
        }
        // As the theme gives them: a length worked out, or a variable's value.
        if (size !== undefined) {
            style.fontSize = size as number
        }
        if (lineHeight !== undefined) {
            style.lineHeight = lineHeight as number
        }
        if (weight !== undefined) {
            style.fontWeight = weightOf(Number(weight))
        }
        if (letterSpacing !== undefined) {
            style.kerning = letterSpacing as number
        }
        if (transform === 'none' || transform === 'uppercase' || transform === 'lowercase') {
            style.textTransform = transform
        }
        const after = textSignature(text)
        if (after !== before) {
            shared.style = style
            shared.getAllInstancesLayers().forEach((layer) => layer.style.syncWithSharedStyle(shared))
            counts.textStyles++
            changedStyles.add(`${shared.name}: ${before} → ${after}`)
            changedTextStyles.add(shared.name)
        }
        text.remove()
    }

    // ---- Symbols ----

    // Each bound frame's corners, padding and gap; its stack lays it out again, and its symbol's instances follow. A
    // symbol's frames are found in its file format, and only the way to them is read through the API.
    const laidOut = new Set<string>()
    const visit = (layer: sketch.Layer, data: FileLayer, master: sketch.SymbolMaster) => {
        const binding = settingOf<FrameBindings>(data, 'lyra-bindings')
        if (binding) {
            const at = binding.at
            let changed = false
            const corners = binding.radius
            if (corners) {
                const radii = at.radius.map((corner, index) => (corners[index] ? followLength(corner, corners[index], layer.name) : corner))
                if (radii.every((corner) => corner !== undefined) && radii.join() !== layer.style.corners.radii.join()) {
                    layer.style.corners.radii = radii.map((corner) => Math.max(0, corner))
                    changed = true
                }
            }
            const stack = layer.stackLayout
            if ((binding.padding || binding.gap) && stack && at.padding) {
                const padding = at.padding.map((side, index) => {
                    const one = binding.padding?.[index]
                    return one ? followLength(side, one, layer.name) : side
                })
                const gap = binding.gap ? followLength(at.gap, binding.gap, layer.name) : at.gap
                const [top = 0, right = 0, bottom = 0, left = 0] = padding.map((side) => Math.max(0, side ?? 0))
                // Sketch gives a padding that's the same all round as a number.
                const now = typeof stack.padding === 'number' ? { top: stack.padding, right: stack.padding, bottom: stack.padding, left: stack.padding } : stack.padding
                if (now.top !== top || now.right !== right || now.bottom !== bottom || now.left !== left || (gap !== undefined && stack.gap !== gap)) {
                    stack.padding = { top, right, bottom, left }
                    if (gap !== undefined) {
                        stack.gap = Math.max(0, gap)
                    }
                    stack.apply()
                    changed = true
                    laidOut.add(master.name)
                }
            }
            // A size the styles set, e.g. an alert's accent band or a selected menu item's indicator, in the dimensions
            // it's bound in: one the theme takes to 0 hides it, as it shows nothing; one drawn at 0 is a mark whose
            // content runs past it, e.g. a slider's end label, and shows. A layer with a stack of its own, e.g. a
            // badge, is as big as its content and padding make it.
            if (binding.width || binding.height) {
                const frame = layer.frame
                const width = binding.width ? followLength(at.width, binding.width, layer.name) : frame.width
                const height = binding.height ? followLength(at.height, binding.height, layer.name) : frame.height
                if (width !== undefined && height !== undefined) {
                    const hidden = (!!binding.width && at.width > 0 && width <= 0) || (!!binding.height && at.height > 0 && height <= 0)
                    if (layer.hidden !== hidden) {
                        layer.hidden = hidden
                        changed = true
                        laidOut.add(master.name)
                    }
                    if (!hidden && !stack && (Math.abs(frame.width - Math.max(0, width)) > 0.01 || Math.abs(frame.height - Math.max(0, height)) > 0.01)) {
                        // One at its parent's far edge stays there, e.g. a band along a bottom border.
                        const parent = layer.parent.type === 'Page' ? undefined : layer.parent.frame
                        const right = !!parent && Math.abs(frame.x + frame.width - parent.width) < 0.5 && frame.x > 0.5
                        const bottom = !!parent && Math.abs(frame.y + frame.height - parent.height) < 0.5 && frame.y > 0.5
                        const [w, h] = [Math.max(0, width), Math.max(0, height)]
                        layer.frame = { x: parent && right ? parent.width - w : frame.x, y: parent && bottom ? parent.height - h : frame.y, width: w, height: h }
                        changed = true
                        laidOut.add(master.name)
                    }
                }
            }
            if (changed) {
                counts.layers++
                changedSymbols.add(`${master.name} › ${layer.name}`)
            }
        }
        const children = childrenOf(layer)
        ;(data.layers ?? []).forEach((child, index) => {
            if (holdsBindings(child)) {
                // The API lists a layer's children as the file format does.
                const match = children[index]?.id === child.do_objectID ? children[index] : children.find((candidate) => candidate.id === child.do_objectID)
                if (match) {
                    visit(match, child, master)
                }
            }
        })
    }
    // The symbols with frames that follow a variable that changed, as the kit recorded them; not their starters, which
    // hold them.
    for (const [name, symbol] of Object.entries(kit.symbols)) {
        const master = localByName.get(name)
        if (master && (symbol.layout?.some(moved) || symbol.corners?.some(moved))) {
            const data = fileFormatOf(master)
            const children = master.layers
            ;(data.layers ?? []).forEach((child, index) => {
                const layer = children[index]
                if (layer && holdsBindings(child)) {
                    visit(layer, child, master)
                }
            })
            master.stackLayout?.apply()
            await pace()
        }
    }

    // ---- Boards ----

    /**
     * Instances of the symbols the theme changed, e.g. a card in its starters or a button in a dialog, as Sketch
     * doesn't resize them: each sized to its symbol's content again, and each stack laid out again, the innermost
     * first; twice, for symbols inside symbols. Fixed-size symbols, such as icons, keep the size their instance is drawn
     * at.
     */
    const refresh = (layer: sketch.Layer) => {
        childrenOf(layer).forEach(refresh)
        const drawn = drawnSizes.get(layer.id)
        if (drawn && (Math.abs(layer.frame.width - drawn.width) > 0.01 || Math.abs(layer.frame.height - drawn.height) > 0.01)) {
            layer.frame = { x: layer.frame.x, y: layer.frame.y, width: drawn.width, height: drawn.height }
        } else if (layer.type === 'SymbolInstance') {
            const instance = layer as sketch.SymbolInstance
            if (instance.master?.stackLayout) {
                instance.resizeWithSmartLayout()
            }
        }
        layer.stackLayout?.apply()
    }
    /**
     * A symbol that sizes to its content and whose content outgrew it, e.g. a dialog whose texts take a wider font: it
     * grows in the browser, and the symbol grows with it. One that takes its container's width doesn't, e.g. a list,
     * whose texts wrap there instead. Sketch doesn't size a symbol to parts that fill it, so it's sized as fixed, then
     * given back its own sizing. How far its content runs past it is measured against how far it did before the theme,
     * as parts can overlap on purpose, e.g. a form field's addons.
     */
    const fitContent = (symbol: sketch.SymbolMaster) => {
        const before = overflowsBefore.get(symbol.id)
        if (before === undefined) {
            return
        }
        const data = fileFormatOf(symbol)
        const room = Math.max(0, overflowOf(data)) - Math.max(0, before)
        if (room <= 0.5 || data.horizontalSizing !== sketch.FlexSizing.Fit) {
            return
        }
        symbol.horizontalSizing = sketch.FlexSizing.Fixed
        symbol.frame = { x: symbol.frame.x, y: symbol.frame.y, width: symbol.frame.width + room, height: symbol.frame.height }
        layOutFromTop(symbol)
        symbol.horizontalSizing = sketch.FlexSizing.Fit
        layOutFromTop(symbol)
        counts.layers++
        changedSymbols.add(`${symbol.name} › Width`)
    }
    // Those whose layout changed: their texts' styles or their frames changed, or they hold one that did. A first theme
    // lays out every symbol, as before.
    let moving: sketch.SymbolMaster[]
    if (previous) {
        const names = new Set<string>()
        const add = (name: string) => {
            if (!names.has(name)) {
                names.add(name)
                ;(users.get(name) ?? []).forEach(add)
            }
        }
        for (const [name, symbol] of Object.entries(kit.symbols)) {
            if (laidOut.has(name) || symbol.textStyles?.some((style) => changedTextStyles.has(style))) {
                add(name)
            }
        }
        moving = mayMove.filter((symbol) => names.has(symbol.name))
    } else {
        moving = counts.layers || counts.layerStyles || counts.textStyles || options.boards !== false ? mayMove : []
    }
    for (const each of [refresh, fitContent, refresh] as Array<(symbol: sketch.SymbolMaster) => void>) {
        for (const symbol of moving) {
            each(symbol)
            await pace()
        }
    }
    if (options.boards !== false) {
        // The boards that show a symbol whose layout changed; on the theme's background, as cards are, so their labels
        // read on a dark theme too.
        const boards = new Set(moving.map((symbol) => kit.symbols[symbol.name]?.board))
        const background = moved('background-basic-color-1') ? colourIn(themed('background-basic-color-1')) : undefined
        for (const page of doc.pages) {
            for (const starters of page.layers.filter((layer) => layer.type === 'Artboard' && / \/ Starters$/.test(layer.name)) as sketch.Artboard[]) {
                if (!previous || boards.has(starters.name)) {
                    relayout(starters)
                    await pace()
                }
                if (background && String(starters.background.color).toLowerCase() !== background) {
                    starters.background = { enabled: true, includedInExport: true, color: background }
                }
            }
        }
    }

    // ---- The Theme board ----

    const themeName = options.name ?? recorded.name ?? 'custom'
    if (options.board !== false) {
        const values: BoardValues = { themeName, baseTheme, given, baseFormulas, themed }
        const page = boardPage ?? new sketch.Page({ name: 'Theme', parent: doc })
        await writeThemeBoard(page, board, boardData, kit, values, pace)
    }

    // The theme, recorded for whoever builds from the document, as the Theme Editor gives it to an app: CSS variables
    // over the base theme, or the Sass that registers it, with the shades worked out; and the values it was given, to
    // apply it again after the kit is rebuilt.
    const { css, scss } = themeCode(themeName, baseTheme, own)
    sketch.Settings.setDocumentSettingForKey(doc, 'lyra-theme', { ...recorded, name: themeName, base: baseTheme, variables: given, css, scss })
    // What the styles and symbols now follow, to change only what moves next time.
    sketch.Settings.setDocumentSettingForKey(doc, 'lyra-theme-applied', { stamp: kit.stamp, values: current })

    // Where the theme makes text hard to read, as the Theme Editor warns: under 3:1.
    const CONTRASTS = [
        ...['primary', 'success', 'info', 'warning', 'danger'].map((status) => ['text-control-color', `color-${status}-500`, `filled ${status} buttons' and badges' text`] as const),
        ['text-basic-color', 'background-basic-color-1', 'text on cards'] as const,
        ['text-hint-color', 'background-basic-color-1', 'hint text on cards'] as const,
        ['header-text-color', 'header-background-color', 'the header\'s text'] as const
    ]
    for (const [text, background, what] of CONTRASTS) {
        // Where the theme sets either colour: the base theme's own are its own.
        if (themed(text) === plain(text) && themed(background) === plain(background)) {
            continue
        }
        const front = colourIn(themed(text))?.slice(0, 7)
        const back = colourIn(themed(background))?.slice(0, 7)
        const ratio = front && back ? contrast(front, back) : undefined
        if (ratio !== undefined && ratio < MINIMUM_CONTRAST) {
            warnings.push(`Contrast: ${text} ${front} on ${background} ${back} is ${ratio.toFixed(1)}:1, under ${MINIMUM_CONTRAST}:1, for ${what}`)
        }
    }

    // The theme's code for the app, beside the Theme board, to copy: a script can't write files. Written again only
    // where it changed.
    if (options.board !== false && (css !== recorded.css || scss !== recorded.scss || !doc.pages.some((page) => page.name === 'Theme' && page.layers.some((layer) => layer.name === 'Theme code')))) {
        writeThemeCode(doc, css, scss)
    }

    return { counts, changed: [...changedSymbols].slice(0, 12), changedStyles: [...changedStyles].slice(0, 12), warnings: warnings.slice(0, 20), warningCount: warnings.length }
}

/** Whether a layer, as the file format keeps it, or one inside it, follows the theme. */
function holdsBindings(data: FileLayer): boolean {
    return settingOf(data, 'lyra-bindings') !== undefined || (data.layers ?? []).some(holdsBindings)
}

/**
 * Symbols in the order their layouts depend on each other: those another holds first, e.g. a button before the dialog
 * that holds it, so each is laid out once what it holds has been.
 */
function innermostFirst(symbols: sketch.SymbolMaster[], kit: KitTheme): sketch.SymbolMaster[] {
    const byName = new Map(symbols.map((symbol) => [symbol.name, symbol]))
    const ordered: sketch.SymbolMaster[] = []
    const seen = new Set<string>()
    const place = (name: string) => {
        if (seen.has(name)) {
            return
        }
        seen.add(name)
        ;(kit.symbols[name]?.uses ?? []).forEach(place)
        const symbol = byName.get(name)
        if (symbol) {
            ordered.push(symbol)
        }
    }
    symbols.forEach((symbol) => place(symbol.name))
    return ordered
}

/**
 * Whether a layer, as the file format keeps it, can't be narrower than it's drawn: a text that sizes to its words, a
 * symbol, or a stack holding one.
 */
function rigid(data: FileLayer): boolean {
    if (!data.isVisible || data.flexItem?.ignoreLayout) {
        return false
    }
    if (data._class === 'text') {
        return data.horizontalSizing !== sketch.FlexSizing.Fixed
    }
    return data._class === 'symbolInstance' || (isStack(data) && (data.layers ?? []).some(rigid))
}

/**
 * How far a layer's rigid parts run past its stacks' padding, the furthest, from the layer as the file format keeps
 * it. Texts that wrap and frames without a layout aren't counted, as they take the room they're given, e.g. a QR
 * code's caption.
 */
function overflowOf(data: FileLayer): number {
    const parts = data._class === 'symbolInstance' ? [] : (data.layers ?? []).filter((part) => part.isVisible)
    const nested = Math.max(0, ...parts.map(overflowOf))
    if (data._class === 'symbolInstance' || !isStack(data)) {
        return nested
    }
    const right = data.rightPadding ?? 0
    return Math.max(nested, ...parts.filter(rigid).map((part) => part.frame.x + part.frame.width - (data.frame.width - right)))
}

/** Each stack laid out, the outermost first, so parts that fill their parent follow it. */
function layOutFromTop(layer: sketch.Layer) {
    if (layer.stackLayout && layer.type !== 'SymbolInstance') {
        layer.stackLayout.apply()
    }
    childrenOf(layer).forEach(layOutFromTop)
}

/**
 * Moves a board's rows down where a theme made what's in them bigger, e.g. cards with more padding, so they don't run
 * into the rows below; rows that still fit stay where they are, and the board grows with them.
 */
function relayout(starters: sketch.Artboard) {
    // A board's instances are as big as their symbols, which the theme may have changed, e.g. a card's.
    for (const item of starters.layers) {
        const size = item.type === 'SymbolInstance' ? (item as sketch.SymbolInstance).master?.frame : undefined
        if (size && (Math.abs(item.frame.width - size.width) > 0.5 || Math.abs(item.frame.height - size.height) > 0.5)) {
            item.frame = { x: item.frame.x, y: item.frame.y, width: size.width, height: size.height }
        }
    }
    // The control status's backdrop frames its instance, 12 all round.
    for (const backdrop of starters.layers.filter((item) => item.name === 'Control backdrop')) {
        const framed = starters.layers.find((item) => item.type === 'SymbolInstance' && Math.abs(item.frame.x - backdrop.frame.x - 12) < 1 && Math.abs(item.frame.y - backdrop.frame.y - 12) < 1)
        if (framed) {
            backdrop.frame = { x: backdrop.frame.x, y: backdrop.frame.y, width: framed.frame.width + 24, height: framed.frame.height + 24 }
        }
    }
    const rows: Array<{ top: number, items: sketch.Layer[] }> = []
    for (const item of starters.layers) {
        // The control status's backdrop frames its row, 12 above it.
        const top = item.frame.y + (item.name === 'Control backdrop' ? 12 : 0)
        const row = rows.find((candidate) => Math.abs(candidate.top - top) < 1)
        if (row) {
            row.items.push(item)
        } else {
            rows.push({ top, items: [item] })
        }
    }
    rows.sort((a, b) => a.top - b.top)
    let shift = 0
    let bottom = -Infinity
    for (const row of rows) {
        const top = Math.min(...row.items.map((item) => item.frame.y)) + shift
        if (top < bottom + 8) {
            shift += bottom + 16 - top
        }
        if (shift) {
            for (const item of row.items) {
                item.frame = { x: item.frame.x, y: item.frame.y + shift, width: item.frame.width, height: item.frame.height }
            }
        }
        bottom = Math.max(bottom, ...row.items.map((item) => item.frame.y + item.frame.height))
    }
    const height = Math.ceil(bottom + 64)
    if (height > starters.frame.height + 0.5) {
        // Resizing a board scales what's on it: its layers wait on the page meanwhile.
        const page = starters.parent
        const items = starters.layers.slice().map((item) => ({ item, frame: { ...item.frame } }))
        for (const { item, frame } of items) {
            item.parent = page
            item.frame = { x: starters.frame.x + frame.x, y: starters.frame.y + frame.y, width: frame.width, height: frame.height }
        }
        starters.frame = { x: starters.frame.x, y: starters.frame.y, width: starters.frame.width, height }
        for (const { item, frame } of items) {
            item.parent = starters
            item.frame = frame
        }
    }
}

/** The theme as the Theme Editor gives it to an app: CSS variables over the base theme, and the Sass that registers it. */
function themeCode(themeName: string, baseTheme: string, own: Variables): { css: string, scss: string } {
    const entries = Object.entries(own).sort(([a], [b]) => (a < b ? -1 : 1))
    const css = [`/* ${themeName}: CSS variables over Lyra's ${baseTheme} theme, loaded after its CSS. */`, `.nb-theme-${baseTheme} {`, ...entries.map(([key, value]) => `  --${key}: ${value};`), '}', ''].join('\n')
    const scss = [
        '@use \'sass:string\';',
        '@forward \'@liquid-js/lyr-core/styles/theming\';',
        '@use \'@liquid-js/lyr-core/styles/theming\' as *;',
        `@use '@liquid-js/lyr-core/styles/themes/${baseTheme}';`,
        '',
        '$nb-themes: nb-register-theme(',
        '  (',
        ...entries.map(([key, value]) => (key.startsWith('font-family') ? `    ${key}: string.unquote('${value.replace(/'/g, '\\\'')}'),` : `    ${key}: ${value},`)),
        '  ),',
        `  ${themeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'custom'},`,
        `  ${baseTheme}`,
        ');',
        ''
    ].join('\n')
    return { css, scss }
}
