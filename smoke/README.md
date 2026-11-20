# Smoke test

Installs the freshly built packages from `.lib/` into a plain Angular app and
checks that it builds in production mode, renders in a browser and renders on
the server.

```sh
yarn build                      # in the repository root
rm -rf smoke/.lib smoke/.angular && cp -R dist smoke/.lib   # .angular caches the previous packages
cd smoke
npm install
npm run build
npm run e2e                     # Playwright against `ng serve`
npm run serve:ssr               # http://localhost:4000
```
