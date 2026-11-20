import { Routes } from '@angular/router'

export const ALERT_ROUTES: Routes = [
    {
        path: 'alert-accents.component',
        loadComponent: () => import('./alert-accents.component').then((m) => m.AlertAccentsComponent)
    },
    {
        path: 'alert-colors.component',
        loadComponent: () => import('./alert-colors.component').then((m) => m.AlertColorsComponent)
    },
    {
        path: 'alert-outline.component',
        loadComponent: () => import('./alert-outline.component').then((m) => m.AlertOutlineComponent)
    },
    {
        path: 'alert-showcase.component',
        loadComponent: () => import('./alert-showcase.component').then((m) => m.AlertShowcaseComponent)
    },
    {
        path: 'alert-sizes.component',
        loadComponent: () => import('./alert-sizes.component').then((m) => m.AlertSizesComponent)
    },
    {
        path: 'alert-test.component',
        loadComponent: () => import('./alert-test.component').then((m) => m.AlertTestComponent)
    }
]
