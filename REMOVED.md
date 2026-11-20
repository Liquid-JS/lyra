# Removed from the Nebular fork

What the fork dropped, deferred or left out relative to `akveo/nebular` at v17.0.0 (`06095546`),
and how to get it back if needed. Restore any file with `git show <commit>^:<old path>`.

## Packages

| Removed | Why | Commit |
|---|---|---|
| `@nebular/bootstrap` (`src/framework/bootstrap`) | Last published as 9.1.0-rc, not built or tested. The docs keep the `.btn` base styles they used from its globals (`packages/docs/src/app/@theme/styles/_buttons.scss`). | `899f8f59` |
| `src/framework/icons` | README-only stub for the 2018 `nebular-icons` package. | `899f8f59` |

## Components

| Removed | Why | Commit |
|---|---|---|
| `nb-select-with-autocomplete` (`NbSelectWithAutocompleteComponent`, `NbSelectWithAutocompleteModule`) | Experimental in Nebular, and duplicated by `nb-select searchable`. | `11740f81` |
| `ng2-smart-table` styles and `smart-table-*` theme variables | Styled Akveo's table add-on, which Lyra doesn't include; `nb-table` and the tree grid have their own. | `bae21d33` |

## Theming

| Removed | Why | Commit |
|---|---|---|
| Sass variables mode (`$nb-enable-css-custom-properties: false`), its `pre-process` and `lazy-process` contexts, `get-current-theme-name()` | Every current browser supports CSS custom properties, which do all it did and change at run time. Themes are always CSS variables; `nb-theme()` is the variable's `var()`. | `12396e30` |

## Documentation site

| Removed | Why | Commit |
|---|---|---|
| Algolia DocSearch (`ngd-search`, `docsearch.js`) | Used Akveo's API key and `nebular` index, so results pointed at the Nebular site. Needs an own index to return. | `c6d3e664` |
| Google Tag Manager snippet, analytics events | Akveo's GTM container. `NgdAnalytics` is kept but disabled. | `c6d3e664` |
| HubSpot forms and CTA (`hubspot-form-dialog`, `hubspot-cta` / services banner, `hs-form.scss`) | Akveo lead capture. | `c6d3e664` |
| Home page "For business" section, Eva Design promo section, hero Demo and Download buttons | Akveo marketing. | `c6d3e664` |
| "Professional Services" page and header menu entry | Akveo services. | `c6d3e664` |
| "Install based on starter kit" guide and ngx-admin notes in install guides | Akveo product (ngx-admin). | `c6d3e664` |
| Akveo Store backend bundle note (auth backend API page) | Akveo product. | `c6d3e664` |
| Migration guides 3.5.0 → 4.0.0 and 2.0.0-rc.8 → rc.9 auth, `packages/core/350-400-*.md` tables | Historical Nebular versions; replaced by "Migrating from Nebular". | `c6d3e664` |
| Google site verification file, Akveo logo asset | Akveo property. | `c6d3e664` |
| UTM tracking parameters on outbound links | Akveo campaign tracking. | `c6d3e664` |
| Multi-version docs builder (`tools/deploy-docs`) and version switcher entries | Only the current version is published; the switcher shows it alone. | `64887bc2` |

## Tooling

| Removed | Replaced by | Commit |
|---|---|---|
| gulp and all gulp tasks (`tools/gulp`, `gulpfile.js`) | Node scripts in `scripts/` and package scripts | `64887bc2`, `4b6147f7` |
| typedoc 0.12 + `doc-prsr` | `scripts/docs/api.ts` (TypeScript compiler API) | `64887bc2` |
| Protractor e2e (`protractor.conf.js`, `e2e/*` Protractor specs) | Playwright | `5f11c4a1` |
| BrowserStack launcher, tunnel and committed credentials in CI | Local headless Chromium (Puppeteer, then Playwright) | `4b6147f7`, `11a1d016` |
| codecov upload and `codecov.yml` | none yet | `4b6147f7` |
| Prettier, `eslint-config-prettier`, `stylelint-config-prettier`, `.lintstagedrc*.json` | ESLint `@stylistic` rules, stylelint 17, lint-staged config in `package.json` | `d9c0d8c4`, `4b6147f7` |
| npm and `package-lock.json` | Yarn 4 workspaces (`yarn.lock`) | `4b6147f7` |
| `@angular-devkit/build-angular` | `@angular/build` | `4b6147f7` |
| gulp version bump, `conventional-changelog-cli`, `tools/publish.sh` | lerna-lite version, `scripts/publish.ts` | `4b6147f7` |
| `ts-node`, `npm-run-all`, `del`, `fs-extra`, `colors.js`, `jasmine-spec-reporter`, `jasmine-fail-fast` | Node built-ins, Yarn workspace scripts | `4b6147f7`, `64887bc2` |
| Smoke project's karma unit test, ESLint target and `@nguniversal` `serve-ssr` / `prerender` targets | Playwright check plus the application builder's built-in SSR | `5f11c4a1` |
| Custom `test.ts` entry points and `polyfills.ts` files | The unit-test builder's generated entry; the `zone.js` polyfills live in `core:test-build` | CLI alignment, `11a1d016` |
| `rimraf` (only used to clear `dist/`) | `fs.rmSync` in the `prebuild` script | dependency cleanup |
| Per-package `dependencies` and `devDependencies` in the published packages | `peerDependencies` only; the toolchain lives in the root `devDependencies` | dependency cleanup |
| `body-parser` in the playground backend | `express.json()` / `express.urlencoded()` (Express 5) | ESM switch |
| Karma, Jasmine, `karma.conf.js`, `@types/jasmine` and Puppeteer | Vitest in headless Chromium through `@vitest/browser-playwright`, on the unit-test builder | `11a1d016` |
| `@angular/animations`, `provideAnimations()` / `BrowserAnimationsModule` | `animate.enter` / `animate.leave`, CSS transitions and measured-height animations | `6a76e219`, `3037c1fc` |
| Playground and docs feature and routing NgModules | `*.routes.ts` files with route-level providers | `10b91aa1`, `09d7fded` |
| NgModule bootstrap of the apps and the smoke project | `bootstrapApplication` with the `provideNb*()` functions | `0fb92b59`, `c7ba4597` |

Removed root scripts: `build:packages*`, `build:prod`, `build:wp`, `start:prod`, `test:packages`, `test:wp`,
`test:coverage`, `ci:lint`, `docs:gh-pages`, `docs:prod`, `docs:start`, `docs:copy-index`, `docs:dirs`,
`docs:sitemap`, `release:validate`, `version:bump`, `version:changelog`. Their equivalents are listed in `CONTRIBUTING.md`.

## Not adopted from forks and upstream PRs

| Change | Status |
|---|---|
| myfokus/nebular rebuild of components on signals with OnPush | Not merged: Lyra moved to signals itself, with `model()` for the members apps set. |
| akveo/nebular#2635 `nbTagInput` component | Not merged: new component, needs review. |
| akveo/nebular#3316 ThreatCrush CI scanner | Not merged: third-party service. |
| akveo/nebular#3249 Sass warning fix | Not needed: already fixed upstream. |

## Deferred, still to do

- Specs are compiled JIT (`aot: false` in `core:test-build`), because the overlay specs swap directive providers with
  `TestBed.overrideDirective`, which code compiled ahead of time doesn't allow. `yarn lint` type-checks their templates
  with `ngc` instead (`scripts/check-spec-templates.ts`).

## Kept on purpose

- Lint rules off: `no-input-rename`, `no-output-native`, `no-output-on-prefix` and `component-selector` (libraries
  and playground) match the published API, and `prefer-on-push-component-change-detection` flags the containers that
  check eagerly on purpose.
- `NbNativeDateService` reads locale data through Angular's deprecated `getLocale*` functions rather than `Intl`, so
  names come from the bundled locale data and are the same in every browser; `Intl` also has no two-letter weekday
  names for the calendar header. `NbDateService` takes Lyra's own `NbDateNameWidth` instead of `TranslationWidth`.
