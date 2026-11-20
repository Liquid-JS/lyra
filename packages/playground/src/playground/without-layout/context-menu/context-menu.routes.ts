import { Routes } from '@angular/router'
import { provideNbMenu } from '@liquid-js/lyr-core'

export const CONTEXT_MENU_ROUTES: Routes = [
    {
        path: '',
        providers: [
            provideNbMenu()
        ],
        children: [
            {
                path: 'context-menu-click.component',
                loadComponent: () => import('./context-menu-click.component').then((m) => m.ContextMenuClickComponent)
            },
            {
                path: 'context-menu-showcase.component',
                loadComponent: () => import('./context-menu-showcase.component').then((m) => m.ContextMenuShowcaseComponent)
            },
            {
                path: 'context-menu-test.component',
                loadComponent: () => import('./context-menu-test.component').then((m) => m.ContextMenuTestComponent)
            },
            {
                path: 'context-menu-modes.component',
                loadComponent: () => import('./context-menu-modes.component').then((m) => m.ContextMenuModesComponent)
            },
            {
                path: 'context-menu-noop.component',
                loadComponent: () => import('./context-menu-noop.component').then((m) => m.ContextMenuNoopComponent)
            },
            {
                path: 'context-menu-right-click.component',
                loadComponent: () => import('./context-menu-right-click.component').then((m) => m.ContextMenuRightClickComponent)
            }
        ]
    }
]
