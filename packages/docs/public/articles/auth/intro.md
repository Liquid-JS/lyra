# Auth Module

The Auth module is a pluggable authentication layer: UI components (login, register, ...) on one side, authentication
`Strategies` that talk to the backend on the other.

<div class="note note-info">
  <div class="note-title">Note</div>
  <div class="note-body">
    The setup still requires communication with backend services.
  </div>
</div>

---

## Authentication UI components

- Login
- Logout
- Register
- Password Recover
- Password Reset

Use the built-in components or [create your own](extras/auth/custom-auth-components).

---

## Auth Strategies

- `NbDummyAuthStrategy` - simulates backend responses, for testing and while the API is in development;
- `NbPasswordAuthStrategy` - email/password authentication against an HTTP API;
- `NbOAuth2AuthStrategy` - sign-in with an OAuth2 provider.

---

## Other helper services

- `NbAuthService` - facade to communicate with a configured strategy;
- `NbTokenService` - gets, sets and clears the authentication token, and tells when it changes;
- `NbTokenLocalStorage` - keeps the token in the browser's storage;
- `NbAuthJWTToken`, `NbAuthSimpleToken`, `NbAuthOAuth2Token`, `NbAuthOAuth2JWTToken` - token classes;
- `NbAuthJWTInterceptor` and `NbAuthSimpleInterceptor` - HTTP interceptors that add the token to requests.

---

## Related Articles

- Auth Module [Installation](extras/auth/installation)
