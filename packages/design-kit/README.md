# Design kit generator

Makes Lyra's design kit from the components themselves: the playground renders each component's specimen page, the
generator reads it back as boxes, colours and text, and writes it to a design tool as symbols, styles and colour
variables. The docs' Design kit guide (`packages/docs/public/articles/guides/design-kit.md`) is for the kit's users;
this is for regenerating it.

## Layout

- `src/*.ts`: the generator, run with Node: tokens, capture, the tool-neutral model, the Sketch scripts and the map
  to code. `src/kit.ts` has the model's types and the data each Sketch script takes.
- `src/sketch/`: what runs in Sketch, in TypeScript against `sketch.d.ts`, the parts of Sketch's API the scripts use,
  and `file-format.ts`, what they read of a layer's file format. `component.ts` builds a component, `theme/` applies a
  theme (`values.ts` is its maths, with unit tests), `check.ts` checks a design and `commands.ts` is the plugin's
  menu. The generator bundles each with its data, with esbuild, into a CommonJS script for Sketch's JavaScriptCore.

`yarn workspace design-kit lint` type-checks both sides and lints them; `yarn workspace design-kit test` runs the unit
tests.

## Outputs

All in `dist/design-kit`:

- `tokens.json`: the default theme's variables as design tokens (W3C format), aliases kept.
- `components/<component>.json`: what capture read from each specimen page.
- `kit.json`: the tool-neutral model: symbols, starters, layer and text styles, images.
- `sketch/<component>.<hash>.js`: a script per component that builds it in a Sketch document.
- `sketch/theme.<hash>.js` and `sketch/check.<hash>.js`: the theme script and the design check, and the plugin with
  both, `Lyra design kit.sketchplugin`.
- `lyra-kit.json`: the kit's map to code, published with the kit.

## Regenerate

1. `yarn design-kit:tokens` writes `tokens.json`.
2. `yarn start` serves the playground on port 4200, with the specimen pages at `/design-kit/<component>`. Restart it
   after changing a theme's SCSS: it doesn't rebuild the global theme CSS.
3. `yarn design-kit:capture [component …]` reads the specimen pages, every component unless some are named. It also
   nudges each theme variable a component's rules use, the others held, to record what follows it, and writes the
   theme's formulas from its compiled CSS: run `yarn build` first.
4. `yarn design-kit:model` writes `kit.json`. It stops where a symbol's combinations lay out differently or a style
   name would stand for two looks: add the input that's missing to the component's spec in `components.ts`.
5. `yarn design-kit:sketch <document path> [component …]` writes the Sketch scripts and prints the line that runs each,
   e.g. `require("…/button.1a2b3c4d5e.js")()`, and the theme script, which applies a theme to a document made with
   the kit (`theme` builds it alone).
6. Run each line in Sketch, one component at a time, with the Sketch MCP server's `run_code` or Plugins › Run Script.
   Components another holds go first, e.g. buttons and inputs before dialogs and tables, in the order the model
   lists them. Each run reports its board, its counts and any warnings.
7. `yarn design-kit:manifest` writes `lyra-kit.json`. It reads the docs' API data, so run `yarn docs:prepare` first
   after changing a component's inputs; it stops where a kit input can't be set in code, which `code` in the
   component's spec then explains.

A component's spec (`components.ts`) says which inputs make symbols and which name styles, and its specimen page
(`packages/playground/src/design-kit`) renders every combination of them.

The theme script (`src/sketch/theme/apply.ts`) works a theme's variables out with the compiled formulas, as the browser does,
and moves each colour variable, each style's border and font, and each symbol's corners, padding and gaps as the kit
recorded they follow them: frames keep their bindings in their layers' settings (`lyra-bindings`), and the script
carries the styles'. It shows the theme on a Theme board, where designers change values and apply them again, and
records it for the app in the document's settings (`lyra-theme`). It records the values it applied too
(`lyra-theme-applied`), and next time changes only the colours, styles and frames that follow a variable whose value
changed, and lays out again only the symbols they're in: the theme script's data lists what each symbol depends on. A
component's rebuild clears the record, so the next theme is applied in full. The generator also writes it into the kit's Sketch
plugin, `Lyra design kit.sketchplugin` in `dist/design-kit`, whose Lyra › Apply theme runs it on the front
document: designers install it by double-clicking it.

A rebuild keeps each symbol, and the IDs of its layers by their names, so instances keep their overrides, in the kit
and in designs that use it as a library. Renaming a layer or a symbol, or moving a layer to another parent, gives it a
new ID, and instances lose their overrides of it: rename with care once the kit is published.

The generator builds the components on the kit's foundations, which it doesn't make: the colour variables, the
typography text styles, the icon symbols and the Colors, Typography and Effects pages. They were made once for the Sketch
file; a component's run warns about any it can't find. The docs' Theme Editor updates the colour variables and fonts
from a theme (its Design kit tab).

## Before publishing

- Update the version on the Cover page to the release's.
- Check each changed board against its specimen page: `yarn design-kit:capture --screenshots <dir>` saves a picture of
  each page as it's read. Check the Symbols page for overlaps too.
- Save the Sketch file, and publish it with `lyra-kit.json` and `tokens.json`.

The kit uses Inter, which designers install themselves; it's under the SIL Open Font License.
