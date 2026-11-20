# Lyra icons

[![GitHub license](https://img.shields.io/github/license/Liquid-JS/lyra.svg)](https://github.com/Liquid-JS/lyra/blob/master/LICENSE.txt)
[![npm](https://img.shields.io/npm/dm/@liquid-js/lyr-icons.svg)](https://www.npmjs.com/package/@liquid-js/lyr-icons)
[![scope](https://img.shields.io/npm/v/@liquid-js/lyr-icons.svg)](https://www.npmjs.com/package/@liquid-js/lyr-icons)

Lyra's icon pack for `nb-icon`: SVG icons, most in a fill and an outline style.

## Quick links

- [Icon browser](https://liquid-js.github.io/lyra/icons/browse-icons/)
- [Register icon packs](https://liquid-js.github.io/lyra/icons/register-icon-packs/)
- [Icon component](https://liquid-js.github.io/lyra/components/more/icon/overview/)

### Installing

```sh
npm install --save @liquid-js/lyr-icons
```

### Provide the icons

```ts
import { provideNbTheme } from '@liquid-js/lyr-core'
import { provideNbIcons } from '@liquid-js/lyr-icons'

bootstrapApplication(AppComponent, {
    providers: [
        provideNbTheme(),
        provideNbIcons()
    ]
})
```

`provideNbIcons()` adds every icon to the bundle. To add only the icons the app uses, see
[Register icon packs](https://liquid-js.github.io/lyra/icons/register-icon-packs/).

### Include it in HTML template

```html
<nb-icon icon="star-outline" />
```
