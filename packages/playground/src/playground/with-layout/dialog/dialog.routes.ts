import { Routes } from '@angular/router';
import { provideNbDialog } from '@liquid-js/lyr-core';

export const DIALOG_ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideNbDialog(),
    ],
    children: [
      {
        path: 'dialog-auto-focus.component',
        loadComponent: () => import('./dialog-auto-focus.component').then((m) => m.DialogAutoFocusComponent),
      },
      {
        path: 'dialog-backdrop-click.component',
        loadComponent: () => import('./dialog-backdrop-click.component').then((m) => m.DialogBackdropClickComponent),
      },
      {
        path: 'dialog-esc.component',
        loadComponent: () => import('./dialog-esc.component').then((m) => m.DialogEscComponent),
      },
      {
        path: 'dialog-has-backdrop.component',
        loadComponent: () => import('./dialog-has-backdrop.component').then((m) => m.DialogHasBackdropComponent),
      },
      {
        path: 'dialog-result.component',
        loadComponent: () => import('./dialog-result.component').then((m) => m.DialogResultComponent),
      },
      {
        path: 'dialog-scroll.component',
        loadComponent: () => import('./dialog-scroll.component').then((m) => m.DialogScrollComponent),
      },
      {
        path: 'dialog-showcase.component',
        loadComponent: () => import('./dialog-showcase.component').then((m) => m.DialogShowcaseComponent),
      },
      {
        path: 'dialog-template.component',
        loadComponent: () => import('./dialog-template.component').then((m) => m.DialogTemplateComponent),
      },
      {
        path: 'dialog-confirm.component',
        loadComponent: () => import('./dialog-confirm.component').then((m) => m.DialogConfirmComponent),
      },
      {
        path: 'dialog-position.component',
        loadComponent: () => import('./dialog-position.component').then((m) => m.DialogPositionComponent),
      },
    ],
  },
];
