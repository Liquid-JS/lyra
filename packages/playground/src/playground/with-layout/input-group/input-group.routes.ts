import { Routes } from '@angular/router'

export const INPUT_GROUP_ROUTES: Routes = [
    {
        path: 'input-group-showcase.component',
        loadComponent: () => import('./input-group-showcase.component').then((m) => m.InputGroupShowcaseComponent)
    },
    {
        path: 'input-group-full-width.component',
        loadComponent: () => import('./input-group-full-width.component').then((m) => m.InputGroupFullWidthComponent)
    }
]
