import { Routes } from '@angular/router'

export const LIST_ROUTES: Routes = [
    {
        path: 'simple-list-showcase.component',
        loadComponent: () => import('./simple-list-showcase.component').then((m) => m.SimpleListShowcaseComponent)
    },
    {
        path: 'users-list-showcase.component',
        loadComponent: () => import('./users-list-showcase.component').then((m) => m.UsersListShowcaseComponent)
    },
    {
        path: 'list-item-layout.component',
        loadComponent: () => import('./list-item-layout.component').then((m) => m.ListItemLayoutComponent)
    }
]
