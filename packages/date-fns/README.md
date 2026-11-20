# Lyra date-fns adapter

[![GitHub license](https://img.shields.io/github/license/Liquid-JS/lyra.svg)](https://github.com/Liquid-JS/lyra/blob/master/LICENSE.txt)
[![npm](https://img.shields.io/npm/dm/@liquid-js/lyr-date-fns.svg)](https://www.npmjs.com/package/@liquid-js/lyr-date-fns)
[![scope](https://img.shields.io/npm/v/@liquid-js/lyr-date-fns.svg)](https://www.npmjs.com/package/@liquid-js/lyr-date-fns)

A date service for Lyra's calendars and datepickers that formats and parses native dates with date-fns.

## Quick links

- [Datepicker](https://liquid-js.github.io/lyra/components/forms/datepicker/overview/)
- [Documentation](https://liquid-js.github.io/lyra/)

### Installing

```sh
npm install --save @liquid-js/lyr-date-fns date-fns
```

### Provide the date service

```ts
import { provideNbTheme } from '@liquid-js/lyr-core'
import { provideNbDateFnsDate } from '@liquid-js/lyr-date-fns'

bootstrapApplication(AppComponent, {
    providers: [
        provideNbTheme(),
        provideNbDateFnsDate({
            format: 'dd.MM.yyyy'
        })
    ]
})
```

`format` is the format datepickers use when they set none. `parseOptions`, `formatOptions` and `getWeekOptions` pass
date-fns's options, such as the locale.
