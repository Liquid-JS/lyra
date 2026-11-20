import { Routes } from '@angular/router';
import { provideNbToastr } from '@liquid-js/lyr-core';

/** A photographer's site: her work, a project, about her, and how to get in touch, in its frame. */
export const PORTFOLIO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./portfolio-shell.component').then((m) => m.PortfolioShellComponent),
    // The contact form's confirmation.
    providers: [provideNbToastr({ position: 'bottom-end', duration: 5000 })],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      {
        path: 'home',
        data: { title: 'Home' },
        loadComponent: () => import('./portfolio-home.component').then((m) => m.PortfolioHomeComponent),
      },
      {
        path: 'work',
        data: { title: 'Project' },
        loadComponent: () => import('./portfolio-work.component').then((m) => m.PortfolioWorkComponent),
      },
      {
        path: 'about',
        data: { title: 'About' },
        loadComponent: () => import('./portfolio-about.component').then((m) => m.PortfolioAboutComponent),
      },
      {
        path: 'contact',
        data: { title: 'Contact' },
        loadComponent: () => import('./portfolio-contact.component').then((m) => m.PortfolioContactComponent),
      },
    ],
  },
];
