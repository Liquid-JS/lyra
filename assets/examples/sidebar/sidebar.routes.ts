import { Routes } from '@angular/router'
import { provideNbSidebar } from '@liquid-js/lyr-core'

export const SIDEBAR_ROUTES: Routes = [
    {
        path: '',
        providers: [
            provideNbSidebar()
        ],
        children: [
            {
                path: 'sidebar-close.component',
                loadComponent: () => import('./sidebar-close.component').then((m) => m.SidebarCloseComponent)
            },
            {
                path: 'sidebar-compacted.component',
                loadComponent: () => import('./sidebar-compacted.component').then((m) => m.SidebarCompactedComponent)
            },
            {
                path: 'sidebar-fixed.component',
                loadComponent: () => import('./sidebar-fixed.component').then((m) => m.SidebarFixedComponent)
            },
            {
                path: 'sidebar-one-test.component',
                loadComponent: () => import('./sidebar-one-test.component').then((m) => m.SidebarOneTestComponent)
            },
            {
                path: 'sidebar-right.component',
                loadComponent: () => import('./sidebar-right.component').then((m) => m.SidebarRightComponent)
            },
            {
                path: 'sidebar-showcase.component',
                loadComponent: () => import('./sidebar-showcase.component').then((m) => m.SidebarShowcaseComponent)
            },
            {
                path: 'sidebar-test.component',
                loadComponent: () => import('./sidebar-test.component').then((m) => m.SidebarTestComponent)
            },
            {
                path: 'sidebar-three-test.component',
                loadComponent: () => import('./sidebar-three-test.component').then((m) => m.SidebarThreeTestComponent)
            },
            {
                path: 'sidebar-toggle.component',
                loadComponent: () => import('./sidebar-toggle.component').then((m) => m.SidebarToggleComponent)
            },
            {
                path: 'sidebar-two-test.component',
                loadComponent: () => import('./sidebar-two-test.component').then((m) => m.SidebarTwoTestComponent)
            }
        ]
    }
]
