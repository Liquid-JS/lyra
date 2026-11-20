import { Routes } from '@angular/router';

export const OVERLAY_ROUTES: Routes = [
  {
    path: 'overlay-showcase.component',
    loadComponent: () => import('./overlay-showcase.component').then((m) => m.OverlayShowcaseComponent),
  },
  {
    path: 'overlay-host.component',
    loadComponent: () => import('./overlay-host.component').then((m) => m.OverlayHostComponent),
  },
];
