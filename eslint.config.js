// @ts-check
import angularEslintPlugin from '@angular-eslint/eslint-plugin'
import stylisticPlugin from '@stylistic/eslint-plugin'
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin'
import { configs as angularConfigs, createProcessor } from 'angular-eslint'
import { defineConfig } from 'eslint/config'
import { importX as importPlugin } from 'eslint-plugin-import-x'
import jsdocPlugin from 'eslint-plugin-jsdoc'
import preferArrowPlugin from 'eslint-plugin-prefer-arrow-functions'
import rxjsX from 'eslint-plugin-rxjs-x'
import unusedImportsPlugin from 'eslint-plugin-unused-imports'
import globals from 'globals'
import { configs as tsConfigs, parser } from 'typescript-eslint'

/**
 * Shared lint configuration, the same as nxt-components'. Every workspace extends it from its own `eslint.config.js`,
 * which is what the `lint` targets in angular.json use. Lyra's own additions follow nxt's rules, in `lyraRules`.
 */
export const rootConfig = defineConfig(
    {
        ignores: ['**/dist', '**/node_modules', '**/.lib', '**/.angular', 'coverage', 'docs', '.yarn', '.husky', 'tmp', 'test-results', 'playwright-report', '**/files/**', 'packages/*/**']
    },
    {
        files: ['**/*.ts', '**/*.js', '**/*.cjs', '**/*.mjs'],
        plugins: {
            '@angular-eslint': angularEslintPlugin,
            '@typescript-eslint': typescriptEslintPlugin,
            '@import': importPlugin,
            '@jsdoc': jsdocPlugin,
            '@prefer-arrow-functions': preferArrowPlugin,
            '@unused-imports': unusedImportsPlugin,
            '@stylistic': stylisticPlugin
        },
        languageOptions: {
            parser,
            parserOptions: {
                projectService: {
                    allowDefaultProject: ['.*', '*.js', '*.ts', '*.mjs', '*.cjs', 'packages/*/*.js', 'packages/*/*.mjs', 'packages/*/*.cjs', 'packages/playground/backend/*.js'],
                    maximumDefaultProjectFileMatchCount_THIS_WILL_SLOW_DOWN_LINTING: 32
                },
                tsconfigRootDir: import.meta.dirname
            }
        },
        processor: createProcessor(),
        rules: {
            '@angular-eslint/component-class-suffix': 'error',
            '@angular-eslint/component-selector': [
                'error',
                {
                    prefix: 'app',
                    style: 'kebab-case',
                    type: 'element'
                }
            ],
            '@angular-eslint/contextual-lifecycle': 'error',
            '@angular-eslint/directive-class-suffix': 'error',
            '@angular-eslint/directive-selector': [
                'error',
                {
                    prefix: 'app',
                    style: 'camelCase',
                    type: 'attribute'
                }
            ],
            '@angular-eslint/no-input-rename': 'error',
            '@angular-eslint/no-inputs-metadata-property': 'error',
            '@angular-eslint/no-output-native': 'off',
            '@angular-eslint/no-output-on-prefix': 'error',
            '@angular-eslint/no-output-rename': 'error',
            '@angular-eslint/no-outputs-metadata-property': 'error',
            '@angular-eslint/template/no-negated-async': 'off',
            '@angular-eslint/use-lifecycle-interface': 'error',
            '@angular-eslint/use-pipe-transform-interface': 'error',
            '@import/no-deprecated': 'warn',
            '@import/no-extraneous-dependencies': [
                'error',
                {
                    devDependencies: false
                }
            ],
            '@import/no-internal-modules': 'off',
            '@import/order': 'error',
            '@jsdoc/check-alignment': 'error',
            '@jsdoc/no-types': 'error',
            '@jsdoc/tag-lines': [
                'error',
                'never',
                {
                    startLines: 1
                }
            ],
            '@prefer-arrow-functions/prefer-arrow-functions': [
                'error',
                {
                    allowNamedFunctions: true,
                    classPropertiesAllowed: false,
                    disallowPrototype: true,
                    returnStyle: 'unchanged',
                    singleReturnOnly: false
                }
            ],
            '@stylistic/arrow-parens': 'off',
            '@stylistic/brace-style': ['error', '1tbs'],
            '@stylistic/comma-dangle': 'error',
            '@stylistic/eol-last': 'error',
            '@stylistic/indent': ['error', 4],
            '@stylistic/linebreak-style': 'off',
            '@stylistic/max-len': 'off',
            '@stylistic/member-delimiter-style': [
                'error',
                {
                    multiline: {
                        delimiter: 'none',
                        requireLast: false
                    },
                    singleline: {
                        delimiter: 'comma',
                        requireLast: false
                    }
                }
            ],
            '@stylistic/new-parens': 'error',
            '@stylistic/no-multiple-empty-lines': [
                'error',
                {
                    max: 1,
                    maxBOF: 0
                }
            ],
            '@stylistic/no-trailing-spaces': 'error',
            '@stylistic/quote-props': ['error', 'consistent-as-needed'],
            '@stylistic/quotes': [
                'error',
                'single',
                {
                    avoidEscape: true
                }
            ],
            '@stylistic/semi': ['error', 'never'],
            '@stylistic/space-before-function-paren': [
                'error',
                {
                    anonymous: 'always',
                    asyncArrow: 'always',
                    named: 'never'
                }
            ],
            '@stylistic/space-in-parens': ['error', 'never'],
            '@stylistic/type-annotation-spacing': 'error',
            '@typescript-eslint/adjacent-overload-signatures': 'error',
            '@typescript-eslint/array-type': [
                'error',
                {
                    default: 'array-simple',
                    readonly: 'generic'
                }
            ],
            '@typescript-eslint/consistent-type-assertions': 'off',
            '@typescript-eslint/consistent-type-definitions': 'error',
            '@typescript-eslint/dot-notation': 'off',
            '@typescript-eslint/explicit-member-accessibility': 'off',
            '@typescript-eslint/member-ordering': [
                'error',
                {
                    default: ['public-static-field', 'static-field', 'instance-field']
                }
            ],
            '@typescript-eslint/naming-convention': 'off',
            '@typescript-eslint/no-deprecated': 'error',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-inferrable-types': 'off',
            '@typescript-eslint/no-misused-new': 'error',
            '@typescript-eslint/no-namespace': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/no-redeclare': 'error',
            '@typescript-eslint/no-require-imports': 'error',
            '@typescript-eslint/no-restricted-types': [
                'error',
                {
                    types: {
                        Boolean: {
                            message: 'Avoid using the `Boolean` type. Did you mean `boolean`?'
                        },
                        Function: {
                            message: 'Avoid using the `Function` type. Prefer a specific function type, like `() => void`.'
                        },
                        Number: {
                            message: 'Avoid using the `Number` type. Did you mean `number`?'
                        },
                        Object: {
                            message: 'Avoid using the `Object` type. Did you mean `object`?'
                        },
                        String: {
                            message: 'Avoid using the `String` type. Did you mean `string`?'
                        },
                        Symbol: {
                            message: 'Avoid using the `Symbol` type. Did you mean `symbol`?'
                        }
                    }
                }
            ],
            '@typescript-eslint/no-shadow': [
                'error',
                {
                    hoist: 'all'
                }
            ],
            '@typescript-eslint/no-this-alias': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-use-before-define': 'off',
            '@typescript-eslint/prefer-for-of': 'error',
            '@typescript-eslint/prefer-function-type': 'error',
            '@typescript-eslint/prefer-namespace-keyword': 'error',
            '@typescript-eslint/triple-slash-reference': [
                'error',
                {
                    lib: 'always',
                    path: 'always',
                    types: 'prefer-import'
                }
            ],
            '@typescript-eslint/unified-signatures': 'error',
            '@unused-imports/no-unused-imports': 'error',
            '@unused-imports/no-unused-vars': [
                'error',
                {
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                    vars: 'all',
                    varsIgnorePattern: '^_'
                }
            ],
            'arrow-body-style': ['error', 'as-needed'],
            'complexity': 'off',
            'constructor-super': 'error',
            'curly': 'off',
            'eqeqeq': 'off',
            'id-match': 'off',
            'max-classes-per-file': 'off',
            'no-bitwise': 'off',
            'no-caller': 'error',
            'no-cond-assign': ['error', 'except-parens'],
            'no-console': 'off',
            'no-debugger': 'error',
            'no-duplicate-case': 'error',
            'no-duplicate-imports': [
                'error',
                {
                    includeExports: false
                }
            ],
            'no-empty': 'off',
            'no-eval': [
                'error',
                {
                    allowIndirect: false
                }
            ],
            'no-extra-bind': 'error',
            'no-fallthrough': 'off',
            'no-invalid-this': 'off',
            'no-new-func': 'error',
            'no-new-wrappers': 'error',
            'no-redeclare': 'off',
            'no-restricted-imports': [
                'error',
                {
                    message: "Please import directly from 'rxjs' instead",
                    name: 'rxjs/Rx'
                }
            ],
            'no-return-await': 'error',
            'no-sequences': [
                'error',
                {
                    allowInParentheses: true
                }
            ],
            'no-sparse-arrays': 'error',
            'no-template-curly-in-string': 'error',
            'no-throw-literal': 'error',
            'no-undef-init': 'error',
            'no-underscore-dangle': 'off',
            'no-unsafe-finally': 'error',
            'no-unused-labels': 'off',
            'no-unused-vars': 'off',
            'no-var': 'error',
            'object-shorthand': 'error',
            'one-var': ['error', 'never'],
            'prefer-const': [
                'error',
                {
                    destructuring: 'any',
                    ignoreReadBeforeAssign: false
                }
            ],
            'prefer-object-spread': 'error',
            'radix': ['error', 'always'],
            'sort-keys': 'off',
            'use-isnan': [
                'error',
                {
                    enforceForIndexOf: false,
                    enforceForSwitchCase: true
                }
            ],
            'valid-typeof': 'off'
        }
    },
    {
        files: ['**/*.spec.ts', '**/*.spec.js', '**/*.config.js', '**/*.config.ts', '**/*.config.cjs', '**/*.config.mjs', 'test/*.cjs', '**/test.ts', '**/test.js', 'scripts/**/*.ts', 'tools/**/*.ts', 'e2e/**/*.ts', 'smoke/**/*.ts', '**/test-setup.ts', '**/schematics/**/*.ts'],
        rules: {
            '@import/no-extraneous-dependencies': [
                'off',
                {
                    devDependencies: true
                }
            ]
        }
    },
    {
        files: ['**/*.cjs'],
        rules: {
            '@typescript-eslint/no-require-imports': 'off'
        }
    },
    {
        files: [
            '**/*.html'
        ],
        extends: [
            ...angularConfigs.templateRecommended,
            ...angularConfigs.templateAccessibility
        ],
        rules: {
            '@angular-eslint/template/eqeqeq': 'off',
            '@angular-eslint/template/no-negated-async': 'off',
            // A label names a custom control, such as nb-select, through the control's `aria-labelledby` and its own id.
            '@angular-eslint/template/label-has-associated-control': [
                'error',
                {
                    labelComponents: [{ selector: 'label', inputs: ['for', 'htmlFor', 'id'] }],
                    // Lyra's controls that render a native input inside, which a wrapping label names.
                    controlComponents: ['nb-checkbox', 'nb-toggle', 'nb-radio']
                }
            ],
            // The markdown viewer's `remarkNode` renders a node's children into the element.
            '@angular-eslint/template/elements-content': ['error', { allowList: ['aria-label', 'innerHTML', 'innerText', 'textContent', 'title', 'remarkNode'] }]
        }
    },
    ...lyraRules()
)

/**
 * Lyra's rules on top of nxt-components': the TypeScript and Angular recommended sets, RxJS checks, no non-null
 * assertions, named exports, and the Angular API Lyra keeps from Nebular (aliased inputs, `on`-prefixed outputs).
 */
function lyraRules() {
    return defineConfig(
        {
            files: ['**/*.ts'],
            extends: [...tsConfigs.recommended, ...angularConfigs.tsRecommended],
            plugins: {
                'rxjs-x': rxjsX
            },
            rules: {
                '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
                '@typescript-eslint/no-explicit-any': 'off',
                '@typescript-eslint/no-empty-function': 'off',
                '@typescript-eslint/no-empty-object-type': 'off',
                '@typescript-eslint/no-inferrable-types': 'off',
                '@typescript-eslint/no-this-alias': 'off',
                '@typescript-eslint/no-unused-expressions': 'off',
                '@typescript-eslint/no-unused-vars': 'off',
                // Narrow with a local, a required query or a check instead.
                '@typescript-eslint/no-non-null-assertion': 'error',
                // The public API keeps its aliased inputs, native-named outputs and `on`-prefixed outputs.
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
                            'skipLast', 'takeLast', 'throwIfEmpty', 'toArray'
                        ]
                    }
                ]
            }
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
                        message: 'Use the named exports of this package.'
                    }
                ],
                'no-restricted-imports': [
                    'error',
                    {
                        paths: [{ name: 'rxjs/Rx', message: "Please import directly from 'rxjs' instead" }],
                        patterns: [
                            { group: ['firebase/compat/*', '@angular/fire/compat', '@angular/fire/compat/*'], message: 'Use the modular Firebase API.' },
                            { group: ['date-fns/*'], message: "Import from 'date-fns'." }
                        ]
                    }
                ]
            }
        },
        {
            // Tools that load these files expect a default export.
            files: ['**/eslint.config.js', '.remarkrc.mjs', 'stylelint.config.mjs', '**/playwright*.config.ts', '**/vitest-base.config.ts', 'smoke/src/main.server.ts'],
            rules: {
                'no-restricted-syntax': 'off'
            }
        },
        {
            files: ['**/*.spec.ts', '**/test.ts', '**/schematics/**/*.ts', 'tools/**/*.ts'],
            rules: {
                '@typescript-eslint/ban-ts-comment': 'off',
                '@typescript-eslint/no-require-imports': 'off'
            }
        },
        {
            files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
            languageOptions: {
                globals: { ...globals.node }
            },
            rules: {
                '@typescript-eslint/no-require-imports': 'off'
            }
        }
    )
}

/**
 * Rules for the published libraries on top of `rootConfig`: their code has no `any`. Specs, tools and the docs and
 * playground apps may still use it, as in nxt-components.
 */
export const libraryConfig = defineConfig({
    files: ['**/*.ts'],
    ignores: ['**/*.spec.ts', '**/test.ts'],
    rules: {
        '@typescript-eslint/no-explicit-any': 'error'
    }
})

// ESLint loads the default export.
export default rootConfig
