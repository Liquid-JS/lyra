# Use Theme Variable

The `nb-theme` Sass function gives a theme variable as its CSS custom property: `nb-theme(border-radius)` is
`var(--border-radius)`, so the style follows the theme the element is in.

---

## Import Theme

In your `*.component.scss`, use Lyra's theming by its package name, which works from any folder. The themes your
`themes.scss` registers in [Enable Customizable Theme](theme/customization/enable-customizable-theme) aren't needed here:
`nb-theme()` only names the variable, and each theme sets its values.

```scss
@use '@liquid-js/lyr-core/styles/theming' as *;
```

---

## Access Variable

```scss
@use '@liquid-js/lyr-core/styles/theming' as *;

:host {
  background: nb-theme(background-basic-color-1);
}
```

The variables are listed under [Default Theme Variables](theme/built-in-themes/default-theme).

---

## Where They Are

A theme sets its variables on its class, `nb-theme-<name>`, which `nb-layout` puts on the `body`: everything in the
body can use them, but not `:root` or `html`, which are outside it. Variables of your own that follow the theme's go on
the `body`, or in your components:

```scss
body {
  --app-paper: var(--color-basic-200);
}
```

---

## Multiple Runtime Themes

The styles read [CSS custom properties](theme/customization/css-custom-properties), so with
[Multiple Runtime Themes](theme/customization/enable-multiple-runtime-themes) they follow whichever theme is active,
with nothing more to do. `nb-install-component` puts its content in the component's `:host`:

```scss
@use '@liquid-js/lyr-core/styles/theming' as *;

@include nb-install-component {
  background: nb-theme(background-basic-color-1);
}
```

## Related Articles

- [Style Other Elements](theme/customization/style-other-elements)
- [Design System Theme](theme/design-system/design-system-theme)
- [Enable Customizable Theme](theme/customization/enable-customizable-theme)
- [Create Custom Theme](theme/customization/create-custom-theme)
