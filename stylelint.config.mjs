import { defineStylistic, defineStylisticOverride } from '@stylistic/stylelint-config';

// Our changes to the stylistic preset. Its rules are named per syntax, so these are set for CSS and again for SCSS.
const stylistic = {
  'indentation': 2,
  'max-line-length': null,
  'string-quotes': 'single',
  'block-closing-brace-newline-after': [
    'always',
    {
      'ignoreAtRules': [
        'if',
        'else'
      ]
    }
  ],
  'declaration-colon-newline-after': null,
  'max-empty-lines': [
    1,
    {
      'ignore': [
        'comments'
      ]
    }
  ]
};

const rules = {
  'color-no-invalid-hex': true,
  'function-calc-no-unspaced-operator': true,
  'function-name-case': 'lower',
  'function-url-quotes': 'always',
  'length-zero-no-unit': true,
  'unit-no-unknown': true,
  'unit-allowed-list': [
    'px',
    '%',
    'deg',
    'ms',
    'em',
    'vh',
    'dvh',
    'vw',
    'vmax',
    's',
    'rem',
    'fr'
  ],
  'shorthand-property-no-redundant-values': true,
  'declaration-block-no-duplicate-properties': [
    true,
    {
      'ignore': [
        'consecutive-duplicates-with-different-values'
      ]
    }
  ],
  'selector-pseudo-element-colon-notation': 'double',
  'selector-pseudo-element-no-unknown': [
    true,
    {
      'ignorePseudoElements': [
        'ng-deep'
      ]
    }
  ],
  'selector-type-case': 'lower',
  'selector-max-id': 0,
  'no-descending-specificity': null,
  'selector-class-pattern': null,
  'selector-id-pattern': null,
  'keyframes-name-pattern': null,
  'scss/dollar-variable-pattern': null,
  'scss/at-mixin-pattern': null,
  'scss/at-function-pattern': null,
  'scss/percent-placeholder-pattern': null,
  'scss/no-global-function-names': null,
  'scss/at-extend-no-missing-placeholder': null,
  'scss/dollar-variable-empty-line-before': null,
  'scss/double-slash-comment-whitespace-inside': null,
  'scss/double-slash-comment-empty-line-before': null,
  'scss/load-no-partial-leading-underscore': null,
  'scss/comment-no-empty': null,
  'scss/operator-no-newline-after': null,
  'scss/at-if-no-null': null,
  'color-function-notation': null,
  'alpha-value-notation': null,
  'hue-degree-notation': null,
  'number-max-precision': null,
  'color-hex-length': null,
  'declaration-block-no-redundant-longhand-properties': null,
  'declaration-empty-line-before': null,
  'custom-property-empty-line-before': null,
  'at-rule-empty-line-before': null,
  'rule-empty-line-before': null,
  'comment-empty-line-before': null,
  'value-keyword-case': null,
  'font-family-name-quotes': null,
  'property-no-vendor-prefix': null,
  'value-no-vendor-prefix': null,
  'selector-no-vendor-prefix': null,
  'media-feature-range-notation': null,
  'import-notation': null,
  'no-empty-source': null,
  'block-no-empty': null,
  'scss/at-mixin-argumentless-call-parentheses': 'always',
  'color-function-alias-notation': null,
  'scss/at-rule-conditional-no-parentheses': null,
  'nesting-selector-no-missing-scoping-root': null,
  'selector-not-notation': null,
  'property-no-deprecated': null,
  'declaration-property-value-keyword-no-deprecated': null,
  'font-family-no-duplicate-names': null,
  'block-no-redundant-nested-style-rules': null,
  'scss/dollar-variable-no-missing-interpolation': null
};

/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard-scss', '@stylistic/stylelint-config'],
  rules: { ...defineStylistic({ rules: stylistic }), ...rules },
  overrides: [defineStylisticOverride({ syntax: 'scss', files: '**/*.scss', rules: stylistic })],
};
