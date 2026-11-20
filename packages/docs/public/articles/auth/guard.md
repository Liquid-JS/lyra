# Protecting application based on user authentication

Take an app with two areas:

- `/pages/*` - available only to authenticated users
- `/auth/*` - login, register, etc.

A [route guard](https://angular.dev/guide/routing/route-guards) with `NbAuthService` keeps anonymous users out of
`/pages/*`.

---

## Create a guard

Create `auth.guard.ts` next to `app.routes.ts`:

```ts
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  return true;
};
```

---

## Complete the guard

`NbAuthService.isAuthenticated()` returns an `Observable<boolean>`, which a guard can return as is:

```ts
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { NbAuthService } from '@liquid-js/lyr-auth';

export const authGuard: CanActivateFn = () => {
  return inject(NbAuthService).isAuthenticated();
};
```

`isAuthenticated()` checks the stored token; `isAuthenticatedOrRefresh()` first refreshes one that has expired with
its strategy.

---

## Register the guard

A functional guard runs in the route's injection context, so there is nothing to register: `inject()` gets
`NbAuthService` from the application providers, where `provideNbAuth()` put it.

---

## Add guard to routes

Reference the guard in `app.routes.ts`:

```ts
import { authGuard } from './auth.guard';

// ...

export const routes: Routes = [
  {
    path: 'pages',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/pages.routes').then((m) => m.routes),
  },
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      // ...
    ],
  },
  // ...
];
```

---

## Redirect non-authenticated to the login page

To send a user who isn't authenticated to `auth/login` instead of refusing the route, return a `UrlTree`:

```ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { NbAuthService } from '@liquid-js/lyr-auth';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  return inject(NbAuthService).isAuthenticated()
    .pipe(
      map((authenticated) => authenticated || router.createUrlTree(['auth/login'])),
    );
};
```

---

## Related Articles

- [NbAuthService](extras/auth/nbauthservice)
- [NbTokenService](extras/auth/nbtokenservice)
