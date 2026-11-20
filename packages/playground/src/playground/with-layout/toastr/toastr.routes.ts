import { Routes } from '@angular/router';
import { provideNbToastr } from '@liquid-js/lyr-core';

export const TOASTR_ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideNbToastr(),
    ],
    children: [
      {
        path: 'toastr-destroy-by-click.component',
        loadComponent: () => import('./toastr-destroy-by-click.component').then((m) => m.ToastrDestroyByClickComponent),
      },
      {
        path: 'toastr-duration.component',
        loadComponent: () => import('./toastr-duration.component').then((m) => m.ToastrDurationComponent),
      },
      {
        path: 'toastr-icon.component',
        loadComponent: () => import('./toastr-icon.component').then((m) => m.ToastrIconComponent),
      },
      {
        path: 'toastr-positions.component',
        loadComponent: () => import('./toastr-positions.component').then((m) => m.ToastrPositionsComponent),
      },
      {
        path: 'toastr-prevent-duplicates.component',
        loadComponent: () => import('./toastr-prevent-duplicates.component').then((m) => m.ToastrPreventDuplicatesComponent),
      },
      {
        path: 'toastr-prevent-duplicates-behaviour.component',
        loadComponent: () => import('./toastr-prevent-duplicates-behaviour.component').then((m) => m.ToastrPreventDuplicatesBehaviourComponent),
      },
      {
        path: 'toastr-showcase.component',
        loadComponent: () => import('./toastr-showcase.component').then((m) => m.ToastrShowcaseComponent),
      },
      {
        path: 'toastr-statuses.component',
        loadComponent: () => import('./toastr-statuses.component').then((m) => m.ToastrStatusesComponent),
      },
      {
        path: 'toastr-limit.component',
        loadComponent: () => import('./toastr-limit.component').then((m) => m.ToastrLimitComponent),
      },
      {
        path: 'toastr-actions.component',
        loadComponent: () => import('./toastr-actions.component').then((m) => m.ToastrActionsComponent),
      },
    ],
  },
];
