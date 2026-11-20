import { Routes } from '@angular/router';

export const CHECKBOX_ROUTES: Routes = [
  {
    path: 'checkbox-disabled.component',
    loadComponent: () => import('./checkbox-disabled.component').then((m) => m.CheckboxDisabledComponent),
  },
  {
    path: 'checkbox-showcase.component',
    loadComponent: () => import('./checkbox-showcase.component').then((m) => m.CheckboxShowcaseComponent),
  },
  {
    path: 'checkbox-status.component',
    loadComponent: () => import('./checkbox-status.component').then((m) => m.CheckboxStatusComponent),
  },
  {
    path: 'checkbox-test.component',
    loadComponent: () => import('./checkbox-test.component').then((m) => m.CheckboxTestComponent),
  },
  {
    path: 'checkbox-indeterminate.component',
    loadComponent: () => import('./checkbox-indeterminate.component').then((m) => m.CheckboxIndeterminateComponent),
  },
  {
    path: 'checkbox-sizes.component',
    loadComponent: () => import('./checkbox-sizes.component').then((m) => m.CheckboxSizesComponent),
  },
];
