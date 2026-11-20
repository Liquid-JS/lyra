# Lyra Security

[![GitHub license](https://img.shields.io/github/license/Liquid-JS/lyra.svg)](https://github.com/Liquid-JS/lyra/blob/master/LICENSE.txt)
[![npm](https://img.shields.io/npm/dm/@liquid-js/lyr-security.svg)](https://www.npmjs.com/package/@liquid-js/lyr-security)
[![scope](https://img.shields.io/npm/v/@liquid-js/lyr-security.svg)](https://www.npmjs.com/package/@liquid-js/lyr-security)

Roles and permissions for Angular: an access control list, a role provider and a directive that shows what a role may
use.

## Quick links

- [Introduction](https://liquid-js.github.io/lyra/extras/security/introduction/)
- [Configuration and usage](https://liquid-js.github.io/lyra/extras/security/acl-configuration-usage/)
- [Multiple user roles](https://liquid-js.github.io/lyra/extras/security/multiple-user-roles/)

### Installing

```sh
npm install --save @liquid-js/lyr-security
```

### Provide the access control list

```ts
import { of } from 'rxjs'
import { NbRoleProvider, provideNbSecurity } from '@liquid-js/lyr-security'

bootstrapApplication(AppComponent, {
    providers: [
        provideNbSecurity({
            accessControl: {
                guest: {
                    view: ['news', 'comments']
                },
                user: {
                    parent: 'guest',
                    create: 'comments'
                }
            }
        }),
        { provide: NbRoleProvider, useValue: { getRole: () => of('guest') } }
    ]
})
```

### Import the directive

```ts
import { NbIsGrantedDirective } from '@liquid-js/lyr-security'

@Component({
    ...
    imports: [
        ...
        NbIsGrantedDirective
    ]
})
```

### Include it in HTML template

```html
<button *nbIsGranted="['create', 'comments']">Post comment</button>
```
