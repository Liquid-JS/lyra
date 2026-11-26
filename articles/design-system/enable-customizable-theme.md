# Enable Customizable Themes

Lyra's styles come as prebuilt CSS by default. To customize theme variables, use the Sass sources instead.

<div class="note note-info section-end">
  <div class="note-title">Note</div>
  <div class="note-body">
    You may already have this setup in place, if you used `ng add @liquid-js/lyr-core` and selected customizable themes during the installation process.
  </div>
</div>

---

## Import a theme

Create a `themes.scss` in your `src` folder and import a theme of your choice:

```scss
// import Lyra Theme System and the default theme
@forward '@liquid-js/lyr-core/styles/theming';
@use '@liquid-js/lyr-core/styles/theming' as *;
@use '@liquid-js/lyr-core/styles/themes/default';
```

---

## Modify theme variables

Register your changes with `nb-register-theme`: the changed variables, the theme's name and its parent. Here the text
gets darker and the disabled text opaque:

```scss
@forward '@liquid-js/lyr-core/styles/theming';
@use '@liquid-js/lyr-core/styles/theming' as *;
@use '@liquid-js/lyr-core/styles/themes/default';

$nb-themes: nb-register-theme(
  (
    // color-basic-900 instead of color-basic-800
    text-basic-color: color-basic-900,
    // color-basic-600 instead of color-basic-transparent-600
    text-disabled-color: color-basic-600
  ),
  default,
  default
);
```

A status colour is its nine shades. The [theme editor](theme/theme-editor) makes them from a brand colour, as
`nb-status-palette` does in Sass (see [Create Custom Theme](theme/customization/create-custom-theme)), or set them
yourself, e.g. a violet primary:

```scss
@forward '@liquid-js/lyr-core/styles/theming';
@use '@liquid-js/lyr-core/styles/theming' as *;
@use '@liquid-js/lyr-core/styles/themes/default';

$nb-themes: nb-register-theme(
  (
    // new primary color
    color-primary-100: #faf7ff,
    color-primary-200: #ece3ff,
    color-primary-300: #d5bfff,
    color-primary-400: #b18aff,
    color-primary-500: #a16eff,
    color-primary-600: #7b51db,
    color-primary-700: #5a37b8,
    color-primary-800: #3e2494,
    color-primary-900: #29157a,
    text-basic-color: color-basic-900,
    text-disabled-color: color-basic-600
  ),
  default,
  default
);
```

---

## Enable Lyra Styles

In your `styles.scss` (listed under `"styles": [..]` in `angular.json`):

```scss
// this is our just created themes.scss file, make sure the path to the file is correct
@use 'themes' as *;

// framework component styles
@use '@liquid-js/lyr-core/styles/globals' as *;

// install the framework styles
@include nb-install() {
  @include nb-theme-global();
}
```

`nb-theme-global()` writes every component's styles, and the page-wide rules once: normalize, `.visually-hidden` and the
overlays' structure. To install only some components' themes, include `nb-theme-base()` for those rules, then each
component's theme mixin.

---

## Related Articles

- [Use Theme Variables](theme/customization/use-theme-variables)
- [Create Custom Theme](theme/customization/create-custom-theme)
- [Multiple Runtime Themes](theme/customization/enable-multiple-runtime-themes)
