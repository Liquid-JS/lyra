# What is Lyra?

Lyra is an Angular UI library with a design system of its own: 54 UI components, 6 visual themes, a theme editor, and Auth and Security packages.

Lyra is a maintained fork of [Nebular](https://github.com/akveo/nebular) by Akveo. Components, selectors and theme variables keep their `nb-` prefix,
so an existing Nebular application migrates by switching package names; see [Migrating from Nebular](docs/migration/migrating-from-nebular).

---

## What's included

Lyra is distributed as separate npm packages:

- Lyra Core `@liquid-js/lyr-core`
  - 6 visual themes and a theming engine built on CSS custom properties.
  - UI components with no third-party dependencies.
  - Server-side rendering and right-to-left writing systems.
- Lyra Icons `@liquid-js/lyr-icons`
  - 284 icons for the `nb-icon` component, in outline and fill.
- Lyra Auth `@liquid-js/lyr-auth`
  - Login, register, reset password and restore password pages.
  - Configurable authentication strategies (backend connectors).
  - Token helpers: storing, passing with HTTP requests.
- Lyra Auth for Firebase `@liquid-js/lyr-firebase-auth`
  - Authentication strategies for Firebase applications, built on `@liquid-js/lyr-auth`.
- Lyra Security `@liquid-js/lyr-security`
  - Roles and permissions.
- Lyra Moment `@liquid-js/lyr-moment` and Lyra date-fns `@liquid-js/lyr-date-fns`
  - Adapters that let the date components work with those date libraries.
- Lyra Extras `@liquid-js/lyr-extras`
  - Components built on other libraries, such as a markdown editor, charts and QR codes, each in its own entry point so
    an app only installs the libraries it uses.

---

## Browser support

Lyra supports the browsers [Angular supports](https://angular.dev/reference/versions).

## Have questions?

Look through the [issues](https://github.com/Liquid-JS/lyra/issues) or open a new one.
