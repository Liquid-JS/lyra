# Style Other Elements

A third-party component, or markup of your own, can look like the Lyra components around it: `nb-button()`,
`nb-input()` and `nb-panel()` give any element the look of a Lyra button, field or panel. Like Lyra's components,
they read the theme's [CSS custom properties](theme/customization/css-custom-properties), so the element follows
the active theme, also when it [changes at run time](theme/customization/changing-theme).

<div class="note note-info section-end">
  <div class="note-title">Setup Required</div>
  <div class="note-body">
    This guide assumes you already enabled <a href="theme/customization/enable-customizable-theme">Theme Customization</a>.
  </div>
</div>

---

## Style the elements

The mixins come with Lyra's theming, which you use by its package name. Include one in the rule for the element:

```scss
@use '@liquid-js/lyr-core/styles/theming' as *;

// A third-party date range dialog: its panel, its buttons and its fields.
.vendor-range-dialog {
  @include nb-panel(option-list);
  padding: 0.75rem;

  .vendor-apply {
    @include nb-button(filled, primary, small);
  }

  .vendor-cancel {
    @include nb-button(ghost, basic, small);
  }

  input {
    @include nb-input($size: small);
  }
}
```

A third-party component's elements are outside your component's view, so put these rules in your global
`styles.scss`, or in a component with `ViewEncapsulation.None`. If the component's own styles are more specific than
your rule, start the selector with the component's element, as in `vendor-range-picker .vendor-apply`.

---

## Buttons

```scss
@include nb-button($appearance: filled, $status: basic, $size: medium, $shape: rectangle);
```

- `$appearance`: `filled`, `outline`, `ghost` or `hero`.
- `$status`: `basic`, `primary`, `success`, `info`, `warning`, `danger`, `control`, or one of your custom statuses.
- `$size`: `tiny`, `small`, `medium`, `large` or `giant`.
- `$shape`: `rectangle`, `semi-round` or `round`.

The element gets the button's colours, font, padding, height and corners, its focus outline for the keyboard, and its
colours under the pointer, pressed and disabled. Its content is laid out in a line, in the middle, as a button's is.
A Lyra button's icons, spinner and edges are its own.

## Fields

```scss
@include nb-input($status: basic, $size: medium, $shape: rectangle);
```

For an `input` or a `textarea`: the field's colours, font, padding, height and corners, its placeholder, and its
colours with the focus, under the pointer and disabled. The width stays the field's own.

## Panels

```scss
@include nb-panel($kind: option-list);
```

- `option-list`: the list a select or an autocomplete opens, with its background, border, corners, shadow, text and
  scrollbars.
- `popover`: a popover's background, border, corners, shadow and text.

The padding and layout stay the element's own.

---

## Disabled elements

A button or field looks disabled when it's `:disabled`, or has `aria-disabled="true"`. When a third-party component
marks it another way, name that with `$disabled`, a selector appended to the element's:

```scss
.vendor-apply {
  @include nb-button(filled, primary, small, $disabled: '.is-disabled');
}
```

---

## Related Articles

- [Use Theme Variables](theme/customization/use-theme-variables)
- [CSS Custom Properties](theme/customization/css-custom-properties)
- [Enable Customizable Theme](theme/customization/enable-customizable-theme)
