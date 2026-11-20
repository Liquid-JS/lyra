import { Routes } from '@angular/router';

export const PAGINATION_ROUTES: Routes = [
  {
    path: 'pagination-showcase.component',
    loadComponent: () => import('./pagination-showcase.component').then((m) => m.PaginationShowcaseComponent),
  },
  {
    path: 'pagination-tree-grid.component',
    loadComponent: () => import('./pagination-tree-grid.component').then((m) => m.PaginationTreeGridComponent),
  },
];
