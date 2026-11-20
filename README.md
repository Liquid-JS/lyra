# Lyra

[![GitHub license](https://img.shields.io/github/license/Liquid-JS/lyra.svg)](https://github.com/Liquid-JS/lyra/blob/master/LICENSE.txt)

A customizable Angular UI library: over 50 components, six built-in themes, and Auth and Security packages.

- **[@liquid-js/lyr-core](packages/core)** - components, layout and the theming system
- **[@liquid-js/lyr-icons](packages/icons)** - icons for `nb-icon`
- **[@liquid-js/lyr-auth](packages/auth)** - authentication components and strategies
- **[@liquid-js/lyr-firebase-auth](packages/firebase-auth)** - Firebase authentication strategies
- **[@liquid-js/lyr-security](packages/security)** - roles and permissions
- **[@liquid-js/lyr-moment](packages/moment)** - Moment.js date adapter
- **[@liquid-js/lyr-date-fns](packages/date-fns)** - date-fns date adapter
- **[@liquid-js/lyr-extras](packages/extras)** - components built on other libraries, such as a markdown editor and QR codes

Package majors track the Angular major they support.

## Quick links

- [Documentation](https://liquid-js.github.io/lyra/)
- [Getting started](https://liquid-js.github.io/lyra/docs/guides/install-lyra/)
- [Components](https://liquid-js.github.io/lyra/components/all-components/)
- [Migrating from Nebular](https://liquid-js.github.io/lyra/docs/migration/migrating-from-nebular/)

## Development

This project uses [Yarn 2+](https://yarnpkg.com/) and [Angular CLI](https://angular.dev/tools/cli) for development. To
get started, run `yarn install` in the project root directory.

```sh
yarn start      # playground with every component example
yarn build      # all packages into dist/
yarn test       # unit tests
yarn e2e        # end-to-end tests in Chromium, Firefox and WebKit
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the other scripts and the commit conventions.
