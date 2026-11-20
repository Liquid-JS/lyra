# Localization

Lyra's components show and announce texts: labels of buttons, placeholders, messages for screen readers,
validation messages and the authentication pages. They're English; translate them with Angular's i18n, or set them
in code.

---

## Translate with Angular i18n

The texts are `$localize` messages with ids that start with `nb.`, such as `nb.pagination.next` or
`nb.auth.loginTitle`, so they're translated like your app's own texts:

```sh
ng add @angular/localize
```

`ng extract-i18n` adds Lyra's messages to your messages file, and the translations apply when you build each locale,
or at run time with `loadTranslations`. Messages with values name them, e.g. `nb.pagination.range` is
`{$start}–{$end} of {$length}`.

Without `@angular/localize`, Lyra shows the English texts.

---

## Set texts in code

`provideNbTexts` changes texts by component, e.g. for texts your app keeps elsewhere; the others stay as they are:

```ts
bootstrapApplication(AppComponent, {
  providers: [
    provideNbTexts({
      pagination: { next: 'Naprej', range: (start, end, length) => `${start}–${end} od ${length}` },
      validation: { required: 'Obvezno polje' },
    }),
  ],
});
```

In a component's providers, it changes the texts of the components inside it, over the app's. `NbTextsService.set`
changes them at run time, e.g. when the user picks another language:

```ts
inject(NbTextsService).set({ pagination: { next: 'Next' } });
```

Inputs that set a text, such as the `label` of `nb-breadcrumbs`, and options such as `provideNbValidation`'s
`messages` or a strategy's `defaultErrors`, are used over the texts.

The texts, by component, are listed in `NbTexts`; `@liquid-js/lyr-auth` adds `auth` for its pages and
`authStrategy` for the messages of its strategies.
