import { Routes } from '@angular/router'

export const SPINNER_ROUTES: Routes = [
    {
        path: 'spinner-button.component',
        loadComponent: () => import('./spinner-button.component').then((m) => m.SpinnerButtonComponent)
    },
    {
        path: 'spinner-card.component',
        loadComponent: () => import('./spinner-card.component').then((m) => m.SpinnerCardComponent)
    },
    {
        path: 'spinner-colors.component',
        loadComponent: () => import('./spinner-colors.component').then((m) => m.SpinnerColorsComponent)
    },
    {
        path: 'spinner-sizes.component',
        loadComponent: () => import('./spinner-sizes.component').then((m) => m.SpinnerSizesComponent)
    },
    {
        path: 'spinner-tabs.component',
        loadComponent: () => import('./spinner-tabs.component').then((m) => m.SpinnerTabsComponent)
    }
]
