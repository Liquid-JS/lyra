# Strategy

An `Auth Strategy` holds the logic of one authentication flow (email/password, OAuth2, ...): it takes the user's input,
talks to the backend and hands the result back to the UI layer. Three come out of the box:

- `NbDummyAuthStrategy` - simulates backend responses, for testing and while the API is in development;
- `NbPasswordAuthStrategy` - email/password authentication, see [NbPasswordAuthStrategy](extras/auth/nbpasswordauthstrategy);
- `NbOAuth2AuthStrategy` - sign-in with an OAuth2 provider, see [NbOAuth2AuthStrategy](extras/auth/nboauth2authstrategy).

Each has defaults for every option; what you pass to `setup` is merged over them.

---

## Configure a strategy

As an example, let's configure the API endpoints of `NbPasswordAuthStrategy`, provided with `provideNbAuth` (or
`NbAuthModule.forRoot` in an NgModule app):

```typescript
provideNbAuth({
  strategies: [
    NbPasswordAuthStrategy.setup({
      name: 'email',
    }),
  ],
  forms: {},
}),
```

`email` is the strategy's name, which the forms and `NbAuthService` refer to it by, so an app can configure several
strategies.

---

## Setup API configuration

Each action's endpoint is `baseEndpoint + endpoint`. By default `baseEndpoint` is `/api/auth/` and the endpoints are
`login`, `register`, `request-pass`, `reset-pass`, `logout` and `refresh-token`:

```typescript
provideNbAuth({
  strategies: [
    NbPasswordAuthStrategy.setup({
      name: 'email',

      baseEndpoint: '',
      login: {
        // ...
        endpoint: '/api/auth/login',
      },
      register: {
        // ...
        endpoint: '/api/auth/register',
      },
    }),
  ],
  forms: {},
}),
```

For an API on a separate server, `http://example.com/app-api/v1`, with its own paths:

```typescript
{
  baseEndpoint: 'http://example.com/app-api/v1',
  login: {
    endpoint: '/auth/sign-in',
  },
  register: {
    endpoint: '/auth/sign-up',
  },
  logout: {
    endpoint: '/auth/sign-out',
  },
  requestPass: {
    endpoint: '/auth/request-pass',
  },
  resetPass: {
    endpoint: '/auth/reset-pass',
  },
}
```

By default `resetPass` is a `PUT` and `logout` a `DELETE`; an API that accepts only `POST` sets each action's
`method`:

```typescript
{
  baseEndpoint: 'http://example.com/app-api/v1',
  login: {
    endpoint: '/auth/sign-in',
    method: 'post',
  },
  register: {
    endpoint: '/auth/sign-up',
    method: 'post',
  },
  logout: {
    endpoint: '/auth/sign-out',
    method: 'post',
  },
  requestPass: {
    endpoint: '/auth/request-pass',
    method: 'post',
  },
  resetPass: {
    endpoint: '/auth/reset-pass',
    method: 'post',
  },
}
```

<div class="note note-info">
  <div class="note-title">Note</div>
  <div class="note-body">
    Only the options you change need listing; the rest keep the strategy's defaults.
  </div>
</div>

---

## Related Articles

- Adjusting [Auth Components UI](extras/auth/configuring-ui)
- Receiving [user token after authentication](extras/auth/getting-user-token)
