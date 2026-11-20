import { Routes } from '@angular/router'

/** A mobile app's screens, in its header and bottom tabs. */
export const MOBILE_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./mobile-shell.component').then((m) => m.MobileShellComponent),
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'today' },
            {
                path: 'today',
                data: { title: 'Today' },
                loadComponent: () => import('./mobile-today.component').then((m) => m.MobileTodayComponent)
            },
            {
                path: 'customers',
                data: { title: 'Customers' },
                loadComponent: () => import('./mobile-customers.component').then((m) => m.MobileCustomersComponent)
            },
            {
                path: 'customer',
                data: { title: 'Customer', back: true },
                loadComponent: () => import('./mobile-customer.component').then((m) => m.MobileCustomerComponent)
            },
            {
                path: 'messages',
                data: { title: 'Messages' },
                loadComponent: () => import('./mobile-messages.component').then((m) => m.MobileMessagesComponent)
            },
            {
                path: 'settings',
                data: { title: 'Settings' },
                loadComponent: () => import('./mobile-settings.component').then((m) => m.MobileSettingsComponent)
            }
        ]
    }
]
