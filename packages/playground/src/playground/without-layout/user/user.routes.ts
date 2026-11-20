import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: 'user-test.component',
    loadComponent: () => import('./user-test.component').then((m) => m.UserTestComponent),
  },
];
