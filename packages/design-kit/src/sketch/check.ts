import sketch = require('sketch')

import type { CheckFinding, CheckOptions, CheckRow, KitCheck } from '../kit.ts'
import { childrenOf, fileFormatOf, hexOf, isLocal, openDocument } from './document.ts'
import type { FileLayer } from './file-format.ts'

/**
 * Checks a design made with the Lyra design kit for what goes beyond its theme, for the designer to keep it consistent
 * and the developer to know what to build: colours that aren't the kit's colour variables, texts without a text style
 * or with one of the design's own, instances given another component's look, symbols of the design's own, detached or
 * changed copies of the kit's symbols, and components composed from the kit's parts and styles, e.g. a card. Each is
 * listed with where it is and what it takes in the app, on a Check page and in the result, as JSON.
 */
export function checkDesign(kit: KitCheck, options: CheckOptions): string {
    const doc = openDocument(options.document)
    const findings: CheckFinding[] = []

    // The colour variables the design can use, its own and the kit's, by their colours, for the nearest to a colour.
    // A design that uses the kit as a library has the kit's as those its styles and symbols use, in the kit's theme,
    // besides its own.
    const swatchColours = new Map(doc.swatches.map((swatch) => [swatch.name, String(swatch.color).toLowerCase()]))
    const collect = (style: sketch.Style) => {
        for (const paint of [...style.fills, ...style.borders]) {
            if (paint.swatch && !swatchColours.has(paint.swatch.name)) {
                swatchColours.set(paint.swatch.name, String(paint.swatch.color).toLowerCase())
            }
        }
    }
    doc.sharedLayerStyles.forEach((shared) => collect(shared.style))
    const walkStyles = (layer: sketch.Layer) => {
        if (layer.style) {
            collect(layer.style)
        }
        childrenOf(layer).forEach(walkStyles)
    }
    doc.getSymbols().forEach(walkStyles)
    const swatches = [...swatchColours].map(([name, color]) => ({ name, color }))
    const channels = (hex: string) => [1, 3, 5, 7].map((at) => parseInt(hex.slice(at, at + 2) || 'ff', 16))
    // The nearest colour variable, where one is close enough to be what was meant: a colour far from all of them, e.g.
    // an ink of the design's own, is a colour of its own, not a variable's.
    const CLOSE = 24
    const nearest = (hex: string) => {
        const [r = 0, g = 0, b = 0, a = 0] = channels(hex)
        let best: (typeof swatches)[number] | undefined
        let distance = Infinity
        for (const swatch of swatches) {
            const [sr = 0, sg = 0, sb = 0, sa = 0] = channels(swatch.color)
            // Weighted as the eye weighs the channels, roughly.
            const next = 2 * (r - sr) ** 2 + 4 * (g - sg) ** 2 + 3 * (b - sb) ** 2 + 3 * (a - sa) ** 2
            if (next < distance) {
                distance = next
                best = swatch
            }
        }
        return Math.sqrt(distance / 3) <= CLOSE ? best : undefined
    }
    const cssVariable = (name: string) => (kit.swatches[name] ? `var(--${kit.swatches[name]})` : undefined)

    /** Where a layer is, by its board and the groups it's in. */
    const placeOf = (layer: sketch.Layer) => {
        const path: string[] = []
        for (let at: sketch.Group | sketch.Page = layer.parent; at.type !== 'Page'; at = at.parent) {
            path.unshift(at.name)
        }
        return path.join(' › ')
    }

    /** A layer's size, or that it covers its board, e.g. a page's background on screens of every height. */
    const sizeOf = (layer: sketch.Layer) => {
        const board = layer.parent as sketch.Group
        const covers = board.type === 'Artboard' && layer.frame.x <= 0 && layer.frame.y <= 0 && layer.frame.x + layer.frame.width >= board.frame.width && layer.frame.y + layer.frame.height >= board.frame.height
        return covers ? 'the whole board' : `${Math.round(layer.frame.width)} × ${Math.round(layer.frame.height)}`
    }

    const add = (kind: string, layer: sketch.Layer, detail: string, app: string) => findings.push({ kind, layer: layer.name, id: layer.id, place: placeOf(layer), detail, app })

    /**
     * The colours that aren't colour variables in a layer as the file keeps it: its fills', borders' and text's, and
     * with `deep`, those of everything in it.
     */
    const looseColours = (data: FileLayer, deep = false): string[] => {
        const style = data.style ?? {}
        const colours: string[] = []
        for (const paint of [...(style.fills ?? []), ...(style.borders ?? [])]) {
            if (paint.isEnabled !== false && paint.fillType === 0 && paint.color && !paint.color.swatchID && paint.color.alpha > 0) {
                colours.push(hexOf(paint.color))
            }
        }
        const text = style.textStyle?.encodedAttributes.MSAttributedStringColorAttribute
        if (data._class === 'text' && text && !text.swatchID) {
            colours.push(hexOf(text))
        }
        return deep ? [...new Set([...colours, ...(data.layers ?? []).flatMap((child) => looseColours(child, true))])] : colours
    }
    /** A colour with the colour variable nearest to it, e.g. `#141110ff, nearest Background/Basic/3 (#151211ff)`. */
    const colourText = (colour: string) => {
        const close = nearest(colour)
        return `${colour}${close ? `, nearest ${close.name} (${close.color})` : ', no colour variable near it'}`
    }
    /** Whether two `#rrggbbaa` colours are the same, but for the rounding of a channel. */
    const sameColour = (a: string, b: string | undefined) => !!b && [1, 3, 5, 7].every((at) => Math.abs(parseInt(a.slice(at, at + 2), 16) - parseInt(b.slice(at, at + 2), 16)) <= 1)
    /** The colour a symbol's text or icon has of its own, where an override would change it. */
    const ownColourOf = (layer: sketch.Layer, property: string): string | undefined => {
        // A layer of a library's symbol can't be exported, so its colour is read as the API gives it.
        try {
            const style = layer.style
            const tint = style.tint && 'color' in style.tint ? style.tint.color : style.tint?.swatch.color
            const colour = property === 'textColor' ? style.textColor : tint ?? style.fills.find((fill) => fill.enabled !== false)?.color
            return colour ? String(colour).toLowerCase() : undefined
        } catch {
            return undefined
        }
    }

    /**
     * Whether a layer is a drawing and nothing else: a shape or an image, or a group of them, e.g. a logo, which the app
     * builds as one element.
     */
    const isDrawing = (layer: sketch.Layer): boolean =>
        layer.type === 'ShapePath' || layer.type === 'Shape' || layer.type === 'Image' || (layer.type === 'Group' && !kitSymbols[layer.name] && childrenOf(layer).length > 0 && childrenOf(layer).every(isDrawing))

    const kitSymbols = kit.symbols
    // The kit has the symbols as its own; a design has them from the kit, as a library.
    const isKitDocument = doc.getSymbols().some((symbol) => isLocal(symbol) && symbol.name === 'Button/Medium/Rectangle')

    /** The kit's components of the nested instances an override reaches into, with their symbols swapped or not. */
    const heldComponents = (layer: sketch.SymbolInstance, override: sketch.Override): string[] => {
        const ids = override.path.split('/')
        const found: string[] = []
        let master = layer.master
        for (let depth = 1; depth < ids.length && master; depth++) {
            const path = ids.slice(0, depth).join('/')
            const id = ids[depth - 1]
            const swap = layer.overrides.find((candidate) => candidate.property === 'symbolID' && candidate.path === path && !candidate.isDefault)
            const nested = (master.layers ?? []).flatMap(function inner(child: sketch.Layer): sketch.Layer[] {
                return child.id === id ? [child] : childrenOf(child).flatMap(inner)
            })[0] as sketch.SymbolInstance | undefined
            const symbolId = swap ? String(swap.value) : nested?.symbolId
            master = symbolId ? doc.getSymbolMasterWithID(symbolId) : undefined
            const component = master ? kitSymbols[master.name] : undefined
            if (component) {
                found.push(component)
            }
        }
        return found
    }

    const visitInstance = (layer: sketch.SymbolInstance) => {
        const master = layer.master
        if (!master) {
            return
        }
        // The kit's icons are its own too, e.g. Icon/Outline/star.
        const component = kitSymbols[master.name] ?? (master.name.startsWith('Icon/') ? 'Icon' : undefined)
        if (!component) {
            add('Own component', layer, `An instance of ${master.name}, which isn't the kit's`, 'The design\'s own component: build it with Lyra\'s components or as custom markup and CSS.')
            return
        }
        // A look of another component, e.g. a card's style on a button, isn't one the component has in the app.
        for (const override of layer.overrides) {
            if (override.isDefault || (override.property !== 'layerStyle' && override.property !== 'textStyle')) {
                continue
            }
            const shared = override.property === 'layerStyle' ? doc.getSharedLayerStyleWithID(override.value) : doc.getSharedTextStyleWithID(override.value)
            const owner = shared ? kit.styles[shared.name] : undefined
            // A look of a component the instance holds is that component's, e.g. a select's value in a field, as is one
            // its symbols draw, e.g. a form field's input's.
            if (shared && owner !== component && owner !== 'typography' && !kit.usedBy[shared.name]?.includes(component) && !heldComponents(layer, override).includes(owner ?? '')) {
                add('Other look', layer, `${master.name}'s ${override.affectedLayer.name} has ${shared.name}, ${owner ? `a look of ${owner}` : 'a style of the design\'s own'}`, `Custom CSS for the ${component}'s ${override.affectedLayer.name}.`)
            }
        }
        // A colour of its own on a part, e.g. a star's straw, isn't one of the component's looks.
        for (const override of layer.overrides) {
            if (override.isDefault || (override.property !== 'fillColor' && override.property !== 'textColor')) {
                continue
            }
            const colour = String(override.value ?? '').toLowerCase()
            // A colour the part has in the symbol anyway, e.g. a filled button's label, changes nothing.
            if (!swatches.some((swatch) => swatch.color === colour) && !sameColour(colour, ownColourOf(override.affectedLayer, override.property))) {
                const close = nearest(colour)
                const variable = close && cssVariable(close.name)
                add('Colour', layer, `${master.name}'s ${override.affectedLayer.name} in ${colour}${close ? `, nearest ${close.name} (${close.color})` : ''}`, `Custom CSS for the ${component}'s ${override.affectedLayer.name}, e.g. its colour${variable ? ` or ${variable}` : ''}.`)
            }
        }
        const style = layer.style
        if ((style.opacity !== undefined && style.opacity < 1) || style.shadows.some((shadow) => shadow.enabled !== false) || style.blur?.enabled) {
            add('Instance style', layer, `${master.name} with its own opacity, shadow or blur`, `Custom CSS for this ${component}.`)
        }
    }

    const visit = (layer: sketch.Layer) => {
        if (layer.type === 'SymbolInstance') {
            visitInstance(layer as sketch.SymbolInstance)
            return
        }
        // A group or frame named like a kit symbol, with its parts, is a copy of it, detached from the kit; one of the
        // design's own content that's only named so, e.g. a card's body, isn't.
        const parts = kit.parts[layer.name]
        const named = childrenOf(layer).map((child) => child.name)
        const copied = layer.type === 'Group' && kitSymbols[layer.name] && (!parts || (named.length > 0 && named.every((name) => parts.includes(name)))) ? kitSymbols[layer.name] : undefined
        if (copied) {
            add('Detached', layer, `A detached copy of ${layer.name}`, `Lyra's ${copied} with the inputs the kit's map gives, and custom CSS for what was changed.`)
        }
        // The theme's backdrop under a dialog, as the guide composes one: the dialog's own in the app.
        if (layer.sharedStyle?.name === 'Effect/Backdrop' || (layer.style?.fills ?? []).some((fill) => fill.swatch?.name === 'Effect/Backdrop')) {
            add('Composed', layer, 'A backdrop with Effect/Backdrop', 'The backdrop a dialog or a drawer opens over: Lyra draws it, `overlay-backdrop-background-color`.')
            return
        }
        // A frame with a component's style, e.g. a card's, holding the design's content, as the guide composes them: that
        // component in the app.
        const styled = layer.type === 'Group' && !copied && layer.sharedStyle ? kit.styles[layer.sharedStyle.name] : undefined
        if (styled && styled !== 'typography' && styled !== 'the kit' && layer.sharedStyle) {
            add('Composed', layer, `${styled} composed from its parts, with ${layer.sharedStyle.name}`, `Lyra's ${styled}, with the inputs lyra-kit.json's layerStyles give for ${layer.sharedStyle.name}, holding the design's content.`)
            childrenOf(layer).forEach(visit)
            return
        }
        // A drawing made of shapes, e.g. a logo, is one element of the design's own, with the colours it uses.
        if (layer.type === 'Group' && !copied && isDrawing(layer)) {
            const data = fileFormatOf(layer)
            const count = (part: FileLayer): number => (part.layers?.length ? part.layers.reduce((total, child) => total + count(child), 0) : 1)
            const colours = looseColours(data, true)
            add(
                'Own drawing',
                layer,
                `${sizeOf(layer)}, ${count(data)} shapes${colours.length ? `, in ${colours.slice(0, 4).map(colourText).join('; ')}${colours.length > 4 ? ` and ${colours.length - 4} more` : ''}` : ''}`,
                'The design\'s own element, e.g. an SVG or an image in the app, with the theme\'s variables for colours that follow the theme.'
            )
            return
        }
        // A shape or a frame that draws something is the design's own, e.g. a top bar or a book cover, however it's
        // coloured: what the app builds as its own markup and CSS.
        const look = layer.style as sketch.Style | undefined
        const draws = !!look && (look.fills.some((fill) => fill.enabled !== false) || look.borders.some((border) => border.enabled !== false))
        if ((layer.type === 'ShapePath' || layer.type === 'Shape' || (layer.type === 'Group' && !copied)) && draws) {
            const radii = look.corners.radii.filter(Boolean)
            const shared = layer.sharedStyle ? `, ${layer.sharedStyle.name}` : ''
            add('Own drawing', layer, `${sizeOf(layer)}${radii.length ? `, corners ${radii.join(' ')}` : ''}${shared}`, 'The design\'s own element: markup and CSS in the app, with the theme\'s variables for its colours.')
        }
        if (layer.type === 'Image') {
            add('Own drawing', layer, `An image, ${sizeOf(layer)}`, 'An image in the app.')
        }
        // A text style of the design's own, e.g. a display size or a third typeface: a typography class of the app's own.
        const kitTextStyle = (name: string) => !!kit.styles[name] || kit.typography.some((prefix) => name.startsWith(`${prefix}/`))
        const ownTextStyle = layer.type === 'Text' && layer.sharedStyle && !kitTextStyle(layer.sharedStyle.name) ? layer.sharedStyle : undefined
        if (ownTextStyle) {
            const attributes = fileFormatOf(layer).style?.textStyle?.encodedAttributes
            const font = attributes?.MSAttributedStringFontAttribute?.attributes
            const transform = ['', 'uppercase', 'lowercase'][attributes?.MSAttributedStringTextTransformAttribute ?? 0]
            const textLook = [
                font ? `${font.name} ${Math.round(font.size * 100) / 100} px` : undefined,
                attributes?.paragraphStyle?.minimumLineHeight ? `line ${attributes.paragraphStyle.minimumLineHeight} px` : undefined,
                attributes?.kerning ? `spacing ${Math.round(attributes.kerning * 100) / 100} px` : undefined,
                transform || undefined
            ]
            add('Own text style', layer, `${ownTextStyle.name}: ${textLook.filter(Boolean).join(', ')}`, 'A typography class of the app\'s own, with this font, size, line height and spacing; its colour as the design gives it.')
        }
        if (layer.type === 'Text' && !layer.sharedStyle) {
            // By how it looks, so texts that look alike, e.g. every print's frame code, are one style to make.
            const attributes = fileFormatOf(layer).style?.textStyle?.encodedAttributes
            const font = attributes?.MSAttributedStringFontAttribute?.attributes
            const colour = attributes?.MSAttributedStringColorAttribute
            const textLook = [font ? `${font.name} ${Math.round(font.size * 100) / 100} px` : undefined, attributes?.paragraphStyle?.minimumLineHeight ? `line ${attributes.paragraphStyle.minimumLineHeight} px` : undefined, colour ? hexOf(colour) : undefined]
            add('Text without a style', layer, textLook.filter(Boolean).join(', '), `A text style, or a typography class and custom CSS, e.g. for "${String((layer as sketch.Text).text).slice(0, 30)}".`)
        }
        if (layer.type !== 'Artboard') {
            for (const colour of looseColours(fileFormatOf(layer))) {
                const close = nearest(colour)
                const variable = close && cssVariable(close.name)
                add('Colour', layer, colourText(colour), close?.color === colour && variable ? `${variable}: link it to ${close.name}.` : `A theme colour${variable ? `, e.g. ${variable}` : ''}, or a custom colour in CSS.`)
            }
        }
        childrenOf(layer).forEach(visit)
    }

    // The kit's own pages, and its boards elsewhere, e.g. a design's Theme board, aren't the design.
    for (const page of doc.pages.filter((candidate) => !kit.pages.includes(candidate.name))) {
        page.layers.filter((layer) => layer.name !== 'Theme' && layer.name !== 'Check').forEach(visit)
    }

    // A design's own copy of a kit symbol, changed from the kit's: its instances aren't the kit's any more.
    if (!isKitDocument) {
        for (const symbol of doc.getSymbols().filter((candidate) => isLocal(candidate) && kitSymbols[candidate.name])) {
            add('Changed symbol', symbol, `A copy of ${symbol.name} in the design, not the kit's`, `Lyra's ${kitSymbols[symbol.name]}, with custom CSS for what was changed.`)
        }
    }

    if (options.board !== false) {
        writeCheckPage(doc, findings)
    }

    const counts: Record<string, number> = {}
    for (const finding of findings) {
        counts[finding.kind] = (counts[finding.kind] ?? 0) + 1
    }
    // Every finding, for whoever builds the design, e.g. an agent, in the document's settings, and the rows the Check
    // page lists them in, the same thing on several boards once.
    const rows = [...new Set(findings.map((finding) => finding.kind))].flatMap((kind) => rowsOf(findings.filter((finding) => finding.kind === kind)))
    sketch.Settings.setDocumentSettingForKey(doc, 'lyra-check', { counts, total: findings.length, rows, findings, checked: new Date().toISOString() })
    return JSON.stringify({ counts, findings: findings.slice(0, options.limit ?? 200), total: findings.length })
}

/**
 * The findings of a kind as the Check page lists them: the same thing in the same place on several boards, e.g. a logo
 * on every screen, once, with the boards it's on.
 */
function rowsOf(items: CheckFinding[]): CheckRow[] {
    const rows = new Map<string, CheckRow>()
    for (const item of items) {
        const [board, ...rest] = item.place.split(' › ')
        // Instances of one symbol, e.g. ten book covers, are one row wherever they are, as are texts that look alike.
        const where = ['Own component', 'Text without a style', 'Own text style'].includes(item.kind) ? item.detail : [...rest, item.layer].join(' › ')
        const key = `${where}\n${item.detail}`
        const row = rows.get(key) ?? { kind: item.kind, where, detail: item.detail, app: item.app, boards: [], count: 0 }
        row.count++
        const on = board || item.layer
        if (!row.boards.includes(on)) {
            row.boards.push(on)
        }
        rows.set(key, row)
    }
    return [...rows.values()]
}

/** The findings on the document's Check page, by kind. */
function writeCheckPage(doc: sketch.Document, findings: CheckFinding[]) {
    const page = doc.pages.find((candidate) => candidate.name === 'Check') ?? new sketch.Page({ name: 'Check', parent: doc })
    page.layers.filter((layer) => layer.name === 'Check' || layer.name === 'Check draft').forEach((layer) => layer.remove())
    const kinds = [...new Set(findings.map((finding) => finding.kind))]
    const LIMIT = 60
    const ROW = 40
    const width = 1400
    // Written on a draft, then moved to a board made at their height: resizing a board scales what's on it.
    const sheet = new sketch.Artboard({ parent: page, name: 'Check draft', frame: { x: 0, y: -100000, width, height: 20000 } })
    const write = (text: string, x: number, top: number, w: number, size: number, weight: number, colour: string) => {
        const made = new sketch.Text({ parent: sheet, text, name: text.slice(0, 40) })
        made.style.fontFamily = 'Inter'
        made.style.fontSize = size
        made.style.fontWeight = weight
        made.style.lineHeight = Math.round(size * 1.45)
        made.style.textColor = colour
        made.fixedWidth = true
        made.frame = { x, y: top, width: w, height: made.frame.height }
        // As tall as its text wraps to at that width.
        made.adjustToFit()
        return made
    }
    write('Check', 64, 64, 1200, 28, 8, '#222b45ff')
    write(
        findings.length
            ? `${findings.length} things in this design go beyond the kit and its theme. Keep them if they're meant: they're what the app builds as the design's own. Link a colour to a colour variable, or give a text a text style, where it should follow the theme.`
            : 'Everything in this design comes from the kit and its theme.',
        64,
        112,
        1200,
        14,
        5,
        '#8f9bb3ff'
    )
    let y = 184
    for (const kind of kinds) {
        const items = findings.filter((finding) => finding.kind === kind)
        write(`${kind} (${items.length})`, 64, y, 1200, 16, 8, '#222b45ff')
        y += ROW
        const rows = rowsOf(items)
        for (const row of rows.slice(0, LIMIT)) {
            const boards = row.boards.length > 2 ? `${row.boards.slice(0, 2).join(', ')} and ${row.boards.length - 2} more` : row.boards.join(', ')
            const texts = [
                write(`${row.where || row.boards[0]}\non ${boards}${row.count > 1 ? ` (${row.count})` : ''}`, 64, y, 420, 12, 6, '#222b45ff'),
                write(row.detail, 500, y, 400, 12, 5, '#2e3a59ff'),
                write(row.app, 920, y, 420, 12, 5, '#8f9bb3ff')
            ]
            // As tall as its longest text, which wraps.
            y += Math.max(ROW, ...texts.map((text) => text.frame.height + 12))
        }
        if (rows.length > LIMIT) {
            write(`And ${rows.length - LIMIT} more: the document's lyra-check setting lists every one.`, 64, y, 1200, 12, 5, '#8f9bb3ff')
            y += ROW
        }
        y += 24
    }
    const board = new sketch.Artboard({ parent: page, name: 'Check', frame: { x: 0, y: 0, width, height: Math.ceil(y + 40) } })
    board.background = { enabled: true, includedInExport: true, color: '#ffffffff' }
    for (const layer of sheet.layers.slice()) {
        const frame = { ...layer.frame }
        layer.parent = board
        layer.frame = frame
    }
    sheet.remove()
}
