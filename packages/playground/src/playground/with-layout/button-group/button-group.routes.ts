import { Routes } from '@angular/router';

export const BUTTON_GROUP_ROUTES: Routes = [
  {
    path: 'button-group-showcase.component',
    loadComponent: () => import('./button-group-showcase.component').then((m) => m.ButtonGroupShowcaseComponent),
  },
  {
    path: 'button-group-multiple.component',
    loadComponent: () => import('./button-group-multiple.component').then((m) => m.ButtonGroupMultipleComponent),
  },
  {
    path: 'button-group-sizes.component',
    loadComponent: () => import('./button-group-sizes.component').then((m) => m.ButtonGroupSizesComponent),
  },
  {
    path: 'button-group-appearances.component',
    loadComponent: () => import('./button-group-appearances.component').then((m) => m.ButtonGroupAppearancesComponent),
  },
  {
    path: 'button-group-shapes.component',
    loadComponent: () => import('./button-group-shapes.component').then((m) => m.ButtonGroupShapesComponent),
  },
  {
    path: 'button-and-button-toggle-groups.component',
    loadComponent: () => import('./button-and-button-toggle-groups.component').then((m) => m.ButtonAndButtonToggleGroupsComponent),
  },
  {
    path: 'button-group-interactive.component',
    loadComponent: () => import('./button-group-interactive.component').then((m) => m.ButtonGroupInteractiveComponent),
  },
  {
    path: 'button-group-disabled.component',
    loadComponent: () => import('./button-group-disabled.component').then((m) => m.ButtonGroupDisabledComponent),
  },
  {
    path: 'button-group-statuses.component',
    loadComponent: () => import('./button-group-statuses.component').then((m) => m.ButtonGroupStatusesComponent),
  },
  {
    path: 'button-group-value-change.component',
    loadComponent: () => import('./button-group-value-change.component').then((m) => m.ButtonGroupValueChangeComponent),
  },
];
