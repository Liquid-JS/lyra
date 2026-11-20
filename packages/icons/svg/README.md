# Icon sources

`eva/` holds [Eva Icons](https://github.com/akveo/eva-icons) 1.1.3 as published (MIT, see `eva/LICENSE.txt`), so it
can be compared with or updated from upstream, with these fixes:

- `fill/cloud-download.svg` drew its shapes twice, which made the edges heavier; it draws them once.
- `droplet` and `corner-down-left` (both styles) said `viewBox="0 0 24.1 24.1"` or `24.2`; they say 24, as the pack has
  always drawn them.
- The fill files of the 82 icons Eva drew the same in both styles are gone: those keep only their outline
  name (`scripts/icons.ts` refuses two names with one drawing). `lyra/fill/` has filled versions of seven of them.
- Renamed for what they show: `car` → `truck`, `maximize` → `zoom-in`, `minimize` → `zoom-out`, `arrow-up` → `caret-up`, `arrow-down` → `caret-down`, `arrow-left` → `caret-left`, `arrow-right` → `caret-right`, `recording` → `voicemail`, `radio` → `broadcast`. `lyra/` holds the icons Lyra adds. Both have a `fill/` and an
  `outline/` folder: `name.svg` and `name-outline.svg`, 24×24, filled shapes only.

`yarn icons` writes `src/generated/icons.ts` from these files; `yarn lint` checks it's up to date.
