// @ts-check
import { relative } from 'node:path'
import { defineConfig } from 'eslint/config'
import { rootConfig } from '../../eslint.config.js'

const dir = relative(process.cwd(), import.meta.dirname).replace(/\\/g, '/')

// ESLint loads the default export.
export default defineConfig(
    ...rootConfig.filter((entry) => !('ignores' in entry)),
    {
        ignores: [`!${dir}/**/*`, `${dir}/dist`, `${dir}/node_modules`, `${dir}/**/files/**`, `${dir}/public/**`]
    },
    {
        files: ['**/*.ts'],
        rules: {
            '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'ngd', style: 'camelCase' }],
            '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'ngd', style: 'kebab-case' }]
        }
    }
)
