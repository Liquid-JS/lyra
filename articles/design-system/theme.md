# Design System Theme

In Lyra's design system a **theme** is a set of semantic variables, and the connections between them, that describe
the application's look & feel. Components read the variables, not fixed values, so a theme changes the look without
changing the components' styles, a new theme is a short list of differences from its parent, and themes switch at run
time without a page reload, as [CSS custom properties](theme/customization/css-custom-properties).

---

## A Theme

A theme is a Sass map; a value may be a plain value or the name of another variable:

```scss
$theme: (
  // ...
  color-danger-100: #fff2f2,
  color-danger-200: #ffd6d9,
  color-danger-300: #ffa8b4,
  color-danger-400: #ff708d,
  // ...
  color-danger-900: #700940,

  /* Basic colors - for backgrounds and borders and texts */

  color-basic-100: white,
  color-basic-200: #f7f9fc,
  color-basic-300: #edf1f7,
  color-basic-400: #e4e9f2,
  // ...
  color-basic-1100: #101426,

  /* Status colors states - focus, hover, default, active, disabled  */

  color-primary-focus: color-primary-600,
  color-primary-hover: color-primary-400,
  color-primary-default: color-primary-500,
  color-primary-active: color-primary-600,
  color-primary-disabled: color-basic-transparent-300,
  // ...
);
```

The variables fall into these groups:

- Colors
- Backgrounds & Borders
- Text Colors
- Fonts & Text Styles
- Control Heights
- General Theme Variables

---

## Colors

5 status colours (`primary`, `success`, `info`, `warning`, `danger`), each with 9 shades and 6 transparent levels
(8%, 16%, 24%, 32%, 40%, 48%), and `basic`, with 11 shades, for backgrounds and texts. The `status` variants of the
components use them.

Primary color shades:

```scss
color-primary-100: #f2f5ff,
color-primary-200: #cedcfb,
color-primary-300: #a0baf5,
color-primary-400: #5c89e4,
color-primary-500: #3469d1,
color-primary-600: #2955b1,
color-primary-700: #1e4396,
color-primary-800: #16347a,
color-primary-900: #0c225b,

color-primary-transparent-100: rgba(52, 105, 209, 0.08),
color-primary-transparent-200: rgba(52, 105, 209, 0.16),
color-primary-transparent-300: rgba(52, 105, 209, 0.24),
color-primary-transparent-400: rgba(52, 105, 209, 0.32),
color-primary-transparent-500: rgba(52, 105, 209, 0.40),
color-primary-transparent-600: rgba(52, 105, 209, 0.48),
```

Each colour also has the shades the element states use, which a theme can make lighter or darker:

```scss
color-primary-focus: color-primary-600,
color-primary-hover: color-primary-400,
color-primary-default: color-primary-500,
color-primary-active: color-primary-600,
color-primary-disabled: color-basic-transparent-300,
```

---

## Backgrounds & Borders

A theme has backgrounds of 4 shades and borders of 5 shades for `basic`, `alternative` and each status (`primary`,
`success`, `info`, `warning`, `danger`). `basic` and `alternative` backgrounds and borders use the `basic` shades;
a status's use its own colour, from its 500 shade. Basic backgrounds and borders are used by most components (cards,
accordions, menu, etc), the alternative ones by a few (tooltips), and the status ones to distinguish particular
components.

In your own styles, use them as CSS properties, e.g. `background-color: var(--background-basic-color-2)` or
`border-color: var(--border-danger-color-1)`; see [CSS Custom Properties](theme/customization/css-custom-properties).

Basic backgrounds and borders:

```scss
background-basic-color-1: color-basic-100,
background-basic-color-2: color-basic-200,
background-basic-color-3: color-basic-300,
background-basic-color-4: color-basic-400,

border-basic-color-1: color-basic-100,
border-basic-color-2: color-basic-200,
border-basic-color-3: color-basic-300,
border-basic-color-4: color-basic-400,
border-basic-color-5: color-basic-500,
```

Status backgrounds and borders, here for `primary`:

```scss
background-primary-color-1: color-primary-500,
background-primary-color-2: color-primary-600,
background-primary-color-3: color-primary-700,
background-primary-color-4: color-primary-800,

border-primary-color-1: color-primary-500,
border-primary-color-2: color-primary-600,
border-primary-color-3: color-primary-700,
border-primary-color-4: color-primary-800,
border-primary-color-5: color-primary-900,
```

The most used are:

- `background-basic-color-1` - the lightest one, for elements on top: cards, headers, etc.
- `background-basic-color-2` - the layout's background and the input controls (inputs, checkboxes, etc)

Dark themes start from the other end of the basic shades:

```scss
background-basic-color-1: color-basic-800,
background-basic-color-2: color-basic-900,
background-basic-color-3: color-basic-1000,
background-basic-color-4: color-basic-1100,

border-basic-color-1: color-basic-800,
border-basic-color-2: color-basic-900,
border-basic-color-3: color-basic-1000,
border-basic-color-4: color-basic-1100,
border-basic-color-5: color-basic-1100,
```

---

## Text Colors

There are 5 text colours: `basic`, the main text colour, on `basic` backgrounds; `alternate`, on `alternate`
backgrounds; `control`, on `status` colours (`primary`, `success`, etc); `disabled`; and `hint`, for secondary texts
such as placeholders and captions. They use the `basic` shades:

```scss
text-basic-color: color-basic-800,
text-alternate-color: color-basic-100,
text-control-color: color-basic-100,
text-disabled-color: color-basic-transparent-600,
text-hint-color: color-basic-600,
```

---

## Fonts & Text Styles

Each theme has two fonts, `font-family-primary` and `font-family-secondary`; the secondary one is used for headings,
the primary for the rest.

There are 14 text styles:

- 6 `heading` styles, used by h1-h6 elements
- 2 `subtitle` styles, the text of most controls (inputs, menus, etc)
- 2 `paragraph` styles, regular text
- 2 `caption` styles, smaller texts like a tooltip or an input caption
- `label` style, used by label element
- `button` text style, used by button element

Each style sets `font-family`, `font-size`, `font-weight` and `line-height`, for instance the caption style:

```scss
text-caption-font-family: font-family-primary,
text-caption-font-size: 0.75rem,
text-caption-font-weight: 400,
text-caption-line-height: 1rem,
```

Links take their colours from the primary text colours, `link-text-color`, `link-text-hover-color` and
`link-text-focus-color`, and are underlined, `link-text-decoration`. Focused from the keyboard, a link's text is highlighted in the
focus colour, `link-outline-color`, reaching `link-outline-width` past it with `link-outline-border-radius` corners, as
a ring doesn't sit well on text; a link that's only an image has the focus ring around the image instead.

---

## Control Heights

Buttons, button groups, fields, selects and tag inputs of one size share a height, `control-{size}-height`: a field's
text line height, its padding and its border, which is 24, 32, 40, 48 and 56px from `tiny` to `giant` in the built-in
themes. Each control is at least that tall, with its content in the middle, so controls of one size line up beside each
other. Bigger text, from the text styles or the browser's text size, makes them all taller together, and a line height
set on single elements, e.g. by a reading tool, doesn't pull them apart. To make the controls taller or shorter, set the
heights:

```scss
control-medium-height: 2.75rem,
```

A theme value can add others up with `nb-sum`, as the heights do: `nb-sum(input-medium-text-line-height, 0.875rem,
nb-scale(input-border-width, 2))` follows the line height and the border as they change, as a `calc()` over their CSS
properties.

They also share where their text starts, `control-{size}-inset`: 11, 15, 19, 19 and 23px from the control's outer edge,
border included. Each control's padding at the sides is its size's inset less its own border, so a button, a field and
the options under a select start their text at the same place, whether they have a border or not. Set the insets to
give all the controls of a size more or less room at the sides, or a component's padding to change only its own:

```scss
control-medium-inset: 1rem,
button-filled-medium-padding: 1.25rem,
```

---

## General Theme Variables

Other supporting variables, such as `border-radius`, `outline-width` & `outline-color`, `shadow`, etc.

`outline-width` and `outline-color` draw the focus ring of everything focused from the keyboard: buttons, cards, menu
items, tabs. Each component has its own pair mapped to them, e.g. `menu-item-outline-color`, to change one
without the others. Fields show focus with their border instead.

---

## Related Articles

- [Enable Theme Customization](theme/customization/enable-customizable-theme)
- [Create Custom Theme](theme/customization/create-custom-theme)
- [Default Theme Variables](theme/built-in-themes/default-theme)
- [Dark Theme Variables](theme/built-in-themes/dark-theme)
