# Breaking changes

## v22

The first release as Lyra. [Migrating from Nebular](https://liquid-js.github.io/lyra/docs/migration/migrating-from-nebular/)
lists every change in detail.

- **all**: publish the packages as `@liquid-js/lyr-*`; components, selectors and theme variables keep the `nb-` prefix
- **all**: convert to standalone components and provide functions; the modules remain for NgModule apps
- **all**: convert to signal inputs, models and queries, for zoneless change detection
- **all**: inject dependencies with `inject()`; subclasses call `super()` without arguments
- **all**: type public APIs without `any`, and with `strictNullChecks`; unset values are `undefined` instead of `null`
- **lyr-core**: remove `nb-select-with-autocomplete`; use `nb-select searchable`
- **lyr-core**: remove the `ng2-smart-table` styles and the theme variables that styled nothing
- **lyr-core**: `nb-alert` shows its status with `appearance`; `<nb-alert outline="danger">` becomes
  `<nb-alert status="danger" outline>`
- **lyr-core**: `@angular/animations` is no longer a peer dependency
- **lyr-icons**: replace the separate icon packages with Lyra's own pack, `provideNbIcons()`
- **lyr-date-fns**: require `date-fns` 4
