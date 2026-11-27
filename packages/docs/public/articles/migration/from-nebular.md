# Migrating from Nebular

Lyra continues Nebular 17 with Angular 22 support. Component selectors, directives, CSS classes, theme variables and the `nb-` prefix are unchanged,
apart from the changes listed below, so the migration mostly replaces package names and Sass paths.

## Packages

| Nebular                  | Lyra                           |
| ------------------------ | ------------------------------ |
| `@nebular/theme`         | `@liquid-js/lyr-core`          |
| `@nebular/eva-icons`     | `@liquid-js/lyr-icons`         |
| `@nebular/auth`          | `@liquid-js/lyr-auth`          |
| `@nebular/security`      | `@liquid-js/lyr-security`      |
| `@nebular/moment`        | `@liquid-js/lyr-moment`        |
| `@nebular/date-fns`      | `@liquid-js/lyr-date-fns`      |
| `@nebular/firebase-auth` | `@liquid-js/lyr-firebase-auth` |

Lyra requires Angular 22. Update Angular first, then swap the packages:

```bash
npm uninstall @nebular/theme @nebular/eva-icons @nebular/auth eva-icons
npm install @liquid-js/lyr-core @liquid-js/lyr-icons @liquid-js/lyr-auth
```

`@liquid-js/lyr-icons` ships its icons itself, so `eva-icons` is no longer needed. An app that added icons to
Nebular's `eva` pack through its `NbEvaSvgIcon` class can pass them to `provideNbIcons({ extra })` instead, as markup or
whole SVG files; see [Register Icon Packs](icons/register-icon-packs). The pack and its names are renamed too, see
[Icon pack names](#icon-pack-names).

## Imports and styles

Replace the package names in TypeScript imports and Sass `@use` rules; a project-wide search and replace of the names
in the table above covers both:

```ts
// before
import { NbThemeModule } from '@nebular/theme';
// after
import { NbThemeModule } from '@liquid-js/lyr-core';
```

```scss
// before
@use '@nebular/theme/styles/theming' as *;
// after
@use '@liquid-js/lyr-core/styles/theming' as *;
```

Prebuilt themes move the same way, for example `node_modules/@nebular/theme/styles/prebuilt/default.css`
becomes `node_modules/@liquid-js/lyr-core/styles/prebuilt/default.css` in `angular.json`.

Themes are always CSS custom properties: Nebular's Sass variables mode is gone. Remove
`$nb-enable-css-custom-properties` from your `themes.scss` (Sass reports it as an unknown variable otherwise);
`nb-theme()` gives the variable's `var()`, and `nb-install-component()` just wraps your styles in `:host`. Styles that did
Sass maths or colour functions on `nb-theme()` values need `calc()` or `color-mix()` instead. The prebuilt themes use
the variables too.

Loading `@liquid-js/lyr-core/styles/globals` writes no CSS, so a component's styles can use its breakpoint mixins
without copying the page-wide rules into the component. Those rules (normalize, `.visually-hidden` and the overlays'
structure) come from `nb-theme-base()`, which `nb-theme-global()` includes. A stylesheet that installs component themes
one by one instead of `nb-theme-global()` adds `@include nb-theme-base();` once.

`@liquid-js/lyr-core` has an entry point per component family, e.g. `@liquid-js/lyr-core/card`, and the root
re-exports them all. Importing from the root keeps working, and either way a component's code goes into the bundle of the
route that uses it, rather than the app's first one. `NbDayPeriod` is a plain `enum` instead of a `const enum`, so it
works across them.

## Standalone components

Every component, directive and pipe is standalone. Import them into your components, and replace each `forRoot()`
with its provide function in the application providers:

| Module                                 | Provide function                |
| -------------------------------------- | ------------------------------- |
| `NbThemeModule.forRoot(...)`           | `provideNbTheme(...)`           |
| `NbMenuModule.forRoot()`               | `provideNbMenu()`               |
| `NbSidebarModule.forRoot()`            | `provideNbSidebar()`            |
| `NbDialogModule.forRoot(config)`       | `provideNbDialog(config)`       |
| `NbToastrModule.forRoot(config)`       | `provideNbToastr(config)`       |
| `NbWindowModule.forRoot(config)`       | `provideNbWindow(config)`       |
| `NbDatepickerModule.forRoot()`         | `provideNbDatepicker()`         |
| `NbTimepickerModule.forRoot(config)`   | `provideNbTimepicker(config)`   |
| `NbChatModule.forRoot(options)`        | `provideNbChat(options)`        |
| `NbAuthModule.forRoot(options)`        | `provideNbAuth(options)`        |
| `NbSecurityModule.forRoot(options)`    | `provideNbSecurity(options)`    |
| `NbDateFnsDateModule.forRoot(options)` | `provideNbDateFnsDate(options)` |
| `NbMomentDateModule`                   | `provideNbMomentDate()`         |
| `NbEvaIconsModule`                     | `provideNbIcons()`              |
| `NbFirebaseAuthModule`                 | `provideNbFirebaseAuth()`       |

For `forChild()`, add the same function to the lazy route's `providers`. The NgModules still work, so an app can
migrate one feature at a time.

## Zoneless change detection

Lyra works with and without zone.js. To drop it, add `provideZonelessChangeDetection()` to the application providers
and remove `zone.js` from the `polyfills` in `angular.json`.

## Signals

Components use signal inputs, outputs and queries instead of decorators. Bind inputs in templates as before. In code,
read them by calling them (`badge.status()`), and set them through a binding or, in specs,
`fixture.componentRef.setInput('status', 'danger')`; they can't be assigned. Inputs a component also changes itself are
models, so they support two-way binding (`[(flipped)]`) and can be set with `.set()`.

## Behaviour changes

- Dialogs fade and scale in as they open and out as they close (not with reduced motion). `NbDialogRef.close()`
  removes the dialog and emits `onClose` once it has faded out, about 100ms later; closing it again meanwhile does
  nothing.
- `NbSpinnerService.load()` hides the page spinner when a loader fails too, and returns a promise of the loaders'
  values, which rejects with the first failure; the spinner used to stay up and the failure only went to the console.
- The theme can follow the system and be remembered: `provideNbTheme({ themes, preferences })`, `nb-theme-select`,
  `nb-content-size-switcher` and `NbThemeService.setThemePreference()`/`setContentSize()`; `changeTheme` ignores the
  theme already shown.
- `<label nbLabel [for]="field">` labels a field with `nbValidation`, also a control such as `nb-select`, and marks it
  with a `*` while it's required; the field is `aria-required`.
- Cards can be `appearance="filled"`, tinted without an outer border, and an `nbCardLink` inside a card covers it, so the
  card responds to hover, presses and focus as one while its other buttons stay their own.
- Themes have `background-{status}-color-1…4` and `border-{status}-color-1…5` for every status, and
  `border-primary-color-*` are primary shades instead of grey ones.
- `nb-divider` draws a themed line, optionally `vertical` or with content such as "or" in the middle, and a plain `<hr>`
  in themed content gets the same line.
- The selected menu item has a bar on its start edge (`menu-item-active-indicator-*`), not only a different colour; a
  collapsed parent of the selected item shows it. A horizontal menu marks it by colour alone, as before.
- A list item can be laid out with `nb-list-item-title`, `nb-list-item-description` and `nb-list-item-actions`, and an
  `nbListItemLink` covers the item like `nbCardLink` covers a card.
- `nbTooltip` also takes a template, with `nbTooltipContext` as its `$implicit` context.
- A tooltip is a `tooltip` for assistive technologies and describes its host (`aria-describedby`) while it shows.
- The `hint` trigger, the tooltip's default, also shows on keyboard focus (not the focus a click gives), stays while
  the keyboard focus is in the host, and hides on Escape.
- `nb-slider` picks a number, or a `{ start, end }` range, with steps, ticks, labels, a value above the thumb and a
  vertical layout; leaving out `min` or `max` makes that end open, so any value can be reached, and `transform`
  (`sqrt`, `log` or a function) gives the low end more room.
- `nb-progress-bar` can be a ring: `shape="ring"`, with its value or custom content in the middle.
- `nb-page-indicator` shows the pages of a pager as dots: `[count]` and `[(page)]`, by click or arrow keys.
- `nb-datepicker` and `nb-calendar` can pick a month or a year: `pickerMode="month"` or `"year"`, with the first day
  of the month or year as the value, in the date service's new `getMonthFormat()` or `getYearFormat()` by default.
- `table[nbTable]` is a data table on the CDK table with typed row templates (`*nbCellDef="let user; of: source"`), and
  `nbTableDataSource()` sorts, filters and pages rows in the browser or loads a page from a server with `params`;
  `nb-select-column` selects rows and `*nbDetailRowDef` shows a row's details. `nbSort` takes such a data source, its
  sort headers show its order with `aria-sort`, and `nb-pagination [for]` pages it.
- Two more built-in themes, `material-light` and `material-dark`, follow Material 3's baseline schemes: its tonal
  colours, Roboto, pill buttons in sentence case and outlined fields; the app loads Roboto.
- `@liquid-js/lyr-extras/chart` draws chart.js charts in the theme's colours, following theme changes: `nb-chart`
  with chart.js's own types, and `nb-line-chart`, `nb-bar-chart` and `nb-pie-chart` for series and slices; register
  the chart.js parts in use with `provideNbCharts`.
- The OAuth2 code flow uses PKCE (`authorize.pkce: false` turns it off), and every redirect sends a random `state`
  (or `authorize.state`) that the redirect back must bring, or the sign-in is refused.
- The login form's "remember me" works, and is ticked by default: unticked, the token is kept in `sessionStorage`
  (shared by the app's tabs) instead of `localStorage`. `NbTokenStorage.set` takes `{ remember }`, and storages can
  have `changes`.
- `[nbSkeleton]="loading"` shows an element as a shimmering placeholder in the shape of its content while it loads.
- `NbMenuService` and `NbMenuInternalService` are provided in root, so `NbMenuModule.forRoot()` is no longer required
  for menus inside overlays.
- A menu item with children can have its own page (`link` or `url`): its title goes there and opens its submenu, and a
  separate button, named "{title} submenu", opens and closes it. Menus also select from the URL after a navigation to
  the URL already shown.
- A navigation to a URL that no menu item matches clears the menu's selection, so the previous page's item doesn't stay
  selected. To keep a parent selected on its detail pages, give it `pathMatch: 'prefix'`.
- Dialogs can close when a navigation leaves their page, e.g. with the browser's back button: `closeOnNavigation: true`
  in the dialog config. A navigation that only changes the query or fragment leaves them open.
- Toasts have an opt-in close button and pause-on-hover (`closeButton`, `closeButtonLabel`, `pauseOnHover`,
  `statusIcons`).
- The `@nebular/bootstrap` package is not continued.
- `NbSidebarService`, `NbSearchService`, the calendar model services and the tree grid services are provided in root.
  `NbSearchService` is one instance for the app, so a search field and its listeners connect across lazy modules.
- The `essentials` icon pack, Nebular's `nebular-essentials`, is registered by `NbIconLibraries` itself, not by
  `NbIconModule`.
- `NbThemeModule.forRoot()` provides the native date service; the date-fns and moment packages still replace it.
- `NbCalendarKitModule`, and through it the calendar and datepicker modules, no longer provide `NbDateService` and
  `DatePipe`. A standalone component importing them would get its own native date service and ignore the app's
  date-fns or moment one. The app-wide defaults come from `NbThemeModule.forRoot()` or `provideNbTheme()`, so tests
  that render calendar parts without the theme provide `NbDateService` themselves.
- Templates use the block control flow (`@if`, `@for`).
- `nb-radio-group` has `role="radiogroup"`.
- Calendars work by keyboard and are grids for assistive technologies: arrow keys move between days, months or years,
  Home and End to the start and end of the row, Page Up and Page Down by a month (with Shift, a year) or a page, and
  Enter or Space picks; cells are named with the full date and mark the selection, today and disabled dates. Arrow
  Down in a datepicker's input moves into its calendar, which is a named dialog, and Escape goes back. Tab inside a
  focus-triggered overlay, such as the datepicker's, moves between its controls instead of closing it.
- Fields with an overlay work alike. The datepicker's and timepicker's inputs say they open a dialog and whether it's
  open (`aria-haspopup`, `aria-expanded` and `aria-controls`); the autocomplete's input says it controls its list with
  `aria-controls` instead of `aria-owns`. The timepicker works by keyboard: Arrow Down in its input moves into its
  columns, which are listboxes, where the arrow keys, Home, End, Page Up and Page Down move, Enter or Space picks and
  Tab goes to the next column. Escape closes a select's, autocomplete's or picker's overlay, back in its field, and
  only the overlay: a dialog or window around the field stays open, as dialogs now close on Escape that nothing in
  them handled.
- `nb-button-group` is a form control, as a radio group is (`formControl`, `ngModel`, `formField`), and its value has
  a select's shape: the pressed toggle's value, or `null`, and with `multiple` the pressed toggles' values.
  `valueChange` emitted an array of values before, also without `multiple`.
- `nb-tabset` is a tab list (`tablist`, `tab` and `tabpanel` roles): Tab reaches the selected tab, the arrow keys,
  Home and End the others, and Enter or Space selects one on key down. Tabs, route tabs, stepper steps and accordion
  headers show the keyboard's focus with a ring (`*-outline-width` and `*-outline-color`), and the focus colours only
  for the keyboard. The current route tab and menu link say so with `aria-current="page"`, and the current step with
  `aria-current="step"`.
- The close buttons of alerts and toasts are ghost `nbButton`s with the close icon, as a window's is: light on a filled
  colour, basic otherwise, with the buttons' hover and focus ring. A removable tag outside a tag list has a remove
  button named "Remove ..." (`provideNbTexts({ tag: { remove } })`); in a list, Backspace or Delete removes the active
  tag, as before. A window is a `dialog` named by its title, and popover and context menu hosts that open on click
  have `aria-expanded` and `aria-controls`.
- Floating frames look alike: a window is framed by its own variables (`window-background-color`,
  `window-border-color`, `window-border-radius`, `window-shadow`), which follow a floating card's, a basic toast has no
  visible border (`toastr-basic-border-color` is `transparent`), and a tooltip's border is `solid`.
- `nb-radio` has `checkedChange` (whether it's checked, as a checkbox's) in place of `valueChange`, which emitted its
  value as it was checked; the group's `valueChange` gives the value. Its `blur` output, which never emitted, is gone.
- Renamed, as the same thing is named elsewhere: `nb-tabset` and `nb-route-tabset` emit `tabChange` (was
  `changeTab`), as the stepper's `stepChange`; `nb-pagination`'s page is `page` / `pageChange` (was `pageIndex`), as a
  page indicator's; `nb-breadcrumbs`, `nb-toc` and `nb-qr-code` are named with `aria-label` (was `label`), as other
  components are. The context menu has `nbContextMenuOffset` and `nbContextMenuDisabled`, as a popover has.
- A table or tree grid on its own starts its outer cells' text where a list's items start theirs
  (`table-edge-padding`, `tree-grid-edge-padding`), and its lines are in the list's divider colour; in a card, its text
  starts where the card's does, as before.
- One Escape closes one overlay: the dialog, window, popover, context menu or tooltip opened, or brought to the front,
  last (`NbEscapeStack`). Stacked dialogs close one at a time, a confirmation cancels without its dialog, only the
  window in front closes (not a minimized one), and a dialog that doesn't close on Escape keeps it from what's under
  it. The click and hint trigger strategies say `closesOnEscape` instead of emitting Escape in `hide$`; the overlay
  handler closes them. The search closes on Escape key down, as the overlays do.
- The autocomplete's options are the size of the field it's attached to, as a select's are the select's, instead of
  `medium`; its `size` still sets theirs. The timepicker's popup is framed by its own theme variables
  (`timepicker-background-color`, `timepicker-border-radius` and `timepicker-shadow`, with its `timepicker-border-*`),
  which follow the datepicker's, instead of a card's.
- The timepicker validates: `min` and `max` on `nb-timepicker` disable the times out of range in its list, and its
  input reports `nbTimepickerParse` for text that isn't a time (keeping the last time), and `nbTimepickerMin` or
  `nbTimepickerMax`. Emptying the input clears the value, `null` empties it, typed text stays when the picker closes,
  a time picked in the list is the text the input keeps, and leaving the input and the picker touches the control.
- Controls are reachable with Tab in Safari with its default settings, which skip buttons, links, checkboxes, radios and
  file inputs without an explicit `tabindex`: checkbox, radio, toggle, file drop, alert and toast close buttons, tree
  grid toggles and sort headers, menu items, actions and route tabs set one. Checkboxes, radios and toggles take focus
  when clicked, as they do in other browsers, so they are marked touched in Safari too.
- Dialogs have `role="dialog"`, and `aria-modal="true"` when they have a backdrop; set `role`, `ariaLabelledBy`
  and `ariaDescribedBy` in the dialog config to name and describe them.
- A radio inside `nb-radio-group` takes the group's name when it renders, and options update their checkbox when the
  select's `multiple` changes.
- Components animate with Angular's `animate.enter` / `animate.leave` and CSS, so Lyra no longer needs
  `@angular/animations`, `provideAnimations()` or `BrowserAnimationsModule`; keep them only if the app's own
  animations use them. `ng add` no longer sets them up, and its `animations` option has no effect. Animations are
  skipped when the user prefers reduced motion.
- In the dark and cosmic themes, focused links and tabs get lighter instead of darker, so they stay readable:
  `text-{status}-focus-color` is the status's 300 shade.
- The chat form's message field is a `textarea` that grows with the message, up to `chat-form-input-max-height`:
  Enter sends the message and Shift+Enter starts a new line. With `dropFiles`, pasted files and screenshots are added
  like dropped ones. Styles for `nb-chat-form input` now need `nb-chat-form textarea`.
- Component texts, such as button labels, placeholders, validation messages and the authentication pages, are
  translatable with Angular i18n, as `$localize` messages with ids like `nb.pagination.next`, and can be set with
  `provideNbTexts`; see [Localization](docs/guides/localization). Inputs and options that set texts keep working
  over them. The auth pages' messages read the same everywhere now, e.g. "Password should contain from 6 to 50
  characters".
- Controls of one size share a height, `control-{size}-height` (24, 32, 40, 48 and 56px), made from a field's line
  of text, its padding and its border, so buttons, fields, selects and tag inputs grow together with bigger text and
  line up by their middles in a line of text. They also share where their text starts, `control-{size}-inset` (11,
  15, 19, 19 and 23px from the outer edge, border included), so a button's label and a field's text line up above one
  another; fields, selects and their options start their text 2px further in at medium than in Nebular.
- Containers share the card's inset, 1.5rem: accordions, chats, tabs, the outer columns of a table and a list in a
  card start their text where a card's header does. Accordions look like cards, with a border instead of a shadow.
- `edge="start"` or `"end"` on a button lines up its label or icon, instead of its box, with the content around it,
  e.g. a ghost button at the end of a card header; `inline` keeps it from making its row taller than its label. The
  window's controls, a toast's last action and the pagination's last button (`[edge]="false"` to turn it off) use
  them.
- Cards, chats, accordions, tables and tree grids can be `appearance="floating"`: a shadow instead of a border, for one
  over the page, e.g. a chat opened from a button. `provideNbComponentDefaults({ appearance: 'floating' })` sets it for
  all of them.
- The chat looks like a card, and its send button sits in the corner of the message field, by the last line of a long
  message.
- Windows and confirm dialogs float over the page: a shadow (`card-floating-shadow`) instead of a border.
- A window's `states` sets which of full screen, docked and minimized it can be in, and it has a button to each other
  one; it opens in `initialState` when that's one of them, otherwise in the first. `states: ['docked', 'minimized']`
  keeps a window docked, like a chat.
- A calendar range's corner where it runs on into the next row is square (`calendar-cell-range-joined-border-radius`;
  a theme with gaps between rows can round it).
- Layout fixes that apps used to make with overrides:
  - toasts are at most the viewport width less their margin;
  - dialogs wider or taller than the viewport scroll inside it;
  - the overlay container (`z-index: 1045`) sits above the fixed layout header (1040);
  - `nb-tab` no longer sets `overflow: auto`, which clipped content such as shadows; add it back on a tab whose
    height you constrain;
  - a tabset placed directly in `nb-card` uses the card's padding and divider;
  - `nb-user` cuts long names and titles off with an ellipsis;
  - in a vertical stepper the steps stay at the top, with connectors `stepper-vertical-connector-length` long,
    and the step content takes the remaining width;
  - radio spacing is themeable with `radio-label-padding`, `radio-label-end-padding` and `radio-text-padding`.
  - tags show their text as given; set `tag-text-transform: capitalize` in a custom theme for the previous look.
  - selected filled tags keep their background, which a typo in Nebular's theme made transparent;
  - popovers, tooltips and context menus position themselves again when their content changes size, and when the
    element they belong to moves, e.g. as a sidebar opens beside it;
  - themed scrollbars have the theme's colours in Firefox too, through `scrollbar-color`;
  - disabled ghost buttons stay transparent, as the design intends, instead of turning grey;
  - a window moves focus to its title when it opens, without a focus ring, instead of leaving it on the page;
  - buttons in `nb-button-group` share one border with their neighbours, and the one hovered, pressed or focused
    shows its whole border and focus ring over them;
  - fields start at the width for their size, `input-{size}-width` (13rem for medium), up to `input-{size}-max-width`,
    and fill their container with `fullWidth`; inputs used to take the browser's default width and `nb-form-field`
    stretched to its max-width. Selects follow `select-{size}-width` instead of `select-min-width`, which is no longer
    used, and `nb-file-drop` has `fullWidth` too.
  - fields, buttons and selects of one size line up by their middles in a line of text, and keep their height
    when a reading tool changes the text's line height;
  - a table placed directly in a card drops its cell borders, and the card keeps its rounded corners when the table is
    its first or last part; a list placed directly in a card has no lines of its own over the card's border or
    dividers;
  - a table's selection checkboxes sit in the middle of their rows;
  - button groups keep their dividers beside a hovered or pressed filled or ghost button;

## Icon pack names

The icon pack, its classes and a few theming names no longer carry Nebular's names:

| Nebular                                                                     | Lyra                                                                                                  |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `NbEvaIconsModule`                                                          | `provideNbIcons()`, or `NbIconsModule`                                                                |
| `NbEvaSvgIcon`                                                              | `NbAnimatedSvgIcon`                                                                                   |
| the `eva` pack: `pack="eva"`, `registerSvgIcons('eva', …)`                  | `icons`: `pack="icons"`, `registerSvgIcons('icons', …)`                                               |
| the `nebular-essentials` pack                                               | `essentials`                                                                                          |
| the icons' classes `eva` and `eva-<name>`                                   | `nb-icons` and `nb-icons-<name>`                                                                      |
| `eva-animation`, `eva-infinite`, `eva-icon-<type>`, `eva-icon-hover-<type>` | `nb-icons-animation`, `nb-icons-infinite`, `nb-icons-animate-<type>`, `nb-icons-animate-hover-<type>` |
| `eva-hover`, `eva-parent-hover`                                             | `nb-icons-hover`, `nb-icons-parent-hover`                                                             |
| Sass `$eva-mapping`                                                         | `$nb-mapping`                                                                                         |

An app that names the `eva` pack, or styles the `eva-*` classes, changes those names.

## Icon names

Nebular's icon pack drew 82 of its icons the same in both styles. These line drawings, with nothing to fill, keep only
their outline name: `<nb-icon icon="menu" />` becomes `<nb-icon icon="menu-outline" />`. The names that go:
`activity`, `arrow-back`, `arrow-downward`, `arrow-forward`, `arrow-ios-back`, `arrow-ios-downward`, `arrow-ios-forward`, `arrow-ios-upward`, `arrow-upward`, `arrowhead-down`, `arrowhead-left`, `arrowhead-right`, `arrowhead-up`, `at`, `attach`, `attach-2`, `bar-chart`, `bar-chart-2`, `bluetooth`, `checkmark`, `checkmark-circle`, `checkmark-square`, `chevron-down`, `chevron-left`, `chevron-right`, `chevron-up`, `close`, `code`, `code-download`, `collapse`, `corner-down-left`, `corner-down-right`, `corner-left-down`, `corner-left-up`, `corner-right-down`, `corner-right-up`, `corner-up-left`, `corner-up-right`, `diagonal-arrow-left-down`, `diagonal-arrow-left-up`, `diagonal-arrow-right-down`, `diagonal-arrow-right-up`, `done-all`, `download`, `expand`, `eye-off-2`, `flip`, `flip-2`, `globe`, `hash`, `link`, `link-2`, `list`, `log-in`, `log-out`, `menu`, `menu-2`, `menu-arrow`, `minus`, `more-horizontal`, `more-vertical`, `move`, `percent`, `plus`, `power`, `question-mark`, `radio-button-off`, `refresh`, `repeat`, `search`, `shake`, `shuffle`, `shuffle-2`, `slash`, `swap`, `sync`, `text`, `trending-down`, `trending-up`, `upload`, `wifi`, `wifi-off`.

`square`, `crop`, `scissors`, `paper-plane`, `external-link`, `cast` and `smiling-face` keep both names, with filled
versions drawn for Lyra.

A few icons are named for what they show, as both styles: `car` → `truck`, `maximize` → `zoom-in`, `minimize` → `zoom-out`, `arrow-up` → `caret-up`, `arrow-down` → `caret-down`, `arrow-left` → `caret-left`, `arrow-right` → `caret-right`, `recording` → `voicemail`, `radio` → `broadcast`. The old names are search keywords of the new ones
in the [icon browser](icons/browse-icons).

## Breaking changes

- The styles and the 43 `smart-table-*` theme variables for Akveo's `ng2-smart-table` are removed; Lyra's `nb-table`
  and tree grid have their own. An app that still uses ng2-smart-table can keep the styles in its own stylesheet.
- Theme variables that styled nothing are removed: `input-outline-color`, `input-outline-width`,
  `select-outline-color`, `select-outline-width` and `footer-height`. `menu-submenu-padding` (`0 1.25rem`) is
  replaced by `menu-submenu-start-padding` (`1.25rem`), as a submenu's items are inset at the start only.
- `NbLayoutComponent.veryTopRef` is removed; it queried an element the layout no longer has, so it was always
  `undefined`.
- `nb-select-with-autocomplete` (`NbSelectWithAutocompleteComponent`, `NbSelectWithAutocompleteModule`), which Nebular
  marked experimental, is removed: `nb-select searchable` filters its options as the user types, with the select's
  keyboard and screen reader support.
- Dependencies are injected with `inject()`. Classes extending Lyra services or components call `super()` without
  arguments, and specs create services through the injector (`TestBed.inject` or `runInInjectionContext`) instead of
  `new Service(...)`.
- Services use Angular's `@Service()` decorator instead of `@Injectable()`. Services that were provided in root still
  are, and the others (`@Service({ autoProvided: false })`) still need a provider, as before. Subclasses of Lyra
  services can use either decorator.
- The theme services (`NbThemeService`, `NbMediaBreakpointsService`, `NbJSThemesRegistry`, `NbSpinnerService`,
  `NbLayoutDirectionService`, `NbLayoutScrollService`, `NbLayoutRulerService` and `NbStatusService`) provide
  themselves, and their tokens (`NB_THEME_OPTIONS`, `NB_JS_THEMES`, `NB_MEDIA_BREAKPOINTS`, `NB_LAYOUT_DIRECTION`,
  `NB_DOCUMENT`, `NB_WINDOW`) have defaults. `provideNbTheme()` only sets the options, so a service provided again
  next to it in a lazy route or component is a separate instance.
- Injection tokens are typed: `NB_DATE_ADAPTER` and `NB_AUTH_STRATEGIES` hold arrays, `NB_WINDOW` is
  `(Window & typeof globalThis) | undefined` (undefined outside the browser, so code using it checks for it), and
  `NB_DATE_SERVICE_OPTIONS` is `NbDateServiceOptions`.
- Cards and alerts have no margin below them: `card-margin-bottom` and `alert-bottom-margin` are 0, so the layout
  around them spaces them, e.g. a grid's or a column's `gap`. Cards and alerts stacked with nothing between them
  touch; set the variables in your theme to have the old spacing, `1.875rem` and `1.5rem`. Two tiny cards are as tall
  as a medium one 1.875rem apart.
- The theme's `menu-item-icon-margin` (a margin shorthand, `0 0.5rem 0 0`) is `menu-item-icon-end-margin` (`0.5rem`),
  the gap after a menu item's icon on its end side, so it mirrors in RTL.
- `NbDynamicOverlay` takes `(overlay, overlayContainer, injector)` instead of `(overlay, zone, overlayContainer)`.
- The boolean getters that mirrored host classes (`badge.primary`, `card.small`, `alert.giant` and so on) are gone; the
  classes themselves are unchanged.
- `NbIconComponent.config` takes precedence over `icon`, `pack`, `status` and `options` without overwriting them;
  setting it back to `null` shows the separate inputs again. `renderIcon()` and `html` are no longer public.
- `NbUserComponent.onlyPicture` is an input of its own and no longer changes `showName` and `showTitle`.
- `nb-user` shows its picture as an `<img>` (named with the user's name when the name is hidden) instead of a CSS
  background, so a picture that fails to load gives way to the initials; style it with `.user-image`. Initials take
  whole characters, e.g. an emoji, and a `status` colours their area.
- `NbSpinnerDirective` is driven by its inputs only; `show()`, `hide()`, `setInstanceInputs()`, `spinner` and
  `isSpinnerExist` are gone.
- `NbFlipCardComponent.flipped` and `NbRevealCardComponent.revealed` are models.
- Buttons inside `nb-button-group` read the group's `appearance`, `size`, `shape`, `status` and `disabled` instead of
  the group writing them into each button, so `NbButton.updateProperties()` is gone. `NbButton.properties()` holds the
  values a button renders with. A button with its own `disabled` stays disabled inside an enabled group.
- `NbButtonToggleDirective.pressed` is an input; `isPressed()` holds the current state and `setPressed()` changes
  it. `pressedChange$` and `NbButtonToggleChange` are gone; use the `pressedChange` output or the group's
  `valueChange`, which now emits only when the pressed values change.
- A disabled button sets the `disabled` attribute instead of the `disabled` property.
- `NbCheckboxComponent` and `NbToggleComponent` keep `checked` and `disabled` as inputs; `isChecked()` and
  `isDisabled()` hold the current state, which a user or a form can change. The checkbox's `isIndeterminate()` does
  the same for `indeterminate`. `NbToggleComponent.checkState` is a computed signal, called as before.
- Radios inside `nb-radio-group` read the group's value, name, disabled state and status: `isChecked()`,
  `resolvedName()`, `isDisabled()` and `resolvedStatus()` hold what a radio renders with. `NbRadioGroupComponent.radios`
  is a signal, `select(value)` selects a radio as a user would, and `_setName()` and `_markForCheck()` are gone.
- `NbFormFieldControl` is a single `controlState` signal instead of the `status$`, `size$`, `focused$`, `disabled$`
  and `fullWidth$` observables. `NbInputDirective` drops those observables and exposes `focused()`.
  `NbFormFieldComponent` exposes `prefixClasses()` and `suffixClasses()` instead of `prefixClasses$` and
  `suffixClasses$`, and `shouldShowPrefix` and `shouldShowSuffix` are computed signals.
- `NbLayoutDirectionService` keeps the direction in a signal (`direction()`), so `isLtr()`, `isRtl()` and
  `getDirection()` are reactive.
- `NbSelectComponent`:
  - `selected` is an input; read the current value with `selectedValue()`, and set it from code with
    `writeValue()` or a binding.
  - `selectionModel`, `isOpen`, `isHidden`, `overlayPosition`, `selectButtonClasses`, `options` and `customLabel`
    are signals, and `isDisabled()` holds the disabled state a form can change.
  - `status$`, `size$`, `focused$`, `disabled$` and `fullWidth$` are gone (see `controlState`).
  - `positionStrategy` is read-only.
  - `optionsOverlayOffset` is `overlayOffset`, as on the autocomplete and the pickers.
- `NbOptionComponent`:
  - `value`, `selected`, `multiple` and `withCheckbox` are signals.
  - `disabled` stays a boolean, which also covers a disabled `nb-option-group`, so the CDK key managers keep
    reading it.
  - `setDisabledByGroupState()` and `markForCheck()` are gone, because options read their group's `disabled()`.
  - `NbOptionGroupComponent.options` is gone; an option exposes its `group`.
- `NbAutocompleteComponent.overlayPosition` is a signal the directive sets, and `options`, `optionGroups`, `portal`
  and `list` are signal queries. `NbAutocompleteDirective.autocomplete`, `isOpen` and `isClosed` are signals.
  `overlayHost` is the element the options attach to, which `nb-tag-list` sets. `countGroupLabelsBeforeOption()`
  takes arrays.
- `NbAlertComponent` shows its status with an `appearance`, as buttons do: `filled` (default), `outline` or `accent`,
  also set with the `filled`, `outline` and `accent` attributes. `outline` and `accent` no longer take a status:
  `<nb-alert outline="danger">` becomes `<nb-alert status="danger" outline>`. An outline alert is tinted with its
  status' colour and keeps the normal text colour; an accent alert has the basic background, so an accent no longer
  combines with a filled status. The host classes are `appearance-*` instead of `outline-*` and `accent-*`.
- `NbTagComponent`:
  - `selected` is an input and `isSelected()` holds the current state.
  - `setSelected()` changes the state. `selectedChange` emits for changes a user or the tag list makes, not
    for changes to the bound `selected`.
  - `text()`, `removable()` and the other inputs are signals.
- `NbTagListComponent.tags`, `tagInput` and `autocompleteDirective` are signal queries.
- `NbTagInputDirective.separatorKeys` is a signal.
- `NbFocusKeyManagerFactoryService.create()` and `NbActiveDescendantKeyManagerFactoryService.create()` also
  accept a signal of items, with an injector.
- Accordion:
  - Items register with their accordion, so `NbAccordionComponent.openCloseItems` and
    `NbAccordionItemComponent.accordionItemInvalidate` are gone.
  - `collapsed`, `expanded` and `disabled` are inputs, and `isCollapsed()` and `isExpanded()` hold an item's state.
  - `setCollapsed()` changes the state. `collapsedChange` emits for changes made by a user or the accordion, not
    for changes to the bound inputs.
- `NbStepperComponent`:
  - `selectedIndex` is a model, so it supports `[(selectedIndex)]` and `.set()`. A linear stepper reverts an index
    whose earlier steps aren't completed.
  - `selected` is a computed signal instead of an input; select a step with `step.select()` or
    `stepper.selectStep(step)`.
  - `NbStepComponent.completed` is an input, `isCompleted` holds the completed state, and `interacted` is a
    signal.
- `NbTabComponent.active` is an input and `isActive()` holds the current state. `init`, `tabContentDirective` and
  `tabTitleDirective` are signals. `NbTabsetComponent.tabs` is a signal query.
- `NbSidebarComponent`:
  - A sidebar with no side is at the `start`, so it moves to the right in an RTL page; one that was paired with a
    `right` sidebar pairs with `end` instead (or sets `left`).
  - `state` is a model, so `[(state)]` works and `stateChange` is its change output.
  - `isFixed()` holds the fixed state the responsive mode changes.
  - `side()` replaces the `leftValue`, `rightValue`, `startValue` and `endValue` fields.
  - `expanded`, `collapsed` and `compacted` are computed signals.
- `NbLayoutComponent`:
  - `withScrollValue()` and `withSubheader()` are signals.
  - The `centerValue`, `windowModeValue` and `restoreScrollTopValue` fields are replaced by the inputs.
  - `scrollableContainerRef` and `layoutContainerRef` are signal queries.
  - The layout no longer writes an inline `overflow` style on the body; with `withScroll`, a theme rule hides the
    body's scrollbars while the layout is on the page.
- `NbLayoutHeaderComponent.fixedValue` is a computed signal. The column and footer `*Value` fields are replaced by
  their inputs.
- Popover, tooltip and context menu directives:
  - Their inputs are signals and rebuild the overlay when bound values change. To change one from code, bind
    it to a signal instead of assigning it and calling `rebuild()`.
  - `NbPopoverDirective.isDisabled()` combines `nbPopoverDisabled` and the deprecated `nbTooltipDisabled`.
  - `NbTooltipDirective.context` is a computed signal.
  - The popover, tooltip and context menu components take their content, context and position as signal inputs.
  - `NbPositionedContainerComponent` binds one position class instead of the `top`, `left` and similar getters.
- `NbOverlayContainerComponent`'s `isAttached`, `content` and `isStringContent` are signals, and `portalOutlet` is a
  signal query.
- `NbWindowComponent`'s `isFullScreen`, `docked` and `minimized` are computed signals.
  `NbWindowsContainerComponent.viewContainerRef`, `NbDialogContainerComponent.portalOutlet` and
  `NbWindowComponent.overlayContainer` are signal queries.
- Toasts:
  - `NbToastComponent.toast` is a required signal input, and its outputs are output refs. Use
    `outputToObservable()` or `NbToastRef.onClose` / `onClick` to observe them.
  - `NbToastRef.onClose` and `onClick` are observables, as `NbDialogRef.onClose` is, not methods: `ref.onClose()`
    is now `ref.onClose`.
  - `NbToastrContainerComponent.toasts` is a signal query, and `fadeIn` is a computed signal.
- `NbMenuComponent` and `NbMenuItemComponent` take signal inputs; menu items stay plain objects.
- `NbSearchComponent` and `NbSearchFieldComponent` take signal inputs. `showSearchField`, `searchFieldPortal`,
  `searchButton` and `inputElement` are signals.
- Calendars:
  - `NbCalendarCell` describes a cell with signals: its inputs are `Signal`s and `select` is an `OutputRef`.
    Custom cells declare `input()`s and an `output()` instead of plain fields and an `EventEmitter`.
  - The cell getters (`selected`, `today`, `disabled` and so on) are computed signals.
  - Cells still emit `select`, and the view mode button `changeMode`, after the click is handled.
- `NbCalendarComponent`, `NbCalendarRangeComponent` and `NbBaseCalendarComponent`:
  - `visibleDate` is a model that follows navigation, so `[(visibleDate)]` works.
  - The base calendar's `activeViewMode` is a linked signal seeded by its `startView` input; set it with
    `.set()`.
  - `NbCalendarRangeComponent.range` is a model whose change output is `rangeChange`.
  - The `dayCellComponent`, `monthCellComponent` and `yearCellComponent` inputs fall back to the default cells.
- Datepickers:
  - `NbDatepickerComponent.date` and `NbRangepickerComponent.range` are models. `dateChange` and
    `rangeChange` are their change outputs; subscribe with `outputToObservable(picker.date)` instead of
    `picker.dateChange.subscribe()`.
  - `visibleDate` is a model, and `format` is read through the `format` getter (the input is `formatInput`).
  - `NbDateTimePickerComponent.dateTimeChange` is an output; its `format` getter builds a format when none is set.
- `NbCalendarWithTimeComponent.selectedDate()` holds the date and time being edited.
- `NbTimePickerComponent`:
  - `date` is a model the timepicker directive sets.
  - `computedTimeFormat`, `isAM`, the column options and `showSeconds` are computed signals.
  - `timepickerFormatChange$` is gone; the directive follows `computedTimeFormat()`.
  - The localized texts and the 12-hours default are input defaults.
- `NbTimePickerDirective.timepicker` and `NbDatepickerDirective.datepicker` are signal inputs.
- Chat:
  - `NbChatComponent` passes its status to the form through an effect, and scrolls to the latest message
    after the messages render. `messages`, `chatForm`, `titleTemplate` and `scrollable` are signal queries.
  - `NbChatFormComponent.message` is a model.
  - The form's `status`, `inputFocus`, `inputHover`, `fileOver` and `droppedFiles` are signals.
  - `getInputStatus()` and `getButtonStatus()` are the computed `inputStatus` and `buttonStatus`.
  - `NbChatMessageComponent`'s `reply`, `notReply` and `avatarStyle`, and
    `NbChatMessageFileComponent.readyFiles`, are signals.
  - `NbChatCustomMessageDirective`'s `type` and `noStyles` are computed signals.
- Tree grid:
  - `NbTreeGridComponent`'s `source` (`nbTreeGrid`), `levelPadding` and `equalColumnsWidth` are signal inputs.
  - The column definition's `hideOn` and `showOn` are signal inputs.
  - `NbSortDirective.sortable` is a signal input and `sort` is an output.
  - `NbSortHeaderComponent.direction` (`nbSortHeader`) is a model that changes when the header sorts, so
    `[(nbSortHeader)]` works.
  - `isAscending`, `isDescending`, `iconContext` and `disabledAttributeValue` are computed signals; the latter two
    replace `getIconContext()` and `getDisabledAttributeValue()`.
  - A custom `*nbSortHeaderIcon` template renders again; a template migration had dropped it.
  - The row definitions' `columns` and the column definition's name stay decorated inputs, which the CDK table
    reads.
  - Columns with `hideOn` and `showOn` are hidden and shown again as the window resizes; before, the table kept
    rendering every column. The row definitions' `columns` hold the visible columns, and the cells' `columnWidth` is a
    computed signal.
- `NbIsGrantedDirective.nbIsGranted` is a required signal input. A new permission or resource replaces the previous
  check instead of adding another subscription.
- `@liquid-js/lyr-date-fns` requires `date-fns` 4. Locales are imported by name from `date-fns/locale`, as before.
- `@angular/animations` is no longer a peer dependency of `@liquid-js/lyr-core`.
- Tags placed in an `nb-tag-list` take its size (its input's `fieldSize`, or its `size`) unless they set their own; they
  were `medium`. `NbTagComponent.size` is the size the tag shows, and `size` stays its input. The input's
  `tag-input-min-width` is `3em` (was `6rem`), so a tag and the input share a row at every size.
- The public types no longer use `any`. Values that pass through a component take a type parameter that defaults to
  `unknown`: `NbRadioGroupComponent<T>`, `NbRadioComponent<T>`, `NbSelectComponent<T, M>`, `NbButtonGroupComponent<T>`,
  `NbButtonToggleDirective<T>`, `NbDialogRef<T, R>`, `NbWindowRef<T, R>` and `NbMenuItem<D>`. Contexts, templates (`TemplateRef<unknown>`) and other
  opaque values are `unknown`, so code that read them as `any` needs a type argument or a check. In particular:
  - Select: `selectedChange` is typed by `multiple`: `T | null` for a single select, `T[]` with `multiple`, and
    `NbSelectValue<T>` when `multiple` is a boolean that may be either. A select read through a query is typed as a
    single one; name a multiple one as `NbSelectComponent<City, true>`.
  - Dates: `NbDateService`'s month and weekday names take an `NbDateNameWidth` (`'narrow'`, `'abbreviated'`,
    `'short'` or `'wide'`) instead of Angular's deprecated `TranslationWidth`.
  - Auth: `NbAuthResult<R = unknown>` carries its response type, with `string[]` errors and messages. JWT payloads are
    `NbAuthJWTPayload`, with the registered claims typed and others `unknown`. `NbAuthStrategy<O>` is generic over its
    options, and `getOption()` checks the option path, so a mistyped path no longer compiles.
  - Firebase: `NbFirebaseBaseStrategy<O>` is generic over its options, and successes carry the `UserCredential`.
    `NbFirebaseTwitteStrategy` is spelled `NbFirebaseTwitterStrategy`, with the old name kept as a deprecated alias.
- The libraries compile with `strictNullChecks`, and their types say which values can be missing. Values that were
  `null` only to mean "not set" are now `undefined`; `null` stays where it means something (a strategy's redirect set to
  `null` turns a default redirect off) or comes from the platform. Changes that can affect apps:
  - Auth: `NbAuthResult.getToken()` returns `NbAuthToken | undefined` (was `null` without a token), and its `token`
    parameter is optional. `getTokenExpDate()` returns `Date | undefined` when the token has no expiry.
    `NbTokenService.set()` and `clear()` return `Observable<void>`. `NbAuthTokenParceler.getClassByName()` and
    `parseTokenPack()` can return nothing, and `unwrap()` takes an optional value instead of `null`.
    `NbAuthToken.getPayload()` and `NbAuthJWTToken.getPayload()` return `undefined` (was `null`) without a payload.
    Option getters read through `getDeepFromObject()` return `undefined` instead of `null` for missing keys.
  - Security: `NbAclService.register(role, parent?, abilities?)`, and `NbAclRole.parent` is `undefined` without a parent.
  - Calendar: `NbCalendarMonthModelService.createDaysGrid()` fills the cells outside the month with `undefined`
    (was `null`) when bounding months are off, so day cells' `date` input can be `undefined`. `NbDateService`'s
    `isSame*Safe`, `parse`, `format` and `isValidDateString` take optional arguments.
  - Datepicker: `value` getters return `T | undefined`, adapters take an optional `format`, and
    `NbDateAdapterService.format(null)` returns `''`.
  - Overlays: `NbDynamicOverlay.getContainer()` and `NbOverlayContainerComponent.content()` are `undefined` after
    hiding or detaching (were `null`).
  - Menu: `NbMenuService.getSelectedItem()` first emits `undefined`, and its `item` is `undefined` when nothing is
    selected. Menu and sidebar event payloads carry `tag: string | undefined`.
  - Toastr: `NbToastrService.show()` and its shorthands return `NbToastRef | undefined` (`undefined` for a prevented
    duplicate). `NbToastrConfig.limit` defaults to `undefined`.
  - Window: `NbWindowRef.componentRef` is the component rendered in the window, as with `NbDialogRef`: `undefined`
    for a template and after closing. The window around it, which `componentRef` used to be, is
    `windowComponentRef`, and `componentInstance` is deprecated for `componentRef?.instance`. `onClose` emits
    `R | undefined`, and `NbWindowConfig.viewContainerRef` defaults to `undefined`.
  - `NbLayoutScrollService.scrollTo(x?, y?)` takes `undefined` for an axis to keep, and `onManualScroll()` emits it.
  - `NbIconLibraries.getPack()` returns `NbIconPack | undefined`, and `NbChatMessageComponent.avatarStyle()` is
    `undefined` without an avatar.
  - `NbInfiniteListDirective.threshold`, `NbListPageTrackerDirective.pageSize` and `NbTimePickerCellComponent.value`
    are required inputs.
  - More inputs are required: the calendar pickers' `visibleDate`, `month`, `year`, `cellComponent`, `row`,
    `component` and `weeks`; `date` on the month, year and range month/year cells (day cells stay optional, as empty
    cells exist); `nbCustomMessage`; `NbToastrContainerComponent.position`; `nbFilter` and `nbFilterInput`.
  - `NbWindowService.open()`, `provideNbWindow()` and `NbWindowModule.forRoot()` take an `NbPartialWindowConfig`, and
    `NbWindowConfig.states` holds every state the window can be in. `closeOnBackdropClick` is the app's setting
    (`provideNbWindow()`), not a window's: `open()` takes an `NbWindowOpenConfig` without it, and a click on the
    shared backdrop closes every open window.
  - `NbSearchService.activateSearch()` / `deactivateSearch()` take an optional `searchType`, and a search without a
    `type` no longer adds an `undefined` class to the layout.
- The unused `zone` and `renderer` fields of `NbButton`, `NbCheckboxComponent`, `NbToggleComponent`,
  `NbFormFieldComponent`, `NbInputDirective`, `NbOptionComponent`, `NbSelectComponent`, `NbTagComponent` and
  `NbTagListComponent` are gone. `dynamicOverlayHandler` on the popover, tooltip and context menu directives is
  read-only, and `NbWindowComponent.overlayContainer` is a required query.
- The calendar pickers' view models are computed signals: `weeks` (day picker), `days` (days names), `months`
  (month picker, replacing `initMonths()`), `weekNumbers` (week numbers, replacing `getWeeks()`) and `years`
  (year picker).
- `optionsListClass` on `nb-select` and `nb-autocomplete` is applied with a `[class]`
  binding instead of `NgClass`. It takes a string, an array or an object; a `Set` or object keys
  holding several space-separated classes are no longer supported.
- `NbToastrContainerComponent.fadeIn` is replaced by `slideDirection`, the side toasts slide in from.
- The toggle switcher is positioned from one edge in both states (`left` in LTR, `right` in RTL), and the accordion
  body and menu submenus hold their collapsed state in a `collapsed` class; custom themes that position the switcher
  or set those heights need the same properties.
- Toggles, checkboxes and radios have a `size` input (`tiny` to `giant`, `medium` by default), so their size
  variables have the size in their name, as inputs' do: `toggle-height` is `toggle-medium-height`, and the same goes
  for `toggle-width`, `toggle-switcher-size`, `toggle-switcher-icon-size`, `checkbox-width`, `checkbox-height`,
  `radio-width`, `radio-height` and the `text-font-size`, `text-font-weight` and `text-line-height` of all three.
  Custom themes that set them set the medium ones, and styles that override them on an element, e.g. for a smaller
  toggle, can use `size` instead.
- `@liquid-js/lyr-firebase-auth` uses the modular Firebase and AngularFire APIs instead of `firebase/compat`.
  Provide Firebase with `provideFirebaseApp(() => initializeApp(config))` and `provideAuth(() => getAuth())`
  instead of `AngularFireModule.initializeApp(config)` and `AngularFireAuthModule`. It requires `firebase` 13.
  Custom strategies extending `NbFirebaseBaseStrategy` receive the modular `Auth` instance as `this.auth`
  instead of `AngularFireAuth` as `this.afAuth`.
- Controls take their size from shared theme variables instead of their own padding:
  - buttons, fields (not textareas), selects and tag lists are at least `control-{size}-height` tall, with their
    content in the middle, and have no padding above or below; a textarea's is worked out from the same height;
  - `button-{appearance}-{size}-padding`, `select-{appearance}-{size}-padding` and `input-{size}-padding` are the
    padding at the sides only, the size's `control-{size}-inset` less the control's border; a custom theme that set
    them, e.g. `0.6875rem 1.125rem`, sets the side padding alone, or `control-{size}-inset` for every control of a size;
  - `option-{size}-padding`, `tag-list-with-input-{size}-padding` and `file-drop-{size}-padding` are the padding above
    and below only; options take their sides from the new `option-{size}-padding-inline`, and tag lists and file drops
    from `input-{size}-padding`;
  - hero icon buttons at medium and large are square, as the others are (`icon-button-hero-{medium,large}-padding`).
- Containers have the card's inset and look:
  - `chat-border` is replaced by `chat-border-width`, `chat-border-style` and `chat-border-color`, which follow the
    card's, as `chat-border-radius` and `chat-shadow` do; a chat no longer has a shadow, unless it's
    `appearance="floating"` (`chat-floating-shadow`). `chat-padding` is `1rem 1.5rem`.
  - the accordion's border, radius, padding, shadow and dividers follow the card's (`accordion-border-width`,
    `-style` and `-color` are new); an accordion no longer has a shadow, unless it's `appearance="floating"`. Its
    arrow sits at the end of the header, not over its padding.
  - tabs and tab content are padded `1rem 1.5rem` (`tabset-tab-padding`, `tabset-content-padding`,
    `route-tabset-tab-padding`), and a tab's dot badge sits in the middle of its padding
    (`tabset-tab-badge-dot-mode-horizontal-offset`);
  - a table's or tree grid's outer columns are padded `table-edge-padding` / `tree-grid-edge-padding`, a list item's
    inset, and directly in a card `table-card-edge-padding` / `tree-grid-card-edge-padding`;
  - list items are padded at the sides by `list-item-padding-inline`, the medium controls' inset; in a card, by
    `list-card-edge-padding`, and in a card's body not at all;
  - a horizontal stepper's content has no padding at the sides, so it starts where its first step does.
- The calendar header's buttons line up with the days: the month's starts where the first day does, and the arrows are
  a day big, over the last two days of a week. The header is padded `calendar-navigation-padding: 0.5rem 0.625rem`,
  and the date and time pickers' footers `calendar-picker-padding-start` at both sides, so their buttons start and end
  where the days do.
- The window's buttons are as wide as their icon and padding, with a gap between them, instead of 3rem each in a
  9.5rem row.
- Windows have states instead of button flags: `NbWindowConfig.buttons` (`NbWindowControlButtonsConfig`,
  `NB_WINDOW_DEFAULT_BUTTONS_CONFIG`) is replaced by `states`, the states a window can be in, whose buttons follow
  from them, and `closeButton`. `{ minimize: false }` becomes `states: ['full-screen', 'docked']`, and
  `{ close: false }` becomes `closeButton: false`. The docked state is `NbWindowState.DOCKED` (`'docked'`) instead of
  `MAXIMIZED` (`'maximized'`), `NbWindowRef.maximize()` is `dock()`, and the window's host class is `docked`.
