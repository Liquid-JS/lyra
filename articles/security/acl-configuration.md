# ACL

An ACL (access control list) says "who can do what against what resource". This article sets up three roles
(`guest`, `user` and `moderator`) with three permissions (`view`, `create`, `remove`) over two resources (`news`,
`comments`).

---

## ACL Configuration

Guests can only `view` `news` and `comments`; users can do what guests can and `create` `comments`; moderators can
also `create` `news` and `remove` both. As the `accessControl` of `provideNbSecurity()` (or
`NbSecurityModule.forRoot()` in an NgModule app) in `app.config.ts`:

```ts
provideNbSecurity({
  accessControl: {
    guest: {
      view: ['news', 'comments'],
    },
    user: {
      parent: 'guest',
      create: 'comments',
    },
    moderator: {
      parent: 'user',
      create: 'news',
      remove: '*',
    },
  },
}),
```

Each role lists its permissions with the resources they allow, a string or an array; `parent` inherits another role's;
`*` allows a permission on any resource.

---

## Role Configuration

Next, Lyra Security needs the current user's role, from an `NbRoleProvider` whose `getRole` returns an
`Observable<string>` (or of `string[]`, see [multiple roles](extras/security/multiple-user-roles)). The simplest
provider is a value in the application providers:

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
          return of('guest');
        },
      },
    },
  ],
};
```

The role provider isn't tied to the authentication flow, so it can take the role from anywhere.

---

## Role Provider

In a real app the role depends on the current user. With Lyra Auth configured and a JWT token, a `role.provider.ts`
service reads it from the token:

```typescript
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { NbAuthJWTToken, NbAuthService } from '@liquid-js/lyr-auth';
import { NbRoleProvider } from '@liquid-js/lyr-security';

@Injectable()
export class RoleProvider implements NbRoleProvider {
  private readonly authService = inject(NbAuthService);

  getRole(): Observable<string> {
    return this.authService.onTokenChange().pipe(
      map((token) => {
        // Claims other than the registered ones (exp, sub, …) are `unknown` until checked.
        const role = token instanceof NbAuthJWTToken && token.isValid() ? token.getPayload()?.['role'] : undefined;
        return typeof role === 'string' ? role : 'guest';
      }),
    );
  }
}
```

`onTokenChange` emits a new token on each authentication change, so the role follows it; without a role in the
token, the user is a `guest`. Without Lyra Auth, the same service reads the role from a service of your own.

Provide it:

```typescript
// ...

import { RoleProvider } from './role.provider';
import { NbRoleProvider, provideNbSecurity } from '@liquid-js/lyr-security';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    provideNbSecurity({
      // ...
    }),
    { provide: NbRoleProvider, useClass: RoleProvider },
  ],
};
```

---

## Usage

A `Post Comment` button should only show to users who may `create` `comments`. The `*nbIsGranted` directive works
like `@if`, with a permission and a resource:

```typescript
import { NbIsGrantedDirective } from '@liquid-js/lyr-security';

@Component({
  // ...
  imports: [NbIsGrantedDirective],
  template: `
    <button *nbIsGranted="['create', 'comments']">Post Comment</button>
  `,
})
export class CommentFormComponent {
// ...
```

For more, `NbAccessChecker.isGranted(permission, resource)` returns an `Observable<boolean>` of the check, here as a
signal in `comment-form.component.ts`:

```typescript
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NbAccessChecker } from '@liquid-js/lyr-security';

@Component({
  // ...
  template: `
    @if (canPost()) {
      <button>Post Comment</button>
    }
  `,
})
export class CommentFormComponent {
  private readonly accessChecker = inject(NbAccessChecker);

  readonly canPost = toSignal(this.accessChecker.isGranted('create', 'comments'), { initialValue: false });
}
```

`isGranted` follows the role, so the button hides when the authentication changes while the app is in use. It can be
called from anywhere, including router guards and services.
