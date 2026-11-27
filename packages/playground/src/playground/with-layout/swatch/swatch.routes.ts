import { Routes } from '@angular/router'

export const SWATCH_ROUTES: Routes = [
    {
        path: 'swatch-filter.component',
        loadComponent: () => import('./swatch-filter.component').then((m) => m.SwatchFilterComponent)
    },
    {
        path: 'swatch-showcase.component',
        loadComponent: () => import('./swatch-showcase.component').then((m) => m.SwatchShowcaseComponent)
    },
    {
        path: 'swatch-sizes.component',
        loadComponent: () => import('./swatch-sizes.component').then((m) => m.SwatchSizesComponent)
    },
    {
        path: 'swatch-form.component',
        loadComponent: () => import('./swatch-form.component').then((m) => m.SwatchFormComponent)
    }
]
