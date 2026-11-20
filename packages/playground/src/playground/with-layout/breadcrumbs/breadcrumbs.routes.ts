import { Routes } from '@angular/router'

export const BREADCRUMBS_ROUTES: Routes = [
    {
        path: 'breadcrumbs-showcase.component',
        loadComponent: () => import('./breadcrumbs-showcase.component').then((m) => m.BreadcrumbsShowcaseComponent)
    },
    {
        path: 'breadcrumbs-separator.component',
        loadComponent: () => import('./breadcrumbs-separator.component').then((m) => m.BreadcrumbsSeparatorComponent)
    }
]
