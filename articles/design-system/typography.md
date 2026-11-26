# Lyra Typography

Typography is part of the design system: fonts, text colours and text styles are theme variables.

## Font Family

- **font-family-primary** - all text on the page
- **font-family-secondary** - headings (`<h1>` to `<h6>`)

Both are `Inter, sans-serif` by default; load the font in your app, as Lyra ships none.

---

## Colors

There are 5 text colours, each also available as a CSS class:

- **text-basic-color** (`.text-basic`) - main text colour, on basic backgrounds: cards, sidebars, headers
- **text-alternate-color** (`.text-alternate`) - on alternate backgrounds: coloured headers and sidebars
- **text-control-color** (`.text-control`) - on status backgrounds (`primary`, `success`, etc): filled buttons, selects
- **text-disabled-color** (`.text-disabled`) - disabled text
- **text-hint-color** (`.text-hint`) - secondary text: captions, placeholders, labels

---

## Text Styles

There are 14 text styles, each a combination of `font-size`, `font-weight`, `line-height` and `font-family`:

- **6 heading** styles, used by `<h1>`-`<h6>`, also available as `.h1` to `.h6`
- **2 subtitle** styles, the text of most controls (inputs, menus, etc), `.subtitle` and `.subtitle-2`
- **2 paragraph** styles for regular text and `<p>`, `.paragraph` and `.paragraph-2`
- **2 caption** styles for smaller text like tooltips and input captions, `.caption` and `.caption-2`
- **label** style, used by `<label>`, `.label`
- **button** text style, used by buttons

---

## Apply text styles classes and properties

```html
<input type="email" name="email" />
<span class="caption-2 text-hint">Work email address</span>
```

In Sass, read the variables with `nb-theme()`:

```scss
.my-text {
  font-family: nb-theme(font-family-primary);
  color: nb-theme(text-basic-color);
}
```

---

## Customize Typography styles

Every text style and colour is a [theme](theme/design-system/design-system-theme) variable, so a custom theme changes
them, e.g. the caption style:

```scss
text-caption-font-family: font-family-primary,
text-caption-font-size: 0.75rem,
text-caption-font-weight: 400,
text-caption-line-height: 1rem,
```

The typography variables are listed on the [Default Theme Variables](theme/built-in-themes/default-theme) page.

---

## Related Articles

- [Enable Theme Customization](theme/customization/enable-customizable-theme)
- [Create Custom Theme](theme/customization/create-custom-theme)
- [Default Theme Variables](theme/built-in-themes/default-theme)
- [Use Theme Variables](theme/customization/use-theme-variables)
