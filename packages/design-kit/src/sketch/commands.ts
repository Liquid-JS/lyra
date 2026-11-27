import sketch = require('sketch')

import type { CheckOptions, MirrorOptions, ThemeOptions, ThemeOutcome, UnwrapOptions, UpdateOptions } from '../kit.ts'
import { documentName } from './document.ts'

/**
 * The design kit plugin's commands, which Sketch runs from its Lyra menu on the front document. They call the theme
 * script and the design check that the generator writes beside them, as an agent would.
 */

const applyKitTheme = require('./theme.js') as (options: ThemeOptions) => Promise<string>
const checkKitDesign = require('./check.js') as (options: CheckOptions) => string
const mirrorKitDesign = require('./mirror.js') as (options: MirrorOptions) => string
const unwrapKitStarters = require('./unwrap.js') as (options: UnwrapOptions) => string
const updateDesignFromKit = require('./update.js') as (options: UpdateOptions) => string

/** Applies the theme on the document's Theme board, or the one it recorded, and says what changed. */
function applyTheme() {
    const doc = sketch.getSelectedDocument()
    if (!doc) {
        sketch.UI.message('Open a document made with the Lyra design kit first.')
        return
    }
    // It works in turns, so Sketch stays responsive meanwhile.
    sketch.UI.message('Applying the theme…')
    Promise.resolve()
        .then(() => applyKitTheme({ document: documentName(doc) }))
        .then((result) => {
            const outcome = JSON.parse(result) as ThemeOutcome & { alreadyRunning?: string }
            if (outcome.alreadyRunning) {
                sketch.UI.message('The theme is still being applied; wait for it to finish.')
                return
            }
            const { counts, warnings, warningCount } = outcome
            sketch.UI.message(`Theme applied: ${counts.colours} colours, ${counts.layerStyles + counts.textStyles} styles and ${counts.layers} symbols' frames changed.`)
            if (warningCount) {
                sketch.UI.alert('Lyra theme', `${warningCount} parts of the theme can't all show in the kit:\n\n${warnings.join('\n')}`)
            }
        })
        .catch((error: unknown) => sketch.UI.alert('Lyra theme', `The theme couldn't be applied: ${String(error)}`))
}

/** Lists what the design does beyond the kit and its theme on its Check page, and says how much. */
function checkDesign() {
    const doc = sketch.getSelectedDocument()
    if (!doc) {
        sketch.UI.message('Open a design made with the Lyra design kit first.')
        return
    }
    try {
        const { counts, total } = JSON.parse(checkKitDesign({ document: documentName(doc) })) as { counts: Record<string, number>, total: number }
        sketch.UI.message(
            total
                ? `${total} things go beyond the kit and its theme: ${Object.entries(counts).map(([kind, count]) => `${count} ${kind.toLowerCase()}`).join(', ')}. See the Check page.`
                : 'Everything comes from the kit and its theme.'
        )
    } catch (error) {
        sketch.UI.alert('Lyra check', `The design couldn't be checked: ${String(error)}`)
    }
}

/** Makes a right-to-left copy of each selected screen, beside the others, and says how many symbols it mirrored. */
function mirrorDesign() {
    const doc = sketch.getSelectedDocument()
    if (!doc) {
        sketch.UI.message('Open a design made with the Lyra design kit first.')
        return
    }
    try {
        const { boards, symbols } = JSON.parse(mirrorKitDesign({ document: documentName(doc) })) as { boards: Array<{ replaced: boolean }>, symbols: unknown[] }
        const replaced = boards.filter((board) => board.replaced).length
        sketch.UI.message(
            boards.length
                ? `${boards.length} screens mirrored for right to left${replaced ? `, ${replaced} replacing their earlier copies` : ''}, with ${symbols.length} symbols mirrored on the Right to left page.`
                : 'Select the screens to mirror first.'
        )
    } catch (error) {
        sketch.UI.alert('Lyra mirror', `The screens couldn't be mirrored: ${String(error)}`)
    }
}

/** Turns the selected starters into the symbols they hold, with their looks, so another size keeps the look. */
function unwrapStarters() {
    const doc = sketch.getSelectedDocument()
    if (!doc) {
        sketch.UI.message('Open a design made with the Lyra design kit first.')
        return
    }
    try {
        const { unwrapped } = JSON.parse(unwrapKitStarters({ document: documentName(doc) })) as { unwrapped: unknown[] }
        sketch.UI.message(
            unwrapped.length
                ? `${unwrapped.length} starters unwrapped: swap their symbols for another size, and their looks stay.`
                : 'Select the starters to unwrap, or the screens that hold them, first.'
        )
    } catch (error) {
        sketch.UI.alert('Lyra unwrap', `The starters couldn't be unwrapped: ${String(error)}`)
    }
}

/** Brings the design's symbols and styles up to date with the kit it uses as a library, and says how many. */
function updateFromKit() {
    const doc = sketch.getSelectedDocument()
    if (!doc) {
        sketch.UI.message('Open a design made with the Lyra design kit first.')
        return
    }
    try {
        const { symbols, layerStyles, textStyles, stylesFromMenu } = JSON.parse(updateDesignFromKit({ document: documentName(doc) })) as Record<string, number>
        sketch.UI.message(`Updated from the kit: ${symbols} symbols, ${layerStyles + textStyles} styles.`)
        // From the menu the design is in front, where Sketch syncs styles; one it didn't is left to Library Updates.
        if (stylesFromMenu) {
            sketch.UI.message(`Updated from the kit: ${symbols} symbols, ${layerStyles + textStyles} styles; ${stylesFromMenu} styles follow with Sketch's Library Updates.`)
        }
    } catch (error) {
        sketch.UI.alert('Lyra update', `The design couldn't be updated: ${String(error)}`)
    }
}

// Sketch finds a command's handler among the script's globals, or its exports.
Object.assign(globalThis, { applyTheme, checkDesign, mirrorDesign, unwrapStarters, updateFromKit })
export { applyTheme, checkDesign, mirrorDesign, unwrapStarters, updateFromKit }
