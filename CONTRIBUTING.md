# Contributing to Lyra

- [Questions, Bugs and Features](#issue)
- [Pull Requests](#submit-pr)
- [Repository Structure](#framework-structure)
- [Coding Rules](#rules)
- [New Feature Checklist](#new-feature-checklist)
- [Commit Messages](#commit)

## <a name="issue"></a> Questions, Bugs and Features

Ask questions in [GitHub Discussions][discussions]; [issues][issues] are for bug reports and feature requests.

Before opening an issue, search the existing ones, closed ones included. A bug report needs steps to reproduce,
ideally a minimal repository or StackBlitz, with screenshots and stack traces where they help; an issue without
them is labelled "needs info" and closed after five days without a reply. Fill in the issue form.

To implement a feature, open an issue with a proposal first, so the work can be discussed before it is done; a
small fix can go straight to a pull request.

## <a name="submit-pr"></a> Pull Requests

- Search [open and closed pull requests][pulls] for one that covers your change.
- Branch from `master`, make the change with tests, and follow the [coding rules](#rules).
- Commit with a message in the [commit format](#commit); the change log is generated from it.
- Open the pull request against `Liquid-JS/lyra:master`. The PR check runs the build, lint, unit and e2e tests,
  the playground and docs builds and the smoke app, as described below.

## <a name="framework-structure"></a> Repository Structure

The repository is a Yarn workspace on the Node version in `.nvmrc`. Run `yarn install` in the root, then:

- `yarn start` - serve the playground app with every component example (<http://localhost:4200>)
- `yarn build` - build all packages into `dist/`
- `yarn test` - run the unit tests of every package; `yarn test:schematics` runs the `ng add` schematics tests
- `yarn e2e` - run the Playwright end-to-end tests against the playground in Chromium, Firefox and WebKit
  (`yarn e2e:install` installs the three browsers). It serves the playground built against `dist/` (`yarn build`
  first), or uses one already running on port 4200, such as `yarn start` for the sources; `E2E_BASE_URL` points it
  at another server
- `yarn e2e:safari` - check Safari's Tab order: every Lyra control on every playground page must be reachable with Tab,
  as in Chromium. Safari leaves buttons, links, checkboxes and radios without a `tabindex` out of the Tab order, and
  Playwright's WebKit does the same only on macOS with keyboard navigation off (System Settings → Keyboard), so the
  check skips itself elsewhere
- `yarn lint` - ESLint with the repository's check scripts; `yarn lint:fix` applies fixes
- `yarn lint:sass` - stylelint; `yarn lint:sass:fix` applies fixes
- `yarn lint:html` - format the templates with js-beautify, the formatter VS Code uses for HTML; each package's
  `js-beautify.json` holds the root's options, as `.vscode/settings.json` does, so formatting on save gives the same
  result
- `yarn format:md` - format the docs' articles, the READMEs and this file with the markdown editor's formatter, which
  writes typographic quotes, dashes and ellipses as plain characters and `<hr>` as `---`; `yarn lint` checks them.
  Its settings are in `scripts/remark-config.ts`, which VS Code's remark extension (`unifiedjs.vscode-remark`,
  recommended for the workspace) formats with too
- `yarn docs:serve` - generate the API docs and serve the documentation site (<http://localhost:4100>)
- `yarn docs:example-pictures` - with the docs served, picture each example app's screens for the Examples gallery;
  run it after changing an example app or its theme, and commit the pictures

A pre-commit hook runs the formatters and linters on the staged files, and a commit-msg hook runs commitlint.

Component templates live in `.html` files next to the component; only one-line templates stay inline.

Layout follows what the Angular CLI generates (`ng generate library` / `ng generate application`):

- `packages/<name>/src` - library sources with `src/public-api.ts` as the entry point; `package.json`,
  `ng-package.json` and the tsconfigs sit next to `src`
  - `core` - `@liquid-js/lyr-core`, components and the theming system; `packages/core/schematics` holds `ng add`
  - `extras` - `@liquid-js/lyr-extras`, an entry point per feature (chart, colour picker, markdown, mask, media,
    phone input, QR code)
  - `icons` - `@liquid-js/lyr-icons`, the icons
  - `auth`, `firebase-auth` - `@liquid-js/lyr-auth` and `@liquid-js/lyr-firebase-auth`
  - `security` - `@liquid-js/lyr-security`, ACL
  - `moment`, `date-fns` - date adapters
- `packages/playground` - runnable examples for each feature, also used by the docs and the e2e tests;
  static files live in `public/`, and `backend/` is a small sample API for the auth examples (`node backend/app.js`)
- `packages/docs` - the documentation site; `scripts/docs` generates its API data from the doc comments
- `e2e` - Playwright tests, `smoke` - consumer app that installs the built packages
- `tools/dev-schematics` - generators for playground routes and new components (`ng g .:new-component <name>`)

Libraries import each other's Sass by package name, for example `@use '@liquid-js/lyr-core/styles/theming'`.
`yarn install` links the library style sources into `node_modules/.lyra-styles`, which the builds use as an include path.

Dependencies are declared by role, and `yarn lint` checks the rules (`yarn constraints` and `scripts/check-versions.ts`):

- The root `package.json` only has `devDependencies`: the toolchain and everything the libraries build and test against.
  Workspace scripts run its binaries with `yarn run -T <bin>`.
- Published packages only declare `peerDependencies`.
- The playground and docs apps declare what they run on as `dependencies`, and keep a `devDependency` only when no
  other workspace uses it.
- A package uses the same range everywhere and installs at a single version. If a tool pulls in another copy, align it
  with `resolutions` in the root `package.json`. `yarn constraints --fix` aligns the declared ranges.

## <a name="rules"></a> Coding Rules

- Every feature or fix comes with specs.
- Every public API has a doc comment that says what the signature doesn't: behaviour, defaults, constraints,
  keyboard and ARIA handling. The docs site is generated from them.
- Every component or feature has a playground page, which the docs show as its examples.

## <a name="new-feature-checklist"></a> New Feature Checklist

- lint and tests pass
- a playground page shows it
- its theme variables are in the theme mapping, its `*.theme.scss` in `styles/global/_components.scss` and any
  override in `styles/global/_overrides.scss`
- doc comments are written
- it looks right in every built-in theme, and right to left

## <a name="commit"></a> Commit Messages

Commit messages follow [Conventional Commits][conventional], checked by commitlint on commit, and the change log is
generated from them:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

- The header is at most 100 characters. The subject is imperative and lower case, without a full stop.
- `type` is one of `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore` or `revert`.
  Release commits are made by `yarn release`.
- `scope` is optional, and when given it is a workspace's package name without the `@liquid-js/lyr-` prefix: `core`,
  `extras`, `auth`, `security`, `icons`, `moment`, `date-fns`, `firebase-auth`, `docs` or `playground`.
- The body says why, and what changed from before. Lines in the body are not limited.
- A breaking change starts a footer line with `BREAKING CHANGE:`; a footer may also name the issues the commit closes.
- A revert's header is `revert: ` and the reverted commit's header, with `This reverts commit <hash>.` in the body.

[discussions]: https://github.com/Liquid-JS/lyra/discussions

[issues]: https://github.com/Liquid-JS/lyra/issues

[pulls]: https://github.com/Liquid-JS/lyra/pulls

[conventional]: https://www.conventionalcommits.org/
