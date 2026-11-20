import { Routes } from '@angular/router';

export const SCROLL_ROUTES: Routes = [
  {
    path: 'scroll-window.component',
    loadComponent: () => import('./scroll-window.component').then((m) => m.ScrollWindowComponent),
  },
];
