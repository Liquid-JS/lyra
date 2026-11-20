// @ts-check
import { relative } from 'node:path';
import { defineConfig } from 'eslint/config';
import { libraryConfig, rootConfig } from '../../eslint.config.js';

const dir = relative(process.cwd(), import.meta.dirname).replace(/\\/g, '/');

// ESLint loads the default export.
export default defineConfig(
  ...rootConfig.filter((entry) => !('ignores' in entry)),
  ...libraryConfig,
  {
    ignores: [`!${dir}/**/*`, `${dir}/dist`, `${dir}/node_modules`, `${dir}/**/files/**`],
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'nb', style: 'camelCase' }],
      // Components such as `table[nbTreeGrid]` and `button[nbButton]` use attribute selectors on purpose.
      '@angular-eslint/component-selector': 'off',
    },
  },
);
