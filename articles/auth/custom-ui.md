# Custom Auth Components

When the [settings of the Auth components](extras/auth/configuring-ui) aren't enough, make components of your own.
The UI is decoupled from the Auth logic, so a custom component keeps the strategies and services and changes only
the look.

<div class="note note-info">
  <div class="note-title">Note</div>
  <div class="note-body">
    This article assumes an app set up as in the [Auth Installation guide](extras/auth/installation): a strategy in `app.config.ts` and routes to the built-in components in `app.routes.ts`.
  </div>
</div>

---

## Create Auth Routes

The custom components get lazy-loaded routes of their own, in an `auth` folder with an `auth.routes.ts`:

```ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  // .. here goes our components routes
];
```

Load them from `app.routes.ts`, in place of the routes to the built-in components:

```ts
export const routes: Routes = [
  // .. some other app routs
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.routes),
  },
];
```

<http://localhost:4200/auth> now shows nothing, without errors or a redirect.

---

## Setup Auth Container

The auth components need a container with the layout; Lyra's `NbAuthComponent` serves. Add it to `auth.routes.ts`:

```ts
import { Routes } from '@angular/router';

import { NbAuthComponent } from '@liquid-js/lyr-auth';  // <---

export const routes: Routes = [
  {
    path: '',
    component: NbAuthComponent,  // <---
  },
];
```

<http://localhost:4200/auth> shows the container:

![image](assets/images/articles/custom-auth/auth-container.png)

---

## Login Component Extension

The simplest customization is a component that extends the Lyra one, keeping its logic and replacing the template,
the styles or particular methods. Here the login form gets labels on its inputs, so the template changes.

Create `login/login.component.ts` and `login/login.component.html`, with the component extending `NbLoginComponent`
and importing what its template uses, here the same components as Lyra's template:

```ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NbLoginComponent } from '@liquid-js/lyr-auth';
import {
  NbAlertComponent,
  NbButtonComponent,
  NbCheckboxComponent,
  NbIconComponent,
  NbInputDirective,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    FormsModule,
    RouterLink,
    NbAlertComponent,
    NbButtonComponent,
    NbCheckboxComponent,
    NbIconComponent,
    NbInputDirective,
  ],
})
export class LoginComponent extends NbLoginComponent {
}
```

```html
<strong>Hello</strong>
```

Add it to the routes:

```ts
import { Routes } from '@angular/router';
import { NbAuthComponent } from '@liquid-js/lyr-auth';

import { LoginComponent } from './login/login.component'; // <---

export const routes: Routes = [
  {
    path: '',
    component: NbAuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent, // <---
      },
    ],
  },
];
```

The package doesn't ship the template sources, so copy Lyra's template from
[GitHub](https://github.com/Liquid-JS/lyra/blob/master/packages/auth/src/components/login/login.component.html) into
`login.component.html` and change what you need.

<div class="note note-info">
  <div class="note-title">Note</div>
  <div class="note-body">
    Copy the sources of the Lyra version you have installed: the `master` branch may be ahead of it.
  </div>
</div>

![image](assets/images/articles/custom-auth/form-with-labels.png)

## Complete example

A complete code example is on [GitHub](https://github.com/Liquid-JS/lyra/tree/master/packages/playground/src/playground/without-layout/smart-home),
and in the playground: [custom auth components example](/example/smart-home).

---

## Related Articles

- [Configuring a Strategy](extras/auth/configuring-a-strategy)
- Configuring [Auth Components](extras/auth/configuring-ui)
