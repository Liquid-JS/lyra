import { Routes } from '@angular/router'
import { provideNbDatepicker, provideNbDialog, provideNbToastr } from '@liquid-js/lyr-core'
import { NB_LINE_CHART_PARTS, provideNbCharts } from '@liquid-js/lyr-extras/chart'

/** Relay's pages: the site in its top bar, and the console in its sidebar, which the frame tells apart by `frame`. */
export const RELAY_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./relay-shell.component').then((m) => m.RelayShellComponent),
        // The overview's chart, the console's toasts and dialogs, and the dates the log is filtered by and keys expire on.
        providers: [provideNbCharts(...NB_LINE_CHART_PARTS), provideNbToastr(), provideNbDialog(), provideNbDatepicker()],
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'home' },
            {
                path: 'home',
                data: { title: 'Home', frame: 'site' },
                loadComponent: () => import('./relay-home.component').then((m) => m.RelayHomeComponent)
            },
            {
                path: 'pricing',
                data: { title: 'Pricing', frame: 'site' },
                loadComponent: () => import('./relay-pricing.component').then((m) => m.RelayPricingComponent)
            },
            {
                path: 'overview',
                data: { title: 'Overview', frame: 'console' },
                loadComponent: () => import('./relay-overview.component').then((m) => m.RelayOverviewComponent)
            },
            {
                path: 'keys',
                data: { title: 'API keys', frame: 'console' },
                loadComponent: () => import('./relay-keys.component').then((m) => m.RelayKeysComponent)
            },
            {
                path: 'events',
                data: { title: 'Events', frame: 'console' },
                loadComponent: () => import('./relay-events.component').then((m) => m.RelayEventsComponent)
            },
            {
                path: 'docs',
                data: { title: 'Docs', frame: 'console' },
                loadComponent: () => import('./relay-docs.component').then((m) => m.RelayDocsComponent)
            }
        ]
    }
]
