import { Routes } from '@angular/router'
import { provideNbMenu, provideNbSidebar } from '@liquid-js/lyr-core'

export const MENU_ROUTES: Routes = [
    {
        path: '',
        providers: [
            provideNbMenu(),
            provideNbSidebar()
        ],
        children: [
            {
                path: 'menu-test.component',
                loadComponent: () => import('./menu-test.component').then((m) => m.MenuTestComponent),
                children: [
                    {
                        path: '',
                        redirectTo: '1',
                        pathMatch: 'full'
                    },
                    {
                        path: '1',
                        loadComponent: () => import('./components/menu-children.component').then((m) => m.MenuItem1Component)
                    },
                    {
                        path: '2',
                        loadComponent: () => import('./components/menu-children.component').then((m) => m.MenuItem2Component)
                    },
                    {
                        path: '12',
                        loadComponent: () => import('./components/menu-children.component').then((m) => m.MenuItem1Component)
                    },
                    {
                        path: '3',
                        loadComponent: () => import('./components/menu-children.component').then((m) => m.MenuItem3Component),
                        children: [
                            {
                                path: '',
                                redirectTo: '1',
                                pathMatch: 'full'
                            },
                            {
                                path: '1',
                                loadComponent: () => import('./components/menu-children.component').then((m) => m.MenuItem31Component)
                            },
                            {
                                path: '2',
                                loadComponent: () => import('./components/menu-children.component').then((m) => m.MenuItem32Component)
                            },
                            {
                                path: '3',
                                loadComponent: () => import('./components/menu-children.component').then((m) => m.MenuItem33Component),
                                children: [
                                    {
                                        path: '',
                                        redirectTo: '1',
                                        pathMatch: 'full'
                                    },
                                    {
                                        path: '1',
                                        loadComponent: () => import('./components/menu-children.component').then((m) => m.MenuItem331Component)
                                    },
                                    {
                                        path: '2',
                                        loadComponent: () => import('./components/menu-children.component').then((m) => m.MenuItem332Component)
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        path: '4',
                        loadComponent: () => import('./components/menu-children.component').then((m) => m.MenuItem4Component)
                    }
                ]
            }
        ]
    }
]
