# Lyra Migration Instructions

Lyra follows [semantic versioning](https://semver.org/), and its major version tracks the Angular major it supports:

- **major** - targets a new Angular major and may contain breaking changes;
- **minor** - new features and bug fixes, backward-compatible;
- **patch** - bug fixes.

## Migration Steps

1. Run `ng update @liquid-js/lyr-core@22`, where `22` is the desired version, or update the versions in your `package.json`.
   Several packages update at once: `ng update @liquid-js/lyr-core @liquid-js/lyr-auth @liquid-js/lyr-security`.

2. Resolve npm peer-dependency warnings. To update Angular, follow the [Angular update guide](https://angular.dev/update-guide).

3. Follow the migration notes in the [Lyra CHANGELOG](https://github.com/Liquid-JS/lyra/blob/master/CHANGELOG.md), if any.

## Related Articles

- [Migrating from Nebular](docs/migration/migrating-from-nebular)
- [Angular release process](https://angular.dev/reference/releases)
