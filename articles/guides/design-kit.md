# Design kit

Lyra's design kit has the components as symbols for design tools, made from the components themselves in the default
theme: every size, shape, appearance, status and state they have in code, with the theme's colours as colour
variables and its typography as text styles. It's for Sketch; Figma and Penpot follow.

`lyra-kit.json` comes with it and maps everything in the kit to code: each symbol to its component and inputs, each
style to the inputs it stands for, each colour variable to its CSS variable. Developers and agents use it to turn a
design into Angular.

**From a design to code, in short:**

1. Write the design's theme to files with the plugin's `theme-files.mjs`, and load it in the app, as
   [For agents](#for-agents) shows.
2. Read a screen's outline with the plugin's `inspect.js` and `outline: true`: its layers, instances and overrides.
3. Look up each instance's symbol in `lyra-kit.json`: its component's `selector` and inputs, its look's inputs from
   `layerStyles`, and its `notes`. [From design to code](#from-design-to-code) has the steps.
4. Lay the components out as the frames are, with the theme's CSS variables and typography classes for the design's
   own layers; **Lyra › Check design** lists what's the design's own.
5. Compare a screenshot of the result with the design.

---

## What's in it

- **Colour variables**: the theme's colours, named by what they're for. `Palette/Primary/500` is
  `--color-primary-500`, `State/Primary/Hover` is `--color-primary-hover`, `Background/Basic/2` is
  `--background-basic-color-2`, `Text/Hint` is `--text-hint-color`.
- **Text styles**: the theme's typography in each text colour, such as `Heading/H1/Basic` or `Caption/C1/Hint`, a
  `Display` size above the headings and `Code` in the theme's third typeface, and components' own fonts, such as
  `Input Text/Medium/Hint`.
- **Symbols**: one for each layout a component has, named by the inputs that change its size or arrangement.
  `Button/Medium/Rectangle/Icon Start` is a medium, rectangular button with an icon before its text. Its texts have
  the fonts of its size.
- **Looks**: layer styles, named by the inputs that change them, such as `Button/Outline/Danger/Hover` for a button's
  `Body`, with the colours of its texts and icons, which are colour variables.
- **Starters**: a symbol with its look chosen, ready to place, such as `Button/Outline/Danger/Default`. Each
  component's board shows its starters by input, with every symbol below them.

Names read the way the inputs do in code: `size`, `shape`, `appearance`, `status`, then the state.

---

## Design with it

Place a starter for a medium component with its look ready, or the symbol for the size and shape you need, and
change it in its overrides:

- **Look**: choose the layer style for the part that has one, e.g. `Button/Ghost/Basic/Default` for a button's
  `Body`, and the colour variables for its texts and icons, e.g. `Text/Basic` for its `Label` and `Icon`. A starter
  shows which colours go with each style.
- **Size and shape**: swap a symbol you placed for another, e.g. `Button/Small/Round`. Its look stays, and its texts
  take the new size's fonts. A starter's look is set inside it, so first choose **Lyra › Unwrap starters** with the
  starters, or the screens that hold them, selected: each becomes the symbol it holds, with the starter's look and
  your overrides set on it, and then keeps them when you swap it.
- **Texts and icons**: override the text; an icon is its `Glyph`, any `Icon/Outline/…` or `Icon/Fill/…` symbol.
- **Components inside components**, such as a dialog's buttons or a table's paginator, are the kit's symbols too, with
  their own overrides.
- **Values**: swap a symbol for the one that shows yours, e.g. `Progress Bar/Bar/Medium/30%` or
  `Slider/Medium/Single/70%`, a calendar's day for its `Calendar Cell/…/Selected`, `Today` or `Range Start`, or a
  stepper's step for its `Stepper Step/…/Completed`, `Current` or `Upcoming`. A user with a picture is
  `User/…/Image`, whose `Image` takes yours. A picture covers its place whatever its shape, cropped as code crops it,
  as do a swatch's and a card's media.
- **Swatches**: `Swatch/…` for a colour, whose `Fill` colour is an override; `/Split` for two, `Fill` and `Second`;
  `/Picture` for a fabric or a pattern, whose `Image` takes yours; and `/Unavailable` for an option that's out of
  stock. The `Selected` look rings the chosen one. In code they're an `nb-swatch-group`, one choice or several.

Swapping keeps your overrides wherever the new symbol has a layer of the same name, as the kit's values do.

Components that take their container's width in code, such as inputs and alerts, stretch when you resize them; buttons,
tags and badges grow with their text, and texts that wrap in code, such as a toast's message, a field's hint or a
textarea's value, wrap at the width you give them; draw a textarea as tall as its text where it grows with its value,
`nbAutosize` in code, or taller, where it keeps its rows and scrolls a longer value. A button as wide as its container,
e.g. a phone's main action, is `Button/…/Full Width`, `fullWidth` in code. Where a component lays its content out by its
width in a way a resized symbol can't, the kit has it at a phone's width too, e.g. `Chat/Phone`, whose messages wrap as
they do there, and `Audio Player/Phone`, which keeps play, the position and mute, as a player narrower than 24rem does.
An audio player's position lengthens as you widen it. A chat's messages wrap at the width their text is drawn at, and
the chat grows down with them; widen a message's text for a longer line, up to its bubble's room, which the theme's
`chat-message-max-width` sets in code, e.g. `75%`. A chat takes the height you give it, as its messages scroll in code:
drawn shorter than its six messages, it shows those that fit. A field with a textarea is `Field/…/Textarea`; a required
field is `Field/…/Required` in every state, as the app marks its label throughout. Keep instances attached: a detached
copy no longer maps to code.

Use the colour variables and text styles for your own layers too, so they map to the theme's variables. Hover, focus
and active looks show what a component looks like as people use it; in code they come with interaction.

An instance of your own symbol drawn at another size scales its shapes but not their borders' widths, as Sketch does:
draw a symbol you place at several sizes, e.g. a show's artwork at 48 and 240 px, with fills rather than borders.

---

## Compose your screens

Menus, tabs, tables, lists, cards and the app's layout hold your content, so the kit also has the parts they're made
of. Stack them in a frame with auto layout to build your own:

- **App layout**: `Layout Header`, `Sidebar/Expanded` or `Sidebar/Compacted`, and `Layout Footer` around your
  content, on `Background/Basic/3`, each resized as your screen needs. The sidebar holds a menu. `Layout/Expanded`,
  `/Compacted` and `/Collapsed` show a whole one, whose `Brand`, `Layout/Brand`, you swap for your logo's symbol.
- **Phones, tablets and laptops**: `Adaptive Layout/Laptop`, `/Tablet` and `/Phone` show one layout at each size: a
  header with the sections as tabs, the actions and the user; on a phone, a top bar whose actions fold into a menu,
  `Route Tabset/Bar/…` with the sections along the bottom, and `/Phone/Drawer`, the drawer with the user and the
  account's links over the page. Design each screen at the sizes it's used at, from these: a phone's is narrower than
  768 px, Lyra's `md` breakpoint, e.g. 390; a tablet's from 768, e.g. 834; a laptop's from 992, e.g. 1440. The
  header's `Brand` is `Adaptive Layout/Brand`: swap it for your logo's symbol, and the tabs make room for it. Build
  your logo's symbol as `Adaptive Layout/Brand` is: the symbol holds one frame, a stack sized to fit, with the mark
  and the wordmark in it; then the logo takes its own size in the slot, where a symbol whose layers sit in it directly
  is squeezed to the slot's. A longer user's name widens the user too.
  The tabs' titles and their icons' `Glyph` are overrides too.
- **Menus**: `Menu Item/…` for each item, by kind: `Icon`, `Collapsed` and `Expanded` for items with children,
  `Child`, `Badge` and `Group`, each also `Selected`. Starters show them at rest, hovered and selected.
- **Actions**: `Action/…` side by side, by size, with an icon alone, a `Dot` or a `Badge`; the `Disabled` look. In
  code, actions after the first have a divider before them, as the `Actions` symbols show, unless it's turned off.
- **Tabs**: `Tab/Text`, `Tab/Icon` or `Tab/Badge` side by side, one of them with the `Active` look; a `Tabset`'s tabs
  are these too. Tabs that link to pages, e.g. a header's navigation, are `Route Tab/…`, an `nb-route-tabset` with
  `outlet="false"` in code, and a phone's along the bottom are `Route Tabset/Bar/3 Tabs` to `/5 Tabs`,
  `appearance="bar"` in a fixed footer, whose tabs are `Route Tab/Bar/…`; one list of tabs serves both, with
  `showIcons="false"` on the header's where its tabs are text. Give the page's tab the `Active` look and
  the others `Default`: its `Link` and `Link Before` take `Route Tab Link/Active` and `Route Tab Link Before/Active`,
  its `Icon` and `Title Text` `Text/Primary/Default`, as the `Route Tab/Bar/Active` starter shows.
- **Tables**: a row of `Table Header Cell/…`, `Unsorted` or sorted by its column, above rows of `Table Cell`.
- **Lists**: `List Item`, one below another.
- **Cards**: a frame with a card's layer style, such as `Card/Outline`, holding a `Card Header` starter for its
  status, a frame with your content, padded as a `Card Body` is, and a `Card Footer`. The card's corners come with the
  theme, as a style can't hold them: until you apply the theme in the design, as [Your brand](#your-brand) says, the
  frame's corners are square, so apply it early, or round the frame by `card-border-radius` yourself. In code, it's an
  `nb-card` with the inputs the style stands for.
- **Dialogs**: `Dialog` is the one `NbDialogService.confirm()` opens, with a title, a message and its two buttons. For
  other content, a card on a layer filled with `Effect/Backdrop`, over the screen: in code, a component of your own
  that `open()` opens.

Each part maps to code as the components do: `lyra-kit.json` says what each part is in its component, e.g. a menu
item's kind is an `NbMenuItem` with `children` or a `badge`, and the table header cell's sort is its column's
`nbSortHeader`.

### Right to left

Lyra lays a page out right to left with `dir="rtl"`: rows run from the right, parts sit at the other end, e.g. a
field's icon or a progress bar's value, and arrows that point along the line point the other way. Sketch has no
right-to-left layout, so design in the kit's direction and let the plugin mirror the screens that need checking:
select them and choose **Lyra › Mirror for right to left**.

- Each selected screen gets a mirrored copy beside the others, named like it with ` · RTL`.
- The kit's components in it become mirrored copies of their symbols, `Right to left/…`, made once on the design's
  **Right to left** page and reused on the next run, with your overrides kept. The design's own symbols, e.g. a logo,
  stay as they are: Lyra doesn't mirror what the app draws itself.
- Texts align to the right and keep their own direction, as Sketch draws them. On the page, English sample text in a
  right-to-left layout reads that way only where its element has `dir="auto"`, as the texts Lyra's components show
  do, e.g. a menu's or a tab's titles, a chat's messages and a toast's; in the app's own markup, without it, its
  punctuation moves to the start of the line. [Right to left](docs/usability/right-to-left-rtl) has a rule that marks the app's text
  elements all at once. Right-to-left text needs nothing.

The copies are for checking, not for handing over as a second design: the app takes one design and lays it out both
ways, and Lyra › Check design leaves them out. Mirror again after you change a screen: the new copy replaces the one
made before, where it was. Delete the Right to left page to mirror the kit's symbols afresh, e.g. after a kit update.

---

## Your brand

The kit follows Lyra's theme as the app does: its colours, fonts, corners, spacing and borders come from the theme's
variables, and the kit's plugin, **Lyra design kit.sketchplugin**, applies them. Install it by double-clicking it.

- **In your copy of the kit**, the **Theme** page lists every variable the kit follows: the colours a theme starts from,
  with the text on filled controls, also each status's own, e.g. dark text on a light warning fill, primary text and
  borders; the foundations; the typography and its text case, e.g. buttons' and tabs'; and each component's own, with
  its value or the formula it follows, e.g. `border-radius * 3` for a semi-round button's corners. Change a value or a
  colour's chip, then choose **Lyra › Apply theme**: everything that follows it changes with it, e.g. every button's
  corners with `border-radius`, and every danger shade and state with `color-danger-500`. Clear a value to follow the
  base theme again. Any other variable in `tokens.json` works too: give it to the theme script, as [For
  agents](#for-agents) shows, and the theme keeps it.
- **From the [Theme Editor](theme/theme-editor)**, its **Design kit** tab gives a script that applies the theme you
  made there in the same way: run it in the kit from Plugins › Run Script.
- **In each design file you hand over**, apply the theme too. The design's symbols and styles come from the kit, as a
  library; the design records the theme, on its Theme page, which shows the theme's own values, and in its settings as
  `lyra-theme`, with its CSS and Sass for the app, which the plugin's `theme-files.mjs` writes to files, so the design
  and the app use one theme.

A theme starts from one of Lyra's themes, as in the Theme Editor: Default, Dark, Cosmic, Corporate, Material Light or
Material Dark. The base theme sets everything your theme doesn't, e.g. Dark's backgrounds, borders, text colours and
shadows, so a dark design starts from Dark and changes only what makes it yours. Pick the base in the Theme Editor:
its script applies your theme over it, and the Theme page names it. The starters boards take the theme's background.

A progress bar's track is the page's own colour, `background-basic-color-3`, and in the Default theme filled basic
buttons and tags are too, `color-basic-300`: they show on cards, `background-basic-color-1`. Placed on the page itself,
they need colours of their own, e.g. `progress-bar-primary-background-color` or `button-filled-basic-background-color`.

Where the kit shows one value for parts the theme can set apart, e.g. buttons' text case in each appearance, Apply
theme says so, with the variables; it warns where the theme makes text hard to read, too. What you change in a design
beyond the theme is the design's own: the app builds it as custom CSS. Beside the Theme board, **For the app** has the
theme two ways, for the app to use one:

- **Sass**, a theme of its own: the app's `themes.scss`, with `provideNbTheme({ name: '<id>' })`, the name it
  registers, e.g. `drumroll` for a theme called Drumroll.
- **CSS**, variables over the base theme: loaded after the base theme's prebuilt CSS, with the base theme's name in
  `provideNbTheme`.

Install your theme's fonts first: Sketch draws text in the fonts installed on your Mac. Use the same fonts the app
loads, e.g. from Google Fonts; their static files, one per weight, work best.

### Kit changes in your designs

When the kit changes, e.g. you apply a theme or take a new Lyra release, save it: Sketch offers the update in each
design that uses the kit as a library, under **Library Updates** at the top right. Accept it, or choose **Lyra ›
Update from kit**, which takes every symbol and style the design uses from the kit at once: instances keep their
overrides, as the kit keeps its layers' identities. Don't place a kit style again to update it, as that adds another
copy. Apply the theme in the design again, to record it for the app.

---

## From design to code

`lyra-kit.json` has:

- `components`: each component's Angular `class`, `selector`, `docs` page and `inputs`, with how each is set in
  code; its `symbols` and `starters` with the inputs they stand for; `follows`, the theme variables its own parts'
  corners, padding, gaps, sizes, borders, fonts and colours follow, which a theme sets for every instance; and
  `notes`, what its drawings take for granted that code does otherwise unless it's set, e.g. a badge drawn in its
  place, which is `position="inline"`.
- `layerStyles` and `textStyles`: the CSS `variables` each style uses, `usedBy`, the component and inputs it stands
  for, and `follows`, the theme variables its border or font follows. Typography styles name their `typography`, its
  CSS variables, and the `class` that gives a text both, e.g. `h4 text-hint`.
- `variables`: each colour variable's CSS variable and value, and `usedBy`: the components' texts and icons whose
  colour it is in a look, with the inputs it stands for there.
- `states`: what each state means in code.

For each instance in a design:

1. Find its symbol in a component's `symbols`, or its starter in `starters`: that's the component and the inputs its
   layout stands for.
2. Look up the layer styles in its overrides in `layerStyles`: their `usedBy` gives the inputs for its look, such as
   `appearance`, `status` and `state`. A part without a layer style, e.g. a text, has its look in its colour: the
   variable's `usedBy` in `variables` gives the inputs for that layer.
3. Write the component's `selector` with those inputs, set as each input's `code` says. `state` isn't an input:
   `states` says what each one is.
4. Text overrides are its content. An icon symbol `Icon/Outline/name` is `<nb-icon icon="name-outline" />`, and
   `Icon/Fill/name` is `<nb-icon icon="name" />`.
5. Its `notes` say what to set for it to look as drawn, and its `docs` page has what the kit doesn't show, such as a
   select's options or a table's data.

A `Button/Small/Rectangle/Icon Start` with the `Body` style `Button/Outline/Danger/Default`, `Text/Danger/Default`
for its label and icon, the text `Delete` and the icon `Icon/Outline/trash-2`. In `lyra-kit.json`, among the rest:

```json
{
  "components": {
    "button": {
      "selector": "button[nbButton],a[nbButton],…",
      "symbols": {
        "Button/Small/Rectangle/Icon Start": {
          "size": "small",
          "shape": "rectangle",
          "icon": "start"
        }
      }
    }
  },
  "layerStyles": {
    "Button/Outline/Danger/Default": {
      "usedBy": [
        {
          "component": "button",
          "inputs": {
            "appearance": "outline",
            "status": "danger",
            "state": "default"
          }
        }
      ]
    }
  }
}
```

In code:

```html
<button nbButton
  size="small"
  shape="rectangle"
  appearance="outline"
  status="danger">
  <nb-icon icon="trash-2-outline" />
  Delete
</button>
```

Write the inputs the design shows: those you leave out follow your app's defaults, or the component's, such as a
`basic` status. Your own layers' colour variables and text styles are CSS variables, e.g.
`color: var(--text-hint-color)`, or a typography style's `class`, e.g. `<h2 class="h4 text-hint">`, or, for
`Display` and `Code`, which have none, its `css` variables, e.g. `font-size: var(--text-display-font-size)`, so the app
follows the theme; a `<pre>` is in `Code` already. **Lyra › Check design** lists what a design does beyond the kit and
its theme, with what each takes in the app: that's the design's own CSS, and the design's own text styles, e.g. a
second display size, or a kit text style changed on a text, as typography classes of the app's own. It lists the
design's own colour variables with their colours, its own symbols, also one swapped into a kit symbol, e.g. a logo in
a layout's brand, and its drawings' gradients and blend modes, e.g. a picture in multiply. A frame with a component's style, e.g. a card composed as above, is that
component, with your content, and a layer with `Effect/Backdrop` is the backdrop Lyra draws under a dialog. Its Check page puts alike things together, e.g. a logo's shapes as one drawing and texts
that look alike as one style to make; the design's `lyra-check` setting has every finding, and the page's `rows`.

`tokens.json` has the theme's variables as design tokens, by group: `button` › `filled-primary-background-color` is
`--button-filled-primary-background-color`. Values tokens can't hold, e.g. a padding with several sides or a text
case, are in their group's `$extensions`, under `io.github.liquid-js.lyra` › `css`, by their CSS variable, e.g.
`--tabset-content-padding`.

---

## For agents

Read the design with the plugin's `inspect.js`, `Contents/Sketch/inspect.js` in the plugin: `require('…/inspect.js')({
document: '<path>' })` returns each screen as a JSON string, or those named in `boards`: every layer's place in its screen, its
frame's stack, its styles and colour variables by name, and each instance's `symbol`, the kit's `component` it is and
its `overrides`, by the names of the layers they change, e.g. `Label stringValue` or `Input/Body layerStyle`. A whole
design is a lot of JSON: read a screen at a time, its outline first with `depth: 1`, whose layers say how many they
hold in `more`, then a part of it by its ID with `layer`. With `outline: true` it returns lines rather than JSON, a
layer a line, indented by depth, with its frame, symbol or style, overrides, text and font: a screen's structure at a
glance. A frame's `stack` has its layout as CSS too, a text's `font` its size, line height, spacing and case as the
file has them, a fill its gradient as CSS, and a layer that blends with what's under it its `blend`, e.g.
`multiply`. With `svg: '<folder>'`, the design's own drawings, e.g. a
logo, a map or a photo, go to that folder as SVG, or PNG for a picture, and each one's `file` names its file. Your
design tool's MCP server or plugin API reads the rest: the design's theme, in its document settings as `lyra-theme`
(`name`, `id`, `base`, `variables`, `css`, `scss`) and on its **Theme** page: use its Sass with `provideNbTheme({ name:
id })`, or its CSS over the base theme. To have them as files, run the plugin's `theme-files.mjs` with Node on the saved
design, `node "…/Contents/Sketch/theme-files.mjs" Design.sketch src/theme`, without Sketch: it writes
`<id>-theme.css`, `<id>-theme.scss` and `<id>-theme.json`.

To apply a theme to the kit, run the plugin's theme script, `Contents/Sketch/theme.js` in the plugin, with the document,
the base theme, the theme's name and its variables: `require('…/theme.js')({ document: '<path>', base: 'dark', name:
'Drumroll', theme: { 'border-radius': '0.75rem' } })`. Without a `base`, the theme goes over Default; the `name` gives
the theme its `id`, e.g. `drumroll`, which `provideNbTheme` takes. Values are CSS, as in the app: another variable is
`var(--text-basic-color)`. A status's `color-<status>-500` gives its other shades and transparencies, and
`color-basic-600` the greys, as the Theme Editor makes them, unless the theme sets them too. Name the document by its
path: copies of a file share its ID. The first theme applied to a document changes everything that follows it, which
takes several minutes for the whole kit; after that, it changes only what follows the variables whose values changed, in seconds, and `full: true`
changes everything again. It works in Sketch's turns: it returns a promise, so a run-code tool may return, or time out,
before it's done, and Sketch runs other scripts only after it, so they wait, or time out too. When it's done, the
document's `lyra-theme-result` setting has what changed, with `finished`, or the `error`, with the `phase` it was in,
e.g. `symbols`; read it before running other scripts on the document. A run started while another is still going, e.g.
one a tool runs again after it timed out, leaves it to finish and returns `alreadyRunning`; a run that changes nothing
keeps the result before it, with `checkedAgain`. Its `check.js` is Lyra › Check design:
`require('…/check.js')({ document: '<path>' })` lists what a design does beyond the kit and its theme, and puts it on
the design's Check page and every finding in its `lyra-check` setting. Its `mirror.js` is Lyra › Mirror for right to
left, for the screens you name: `require('…/mirror.js')({ document: '<path>', boards: ['Home · Phone'] })`. Its
`unwrap.js` is Lyra › Unwrap starters, for the layers you name, and swaps each for `symbol` with its look:
`require('…/unwrap.js')({ document: '<path>', layers: ['<ID>'], symbol: 'Tag/Small/Plain' })`; a starter without an
icon unwrapped to a symbol with one, e.g. `Icon Start`, gives the icon its label's colour. Its `update.js` is Lyra ›
Update from kit: `require('…/update.js')({ document: '<path>' })`. Its `helpers.js` has `resizeLayer`, which resizes
a board or frame without scaling what's in it, `require('…/helpers.js').resizeLayer({ document: '<path>', layer:
'<ID>', height: 1800 })`, and `setCalendarMonth`, which sets a calendar instance to a month, with its title,
weekdays and days, and the days in its other looks: `setCalendarMonth({ document: '<path>', layer: '<ID>', month:
'2026-11', firstDay: 1, selected: [28], today: 27, disabled: [30] })`. Then, with
`lyra-kit.json`:

- Use Lyra's component for every kit symbol in the design, with the inputs the steps above give; don't rebuild one
  from plain elements.
- Use the theme's CSS variables for colours and typography that have a variable or a text style, never their values.
- Lay out the screen with the frames' positions and spacing, as CSS layout around the components.
- Set what a component's `notes` say it needs to look as drawn, e.g. a badge's `position`.
- Read the component's `docs` page for inputs and content the design doesn't show.
- Compare a screenshot of the result with the design.
- A design with phone and laptop screens is one layout in code: the parts that show at one size alone take
  `*nbShownBelow="'md'"` or `*nbShownAbove="'md'"`, actions `collapse="menu" below="md"`, and a phone's drawer is a
  `fixed drawer` sidebar; the `Adaptive Layout` symbols' notes in `lyra-kit.json` show how. What changes in code with
  the size, e.g. how many tabs a header shows, follows `NbThemeService.breakpoint()`, a signal.

### Scripting the kit

Sketch's plugin API, as a run-code tool uses it, has a few traps:

- Find a document by its path, never by what's selected. Sketch gives a file in `/tmp` as `/tmp/…` or
  `/private/tmp/…`; the kit's scripts take either, and your own should compare paths so too.
- A script can't read files: give it the theme's variables, or anything else it needs, in the script.
- Resizing a frame scales what's in it, unless it's a stack or its layers are pinned: size a board before you place
  layers in it, or resize it after with `helpers.js`'s `resizeLayer`, which keeps its layers as they are.
- In a stack, a frame sizes to its content, so one whose layers are placed on their own collapses: set its
  `horizontalSizing` and `verticalSizing` to `sketch.FlexSizing.Fixed`.
- Link a colour to a colour variable with `fill.swatch = swatch`, a text's with `style.textSwatch = swatch`, or an
  override's with `swatchValue = swatch`. A library swatch's `referencingColor` throws where Sketch takes a colour,
  e.g. an override's value or a board's background: give the board a fill linked to the swatch instead.
- Swap an instance's symbol with `instance.symbolId = master.symbolId`, which keeps the overrides on layers the new
  symbol has by name; `instance.master = …` drops them, e.g. a starter's look and its label. A starter's look is
  inside it: unwrap it first, with `unwrap.js` and the `symbol` to swap to.
- An instance doesn't resize to its overrides by itself: after changing a text in a tag or a button, call
  `instance.resizeWithSmartLayout()` so it grows with it; a text of your own with a fixed width wraps again after
  `text.adjustToFit()`.
- An empty text override goes back to the symbol's own text, e.g. a user's title to "Designer": to leave a text out,
  use a symbol without it where the kit has one, e.g. `User/Picture/…` for the picture alone, or a single space, which
  keeps its line.
- A group's frame follows its layers: moving or resizing a layer can move the group's origin, and the other layers'
  places in it. Use a frame for layers you place yourself.
- An override that swaps a symbol holds the symbol's ID: the design's `getSymbols()` names the kit's symbols it uses.
- Add the kit as a library once, with `Library.getLibraryForDocumentAtPath`, then find it in `Library.getLibraries()`;
  `remove()` it when you're done. After the kit changes, e.g. its theme, run `update.js` on the design: Sketch
  syncs the kit's symbols, whose layers carry its looks. The styles your own layers and overrides use, e.g. a starter's
  unwrapped look, sync only while Sketch is the front app with the design in front: run `osascript -e 'tell
  application "Sketch" to activate'`, open the design last, and run `update.js` again; until then its result counts
  them in `stylesFromMenu`. Don't import a library style again to update it:
  Sketch adds another copy, and the layers stay on the old one.
- A text's `style.fontWeight` may read `null` and not change the font, e.g. for a variable font, and a font's
  PostScript name as its `fontFamily` falls back to Helvetica: for a weight the API doesn't set, start from a text
  style that has it, e.g. a heading's, and change its size, line height and case.
- Closing a document from a script saves it: to read a design without changing it, open a copy.
- The kit has thousands of layers: read what you need into plain objects in one script, rather than the whole
  document, and save as you go.
