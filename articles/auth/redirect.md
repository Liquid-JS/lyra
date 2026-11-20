# Redirect user

## Redirecting user after login/registration

By default, a strategy redirects to `/` on success, and stays on the same page on failure (`failure: null`).

## Changing redirect path

`NbOAuth2AuthStrategy` has one `redirect` setting:

```typescript
provideNbAuth({
  strategies: [
    NbOAuth2AuthStrategy.setup({
      name: 'oauth',

      redirect: {
        success: '/welcome/', // welcome page path
        failure: null, // stay on the same page
      },
    }),
  ],
  forms: {},
}),
```

`NbPasswordAuthStrategy` has one per action:

```typescript
provideNbAuth({
  strategies: [
    NbPasswordAuthStrategy.setup({
      name: 'email',

      login: {
        redirect: {
          success: '/dashboard/',
          failure: null, // stay on the same page
        },
      },

      register: {
        redirect: {
          success: '/welcome/',
          failure: null, // stay on the same page
        },
      }
    }),
  ],
  forms: {},
}),
```

## Related Articles

- Receiving [user token after authentication](extras/auth/getting-user-token)
- [Custom Auth Components](extras/auth/custom-auth-components)
