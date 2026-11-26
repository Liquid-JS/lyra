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

## Layout direction directives

`*nbLtr` and `*nbRtl` render content only in that direction:

```html
<div *nbRtl>This text is visible only when layout direction is RTL</div>
```
