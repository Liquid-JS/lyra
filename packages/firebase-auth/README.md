# Lyra Firebase Auth

[![GitHub license](https://img.shields.io/github/license/Liquid-JS/lyra.svg)](https://github.com/Liquid-JS/lyra/blob/master/LICENSE.txt)
[![npm](https://img.shields.io/npm/dm/@liquid-js/lyr-firebase-auth.svg)](https://www.npmjs.com/package/@liquid-js/lyr-firebase-auth)
[![scope](https://img.shields.io/npm/v/@liquid-js/lyr-firebase-auth.svg)](https://www.npmjs.com/package/@liquid-js/lyr-firebase-auth)

Firebase authentication strategies for Lyra Auth: email and password, Google, Facebook and Twitter.

## Quick links

- [Firebase authentication](https://liquid-js.github.io/lyra/extras/auth/firebase-authentication/)
- [Lyra Auth](https://liquid-js.github.io/lyra/extras/auth/introduction/)

### Installing

```sh
npm install --save @liquid-js/lyr-auth @liquid-js/lyr-firebase-auth
```

The app provides the Firebase app and its Auth instance with [AngularFire](https://github.com/angular/angularfire).

### Provide a strategy

```ts
import { provideNbAuth } from '@liquid-js/lyr-auth'
import { NbFirebasePasswordStrategy, provideNbFirebaseAuth } from '@liquid-js/lyr-firebase-auth'

bootstrapApplication(AppComponent, {
    providers: [
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideAuth(() => getAuth()),
        provideNbFirebaseAuth(),
        provideNbAuth({
            strategies: [
                NbFirebasePasswordStrategy.setup({
                    name: 'password'
                })
            ],
            forms: {}
        })
    ]
})
```
