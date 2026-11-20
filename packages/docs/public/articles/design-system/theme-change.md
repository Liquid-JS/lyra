# Change Current Theme

Lyra has 6 built-in themes - `default`, `dark`, `corporate`, `cosmic`, `material-light` and `material-dark`. The theme
is set at startup and can be changed at run time.

## Set the Theme

Change the `name` setting of your `provideNbTheme` call (or `NbThemeModule.forRoot` in an NgModule app):

```ts
bootstrapApplication(AppComponent, {
  providers: [
    // ...
    provideNbTheme({ name: 'default' }),
  ],
});
```

---

## Runtime Theme Switch

To change the theme from code, e.g. by a user's role, call `NbThemeService.changeTheme`:

```ts
export class AppComponent {
  private readonly themeService = inject(NbThemeService);

  constructor() {
    this.themeService.changeTheme('corporate');
  }
}
```

---

## Follow the System and Remember the User's Choice

Declare the app's themes with what each is for, and Lyra picks the one that fits the system's colour scheme and
contrast (`prefers-color-scheme`, `prefers-contrast`) until the user chooses one. With `preferences`, the choice is
kept, in `localStorage` by default:

```ts
provideNbTheme({
  name: 'default',
  themes: [
    { name: 'default', scheme: 'light' },
    { name: 'dark', scheme: 'dark' },
    { name: 'contrast', scheme: 'dark', contrast: 'more', label: 'High contrast' },
  ],
  preferences: true,
}),
```

`<nb-theme-select />` lets the user choose a theme or "System", and `<nb-content-size-switcher />` how large the content
is, which scales the root font size. In code, `NbThemeService` has `theme()`, `themePreference()`,
`setThemePreference()`, `contentSize()` and `setContentSize()`. To keep the preferences elsewhere, e.g. in the user's
profile on a server, provide `NB_PREFERENCE_STORAGE`; its `get` and `set` may return promises.

---

## Listen to Theme Change

`NbThemeService.onThemeChange()` emits each change, with the new and the previous theme's names:

```ts
export class AppComponent {
  private readonly themeService = inject(NbThemeService);

  constructor() {
    this.themeService.onThemeChange()
      .pipe(takeUntilDestroyed())
      .subscribe((theme: NbThemeChange) => {
        console.log(`Theme changed to ${theme.name}`);
      });
  }
}
```

The current theme is also a signal, `themeService.theme()`, which templates, `computed()` and `effect()` can read.

---

## Related Articles

- [Enable Theme Customization](theme/customization/enable-customizable-theme)
- [Create Custom Theme](theme/customization/create-custom-theme)
