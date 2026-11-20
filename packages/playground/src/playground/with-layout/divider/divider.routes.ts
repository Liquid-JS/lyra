import { Routes } from '@angular/router';

export const DIVIDER_ROUTES: Routes = [
  {
    path: 'divider-showcase.component',
    loadComponent: () => import('./divider-showcase.component').then((m) => m.DividerShowcaseComponent),
  },
];
