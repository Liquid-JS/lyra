# Enable Multiple Runtime Themes

Several themes in one app, switched at run time.

<div class="note note-info section-end">
  <div class="note-title">Setup Required</div>
  <div class="note-body">
    This guide assumes you already enabled <a href="theme/customization/enable-customizable-theme">Theme Customization</a> 
    and reviewed <a href="theme/design-system/design-system-theme">Design System Theme</a> rules.
  </div>
</div>

---

## Enable Second Theme

Every registered theme is installed, so loading a built-in theme in `themes.scss` is enough to add it. To change its
variables, register it again with your changes, as with the first theme:

```scss
@forward '@liquid-js/lyr-core/styles/theming';
@use '@liquid-js/lyr-core/styles/theming' as *;
@use '@liquid-js/lyr-core/styles/themes/default';
@use '@liquid-js/lyr-core/styles/themes/dark';

$nb-themes: nb-register-theme(
  (
    text-basic-color: color-basic-900,
    text-disabled-color: color-basic-600
  ),
  default,
  default
);

$nb-themes: nb-register-theme(
  (
    text-basic-color: color-basic-200,
    text-disabled-color: color-basic-600
  ),
  dark,
  dark
);
```

Each theme's variables are written on its `.nb-theme-<name>` class, and [Change Theme in Runtime](theme/customization/changing-theme)
switches between them.

---

## Related Articles

- [Change Theme in Runtime](theme/customization/changing-theme)
- [CSS Custom Properties](theme/customization/css-custom-properties)
- [Create Custom Theme](theme/customization/create-custom-theme)
