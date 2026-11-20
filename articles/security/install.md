# Installation

The Security package doesn't depend on the Auth or Core packages, though they go well together.

```bash
npm i @liquid-js/lyr-security
```

---

## Register it

Add `provideNbSecurity` to the application providers:

```ts
import { provideNbSecurity } from '@liquid-js/lyr-security';

bootstrapApplication(AppComponent, {
  providers: [
    // ...
    provideNbSecurity(),
  ],
});
```

In an NgModule app, import `NbSecurityModule.forRoot()` in the root module instead.
Components that use the `*nbIsGranted` directive import `NbIsGrantedDirective`.

---

## Related Articles

- Roles & Permissions [Configuration & Usage](extras/security/acl-configuration-usage)
