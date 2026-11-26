import sketch = require('sketch')

import type { CheckOptions, ThemeOptions, ThemeOutcome } from '../kit.ts'
import { documentName } from './document.ts'

/**
 * The design kit plugin's commands, which Sketch runs from its Lyra menu on the front document. They call the theme
 * script and the design check that the generator writes beside them, as an agent would.
 */

const applyKitTheme = require('./theme.js') as (options: ThemeOptions) => Promise<string>
const checkKitDesign = require('./check.js') as (options: CheckOptions) => string

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
            const { counts, warnings, warningCount } = JSON.parse(result) as ThemeOutcome
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

// Sketch finds a command's handler among the script's globals, or its exports.
Object.assign(globalThis, { applyTheme, checkDesign })
export { applyTheme, checkDesign }
