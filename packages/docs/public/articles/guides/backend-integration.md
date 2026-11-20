# Backend Integration

---

## Integration with JSON REST server

The app can call the API server directly with CORS, but a proxy is better: the API server isn't exposed under its own
address, and the browser doesn't send a preflight `OPTIONS` request before each call. The app is then served at, say,
`website.com`, and its API at `website.com/api`. Both the Angular CLI's dev server and production web servers proxy
like that.

---

## angular-cli/webpack-dev-server setup

Create `proxy.conf.json` in the application root, with your API server in place of `http://localhost:3000`
(see [Proxying to a backend server](https://angular.dev/tools/cli/serve#proxying-to-a-backend-server)):

```json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false
  }
}
```

Then serve with it:

```bash
ng serve --proxy-config proxy.conf.json
```

Requests to `/api` are forwarded to the API server.

---

## Production setup

In production a web server serves the built files and proxies `/api` the same way. With [nginx](https://nginx.org/en/):

```nginx
server {
  listen 80;
  server_name website.com;

  root /yourAngularAppDistPath;
  index index.html index.htm;
  etag on;

  location / {
    index index.html;
    try_files $uri /index.html;
  }

  location /api {
    proxy_pass http://localhost:3000/;
    proxy_set_header Host $host;
  }
}
```
