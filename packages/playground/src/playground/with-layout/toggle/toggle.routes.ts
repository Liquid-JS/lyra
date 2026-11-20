import { Routes } from '@angular/router';

export const TOGGLE_ROUTES: Routes = [
  {
    path: 'toggle-disabled.component',
    loadComponent: () => import('./toggle-disabled.component').then((m) => m.ToggleDisabledComponent),
  },
  {
    path: 'toggle-showcase.component',
    loadComponent: () => import('./toggle-showcase.component').then((m) => m.ToggleShowcaseComponent),
  },
  {
    path: 'toggle-status.component',
    loadComponent: () => import('./toggle-status.component').then((m) => m.ToggleStatusComponent),
  },
  {
    path: 'toggle-test.component',
    loadComponent: () => import('./toggle-test.component').then((m) => m.ToggleTestComponent),
  },
  {
    path: 'toggle-label-position.component',
    loadComponent: () => import('./toggle-label-position.component').then((m) => m.ToggleLabelPositionComponent),
  },
  {
    path: 'toggle-form.component',
    loadComponent: () => import('./toggle-form.component').then((m) => m.ToggleFormComponent),
  },
  {
    path: 'toggle-sizes.component',
    loadComponent: () => import('./toggle-sizes.component').then((m) => m.ToggleSizesComponent),
  },
];
