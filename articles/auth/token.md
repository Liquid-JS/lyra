# Getting user token

## Receiving user token after login/registration

With a strategy configured, the next step is to use the token the backend returns: to call the API, and e.g. to show
the user's name in the header. This article assumes the backend returns a JWT, whose payload holds the user info.

Each strategy has a default token class: `NbPasswordAuthStrategy` uses `NbAuthSimpleToken`, `NbOAuth2AuthStrategy`
uses `NbAuthOAuth2Token`. Another class can be set, as below.

---

## Configure the token type

Set `NbAuthJWTToken` as the token class of the strategy, in the `provideNbAuth` call (or `NbAuthModule.forRoot`):

```typescript
provideNbAuth({
  strategies: [
    NbPasswordAuthStrategy.setup({
      name: 'email',

      token: {
        class: NbAuthJWTToken,
      },
    }),
  ],
  forms: {},
}),
```

---

## Configure token extraction

By default `NbPasswordAuthStrategy` reads the token from the `data.token` key of the login/register response:

```typescript
{
  data: {
    token: 'some-jwt-token'
  }
}
```

For an API that returns `{ token: 'some-jwt-token' }`, set the key:

```typescript
provideNbAuth({
  strategies: [
    NbPasswordAuthStrategy.setup({
      name: 'email',

      token: {
        class: NbAuthJWTToken,

        key: 'token', // where to look for the token in the response body
      },
    }),
  ],
  forms: {},
}),
```

---

## Where the token is kept

`NbTokenLocalStorage`, the default `NbTokenStorage`, keeps a remembered token in `localStorage`, and one that isn't in
`sessionStorage`, so it's gone when the browser closes. The login form's "remember me" box, ticked unless the user
unticks it, decides; a refreshed token stays where the current one is, and a token from a redirect, e.g. OAuth2, is
remembered. Tabs share a token kept for the session over a `BroadcastChannel`: a new tab asks the open ones for it, and
signing in, a refresh or signing out in one tab reaches the others.

An app's own `NbTokenStorage` gets the choice as `set(token, { remember })`, and can tell the token service about
changes from elsewhere with a `changes` Observable.

---

## Use token

In the header component, `NbAuthService.onTokenChange()` emits the token now and whenever it changes, so the header
stays up to date without requesting anything. The payload types the registered JWT claims (`exp`, `sub`, ...) and
leaves the others `unknown`, so describe the claims your backend adds:

```typescript
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NbAuthJWTPayload, NbAuthJWTToken, NbAuthService } from '@liquid-js/lyr-auth';
import { NbLayoutHeaderComponent, NbUserComponent } from '@liquid-js/lyr-core';

interface UserPayload extends NbAuthJWTPayload {
  name?: string;
  picture?: string;
}

@Component({
  imports: [NbLayoutHeaderComponent, NbUserComponent],
  template: `
    <nb-layout-header fixed>
      <nb-user [name]="user()?.name" [picture]="user()?.picture" />
    </nb-layout-header>
  `,
})
export class HeaderComponent {
  private readonly authService = inject(NbAuthService);

  readonly user = signal<UserPayload | undefined>(undefined);

  constructor() {
    this.authService.onTokenChange()
      .pipe(takeUntilDestroyed())
      .subscribe((token) => {
        if (token instanceof NbAuthJWTToken && token.isValid()) {
          // We assume the backend puts name and picture claims into the token.
          this.user.set(token.getPayload() as UserPayload);
        }
      });
  }
}
```

`NbAuthService` can be injected in any component the same way to read or react to the authentication state.

---

## Related Articles

- [NbAuthService](extras/auth/nbauthservice)
- [NbTokenService](extras/auth/nbtokenservice)
