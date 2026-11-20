# CSS Custom Properties

Lyra's themes are CSS custom properties. Each installed theme writes its variables once, on its `.nb-theme-<name>`
class, and the components read them with `var()`, so they follow whichever theme an element is in:

```css
.nb-theme-default {
  --color-basic-800: #222b45;
  --text-basic-color: var(--color-basic-800);
  --border-radius: 0.25rem;
  --button-semi-round-border-radius: calc(var(--border-radius) * 3);
}
```

`NbThemeService` puts the theme's class on the `body`. Changing the theme swaps the class, so the whole app takes the
other theme's variables at once, without loading more CSS or reloading the page.

With several themes enabled, the variables they have alike, such as the components' colours that follow a status's,
are written once, for all of them, and each theme's own values after.

---

## Use them in your styles

`nb-theme()` gives a variable's `var()`:

```scss
@use '../../../themes' as *;

.summary {
  background-color: nb-theme(background-basic-color-2);
  border-radius: nb-theme(border-radius);
}
```

In plain CSS, use the variables directly: `background-color: var(--background-basic-color-2)`.

---

## Change them at run time

A variable can be set anywhere CSS can, and everything that refers to it follows, e.g. a corner radius:

```css
.nb-theme-default {
  --border-radius: 0.5rem;
}
```

Variables that refer to other ones follow them too: the semi-round shapes above are three times `--border-radius`, so
they round off with it. The [Theme Editor](theme/theme-editor) works this way, and exports a theme's changes as CSS.

---

## Related Articles

- [Use Theme Variables](theme/customization/use-theme-variables)
- [Create Custom Theme](theme/customization/create-custom-theme)
- [Multiple Runtime Themes](theme/customization/enable-multiple-runtime-themes)
