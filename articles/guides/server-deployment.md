# Server Deployment

A built Lyra app is static HTML, JavaScript and CSS:

- Build it with `ng build`.
- Copy the output under `dist/` to a web server.

The server has to send `index.html` for every route the app handles; see Angular's
[deployment guide](https://angular.dev/tools/cli/deployment).

---

## Related Articles

- [Backend configuration](docs/guides/backend-integration)
