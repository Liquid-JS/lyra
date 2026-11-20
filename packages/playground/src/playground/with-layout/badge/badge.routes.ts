import { Routes } from '@angular/router';

export const BADGE_ROUTES: Routes = [
  {
    path: 'badge-showcase.component',
    loadComponent: () => import('./badge-showcase.component').then((m) => m.BadgeShowcaseComponent),
  },
  {
    path: 'badge-inline.component',
    loadComponent: () => import('./badge-inline.component').then((m) => m.BadgeInlineComponent),
  },
];
