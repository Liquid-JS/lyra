import { chain, noop } from '@angular-devkit/schematics'

import { Schema } from './schema.js'
import { raiseStyleBudget } from './raise-budget/index.js'
import { registerModules } from './register-modules/index.js'
import { registerCustomizableTheme, registerPrebuiltTheme } from './register-theme/index.js'
import { wrapRootComponentInLayout } from './wrap-in-layout/index.js'

/**
 * Sets the project up: registers the providers or modules, adds the theme (customisable SCSS or prebuilt CSS), raises
 * the initial bundle's budget for the theme's CSS, and wraps the root component in `nb-layout` when asked.
 */
export function setup(options: Schema) {
    return chain([
        registerModules(options),
        options.customization ? registerCustomizableTheme(options) : registerPrebuiltTheme(options),
        raiseStyleBudget(options),
        options.layout ? wrapRootComponentInLayout(options) : noop()
    ])
}
