# RTL

All Lyra components support RTL.

Components that take a position also accept the logical `start` and `end`, which follow the layout direction: `start` is left in LTR and right in RTL.
The sidebar is at the start by default, and `end` puts it on the other side; the physical `left` and `right` keep it on that side in both directions:

```html
<nb-sidebar></nb-sidebar>
<nb-sidebar end></nb-sidebar>
```

The document direction is the fourth argument of `provideNbTheme` (or `NbThemeModule.forRoot`, which takes the same arguments): `NbLayoutDirection.LTR`, the default, or `NbLayoutDirection.RTL`.

```typescript
import { NbLayoutDirection, provideNbTheme } from '@liquid-js/lyr-core';

bootstrapApplication(AppComponent, {
  providers: [
    provideNbTheme({ name: 'default' }, [], undefined, NbLayoutDirection.RTL),
  ],
});
```

<div class="note note-info">
  <div class="note-title">Note</div>
  <div class="note-body">
    Components must be placed inside of the <code>&lt;nb-layout&gt;&lt;/nb-layout&gt;</code> component to correctly support language direction.
  </div>
</div>

For your own components, the `nb-ltr` and `nb-rtl` Sass mixins scope styles to one direction, for values that have no logical form. Pass a property and its value, a block, or both:

```scss
:host {
  @include nb-ltr(padding-left, 1em);
  @include nb-rtl(padding-right, 1em);
}
```

```scss
:host {
  @include nb-ltr() {
    padding-left: 1em;
  }
  @include nb-rtl() {
    padding-right: 1em;
  }
}
```

The mixins only work inside the component's `:host` selector, or `nb-install-component()`, which wraps its content in `:host`.

`NbLayoutDirectionService` holds the direction: `direction()` is a signal, `isLtr()`, `isRtl()` and `getDirection()` read it, `setDirection()` changes it and `onDirectionChange()` emits the changes.

## Text in the other direction

Text in the page's own language needs nothing. Text in the other direction, e.g. English sample text while you check a right-to-left layout, or a user's name, lays out by the page's direction unless its element says otherwise: a full stop or a leading number moves to the other end, so "47 tools" shows as "tools 47". Lyra's components mark the texts they show with `dir="auto"`, so their browser lays each one out by its own direction. Mark your own elements the same way:

```html
<p dir="auto">{{ tool.description }}</p>
```

To mark the app's text elements all at once, e.g. while previewing a right-to-left layout with English text, give them `unicode-bidi: plaintext`. It lays each paragraph out by its own direction, and aligns it by that direction too, so the rule aligns them to the right again. `:where()` keeps the rule's specificity at zero, so your own styles still win:

```css
[dir='rtl'] :where(p, h1, h2, h3, h4, h5, h6, li, dt, dd, label, figcaption, blockquote, td, th) {
  unicode-bidi: plaintext;
  text-align: right;
}
```

Emails, phone numbers and URLs read left to right in both directions: an `nbInput` of type `email`, `tel` or `url` lays them out that way, aligned to the left.

What Lyra marks, and what's left to the app:

- Lyra's own texts, and the content it shows as a label or a message: tab, menu and option titles, tags, toasts, chat messages, the labels of checkboxes, radios and toggles, helper text and the error messages `nb-validation-errors` shows; an `nbValidationError` template's text is yours to mark.
- Your own elements: mark them with `dir="auto"`, inline ones too, e.g. a `<span>` of a card's caption, which the rule above doesn't list.
- Text fields where people may type in the other direction: `dir="auto"` on the `input` or `textarea`, so its text lays out by its own direction as it's typed.
- Text that's partly code or numbers, e.g. "Ages 12+": check it in both directions, as its punctuation moves with the direction around it.

## Layout direction directives

`*nbLtr` and `*nbRtl` render content only in that direction:

```html
<div *nbRtl>This text is visible only when layout direction is RTL</div>
```
