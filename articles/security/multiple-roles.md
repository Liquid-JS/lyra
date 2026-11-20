# Assign multiple roles to a user

A user can have more than one role: `NbRoleProvider.getRole` returns an array of roles instead of one.

---

## Roles configuration

```ts
// ...

import { of } from 'rxjs';
import { NbRoleProvider, provideNbSecurity } from '@liquid-js/lyr-security';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    provideNbSecurity({
      // ...
    }),
    {
      provide: NbRoleProvider,
      useValue: {
        getRole: () => {
          // the roles of the current user
          return of(['guest', 'user', 'editor']);
        },
      },
    },
  ],
};
```

`isGranted` then returns `true` when at least one of the roles can access the resource.
