import { Routes } from '@angular/router';

export const ACTION_ROUTES: Routes = [
  {
    path: 'action-badge.component',
    loadComponent: () => import('./action-badge.component').then((m) => m.ActionBadgeComponent),
  },
  {
    path: 'action-showcase.component',
    loadComponent: () => import('./action-showcase.component').then((m) => m.ActionShowcaseComponent),
  },
  {
    path: 'action-sizes.component',
    loadComponent: () => import('./action-sizes.component').then((m) => m.ActionSizesComponent),
  },
  {
    path: 'action-test.component',
    loadComponent: () => import('./action-test.component').then((m) => m.ActionTestComponent),
  },
  {
    path: 'action-width.component',
    loadComponent: () => import('./action-width.component').then((m) => m.ActionWidthComponent),
  },
  {
    path: 'action-dot-mode.component',
    loadComponent: () => import('./action-dot-mode.component').then((m) => m.ActionDotModeComponent),
  },
];
