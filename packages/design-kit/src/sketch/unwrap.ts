import sketch = require('sketch')

import type { UnwrapOptions } from '../kit.ts'
import { childrenOf, openDocument, restoreOverrides, savedOverrides, type SavedOverride } from './document.ts'

/**
 * Turns a design's starters into the symbols they hold, with the starter's look set on the instance: a starter's look
 * is set inside it, so swapping its symbol for another size loses it, while an instance's own overrides carry over to
 * the symbol swapped in, by the names of the layers they change. With `symbol`, swaps each for it too, e.g.
 * `Tag/Small/Plain`; icons the symbol adds, e.g. a button's with an icon, take the label's colour.
 */
export function unwrapStarters(components: string[], options: UnwrapOptions): string {
    const doc = openDocument(options.document)
    const isKits = (name: string) => components.some((component) => name === component || name.startsWith(`${component}/`))
    // The symbol to swap to: the document's, or imported from the kit's library its starters come from.
    let target = options.symbol ? doc.getSymbols().find((master) => master.name === options.symbol) : undefined
    const importTarget = (library: sketch.Library | null) => {
        if (!target && options.symbol && library) {
            target = library.getImportableSymbolReferencesForDocument(doc).find((reference) => reference.name === options.symbol)?.import()
        }
    }

    /** The kit's symbol a starter holds: its one layer, an instance of the kit's. */
    const heldBy = (master: sketch.SymbolMaster | undefined) => {
        const only = master && isKits(master.name) && master.layers.length === 1 ? master.layers[0] : undefined
        return only?.type === 'SymbolInstance' && isKits((only as sketch.SymbolInstance).master?.name ?? '') ? (only as sketch.SymbolInstance) : undefined
    }

    const unwrapped = new Array<{ from: string, to: string, id: string }>()
    const unwrap = (instance: sketch.SymbolInstance) => {
        const held = heldBy(instance.master)
        const parent = instance.parent as sketch.Group | undefined
        if (!held?.master || !parent) {
            return
        }
        importTarget(instance.master?.getLibrary() ?? null)
        if (options.symbol && !target) {
            throw new Error(`No symbol ${options.symbol} in the document or the kit's library`)
        }
        const prefix = `${held.name}/`
        // The look the starter sets inside it, then the design's overrides of it, which go through the instance it holds.
        const swap = instance.overrides.find((override) => override.property === 'symbolID' && override.path === held.id && !override.isDefault)
        const outer = savedOverrides(doc, instance)
            .filter((saved) => saved.key.startsWith(prefix))
            .map((saved): SavedOverride => ({ ...saved, key: saved.key.slice(prefix.length), depth: saved.depth - 1 }))
        const symbol = target ?? (swap ? doc.getSymbolMasterWithID(String(swap.value)) : undefined) ?? held.master
        const made = symbol.createNewInstance()
        made.parent = parent
        made.index = instance.index
        made.name = instance.name
        // Its place and width; its symbol's height, e.g. another size's.
        made.frame = { ...instance.frame, height: symbol.frame.height }
        const looks = savedOverrides(doc, held)
        restoreOverrides(doc, made, looks)
        restoreOverrides(doc, made, outer)
        // A starter without an icon swapped for a symbol with one, e.g. a button's `Icon Start`: its icons take the
        // label's colour, as code colours them alike, rather than the symbol's own, e.g. white on a filled button.
        const label = [...looks, ...outer].reverse().find((saved) => saved.property === 'textColor' && saved.depth === 1)
        if (label) {
            for (const icon of made.overrides.filter((override) => override.property === 'fillColor' && override.editable && override.isDefault && !override.path.includes('/'))) {
                if (label.swatch) {
                    icon.swatchValue = label.swatch
                } else {
                    icon.value = label.value
                }
            }
        }
        // Sized to its texts, where its symbol grows with them.
        made.resizeWithSmartLayout()
        unwrapped.push({ from: instance.master?.name ?? '', to: symbol.name, id: made.id })
        instance.remove()
    }
    // The starters selected, or in the frames and groups selected.
    const visit = (layer: sketch.Layer) => {
        if (layer.type === 'SymbolInstance') {
            unwrap(layer as sketch.SymbolInstance)
        } else {
            childrenOf(layer).forEach(visit)
        }
    }
    const wanted = options.layers
    const everyLayer = (layer: sketch.Layer): sketch.Layer[] => [layer, ...childrenOf(layer).flatMap(everyLayer)]
    const chosen = wanted ? doc.pages.flatMap((page) => page.layers).flatMap(everyLayer).filter((layer) => wanted.includes(layer.id)) : doc.selectedLayers.layers
    chosen.forEach(visit)
    doc.processPendingChanges()
    return JSON.stringify({ unwrapped })
}
