# Lyra Auth

[![GitHub license](https://img.shields.io/github/license/Liquid-JS/lyra.svg)](https://github.com/Liquid-JS/lyra/blob/master/LICENSE.txt)
[![npm](https://img.shields.io/npm/dm/@liquid-js/lyr-auth.svg)](https://www.npmjs.com/package/@liquid-js/lyr-auth)
[![scope](https://img.shields.io/npm/v/@liquid-js/lyr-auth.svg)](https://www.npmjs.com/package/@liquid-js/lyr-auth)

Authentication for Angular: login, registration and password pages, strategies for passwords and OAuth2, tokens and
route guards.

## Quick links

- [Introduction](https://liquid-js.github.io/lyra/extras/auth/introduction/)
- [Installation](https://liquid-js.github.io/lyra/extras/auth/installation/)
- [Configuring a strategy](https://liquid-js.github.io/lyra/extras/auth/configuring-a-strategy/)

### Installing

```sh
npm install --save @liquid-js/lyr-auth
```

The built-in pages also need [Lyra](https://liquid-js.github.io/lyra/docs/guides/install-lyra/).

### Provide a strategy

```ts
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { NbPasswordAuthStrategy, provideNbAuth } from '@liquid-js/lyr-auth'

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideNbAuth({
            strategies: [
                NbPasswordAuthStrategy.setup({
                    name: 'email'
                })
            ],
            forms: {}
        })
    ]
})
```

### Add the pages to the routes

```ts
import { NbAuthComponent, NbLoginComponent, NbLogoutComponent, NbRegisterComponent } from '@liquid-js/lyr-auth'

export const routes: Routes = [
    {
        path: 'auth',
        component: NbAuthComponent,
        children: [
            { path: '', component: NbLoginComponent },
            { path: 'login', component: NbLoginComponent },
            { path: 'register', component: NbRegisterComponent },
            { path: 'logout', component: NbLogoutComponent }
        ]
    }
]
```
