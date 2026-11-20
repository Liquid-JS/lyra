import { Routes } from '@angular/router';

export const TOOLTIP_ROUTES: Routes = [
  {
    path: 'tooltip-colors.component',
    loadComponent: () => import('./tooltip-colors.component').then((m) => m.TooltipColorsComponent),
  },
  {
    path: 'tooltip-placements.component',
    loadComponent: () => import('./tooltip-placements.component').then((m) => m.TooltipPlacementsComponent),
  },
  {
    path: 'tooltip-showcase.component',
    loadComponent: () => import('./tooltip-showcase.component').then((m) => m.TooltipShowcaseComponent),
  },
  {
    path: 'tooltip-with-icon.component',
    loadComponent: () => import('./tooltip-with-icon.component').then((m) => m.TooltipWithIconComponent),
  },
  {
    path: 'tooltip-template.component',
    loadComponent: () => import('./tooltip-template.component').then((m) => m.TooltipTemplateComponent),
  },
];
