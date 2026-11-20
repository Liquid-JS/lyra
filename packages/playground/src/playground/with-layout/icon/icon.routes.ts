import { Routes } from '@angular/router'

export const ICON_ROUTES: Routes = [
    {
        path: 'icon-showcase.component',
        loadComponent: () => import('./icon-showcase.component').then((m) => m.IconShowcaseComponent)
    },
    {
        path: 'icon-colors.component',
        loadComponent: () => import('./icon-colors.component').then((m) => m.IconColorsComponent)
    }
]
