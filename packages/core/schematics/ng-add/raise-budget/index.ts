import { isJsonObject, JsonValue } from '@angular-devkit/core'

import { updateWorkspace, WorkspaceDefinition } from '@schematics/angular/utility'
import { projectOf } from '../../util/index.js'
import { Schema } from '../schema.js'

/** What Lyra's theme needs of the initial bundle's budget: its CSS is about 740 kB before it's compressed. */
const WARNING = '2mb'
const ERROR = '3mb'

/** A budget's size in bytes, e.g. `500kB` or `1mb`; a percentage or an unknown unit counts as none. */
function bytesOf(size: JsonValue | undefined): number | undefined {
    const match = /^\s*([\d.]+)\s*(b|kb|mb|gb)?\s*$/i.exec(typeof size === 'string' ? size : '')
    if (!match) {
        return undefined
    }
    const unit = (match[2] ?? 'b').toLowerCase()
    return parseFloat(match[1] ?? '0') * { b: 1, kb: 1024, mb: 1024 ** 2, gb: 1024 ** 3 }[unit as 'b']
}

/**
 * Raises the build's `initial` budgets to what Lyra's theme needs, where they're lower, so the first production build
 * passes; budgets already higher are kept.
 */
export function raiseStyleBudget(options: Schema) {
    return updateWorkspace(async (workspace: WorkspaceDefinition) => {
        const project = projectOf(workspace, options.project)
        const configurations = project.targets.get('build')?.configurations ?? {}
        for (const configuration of Object.values(configurations)) {
            const budgets = configuration?.['budgets']
            if (!configuration || !Array.isArray(budgets)) {
                continue
            }
            // A new list: the workspace records changes to its values, not inside them.
            configuration['budgets'] = budgets.map((budget) => {
                if (!isJsonObject(budget) || budget['type'] !== 'initial') {
                    return budget
                }
                const raised = { ...budget }
                for (const [key, size] of [['maximumWarning', WARNING], ['maximumError', ERROR]] as const) {
                    const current = bytesOf(budget[key])
                    if (current !== undefined && current < (bytesOf(size) ?? 0)) {
                        raised[key] = size
                    }
                }
                return raised
            })
        }
    })
}
