import { Routes } from '@angular/router';

export const TOC_ROUTES: Routes = [
  {
    path: 'toc-showcase.component',
    loadComponent: () => import('./toc-showcase.component').then((m) => m.TocShowcaseComponent),
  },
];
