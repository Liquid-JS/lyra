import sketch = require('sketch')

import type { UpdateOptions } from '../kit.ts'
import { openDocument } from './document.ts'

/**
 * Brings a design's copies of the kit's symbols and styles up to date with the kit it uses as a library, e.g. after
 * the kit's theme changed. Sketch syncs a library's styles only for its front document while Sketch is the front app,
 * as when the command runs from its menu: a script run by another app, e.g. an MCP server, syncs the symbols, whose
 * layers carry the kit's looks, and counts the styles the design's own layers and overrides use that it couldn't, in
 * `stylesFromMenu`, with a `note` on bringing Sketch and the design to the front to sync them too.
 */
export function updateFromKit(options: UpdateOptions): string {
    const doc = openDocument(options.document)
    const counts = { symbols: 0, layerStyles: 0, textStyles: 0 }
    const fromMenu = new Set<string>()
    for (const symbol of doc.getSymbols().filter((candidate) => candidate.getLibrary())) {
        if (symbol.syncWithLibrary()) {
            counts.symbols++
        }
    }
    const update = (shared: sketch.SharedStyle, kind: 'layerStyles' | 'textStyles') => {
        // Copies no layer uses, e.g. ones an import replaced, are left as they are.
        if (!shared.getLibrary() || !shared.getAllInstancesLayers().length) {
            return
        }
        try {
            if (shared.syncWithLibrary()) {
                counts[kind]++
            }
        } catch {
            fromMenu.add(shared.name)
        }
    }
    doc.sharedLayerStyles.forEach((shared) => update(shared, 'layerStyles'))
    doc.sharedTextStyles.forEach((shared) => update(shared, 'textStyles'))
    doc.processPendingChanges()
    // Sketch syncs styles for the document in front while it's the front app: from a script, bring Sketch forward, e.g.
    // `osascript -e 'tell application "Sketch" to activate'`, with the design opened last, and run it again.
    const front = sketch.getSelectedDocument()
    const designInFront = !!front && front.id === doc.id
    return JSON.stringify({
        ...counts,
        stylesFromMenu: fromMenu.size,
        ...(fromMenu.size
            ? {
                note: `${counts.symbols} symbols synced. ${fromMenu.size} styles your own layers and overrides use sync only while Sketch is the front app${designInFront ? '' : ' with this design in front'}: run \`osascript -e 'tell application "Sketch" to activate'\`${designInFront ? '' : ', open the design again with Document.open so it\'s in front,'} and run this again, or accept Library Updates in Sketch.`
            }
            : {})
    })
}
