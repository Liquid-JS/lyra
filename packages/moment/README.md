# Lyra moment adapter

[![GitHub license](https://img.shields.io/github/license/Liquid-JS/lyra.svg)](https://github.com/Liquid-JS/lyra/blob/master/LICENSE.txt)
[![npm](https://img.shields.io/npm/dm/@liquid-js/lyr-moment.svg)](https://www.npmjs.com/package/@liquid-js/lyr-moment)
[![scope](https://img.shields.io/npm/v/@liquid-js/lyr-moment.svg)](https://www.npmjs.com/package/@liquid-js/lyr-moment)

A date service for Lyra's calendars and datepickers that works with Moment.js dates.

## Quick links

- [Datepicker](https://liquid-js.github.io/lyra/components/forms/datepicker/overview/)
- [Documentation](https://liquid-js.github.io/lyra/)

### Installing

```sh
npm install --save @liquid-js/lyr-moment moment
```

Moment.js is only published as CommonJS, so add `moment` to the `allowedCommonJsDependencies` build option to silence
the Angular CLI's warning.

### Provide the date service

```ts
import { provideNbTheme } from '@liquid-js/lyr-core'
import { provideNbMomentDate } from '@liquid-js/lyr-moment'

bootstrapApplication(AppComponent, {
    providers: [
        provideNbTheme(),
        provideNbMomentDate()
    ]
})
```

Calendars and datepickers then take and emit `Moment` objects.
