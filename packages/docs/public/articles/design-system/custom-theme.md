# Create Custom Theme

A custom theme is registered like the changes in [Theme Customization](theme/customization/enable-customizable-theme),
under a name of its own and on top of a parent theme, so it only lists what differs.

<div class="note note-info section-end">
  <div class="note-title">Setup Required</div>
  <div class="note-body">
    This guide assumes you already enabled <a href="theme/customization/enable-customizable-theme">Theme Customization</a> 
    and reviewed <a href="theme/design-system/design-system-theme">Design System Theme</a> rules.
  </div>
</div>

The [Theme Editor](theme/theme-editor) builds one interactively: pick a base theme, colours, fonts, corner radius
and text size, see them on components, and copy the result. This guide does the same by hand, for an `aquamarine`
theme with a violet primary colour.

---

## Select parent Theme

Use `dark` as the parent for coloured and dark themes, and `default` otherwise. `aquamarine` is a coloured one, so its
parent is `dark`.

---

## Register new Theme

Register the theme in `themes.scss`:

```scss
@forward '@liquid-js/lyr-core/styles/theming';
@use '@liquid-js/lyr-core/styles/theming' as *;
@use '@liquid-js/lyr-core/styles/themes/dark';

$nb-themes: nb-register-theme((), aquamarine, dark); // <- theme name and a parent theme
```

Then name it in your `provideNbTheme` call (or `NbThemeModule.forRoot` in an NgModule app):

```ts
bootstrapApplication(AppComponent, {
  providers: [
    // ...
    provideNbTheme({ name: 'aquamarine' }),
  ],
});
```

---

## Start with Basic

Basic shades are the source for backgrounds, borders and text colours. In the dark theme, text uses the upper part of
the shades (whitish colours) and backgrounds the lower part.

Set the aquamarine shades, starting with white for `color-basic-100` and finishing with almost black for
`color-basic-1100`:

```scss
@forward '@liquid-js/lyr-core/styles/theming';
@use '@liquid-js/lyr-core/styles/theming' as *;
@use '@liquid-js/lyr-core/styles/themes/dark';

$nb-themes: nb-register-theme(
  (
    color-basic-100: white,
    color-basic-200: #eefafc,
    color-basic-300: #e8f5fa,
    color-basic-400: #d6e6f2,
    color-basic-500: #c7dbeb,
    color-basic-600: #a9c0db,
    color-basic-700: #4f969e,
    color-basic-800: #336a77,
    color-basic-900: #295c66,
    color-basic-1000: #244555,
    color-basic-1100: #121a2b,
  ),
  aquamarine,
  dark
);
```

---

## Tweak backgrounds

To tune the colours further, change which basic shades the backgrounds and borders use. Here they get lighter, by
one shade each:

```scss
background-basic-color-1: color-basic-700,
background-basic-color-2: color-basic-800,
background-basic-color-3: color-basic-900,
background-basic-color-4: color-basic-100,
border-basic-color-1: color-basic-700,
border-basic-color-2: color-basic-800,
border-basic-color-3: color-basic-900,
border-basic-color-4: color-basic-1000,
border-basic-color-5: color-basic-1100,
```

---

## Adjust shadows

Lighter backgrounds may need a lighter shadow:

```scss
shadow: 0 0.5rem 1rem 0 rgba(25, 30, 51, 0.24),
```

---

## Text Colors

Text colours may need a change too. The dark theme's disabled text is a transparent grey from the parent's
`color-basic-transparent-600`; make it an aquamarine shade:

```scss
text-disabled-color: color-basic-600,
```

---

## Primary Color

Lastly, replace the primary blue with violet. `nb-status-palette` makes the shades from the 500 shade:
`color-primary-100` to `-900`, and the transparent `color-primary-transparent-100` to `-600` (the
[theme editor](theme/theme-editor) does the same from a brand colour). Merge them into the theme:

```scss
@use 'sass:map';
@forward '@liquid-js/lyr-core/styles/theming';
@use '@liquid-js/lyr-core/styles/theming' as *;
@use '@liquid-js/lyr-core/styles/themes/dark';

$nb-themes: nb-register-theme(
  map.merge(
    nb-status-palette(primary, #a16eff),
    (
      color-basic-100: white,
      color-basic-200: #eefafc,
      color-basic-300: #e8f5fa,
      color-basic-400: #d6e6f2,
      color-basic-500: #c7dbeb,
      color-basic-600: #a9c0db,
      color-basic-700: #4f969e,
      color-basic-800: #336a77,
      color-basic-900: #295c66,
      color-basic-1000: #244555,
      color-basic-1100: #121a2b,
      background-basic-color-1: color-basic-700,
      background-basic-color-2: color-basic-800,
      background-basic-color-3: color-basic-900,
      background-basic-color-4: color-basic-100,
      border-basic-color-1: color-basic-700,
      border-basic-color-2: color-basic-800,
      border-basic-color-3: color-basic-900,
      border-basic-color-4: color-basic-1000,
      border-basic-color-5: color-basic-1100,
      shadow: 0 0.5rem 1rem 0 rgba(25, 30, 51, 0.24),
      text-disabled-color: color-basic-600,
    )
  ),
  aquamarine,
  dark
);
```

`nb-status-palettes((primary: #a16eff, success: #00d68f))` makes several at once. The shades follow the built-in
themes; pass `material` as the last argument for Material Design shades, whose darker ones stay close to the 500
shade. Shades listed in the second map replace the generated ones, so a palette can also be pasted in by hand:

```scss
color-primary-100: #faf7ff,
color-primary-200: #ece3ff,
color-primary-300: #d5bfff,
color-primary-400: #b18aff,
color-primary-500: #a16eff,
color-primary-600: #7b51db,
color-primary-700: #5a37b8,
color-primary-800: #3e2494,
color-primary-900: #29157a,
```

A status's text, `text-primary-color` and the others, is the status's own colour, so a light colour may read poorly
on the backgrounds. The [theme editor](theme/theme-editor) says by each colour how its text reads and offers the shade
that reaches a 3:1 contrast on backgrounds 1 to 3, or 4.5:1 (WCAG AA for small text) when you tick that; taking it sets
`text-<status>-color` and its hovered, focused and pressed variants, and nothing else. The same goes for the hint text
and the basic colour. It also notes a status colour on which the control text, as a filled button's, reads under the
target, which a darker colour or another `text-control-color` fixes.

The result:

![image](assets/images/articles/design-system/aquamarine-theme.png)

The rest of the theme variables change the same way; they are listed under
[Default Theme Variables](theme/built-in-themes/default-theme).

---

## Related Articles

- [Use Theme Variables](theme/customization/use-theme-variables)
- [Enable Theme Customization](theme/customization/enable-customizable-theme)
- [CSS Custom Properties](theme/customization/css-custom-properties)
