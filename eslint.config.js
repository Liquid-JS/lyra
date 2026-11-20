// @ts-check
// The plugins below and `globals` are CommonJS packages that only provide a default export.
import stylistic from '@stylistic/eslint-plugin';
import { configs as angularConfigs, processInlineTemplates } from 'angular-eslint';
import { defineConfig } from 'eslint/config';
import rxjsX from 'eslint-plugin-rxjs-x';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import { configs as tsConfigs } from 'typescript-eslint';

/**
 * Shared lint configuration. Every workspace extends it from its own
 * `eslint.config.js`, which is what the `lint` targets in angular.json use.
 *
 * Formatting is enforced through @stylistic rules that reproduce the
 * project's established style: 2-space indent, single quotes, semicolons,
 * trailing commas on multiline constructs and 120-column lines.
 */
export const rootConfig = defineConfig(
  {
    ignores: ['**/dist', '**/node_modules', '**/.lib', '**/.angular', 'coverage', '.yarn', 'test-results', 'playwright-report', '**/files/**', 'packages/**/*'],
  },
  {
    files: ['**/*.ts'],
    extends: [...tsConfigs.recommended, ...angularConfigs.tsRecommended],
    processor: processInlineTemplates,
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.js', '*.ts', '*.mjs', '*.cjs', 'packages/*/*.js', 'packages/*/*.mjs'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@stylistic': stylistic,
      'rxjs-x': rxjsX,
      'unused-imports': unusedImports,
    },
    rules: {
      // --- formatting (formerly prettier) ---
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/arrow-spacing': 'error',
      '@stylistic/block-spacing': 'error',
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/comma-spacing': 'error',
      '@stylistic/computed-property-spacing': ['error', 'never'],
      '@stylistic/eol-last': 'error',
      '@stylistic/function-call-spacing': 'error',
      '@stylistic/indent': [
        'error',
        2,
        {
          SwitchCase: 1,
          flatTernaryExpressions: false,
          ignoredNodes: [
            'TSTypeParameterInstantiation',
            'TSUnionType',
            'TSIntersectionType',
            'ConditionalExpression',
            'TemplateLiteral *',
            'PropertyDefinition[decorators]',
            'FunctionExpression > .params[decorators.length > 0]',
            'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
          ],
        },
      ],
      '@stylistic/key-spacing': 'error',
      '@stylistic/keyword-spacing': 'error',
      '@stylistic/linebreak-style': ['error', 'unix'],
      '@stylistic/max-len': [
        'error',
        {
          code: 120,
          ignoreComments: true,
          ignoreRegExpLiterals: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreUrls: true,
        },
      ],
      '@stylistic/member-delimiter-style': [
        'error',
        {
          multiline: { delimiter: 'semi', requireLast: true },
          singleline: { delimiter: 'semi', requireLast: false },
        },
      ],
      '@stylistic/no-multi-spaces': 'error',
      '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/no-whitespace-before-property': 'error',
      // Spaces inside braces. Brackets, parentheses and type arguments are left as they are: the rule would also put
      // each item of a wrapped list on its own line, and long lists of names read better several to a line.
      '@stylistic/list-style': [
        'error',
        { overrides: { '{}': { singleLine: { spacing: 'always' } }, '[]': 'off', '()': 'off', '<>': 'off' } },
      ],
      '@stylistic/operator-linebreak': ['error', 'after', { overrides: { '?': 'before', ':': 'before', '|': 'before', '&': 'before' } }],
      '@stylistic/quote-props': ['error', 'as-needed'],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: 'always' }],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/semi-spacing': 'error',
      '@stylistic/space-before-blocks': 'error',
      '@stylistic/space-before-function-paren': [
        'error',
        { anonymous: 'always', asyncArrow: 'always', named: 'never' },
      ],
      '@stylistic/space-in-parens': ['error', 'never'],
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/template-curly-spacing': 'error',
      '@stylistic/type-annotation-spacing': 'error',

      // --- code quality ---
      'no-restricted-globals': ['error', 'fit', 'fdescribe'],
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      'dot-notation': 'off',
      '@typescript-eslint/dot-notation': 'error',
      '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/no-deprecated': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/unified-signatures': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      // Narrow with a local, a required query or a check instead.
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
        },
      ],
      // The public API keeps its aliased inputs, native-named outputs and attribute component selectors.
      '@angular-eslint/no-host-metadata-property': 'off',
      '@angular-eslint/no-input-rename': 'off',
      '@angular-eslint/no-output-native': 'off',
      '@angular-eslint/no-output-on-prefix': 'off',
      // OnPush is the default; components that host other components' views opt into eager checks on purpose.
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
      'rxjs-x/no-unsafe-takeuntil': [
        'error',
        {
          allow: [
            'count', 'defaultIfEmpty', 'endWith', 'every', 'finalize', 'finally', 'isEmpty', 'last', 'max', 'min',
            'publish', 'publishBehavior', 'publishLast', 'publishReplay', 'reduce', 'share', 'shareReplay',
            'skipLast', 'takeLast', 'throwIfEmpty', 'toArray',
          ],
        },
      ],
    },
  },
  {
    // Prefer named exports and imports. Default exports remain only where a tool requires them.
    files: ['**/*.ts', '**/*.js', '**/*.mjs'],
    rules: {
      'no-restricted-syntax': [
        'error',
        { selector: 'ExportDefaultDeclaration', message: 'Use a named export.' },
        { selector: 'ExportSpecifier[exported.name="default"]', message: 'Use a named export.' },
        { selector: 'ImportDeclaration[source.value=/^\\./] > ImportDefaultSpecifier', message: 'Import a named export.' },
        {
          // Packages that offer named exports (or a namespace import) instead of a default export.
          selector:
            'ImportDeclaration[source.value=/^(typescript|typescript-eslint|angular-eslint|date-fns|passport|passport-jwt|sass)$/] > ImportDefaultSpecifier',
          message: 'Use the named exports of this package.',
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['firebase/compat/*', '@angular/fire/compat', '@angular/fire/compat/*'], message: 'Use the modular Firebase API.' },
            { group: ['date-fns/*'], message: "Import from 'date-fns'." },
          ],
        },
      ],
    },
  },
  {
    // Tools that load these files expect a default export.
    files: ['**/eslint.config.js', '.remarkrc.mjs', 'stylelint.config.mjs', '**/playwright*.config.ts', '**/vitest-base.config.ts', 'smoke/src/main.server.ts'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
  {
    files: ['**/*.spec.ts', '**/test.ts', '**/schematics/**/*.ts', 'tools/**/*.ts'],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angularConfigs.templateRecommended],
    rules: {
      '@angular-eslint/template/eqeqeq': ['error', { allowNullOrUndefined: true }],
    },
  },
);

/**
 * Rules for the published libraries on top of `rootConfig`: their code has no `any`. Specs, tools and the docs and
 * playground apps may still use it, as in nxt-components.
 */
export const libraryConfig = defineConfig({
  files: ['**/*.ts'],
  ignores: ['**/*.spec.ts', '**/test.ts'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
  },
});

// ESLint loads the default export.
export default rootConfig;
