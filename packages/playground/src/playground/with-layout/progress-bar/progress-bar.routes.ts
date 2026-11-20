import { Routes } from '@angular/router'

export const PROGRESS_BAR_ROUTES: Routes = [
    {
        path: 'progress-bar-interactive.component',
        loadComponent: () => import('./progress-bar-interactive.component').then((m) => m.ProgressBarInteractiveComponent)
    },
    {
        path: 'progress-bar-ring.component',
        loadComponent: () => import('./progress-bar-ring.component').then((m) => m.ProgressBarRingComponent)
    },
    {
        path: 'progress-bar-showcase.component',
        loadComponent: () => import('./progress-bar-showcase.component').then((m) => m.ProgressBarShowcaseComponent)
    },
    {
        path: 'progress-bar-size.component',
        loadComponent: () => import('./progress-bar-size.component').then((m) => m.ProgressBarSizeComponent)
    },
    {
        path: 'progress-bar-status.component',
        loadComponent: () => import('./progress-bar-status.component').then((m) => m.ProgressBarStatusComponent)
    },
    {
        path: 'progress-bar-value.component',
        loadComponent: () => import('./progress-bar-value.component').then((m) => m.ProgressBarValueComponent)
    }
]
