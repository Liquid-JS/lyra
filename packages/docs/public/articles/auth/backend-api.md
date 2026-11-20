# Backend Auth Endpoints

The endpoints `NbPasswordAuthStrategy` calls by default, under its `baseEndpoint` of `/api/auth/`. Each action's
endpoint, HTTP method and the keys of the response are [settings of the strategy](extras/auth/configuring-a-strategy),
so an existing API can be matched instead.

The token is read from the `data.token` key of a response, messages from `data.messages` and errors from
`data.errors`, each a string or an array of strings; without them, the strategy's default messages are shown.

- `POST /api/auth/login`

  Signs in. Input:

  ```json
  {
    "email": "string",
    "password": "string",
    "rememberMe": true
  }
  ```

  Output:

  ```json
  {
    "data": {
      "token": "string"
    }
  }
  ```

- `POST /api/auth/register`

  Creates a user. Input:

  ```json
  {
    "email": "string",
    "password": "string",
    "confirmPassword": "string",
    "fullName": "string",
    "terms": true
  }
  ```

  Output: as `login`, a token.

- `POST /api/auth/request-pass`

  Requests a password reset. The backend emails the user a link to the reset password page with a reset token in its
  query, e.g. `/auth/reset-password?reset_password_token=…`. Input:

  ```json
  {
    "email": "string"
  }
  ```

  Output: `Status 200`

- `PUT /api/auth/reset-pass`

  Sets the new password. The reset token is taken from the page's query, under the strategy's
  `resetPass.resetPasswordTokenKey` (`reset_password_token` by default), and sent under the same key. Input:

  ```json
  {
    "password": "string",
    "confirmPassword": "string",
    "reset_password_token": "string"
  }
  ```

  Output: `Status 200`

- `DELETE /api/auth/logout`

  Clears the sign-in information, if the backend keeps any; a stateless REST service just returns `Status 200`.

- `POST /api/auth/refresh-token`

  Exchanges the current token, sent as the body, for a new one. Output: as `login`, a token.

# Token Validation

Every other non-public endpoint should validate the token. `NbAuthJWTInterceptor` sends it as a `Bearer`
`Authorization` header, refreshing an expired one first, and skips the requests the `NB_AUTH_TOKEN_INTERCEPTOR_FILTER`
function returns `true` for; the default filter skips every request, so provide one that returns `false` for the API's
requests. `NbAuthSimpleInterceptor` sends the token's value as it is, in the `NB_AUTH_INTERCEPTOR_HEADER` header
(`Authorization` by default), with every request.

# Sample for pure Node.JS

Validating a controller's endpoints with [Passport](https://github.com/jaredhanson/passport), in `app.js`:

```ts
app.use(`${root}/users`, passport.authenticate('jwt', { session: false }), userController);
```

# Sample for Nest.JS framework for Node.JS

With Nest's [Passport](https://github.com/nestjs/passport/) module:

```ts
@UseGuards(AuthGuard('jwt'))
export class UserController { }
```

More on backend implementation:

- <https://github.com/nestjs/passport/>
- <https://github.com/jaredhanson/passport>
- <https://docs.nestjs.com/techniques/authentication>
