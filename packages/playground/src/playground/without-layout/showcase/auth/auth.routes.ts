import { Routes } from '@angular/router';

import { AUTH_FRAME } from './auth-frame';

/**
 * An app's sign-in pages in three frames: split beside a panel in the theme's colours, which the theme editor shows;
 * `pastel`, a card on soft shapes; and `studio`, a frosted card on a photo. Each has the same pages, written out as
 * the playground's route generator reads them; `panel` is what the frame shows with a page.
 */
export const AUTH_ROUTES: Routes = [
  {
    path: 'pastel',
    loadComponent: () => import('./auth-pastel-shell.component').then((m) => m.AuthPastelShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'sign-in' },
      {
        path: 'sign-in',
        data: { panel: 'quote' },
        loadComponent: () => import('./auth-sign-in.component').then((m) => m.AuthSignInComponent),
      },
      {
        path: 'sign-up',
        data: { panel: 'benefits' },
        loadComponent: () => import('./auth-sign-up.component').then((m) => m.AuthSignUpComponent),
      },
      {
        path: 'forgot-password',
        data: { panel: 'tagline' },
        loadComponent: () => import('./auth-forgot-password.component').then((m) => m.AuthForgotPasswordComponent),
      },
    ],
  },
  {
    path: 'studio',
    loadComponent: () => import('./auth-studio-shell.component').then((m) => m.AuthStudioShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'sign-in' },
      {
        path: 'sign-in',
        data: { panel: 'quote' },
        loadComponent: () => import('./auth-sign-in.component').then((m) => m.AuthSignInComponent),
      },
      {
        path: 'sign-up',
        data: { panel: 'benefits' },
        loadComponent: () => import('./auth-sign-up.component').then((m) => m.AuthSignUpComponent),
      },
      {
        path: 'forgot-password',
        data: { panel: 'tagline' },
        loadComponent: () => import('./auth-forgot-password.component').then((m) => m.AuthForgotPasswordComponent),
      },
    ],
  },
  {
    path: '',
    loadComponent: () => import('./auth-shell.component').then((m) => m.AuthShellComponent),
    providers: [{ provide: AUTH_FRAME, useValue: 'plain' }],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'sign-in' },
      {
        path: 'sign-in',
        data: { panel: 'quote' },
        loadComponent: () => import('./auth-sign-in.component').then((m) => m.AuthSignInComponent),
      },
      {
        path: 'sign-up',
        data: { panel: 'benefits' },
        loadComponent: () => import('./auth-sign-up.component').then((m) => m.AuthSignUpComponent),
      },
      {
        path: 'forgot-password',
        data: { panel: 'tagline' },
        loadComponent: () => import('./auth-forgot-password.component').then((m) => m.AuthForgotPasswordComponent),
      },
    ],
  },
];
