import sketch = require('sketch')

import type { MirrorOptions } from '../kit.ts'
import { isMirroredBoard, MIRROR_OF, MIRRORED, MIRRORED_BOARD, openDocument, restoreOverrides, savedOverrides } from './document.ts'

/**
 * Mirrors a design's screens for right to left, as Lyra lays a page out with `dir="rtl"`: a copy of each screen, beside
 * the others, with its layers mirrored across it, and its kit components swapped for mirrored copies of their symbols.
 * Sketch has no right-to-left layout, so the copies are made once, on the document's Right to left page, for the kit's
 * symbols the screens use; another run reuses them. The design's own symbols, e.g. a logo, stay as they are. Arrows
 * and chevrons that point along the line point the other way, as the app's do; texts align to the right, and keep
 * their own direction.
 */

const { AlignItems, JustifyContent, Direction } = sketch.StackLayout

/** An icon that points along the line, e.g. `Icon/Outline/arrow-back`, and the one that points the other way. */
const DIRECTIONAL = /^Icon\/[^/]+\/(arrow|chevron|arrowhead|diagonal-arrow|corner|arrow-ios)-/
const opposite = (name: string) => name.replace(/\b(left|right|back|forward)\b/g, (word) => ({ left: 'right', right: 'left', back: 'forward', forward: 'back' })[word] ?? word)

const swapEnds = (value: number, start: number, end: number) => (value === start ? end : value === end ? start : value)

export function mirrorDesign(components: string[], options: MirrorOptions): string {
    const doc = openDocument(options.document)
    // The kit's symbols, by their components' names, e.g. Button/Medium/Rectangle: the design's own, e.g. a logo, stay
    // as they are.
    const isKits = (name: string) => components.some((component) => name === component || name.startsWith(`${component}/`))
    const masters = new Map<string, sketch.SymbolMaster>()
    let page = doc.pages.find((candidate) => candidate.name === MIRRORED)
    // The copies made before, by the symbol they mirror.
    for (const layer of page?.layers ?? []) {
        const of = sketch.Settings.layerSettingForKey(layer, MIRROR_OF)
        if (layer.type === 'SymbolMaster' && typeof of === 'string') {
            masters.set(of, layer as sketch.SymbolMaster)
        }
    }
    const made: string[] = []
    let below = Math.max(0, ...(page?.layers ?? []).map((layer) => layer.frame.y + layer.frame.height + 48))

    /** A symbol by its name, the document's or its library's, e.g. the icon an arrow becomes. */
    const symbolNamed = (name: string, library: sketch.Library | null): sketch.SymbolMaster | undefined => {
        const own = doc.getSymbols().find((candidate) => candidate.name === name)
        if (own || !library) {
            return own
        }
        return library.getImportableSymbolReferencesForDocument(doc).find((reference) => reference.name === name)?.import()
    }

    /** The symbol that shows a symbol right to left: an arrow's opposite, a mirrored copy, or the symbol itself. */
    const mirroredSymbol = (master: sketch.SymbolMaster): sketch.SymbolMaster => {
        if (master.name.startsWith('Icon/')) {
            return DIRECTIONAL.test(master.name) ? symbolNamed(opposite(master.name), master.getLibrary()) ?? master : master
        }
        if (master.name.startsWith(`${MIRRORED}/`) || !isKits(master.name)) {
            return master
        }
        const known = masters.get(master.symbolId)
        if (known) {
            return known
        }
        page ??= new sketch.Page({ name: MIRRORED, parent: doc })
        const copy = master.duplicate() as sketch.SymbolMaster
        copy.parent = page
        copy.name = `${MIRRORED}/${master.name}`
        copy.frame = { ...copy.frame, x: 0, y: below }
        below += copy.frame.height + 48
        sketch.Settings.setLayerSettingForKey(copy, MIRROR_OF, master.symbolId)
        masters.set(master.symbolId, copy)
        made.push(master.name)
        mirrorContent(copy)
        return copy
    }

    /** A container's layers mirrored across it: a stack's order and alignment, the others' places. */
    const mirrorContent = (container: sketch.Group) => {
        const width = container.frame.width
        const stack = container.stackLayout
        const layers = [...container.layers]
        for (const layer of layers) {
            // Placed by its parent, not its stack: at the other side, pinned to it as the kit pins it, as Sketch doesn't
            // give a layer's pins back, e.g. a progress bar's value, which stays at the end its instances are resized to.
            if (!stack || layer.ignoresStackLayout) {
                const { x: at, width: extent } = layer.frame
                const x = width - at - extent
                layer.frame = { ...layer.frame, x }
                layer.horizontalPins = extent >= width / 2 - 0.5 ? sketch.Pin.All : x + extent / 2 > width / 2 ? sketch.Pin.Max : sketch.Pin.Min
            }
            mirrorLayer(layer)
        }
        if (!stack) {
            return
        }
        // A row runs the other way; a column's items align to the other side.
        if (stack.direction === Direction.Row) {
            const inFlow = layers.filter((layer) => !layer.ignoresStackLayout)
            const indices = inFlow.map((layer) => layer.index)
            inFlow.forEach((layer, at) => {
                layer.index = indices[inFlow.length - 1 - at]
            })
            stack.justifyContent = swapEnds(stack.justifyContent, JustifyContent.Start, JustifyContent.End)
        } else {
            stack.alignItems = swapEnds(stack.alignItems, AlignItems.Start, AlignItems.End)
        }
        if (typeof stack.padding === 'object') {
            stack.padding = { ...stack.padding, left: stack.padding.right, right: stack.padding.left }
        }
    }

    const mirrorLayer = (layer: sketch.Layer) => {
        if (layer.type === 'Text') {
            const text = layer as sketch.Text
            text.style.alignment = text.style.alignment === 'right' ? 'left' : text.style.alignment === 'center' || text.style.alignment === 'justified' ? text.style.alignment : 'right'
            return
        }
        if (layer.type === 'SymbolInstance') {
            const instance = layer as sketch.SymbolInstance
            const master = instance.master
            if (!master) {
                return
            }
            // Its overrides by the names of the layers they change, as the copy's layers have IDs of their own; the
            // symbols they swap in mirrored too, e.g. a button's icon. Swaps first, outermost first, as they bring the
            // layers the others change.
            const saved = savedOverrides(doc, instance)
            const mirrored = mirroredSymbol(master)
            if (mirrored.symbolId === master.symbolId && !saved.some((override) => override.property === 'symbolID')) {
                return
            }
            instance.symbolId = mirrored.symbolId
            restoreOverrides(doc, instance, saved, mirroredSymbol)
            return
        }
        if (layer.type === 'Group' || layer.type === 'Artboard' || layer.type === 'SymbolMaster') {
            mirrorContent(layer as sketch.Group)
        }
    }

    // The screens to mirror: those named, or those selected.
    const wanted = options.boards
    const boards = doc.pages
        .flatMap((candidate) => candidate.layers)
        .filter((layer) => layer.type === 'Artboard' && (wanted ? wanted.includes(layer.name) || wanted.includes(layer.id) : doc.selectedLayers.layers.some((selected) => selected.id === layer.id)))
        // A mirrored copy isn't mirrored again: its screen is.
        .filter((board) => !isMirroredBoard(board))
    const mirroredBoards = new Array<{ from: string, to: string, id: string, replaced: boolean }>()
    for (const board of boards) {
        const boardPage = board.parent as sketch.Page
        const name = `${board.name}${MIRRORED_BOARD}`
        // The copy an earlier run made, which this one replaces where it is.
        const earlier = boardPage.layers.find((layer) => layer.type === 'Artboard' && (sketch.Settings.layerSettingForKey(layer, MIRROR_OF) === board.id || layer.name === name))
        const right = Math.max(...boardPage.layers.filter((layer) => layer !== earlier).map((layer) => layer.frame.x + layer.frame.width))
        const copy = board.duplicate() as sketch.Artboard
        copy.name = name
        copy.frame = { ...copy.frame, x: earlier?.frame.x ?? right + 200, y: earlier?.frame.y ?? board.frame.y }
        sketch.Settings.setLayerSettingForKey(copy, MIRROR_OF, board.id)
        earlier?.remove()
        mirrorContent(copy)
        mirroredBoards.push({ from: board.name, to: copy.name, id: copy.id, replaced: !!earlier })
    }
    doc.processPendingChanges()
    return JSON.stringify({ boards: mirroredBoards, symbols: made })
}
