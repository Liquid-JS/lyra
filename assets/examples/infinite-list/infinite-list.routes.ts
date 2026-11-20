import { Routes } from '@angular/router'

export const INFINITE_LIST_ROUTES: Routes = [
    {
        path: 'infinite-list-placeholders.component',
        loadComponent: () => import('./infinite-list-placeholders.component').then((m) => m.InfiniteListPlaceholdersComponent)
    },
    {
        path: 'infinite-list-scroll-modes.component',
        loadComponent: () => import('./infinite-list-scroll-modes.component').then((m) => m.InfiniteListScrollModesComponent)
    },
    {
        path: 'infinite-list-showcase.component',
        loadComponent: () => import('./infinite-list-showcase.component').then((m) => m.InfiniteListShowcaseComponent)
    },
    {
        path: 'infinite-news-list.component',
        loadComponent: () => import('./infinite-news-list.component').then((m) => m.InfiniteNewsListComponent)
    }
]
