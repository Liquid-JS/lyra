# Configuring Google OAuth2 with Lyra Auth

`NbOAuth2AuthStrategy` signs in with OAuth2 providers such as Google or Facebook, with no backend of your own, as
[OAuth2](https://tools.ietf.org/html/rfc6749) allows.

This article sets up `NbOAuth2AuthStrategy` for [Google](https://developers.google.com/identity/protocols/OAuth2UserAgent)
with the [implicit](https://tools.ietf.org/html/rfc6749#section-4.2) flow.

---

## Step 1. Obtain keys

Register an application with the provider, as in Google's [Enable APIs for your project](https://developers.google.com/identity/protocols/OAuth2UserAgent#enable-apis),
to get its `client_id`.

---

## Step 2. Enable a Strategy

Register `NbOAuth2AuthStrategy` in the application providers (`app.config.ts`); an app with other strategies adds it
to their array:

```ts
provideNbAuth({
  strategies: [
    NbOAuth2AuthStrategy.setup({
      name: 'google',
      // ...
    }),
  ],
}),
```

`provideNbAuth` is `NbAuthModule.forRoot` in an NgModule app. The strategy's `name`, `google`, is how it's called
later.

---

## Step 3. Configure

Add the `client_id` from Step 1 (this flow needs no client secret), the `authorize` endpoint, the response type
(`token` for the implicit flow) and the [scope](https://tools.ietf.org/html/rfc6749#section-3.3):

```ts
provideNbAuth({
  strategies: [
    NbOAuth2AuthStrategy.setup({
      name: 'google',
      clientId: 'YOUR_CLIENT_ID',
      clientSecret: '',
      authorize: {
        endpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        responseType: NbOAuth2ResponseType.TOKEN,
        scope: 'https://www.googleapis.com/auth/userinfo.profile',
      },
    }),
  ],
}),
```

---

## Step 4. Routes

The flow needs two routes: a "login" route with a button that starts it, and a "callback" route that handles the
provider's response:

```ts
export const routes: Routes = [
  {
    path: '',
    component: OAuth2LoginComponent,
  },
  {
    path: 'callback',
    component: OAuth2CallbackComponent,
  },
];
```

---

## Step 5. Redirect URI

Set `redirectUri` to the callback route's URL, which must also be registered with the provider, as in Google's
[documentation](https://developers.google.com/identity/protocols/OAuth2UserAgent#redirecting):

```ts
provideNbAuth({
  strategies: [
    NbOAuth2AuthStrategy.setup({
      name: 'google',
      clientId: 'YOUR_CLIENT_ID',
      clientSecret: '',
      authorize: {
        endpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        responseType: NbOAuth2ResponseType.TOKEN,
        scope: 'https://www.googleapis.com/auth/userinfo.profile',

        redirectUri: 'http://localhost:4100/example/oauth2/callback',
      },
    }),
  ],
}),
```

---

## Step 6. Complete your components

`OAuth2LoginComponent` starts the sign-in with `NbAuthService.authenticate` and the strategy's name, which builds the
authorization URL and redirects to the provider:

```ts
@Component({
  selector: 'app-oauth2-login',
  imports: [NbButtonComponent],
  template: `
    @if (!token()) {
      <button nbButton status="success" (click)="login()">Sign In with Google</button>
    }
  `,
})
export class OAuth2LoginComponent {
  private readonly authService = inject(NbAuthService);
  private readonly destroyRef = inject(DestroyRef);

  readonly token = toSignal(
    this.authService.onTokenChange().pipe(map((token) => (token.isValid() ? token : undefined))),
  );

  login() {
    this.authService.authenticate('google')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
```

`OAuth2CallbackComponent` calls the same `authenticate`, which sees it's on the way back from the provider, handles the
response and saves the token:

```ts
@Component({
  selector: 'app-oauth2-callback',
  imports: [NbLayoutComponent, NbLayoutColumnComponent],
  template: `
    <nb-layout>
      <nb-layout-column>Authenticating...</nb-layout-column>
    </nb-layout>
  `,
})
export class OAuth2CallbackComponent {
  private readonly authService = inject(NbAuthService);
  private readonly router = inject(Router);

  constructor() {
    this.authService.authenticate('google')
      .pipe(takeUntilDestroyed())
      .subscribe((authResult: NbAuthResult) => {
        if (authResult.isSuccess()) {
          void this.router.navigateByUrl('/pages/dashboard');
        }
      });
  }
}
```

---

## The code flow, PKCE and state

This guide uses the implicit flow (`token`) for brevity, but OAuth 2.1 recommends the authorization code flow, the
strategy's default (`responseType: NbOAuth2ResponseType.CODE`), with a `token` endpoint to exchange the code at.

The code flow uses [PKCE](https://www.rfc-editor.org/rfc/rfc7636): each sign-in makes a random verifier, sends its
S256 challenge to `authorize`, and the verifier with the code to `token`, so a stolen code is useless. Servers that
don't support PKCE ignore it; `authorize: { pkce: false }` turns it off.

Every redirect also sends a `state`, random unless `authorize.state` sets one, and the redirect back is refused
unless it brings the same state, so a sign-in this browser didn't start can't complete. The verifier and the state
are kept in `sessionStorage` while the browser is away.

---

## Complete example

A complete code example is on [GitHub](https://github.com/Liquid-JS/lyra/tree/master/packages/playground/src/playground/with-layout/oauth2).
The [playground example](/example/oauth2) signs in once its `oauth2.routes.ts` has your own client ID in place of the
placeholder.

---

## Related Articles

- [NbAuthService](/extras/auth/nbauthservice)
- [NbTokenService](/extras/auth/nbtokenservice)
- Receiving [user token after authentication](/extras/auth/getting-user-token)
- [NbOAuth2AuthStrategy](/extras/auth/nboauth2authstrategy)
