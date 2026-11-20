import { Routes } from '@angular/router';

export const SKELETON_ROUTES: Routes = [
  {
    path: 'skeleton-showcase.component',
    loadComponent: () => import('./skeleton-showcase.component').then((m) => m.SkeletonShowcaseComponent),
  },
];
