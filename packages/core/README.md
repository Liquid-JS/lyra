# Lyra

[![GitHub license](https://img.shields.io/github/license/Liquid-JS/lyra.svg)](https://github.com/Liquid-JS/lyra/blob/master/LICENSE.txt)
[![npm](https://img.shields.io/npm/dm/@liquid-js/lyr-core.svg)](https://www.npmjs.com/package/@liquid-js/lyr-core)
[![scope](https://img.shields.io/npm/v/@liquid-js/lyr-core.svg)](https://www.npmjs.com/package/@liquid-js/lyr-core)

Customizable Angular UI components: over 50 components, a layout, and a theming system with six built-in themes.

## Quick links

- [Documentation](https://liquid-js.github.io/lyra/)
- [Getting started](https://liquid-js.github.io/lyra/docs/guides/install-lyra/)
- [Components](https://liquid-js.github.io/lyra/components/all-components/)
- [Theme editor](https://liquid-js.github.io/lyra/theme/theme-editor/)

### Installing

The Angular CLI schematic installs Lyra with its icons and sets up the theme:

```sh
ng add @liquid-js/lyr-core
```

Or by hand:

```sh
npm install --save @liquid-js/lyr-core @liquid-js/lyr-icons @angular/cdk
```

### Provide the theme

```ts
import { provideRouter } from '@angular/router'
import { provideNbTheme } from '@liquid-js/lyr-core'
import { provideNbIcons } from '@liquid-js/lyr-icons'

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes),
        provideNbTheme(),
        provideNbIcons()
    ]
})
```

Add a prebuilt theme to the `styles` in `angular.json`, or install a
[customizable theme](https://liquid-js.github.io/lyra/theme/customization/enable-customizable-theme/):

```json
"styles": [
    "node_modules/@liquid-js/lyr-core/styles/prebuilt/default.css"
]
```

### Import components

```ts
import { NbButtonComponent, NbLayoutColumnComponent, NbLayoutComponent } from '@liquid-js/lyr-core'

@Component({
    ...
    imports: [
        ...
        NbLayoutComponent,
        NbLayoutColumnComponent,
        NbButtonComponent
    ]
})
```

### Include them in HTML template

```html
<nb-layout>
    <nb-layout-column>
        <button nbButton status="primary">Save</button>
    </nb-layout-column>
</nb-layout>
```
