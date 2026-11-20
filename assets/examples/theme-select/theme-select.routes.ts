import { Routes } from '@angular/router'

export const THEME_SELECT_ROUTES: Routes = [
    {
        path: 'theme-select-showcase.component',
        loadComponent: () => import('./theme-select-showcase.component').then((m) => m.ThemeSelectShowcaseComponent)
    }
]
