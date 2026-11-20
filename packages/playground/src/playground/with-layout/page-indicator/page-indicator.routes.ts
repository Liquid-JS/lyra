import { Routes } from '@angular/router';

export const PAGE_INDICATOR_ROUTES: Routes = [
  {
    path: 'page-indicator-showcase.component',
    loadComponent: () =>
      import('./page-indicator-showcase.component').then((m) => m.PageIndicatorShowcaseComponent),
  },
];
