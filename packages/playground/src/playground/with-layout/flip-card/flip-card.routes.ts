import { Routes } from '@angular/router';

export const FLIP_CARD_ROUTES: Routes = [
  {
    path: 'flip-card-accents.component',
    loadComponent: () => import('./flip-card-accents.component').then((m) => m.FlipCardAccentsComponent),
  },
  {
    path: 'flip-card-colors.component',
    loadComponent: () => import('./flip-card-colors.component').then((m) => m.FlipCardColorsComponent),
  },
  {
    path: 'flip-card-full.component',
    loadComponent: () => import('./flip-card-full.component').then((m) => m.FlipCardFullComponent),
  },
  {
    path: 'flip-card-showcase.component',
    loadComponent: () => import('./flip-card-showcase.component').then((m) => m.FlipCardShowcaseComponent),
  },
  {
    path: 'flip-card-sizes.component',
    loadComponent: () => import('./flip-card-sizes.component').then((m) => m.FlipCardSizesComponent),
  },
];
