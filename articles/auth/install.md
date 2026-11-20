# Installation

## Install the module

The built-in Auth components need [Lyra Core](docs/guides/install-lyra); the strategies and services alone don't.

```bash
npm i @liquid-js/lyr-auth
```

---

## HttpClient

The Auth package sends its requests with `HttpClient`, so the application provides it:

```ts
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// ...

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
  ],
});
```

`withInterceptorsFromDi()` is needed for the class-based interceptors registered with `HTTP_INTERCEPTORS`, `NbAuthJWTInterceptor` and `NbAuthSimpleInterceptor`, which add the token to requests.

---

## Configure a strategy

Provide the auth services with the strategies, here `NbPasswordAuthStrategy`, each set up with its static `setup` method:

```ts
import { NbPasswordAuthStrategy, provideNbAuth } from '@liquid-js/lyr-auth';

bootstrapApplication(AppComponent, {
  providers: [
    // ...

    provideNbAuth({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'email',
        }),
      ],
      forms: {},
    }),
  ],
});
```

In an NgModule app, `NbAuthModule.forRoot()` takes the same options.

`forms` configures the Auth components; it's empty here and covered in [Configuring UI](extras/auth/configuring-ui).

---

## Enable Auth Components

Add the components' routes to `app.routes.ts`:

```ts
import {
  NbAuthComponent,
  NbLoginComponent,
  NbRegisterComponent,
  NbLogoutComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@liquid-js/lyr-auth';

export const routes: Routes = [
  // ...

  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: NbLoginComponent,
      },
      {
        path: 'login',
        component: NbLoginComponent,
      },
      {
        path: 'register',
        component: NbRegisterComponent,
      },
      {
        path: 'logout',
        component: NbLogoutComponent,
      },
      {
        path: 'request-password',
        component: NbRequestPasswordComponent,
      },
      {
        path: 'reset-password',
        component: NbResetPasswordComponent,
      },
    ],
  },
];
```

---

## Enable Styles

With a prebuilt theme, add the matching prebuilt Auth styles after it in `angular.json`:

```json
"styles": [
  "node_modules/@liquid-js/lyr-core/styles/prebuilt/default.css",
  "node_modules/@liquid-js/lyr-auth/styles/prebuilt/default.css"
],
```

With a [customizable theme](theme/customization/enable-customizable-theme), include the Auth styles in your `styles.scss`:

```scss
// ...
@use '@liquid-js/lyr-auth/styles/globals' as *;

@include nb-install() {
  @include nb-theme-global();
  @include nb-auth-global();
}
```

Now <http://localhost:4200/auth/login> shows the login form.

---

## Related Articles

- [Configuring a Strategy](extras/auth/configuring-a-strategy)
- Adjusting [Auth Components UI](extras/auth/configuring-ui)
- [Custom Auth Components](extras/auth/custom-auth-components)
