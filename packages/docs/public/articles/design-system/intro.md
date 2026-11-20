# Design System

Lyra's components follow a design system of their own: shared rules for colour, type, shape, spacing and states,
kept as theme variables. A theme sets them once, and every component follows.

---

## Principles

Components are built from the same basic elements, with shared styles, so they look and behave alike: a select, an
input and a button of the same size line up, and a status colour means the same everywhere.

The system is built to be customised. Every theme value is a CSS variable, themes inherit from one another, and an app
can also set its components' shapes, sizes and appearances once for all of them.

---

## Built-in themes

- `default` - clean white theme
- `dark` - dark theme
- `cosmic` - alternative dark violet theme
- `corporate` - firm business theme
- `material-light` and `material-dark` - Material 3's baseline light and dark schemes, with Roboto (load the font in
  your app)

Themes inherit from one another: `cosmic` and `material-dark` are built on `dark`, and `dark`, `corporate` and
`material-light` on `default`.

---

## Your own theme

The [theme editor](theme/theme-editor) builds a theme from a few choices, such as status colours, fonts, corners and
component defaults, previews it on real screens, and gives it back as Sass, CSS variables or component defaults.

---

## Related Articles

- [Design System Rules](theme/design-system/design-system-theme)
- [Create Custom Theme](theme/customization/create-custom-theme)
