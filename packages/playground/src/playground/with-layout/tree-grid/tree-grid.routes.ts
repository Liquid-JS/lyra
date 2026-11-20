import { Routes } from '@angular/router';

export const TREE_GRID_ROUTES: Routes = [
  {
    path: 'tree-grid-showcase.component',
    loadComponent: () => import('./tree-grid-showcase.component').then((m) => m.TreeGridShowcaseComponent),
  },
  {
    path: 'tree-grid-sortable.component',
    loadComponent: () => import('./tree-grid-sortable.component').then((m) => m.TreeGridSortableComponent),
  },
  {
    path: 'tree-grid-filterable.component',
    loadComponent: () => import('./tree-grid-filterable.component').then((m) => m.TreeGridFilterableComponent),
  },
  {
    path: 'tree-grid-basic.component',
    loadComponent: () => import('./tree-grid-basic.component').then((m) => m.TreeGridBasicComponent),
  },
  {
    path: 'tree-grid-responsive.component',
    loadComponent: () => import('./tree-grid-responsive.component').then((m) => m.TreeGridResponsiveComponent),
  },
  {
    path: 'tree-grid-custom-icons.component',
    loadComponent: () => import('./tree-grid-custom-icons.component').then((m) => m.TreeGridCustomIconsComponent),
  },
  {
    path: 'tree-grid-disable-click-toggle.component',
    loadComponent: () => import('./tree-grid-disable-click-toggle.component').then((m) => m.TreeGridDisableClickToggleComponent),
  },
  {
    path: 'tree-grid-custom-node-structure.component',
    loadComponent: () => import('./tree-grid-custom-node-structure.component').then((m) => m.TreeGridCustomNodeStructureComponent),
  },
  {
    path: 'tree-grid-no-data.component',
    loadComponent: () => import('./tree-grid-no-data.component').then((m) => m.TreeGridNoDataComponent),
  },
  {
    path: 'tree-grid-variants.component',
    loadComponent: () => import('./tree-grid-variants.component').then((m) => m.TreeGridVariantsComponent),
  },
];
