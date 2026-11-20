# Component Defaults

A theme sets how components look; component defaults set which variant they start as. With
`provideNbComponentDefaults`, an app picks its shape, size and appearance once, e.g. round buttons and large fields,
instead of setting them on every component:

```ts
import { provideNbComponentDefaults } from '@liquid-js/lyr-core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNbComponentDefaults({
      shape: 'semi-round',
      size: 'large',
      appearance: 'outline',
      button: { shape: 'round' },
      select: { appearance: 'filled' },
      iconStyle: 'filled',
    }),
  ],
};
```

A component's own inputs still win: `<button nbButton size="small">` stays small.

---

## What they apply to

`shape` and `size` at the top apply to the controls: buttons, button groups, fields (`nbInput`, the phone input and
the colour picker), selects, tags, checkboxes, radios, toggles, sliders and file drops. `appearance` at the top applies
to each type that has that appearance, and the others keep their own: `outline` reaches buttons, button groups, selects,
tags, alerts and the containers (cards, chats, accordions, tables and tree grids), `hero` only buttons, selects and
tags, and `floating`, a shadow instead of a border, only the containers. Each type's own defaults apply over them:

| Type          | Defaults                      |
| ------------- | ----------------------------- |
| `button`      | `shape`, `size`, `appearance` |
| `buttonGroup` | `shape`, `size`, `appearance` |
| `input`       | `shape`, `size`               |
| `select`      | `shape`, `size`, `appearance` |
| `tag`         | `size`, `appearance`          |
| `checkbox`    | `size`                        |
| `radio`       | `size`                        |
| `toggle`      | `size`                        |
| `slider`      | `size`                        |
| `fileDrop`    | `shape`, `size`               |
| `alert`       | `appearance`                  |
| `card`        | `appearance`                  |
| `chat`        | `appearance`                  |
| `accordion`   | `appearance`                  |
| `table`       | `appearance`                  |
| `treeGrid`    | `appearance`                  |
| `user`        | `shape`, `size`               |
| `pagination`  | `size`, `edge`                |

Alerts, cards, avatars (`nb-user`) and pagination aren't controls, so the top-level `shape` and `size` leave them as
they are; a card's or an alert's size is its height. Button toggles take the buttons' appearance, but `filled` for
`hero`, which they don't have.

Shapes follow the theme's `border-radius`: `rectangle` is the radius, `semi-round` three times it, and `round` fully
round. Material 3's buttons are fully round, so with the Material themes give them the round shape:

```ts
provideNbComponentDefaults({ button: { shape: 'round' } });
```

---

## Inside other components

Components that render controls of their own keep them as designed, so the defaults change what you place yourself
without reshaping a calendar or a pagination:

- the shape follows the defaults everywhere, as it's the app's look;
- a component's own controls take its size, e.g. a pagination's buttons and fields, or are fixed where it has none,
  e.g. the calendar header's and the window's buttons and the chat's message field;
- controls that frame a component keep their appearance: ghost window, calendar, pagination and search buttons, the
  pagination's outline page size select, the outline cards of calendars and pickers, and the floating cards of windows
  and confirm dialogs;
- buttons that do a component's main action, such as a date picker's OK, a confirm dialog's confirm button and the
  chat's send button, follow the buttons' defaults, as do the theme select (a select) and the text size switcher (a
  button group).

---

## Changing them at run time

Defaults can be a signal, e.g. for a density setting your users pick. Components follow it as it changes, without
rendering again, and only those whose defaults changed update:

```ts
export const density = signal<NbComponentSize>('medium');

export const appConfig: ApplicationConfig = {
  providers: [provideNbComponentDefaults(computed(() => ({ size: density() })))],
};
```

---

## Icon style

`iconStyle: 'filled'` or `'outline'` draws icons in one style: an icon named in the other style uses this one where its
pack has both. With `filled`, `<nb-icon icon="star-outline">` draws `star`, and the components' own icons follow too.
Icons with one drawing, like the chevrons, stay as they are. Without an `iconStyle`, icons are drawn as named.

---

## Part of an app

Defaults provided by a component apply inside it, over the app's, type by type. For example, a dense data screen:

```ts
@Component({
  selector: 'app-orders',
  providers: [provideNbComponentDefaults({ size: 'small', button: { appearance: 'ghost' } })],
  templateUrl: './orders.component.html',
})
export class OrdersComponent {}
```

The [Theme Editor](theme/theme-editor) previews the defaults with your theme.
