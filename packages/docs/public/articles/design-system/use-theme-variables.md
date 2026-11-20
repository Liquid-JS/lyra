# Use Theme Variable

The `nb-theme` Sass function gives a theme variable as its CSS custom property: `nb-theme(border-radius)` is
`var(--border-radius)`, so the style follows the theme the element is in.

---

## Import Theme

In your `*.component.scss`, use the `themes.scss` created in [Enable Customizable Theme](theme/customization/enable-customizable-theme):

```scss
@use '../../../themes' as *;
```

---

## Access Variable

```scss
@use '../../../themes' as *;

:host {
  background: nb-theme(background-basic-color-1);
}
```

The variables are listed under [Default Theme Variables](theme/built-in-themes/default-theme).

---

## Multiple Runtime Themes

The styles read [CSS custom properties](theme/customization/css-custom-properties), so with
[Multiple Runtime Themes](theme/customization/enable-multiple-runtime-themes) they follow whichever theme is active,
with nothing more to do. `nb-install-component` puts its content in the component's `:host`:

```scss
@use '../../../themes' as *;

@include nb-install-component {
  background: nb-theme(background-basic-color-1);
}
```

## Related Articles

- [Style Other Elements](theme/customization/style-other-elements)
- [Design System Theme](theme/design-system/design-system-theme)
- [Enable Customizable Theme](theme/customization/enable-customizable-theme)
- [Create Custom Theme](theme/customization/create-custom-theme)
