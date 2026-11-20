import { Routes } from '@angular/router'
import { provideNbSidebar } from '@liquid-js/lyr-core'

export const LAYOUT_ROUTES: Routes = [
    {
        path: '',
        providers: [
            provideNbSidebar()
        ],
        children: [
            {
                path: 'layout-column-left.component',
                loadComponent: () => import('./layout-column-left.component').then((m) => m.LayoutColumnLeftComponent)
            },
            {
                path: 'layout-fixed-header.component',
                loadComponent: () => import('./layout-fixed-header.component').then((m) => m.LayoutFixedHeaderComponent)
            },
            {
                path: 'layout-footer-test.component',
                loadComponent: () => import('./layout-footer-test.component').then((m) => m.LayoutFooterTestComponent)
            },
            {
                path: 'layout-header-test.component',
                loadComponent: () => import('./layout-header-test.component').then((m) => m.LayoutHeaderTestComponent)
            },
            {
                path: 'layout-showcase.component',
                loadComponent: () => import('./layout-showcase.component').then((m) => m.LayoutShowcaseComponent)
            },
            {
                path: 'layout-sidebar-subheader.component',
                loadComponent: () => import('./layout-sidebar-subheader.component').then((m) => m.LayoutSidebarSubheaderComponent)
            },
            {
                path: 'layout-subheader.component',
                loadComponent: () => import('./layout-subheader.component').then((m) => m.LayoutSubheaderComponent)
            },
            {
                path: 'layout-test.component',
                loadComponent: () => import('./layout-test.component').then((m) => m.LayoutTestComponent)
            },
            {
                path: 'layout-w-footer.component',
                loadComponent: () => import('./layout-w-footer.component').then((m) => m.LayoutWFooterComponent)
            },
            {
                path: 'theme-breakpoint-test.component',
                loadComponent: () => import('./theme-breakpoint-test.component').then((m) => m.ThemeBreakpointTestComponent)
            },
            {
                path: 'theme-change-test.component',
                loadComponent: () => import('./theme-change-test.component').then((m) => m.ThemeChangeTestComponent)
            }
        ]
    }
]
