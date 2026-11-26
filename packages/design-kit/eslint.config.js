// @ts-check
import { relative } from 'node:path'
import { defineConfig } from 'eslint/config'
import { rootConfig } from '../../eslint.config.js'

const dir = relative(process.cwd(), import.meta.dirname).replace(/\\/g, '/')

// ESLint loads the default export.
export default defineConfig(
    ...rootConfig.filter((entry) => !('ignores' in entry)),
    {
        ignores: [`!${dir}/**/*`, `${dir}/dist`, `${dir}/node_modules`]
    },
    {
        files: ['src/sketch/**/*.ts'],
        rules: {
            // Sketch's API is a CommonJS module, as are the scripts the plugin's commands load from beside them: a
            // require keeps them as they are in the bundle, without an ES module wrapper.
            '@typescript-eslint/no-require-imports': ['error', { allow: ['^sketch$', '^\\./(theme|check)\\.js$'] }]
        }
    }
)
