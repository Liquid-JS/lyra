## Firebase authentication with Lyra Auth

`@liquid-js/lyr-firebase-auth` adds Firebase authentication to `@liquid-js/lyr-auth`, with these strategies:

- `NbFirebasePasswordStrategy` - authentication with email/password
- `NbFirebaseGoogleStrategy` - authentication with Google accounts
- `NbFirebaseFacebookStrategy` - authentication with Facebook accounts
- `NbFirebaseTwitterStrategy` - authentication with Twitter accounts

## Installation

<div class="note note-info">
  <div class="note-title">Note</div>
  <div class="note-body">
   The package needs <code>firebase</code> and <code>@angular/fire</code> installed and configured, see the <a href="https://github.com/angular/angularfire">@angular/fire docs</a>:
   provide the Firebase app and the Auth instance with the modular AngularFire API, e.g.
<code>provideFirebaseApp(() =&gt; initializeApp(config))</code> and <code>provideAuth(() =&gt; getAuth())</code>.
  </div>
</div>

```sh
  npm i @liquid-js/lyr-auth @liquid-js/lyr-firebase-auth
```

`provideNbFirebaseAuth()` provides the Firebase strategies (in an NgModule app, import `NbFirebaseAuthModule` and use `NbAuthModule.forRoot`); `provideNbAuth` sets them up, here `NbFirebasePasswordStrategy`:

```ts
import { provideNbAuth } from '@liquid-js/lyr-auth';
import { NbFirebasePasswordStrategy, provideNbFirebaseAuth } from '@liquid-js/lyr-firebase-auth';

bootstrapApplication(AppComponent, {
  providers: [
    // ...
    provideNbFirebaseAuth(),
    provideNbAuth({
      strategies: [
        NbFirebasePasswordStrategy.setup({
          name: 'password',
        }),
      ],
      forms: {},
    }),
  ],
});
```

---

## Authentication with email and password

The settings of `NbFirebasePasswordStrategy`, with their defaults; `setup` merges yours over them:

```ts
export class NbFirebasePasswordStrategyOptions extends NbAuthStrategyOptions {
  token = {
    class: NbAuthJWTToken,
  };
  register?: boolean | NbPasswordStrategyModule = {
    redirect: {
      success: '/',
      failure: null,
    },
    defaultErrors: ['Something went wrong, please try again.'],
    defaultMessages: ['You have been successfully registered.'],
  };
  login?: boolean | NbPasswordStrategyModule = {
    redirect: {
      success: '/',
      failure: null,
    },
    defaultErrors: ['Login/Email combination is not correct, please try again.'],
    defaultMessages: ['You have been successfully logged in.'],
  };
  logout?: boolean | NbPasswordStrategyModule = {
    redirect: {
      success: '/',
      failure: null,
    },
    defaultErrors: ['Something went wrong, please try again.'],
    defaultMessages: ['You have been successfully logged out.'],
  };
  refreshToken?: boolean | NbPasswordStrategyModule = {
    redirect: {
      success: null,
      failure: null,
    },
    defaultErrors: ['Something went wrong, please try again.'],
    defaultMessages: ['Your token has been successfully refreshed.'],
  };
  requestPassword?: boolean | NbPasswordStrategyModule = {
    redirect: {
      success: '/',
      failure: null,
    },
    defaultErrors: ['Something went wrong, please try again.'],
    defaultMessages: ['Reset password instructions have been sent to your email.'],
  };
  resetPassword?: boolean | NbPasswordStrategyReset = {
    redirect: {
      success: '/',
      failure: null,
    },
    // The query parameter of the reset link that holds Firebase's code.
    resetPasswordTokenKey: 'oobCode',
    defaultErrors: ['Something went wrong, please try again.'],
    defaultMessages: ['Your password has been successfully changed.'],
  };
  errors?: NbPasswordStrategyMessage = {
    key: 'message',
    getter: (module: string, res: unknown, options: NbFirebasePasswordStrategyOptionsWithKey<'errors'>) =>
      nbAuthMessages(getDeepFromObject(res, options.errors.key, getDeepFromObject(options, `${module}.defaultErrors`))),
  };
  messages?: NbPasswordStrategyMessage = {
    key: 'messages',
    // Firebase's sign-in calls answer with a `UserCredential`, which holds no messages: these are the module's defaults.
    getter: (module: string, _res: unknown, options: NbFirebasePasswordStrategyOptionsWithKey<'messages'>) =>
      nbAuthMessages(getDeepFromObject(options, `${module}.defaultMessages`)),
  };
}
```

### Resetting a password

The request password form makes Firebase email a reset link. For that link to open your app's reset password page,
set the action URL of the password reset email template in the Firebase console (Authentication → Templates) to that
page, e.g. `https://example.com/auth/reset-password`. Firebase adds the reset code to the URL as `oobCode`, which
`NbFirebasePasswordStrategy` reads when the form is sent; change `resetPassword.resetPasswordTokenKey` if your link
carries it under another name. Without a code, resetting fails with the module's default errors.

---

## Social Authentication providers

The Google, Facebook and Twitter strategies share these settings and defaults:

```ts
export class NbFirebaseIdentityProviderStrategyOptions extends NbAuthStrategyOptions {
  token = {
    class: NbAuthJWTToken,
  };
  logout?: boolean | NbPasswordStrategyModule = {
    redirect: {
      success: '/',
      failure: null,
    },
    defaultErrors: ['Something went wrong, please try again.'],
    defaultMessages: ['You have been successfully logged out.'],
  };
  authenticate?: boolean | NbPasswordStrategyModule = {
    redirect: {
      success: '/',
      failure: null,
    },
    defaultErrors: ['Something went wrong, please try again.'],
    defaultMessages: ['You have been successfully authenticated.'],
  };
  refreshToken?: boolean | NbPasswordStrategyModule = {
    redirect: {
      success: null,
      failure: null,
    },
    defaultErrors: ['Something went wrong, please try again.'],
    defaultMessages: ['Your token has been successfully refreshed.'],
  };
  errors?: NbPasswordStrategyMessage = {
    key: 'message',
    getter: (module: string, _res: unknown, options: NbFirebaseIdentityProviderStrategyOptions) =>
      nbAuthMessages(getDeepFromObject(options, `${module}.defaultErrors`)),
  };
  messages?: NbPasswordStrategyMessage = {
    key: 'message',
    getter: (module: string, _res: unknown, options: NbFirebaseIdentityProviderStrategyOptions) =>
      nbAuthMessages(getDeepFromObject(options, `${module}.defaultMessages`)),
  };
  scopes?: string[] = [];
  customParameters?: { [key: string]: string } = {};
}
```

---

## Complete example

A complete code example is on [GitHub](https://github.com/Liquid-JS/lyra/tree/master/packages/playground/src/playground/without-layout/firebase),
and in the playground:

- [Firebase password example](/example/firebase/password-showcase)
- [Firebase social authentication providers example](/example/firebase/social-auth-showcase)
