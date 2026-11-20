# Configuring Azure OAuth2 with Lyra Auth

`NbOAuth2AuthStrategy` signs in with OAuth2 providers such as Azure, with no backend of your own: see
[Configuring Google OAuth2](extras/auth/configuring-google-oauth2) for the steps, which are the same.

## Complete example

A complete code example is on [GitHub](https://github.com/Liquid-JS/lyra/tree/master/packages/playground/src/playground/without-layout/azure).
The [playground example](/example/azure) signs in once its `azure.routes.ts` has your own tenant, application ID and
policy in place of the placeholders.

---

## Related Articles

- [NbAuthService](/extras/auth/nbauthservice)
- [NbTokenService](/extras/auth/nbtokenservice)
- Receiving [user token after authentication](/extras/auth/getting-user-token)
- [NbOAuth2AuthStrategy](/extras/auth/nboauth2authstrategy)
