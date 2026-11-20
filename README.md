# Lyra

Lyra is a customizable Angular UI library: over 50 components, six built-in themes, and Auth and Security packages.

[Documentation](https://liquid-js.github.io/lyra/) | [Migration guide](https://liquid-js.github.io/lyra/docs/migration/migrating-from-nebular)

## Packages

| Package                                                  | Description                                                                 |
| -------------------------------------------------------- | --------------------------------------------------------------------------- |
| [`@liquid-js/lyr-core`](packages/core)                   | Components, layout and the theming system                                   |
| [`@liquid-js/lyr-icons`](packages/icons)                 | Icons for `nb-icon`                                                         |
| [`@liquid-js/lyr-auth`](packages/auth)                   | Authentication components and strategies                                    |
| [`@liquid-js/lyr-firebase-auth`](packages/firebase-auth) | Firebase authentication strategies                                          |
| [`@liquid-js/lyr-security`](packages/security)           | Roles and permissions (ACL)                                                 |
| [`@liquid-js/lyr-moment`](packages/moment)               | Moment.js date adapter                                                      |
| [`@liquid-js/lyr-date-fns`](packages/date-fns)           | date-fns date adapter                                                       |
| [`@liquid-js/lyr-extras`](packages/extras)               | Components built on other libraries, such as a markdown editor and QR codes |

Package majors track the Angular major they support. Components, selectors and theme variables carry the `nb-` prefix.

## Quick start

```bash
ng add @liquid-js/lyr-core
```

See the [installation guide](https://liquid-js.github.io/lyra/docs/guides/install-lyra) for a manual setup.

## Development

This repository is a Yarn workspace built with the Angular CLI.

```bash
yarn install
yarn start      # playground with every component example
yarn build      # all packages into dist/
yarn test       # unit tests
yarn e2e        # Playwright end-to-end tests in Chromium, Firefox and WebKit
yarn e2e:safari # Safari's Tab order, on macOS
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full list of scripts and the commit conventions.

## License

[MIT](LICENSE.txt).
