import { Routes } from '@angular/router';
import { provideNbToastr } from '@liquid-js/lyr-core';
import { NB_LINE_CHART_PARTS, NB_PIE_CHART_PARTS, provideNbCharts } from '@liquid-js/lyr-extras/chart';

/** A SaaS app's pages, in its frame. */
export const SAAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./saas-shell.component').then((m) => m.SaasShellComponent),
    // The chart types the dashboard draws.
    // The charts the screens draw, and the toasts that confirm a save.
    providers: [provideNbCharts(...NB_LINE_CHART_PARTS, ...NB_PIE_CHART_PARTS), provideNbToastr()],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./saas-dashboard.component').then((m) => m.SaasDashboardComponent),
      },
      {
        path: 'customers',
        loadComponent: () => import('./saas-customers.component').then((m) => m.SaasCustomersComponent),
      },
      {
        path: 'customers/edit',
        loadComponent: () => import('./saas-customer-edit.component').then((m) => m.SaasCustomerEditComponent),
      },
      {
        path: 'invoice',
        loadComponent: () => import('./saas-invoice.component').then((m) => m.SaasInvoiceComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('./saas-settings.component').then((m) => m.SaasSettingsComponent),
      },
    ],
  },
];
