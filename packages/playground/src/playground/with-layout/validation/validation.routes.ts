import { Routes } from '@angular/router';

export const VALIDATION_ROUTES: Routes = [
  {
    path: 'validation-showcase.component',
    loadComponent: () => import('./validation-showcase.component').then((m) => m.ValidationShowcaseComponent),
  },
  {
    path: 'validation-messages.component',
    loadComponent: () => import('./validation-messages.component').then((m) => m.ValidationMessagesComponent),
  },
  {
    path: 'validation-template-driven.component',
    loadComponent: () =>
      import('./validation-template-driven.component').then((m) => m.ValidationTemplateDrivenComponent),
  },
  {
    path: 'validation-signal-forms.component',
    loadComponent: () => import('./validation-signal-forms.component').then((m) => m.ValidationSignalFormsComponent),
  },
  {
    path: 'validation-group.component',
    loadComponent: () => import('./validation-group.component').then((m) => m.ValidationGroupComponent),
  },
];
