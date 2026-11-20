import { Routes } from '@angular/router';

export const MASK_ROUTES: Routes = [
  {
    path: 'mask-showcase.component',
    loadComponent: () => import('./mask-showcase.component').then((m) => m.MaskShowcaseComponent),
  },
  {
    path: 'mask-validation.component',
    loadComponent: () => import('./mask-validation.component').then((m) => m.MaskValidationComponent),
  },
];
