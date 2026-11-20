import { Routes } from '@angular/router';

export const EXAMPLE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./example.component').then((m) => m.NgdExampleComponent),
    children: [
      {
        path: '',
        loadChildren: () => import('../../../../playground/src/playground/playground.routes').then((m) => m.PLAYGROUND_ROUTES),
      },
      {
        path: '**',
        loadComponent: () => import('./example-404.component').then((m) => m.NgdExample404Component),
      },
    ],
  },
];
