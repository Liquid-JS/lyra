# Install Lyra

---

## Using Angular CLI

In a project made with the [Angular CLI](https://angular.dev/tools/cli), the schematic installs and configures Lyra:

```bash
ng add @liquid-js/lyr-core
```

It adds `@liquid-js/lyr-core`, `@angular/cdk` and `@liquid-js/lyr-icons`, provides the theme, the icons and the
router, installs the theme you pick (as customizable SCSS, or as the prebuilt CSS with `--no-customization`) and
wraps the root component in `nb-layout` (skip it with `--no-layout`). Lyra's theme styles every component, about 740 kB
of CSS before it's compressed, more than a new app's budget allows, so it raises the `initial` budget in
`angular.json` to `2mb`. That's it.

Something to know before your first build:

- Lyra ships no fonts. The default theme uses Inter: load it in your `index.html`, e.g. from Google Fonts, or set your
  own in your theme.

---

## Manually

### Install Lyra modules

```bash
npm install --save @liquid-js/lyr-core @angular/cdk
```

Lyra's icons are a package of their own:

```bash
npm install --save @liquid-js/lyr-icons
```

See [Register Icon Packs](icons/register-icon-packs), and the [icon browser](icons/browse-icons) for all the icons.

Auth and Security are `@liquid-js/lyr-auth` and `@liquid-js/lyr-security`.

### Configure Lyra

Provide the theme in the application providers:

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideNbTheme } from '@liquid-js/lyr-core';

bootstrapApplication(AppComponent, {
  providers: [
    // `{ name: 'dark' }` starts with the dark theme instead
    provideNbTheme(),
  ],
});
```

Lyra's components use the router, so the providers also need `provideRouter(routes)`.

Then import the components you use into your standalone components, for example `imports: [NbLayoutComponent, NbButtonComponent]`.
Services that need configuration have a provide function, such as `provideNbDialog()`, `provideNbToastr()` or `provideNbMenu()`;
each component's Installation section lists what it needs.

With NgModules, import `NbThemeModule.forRoot()` in the app module and the component modules in your feature modules:

```ts
import { NbThemeModule } from '@liquid-js/lyr-core';

@NgModule({
  imports: [
    // ...
    NbThemeModule.forRoot(),
  ],
})
export class AppModule {}
```

In the same way, `provideNbAuth()` (or `NbAuthModule.forRoot()`) sets up Auth, see [Auth Module](extras/auth/introduction) and its [installation](extras/auth/installation).

### Install Styles

Add a prebuilt theme to the `styles` of your `angular.json`:

```json
"styles": [
  "node_modules/@liquid-js/lyr-core/styles/prebuilt/default.css"
],
```

The prebuilt themes are `default`, `dark`, `cosmic`, `corporate`, `material-light` and `material-dark`.

The theme is about 740 kB of CSS before it's compressed, more than a new app's budget allows: raise the `initial`
budget in `angular.json`, e.g. its `maximumWarning` to `2mb` and its `maximumError` to `3mb`.

<div class="note note-info">
  <div class="note-title">Customizable Theme Configuration</div>
  <div class="note-body">
    To change theme variables or switch between several themes at run time, see <a href="theme/customization/enable-customizable-theme">Enabling Customizable Theme</a> and <a href="theme/customization/enable-multiple-runtime-themes">Multiple Runtime Themes</a>.
  </div>
</div>

Now you can [create a Lyra page](docs/guides/create-lyra-page).

---

## Related Articles

- [Create Lyra Page](docs/guides/create-lyra-page)
- [Lyra UI Components](components/all-components)
