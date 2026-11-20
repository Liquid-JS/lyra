// @ts-check
import { relative } from 'node:path'
import { defineConfig } from 'eslint/config'
import { rootConfig } from '../../eslint.config.js'

const dir = relative(process.cwd(), import.meta.dirname).replace(/\\/g, '/')

// ESLint loads the default export.
export default defineConfig(
    ...rootConfig.filter((entry) => !('ignores' in entry)),
    {
        ignores: [`!${dir}/**/*`, `${dir}/dist`, `${dir}/node_modules`, `${dir}/**/files/**`]
    },
    {
        files: ['**/*.ts'],
        rules: {
            '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'npg', style: 'camelCase' }],
            // Example components deliberately use nb-* selectors; the docs reference them by name.
            '@angular-eslint/component-selector': 'off'
        }
    },
    {
        files: ['**/*.html'],
        rules: {
            // Each auth page exists for its form, so the form's first field takes focus.
            '@angular-eslint/template/no-autofocus': 'off'
        }
    }
)
