# Register Icon pack

`<nb-icon>` shows an `icon="icon-name"` from a `pack="icon-pack"`, or from the default pack without `pack`.

`@liquid-js/lyr-core` registers one pack, `essentials`: the icons its own components use, such as `close-outline`,
`checkmark-outline` and `chevron-down-outline`, the same as in Lyra's pack below. The components take theirs only from
`essentials`, so they look the same whatever the app's default pack is.

To give the components icons of your own, replace some by name, or the whole pack, which then needs every icon the
components use:

```ts
import { provideNbSvgIcons } from '@liquid-js/lyr-core';

import close from './icons/close.svg' with { loader: 'text' };

providers: [provideNbSvgIcons('essentials', { 'close-outline': close })];
```

`NbIconLibraries.registerSvgPack('essentials', icons)` replaces the whole pack.

## Lyra's icons

`@liquid-js/lyr-icons` provides Lyra's icon pack, `icons`: 465 SVG icons. Most come in a fill and an outline style
(`star`, `star-outline`); line icons with nothing to fill have only their outline name (`menu-outline`), and a few solid
ones only their fill name (`qr-code`). All of them are in the [icon browser](icons/browse-icons).

```sh
npm i @liquid-js/lyr-icons
```

Register the pack in the application's providers:

```ts
import { provideNbIcons } from '@liquid-js/lyr-icons';

bootstrapApplication(AppComponent, {
  providers: [provideNbTheme(), provideNbIcons()],
});
```

It becomes the default pack, so an icon needs no `pack`:

```html
<nb-icon icon="star" />
<nb-icon icon="star-outline" />
```

The icons can animate: `zoom`, `pulse`, `shake` or `flip`, once, endlessly, or on hover. The animations stop for users
who ask their system for reduced motion.

```html
<nb-icon icon="heart-outline" [options]="{ animation: { type: 'pulse', infinite: true, hover: false } }" />
```

### Only the icons an app uses

`provideNbIcons()` brings all the icons into the app's bundle (about 50 kB compressed). An app that knows every icon
name it uses can register just those instead; each icon is exported as `nbIcon` and its name in PascalCase:

```ts
import { nbIconStar, nbIconStarOutline, provideNbIconSet } from '@liquid-js/lyr-icons';

providers: [provideNbIconSet({ star: nbIconStar, 'star-outline': nbIconStarOutline })];
```

An icon that's left out renders nothing.

## Your own icons

### In Lyra's pack

Icons of an app's own can join Lyra's pack, where they render, size and animate like its own. Draw them on a 24 × 24
grid like the pack's, and import the SVG files as text:

```ts
import { provideNbIcons } from '@liquid-js/lyr-icons';

import glutenFree from './icons/gluten-free.svg' with { loader: 'text' };
import vegan from './icons/vegan.svg' with { loader: 'text' };

providers: [provideNbIcons({ extra: { vegan, 'gluten-free': glutenFree } })];
```

```html
<nb-icon icon="vegan" />
```

The pack takes whole SVG files, or just the markup inside `<svg>`. A file drawn on another grid keeps its `viewBox`.
Declare the import's type once, e.g. in `src/svg.d.ts`:

```ts
declare module '*.svg' {
  const content: string;
  export default content;
}
```

To add icons later, e.g. in a lazy route, list `provideNbSvgIcons` after the pack's provider:

```ts
import { provideNbSvgIcons } from '@liquid-js/lyr-core';

export const ROUTES: Routes = [{ path: '', providers: [provideNbSvgIcons('icons', { vegan })], children: [/* … */] }];
```

`NbIconLibraries.registerSvgIcons(pack, icons)` does the same from code, for any registered SVG pack.

### A pack of their own

Icons can also be a pack of their own, whole SVGs by name:

```ts
import { inject, provideEnvironmentInitializer } from '@angular/core';
import { NbIconLibraries } from '@liquid-js/lyr-core';

providers: [
  provideEnvironmentInitializer(() =>
    inject(NbIconLibraries).registerSvgPack('social-networks', {
      facebook: '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24"> … </svg>',
      twitter: '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24"> … </svg>',
    }),
  ),
];
```

```html
<nb-icon icon="facebook" pack="social-networks" />
```

A pack's `createIcon` parameter makes icons of its markup some other way, e.g. wrapping it in an `<svg>` of the pack's
own, as Lyra's pack does; `registerSvgIcons` then adds markup the same way.

## 3rd-party/Custom CSS Pack

An icon font is registered as a font pack. Load its CSS (usually in `angular.json`), then register it:

```ts
providers: [
  provideEnvironmentInitializer(() => {
    const iconLibraries = inject(NbIconLibraries);
    iconLibraries.registerFontPack('font-awesome', { iconClassPrefix: 'fa' });
    iconLibraries.setDefaultPack('font-awesome'); // optional: use it without `pack`
  }),
];
```

`iconClassPrefix` is the class prefix the icons share, so an icon is named without it:

```html
<nb-icon icon="star" pack="font-awesome" />
```

The pack class (e.g. `fas` or `far` for Font Awesome) can be set for the whole pack:

```ts
iconLibraries.registerFontPack('font-awesome', { packClass: 'far', iconClassPrefix: 'fa' });
```

### Ligature font pack

`registerFontPack` supports fonts with ligatures, which render an icon from its name:

```ts
iconLibraries.registerFontPack('material-icons', { ligature: true });
```

## Related Articles

- [Icon browser](icons/browse-icons)
- [NbIconComponent](components/more/icon/overview)
