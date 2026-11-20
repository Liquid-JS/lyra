import { Routes } from '@angular/router'
import { provideNbWindow } from '@liquid-js/lyr-core'

export const WINDOW_ROUTES: Routes = [
    {
        path: '',
        providers: [
            provideNbWindow()
        ],
        children: [
            {
                path: 'template-window.component',
                loadComponent: () => import('./template-window.component').then((m) => m.TemplateWindowComponent)
            },
            {
                path: 'window-showcase.component',
                loadComponent: () => import('./window-showcase.component').then((m) => m.WindowShowcaseComponent)
            },
            {
                path: 'windows-backdrop.component',
                loadComponent: () => import('./windows-backdrop.component').then((m) => m.WindowsBackdropComponent)
            },
            {
                path: 'window-controls.component',
                loadComponent: () => import('./window-controls.component').then((m) => m.WindowControlsComponent)
            },
            {
                path: 'window-template-title.component',
                loadComponent: () => import('./window-template-title.component').then((m) => m.WindowTemplateTitleComponent)
            },
            {
                path: 'window-result.component',
                loadComponent: () => import('./window-result.component').then((m) => m.WindowResultComponent)
            }
        ]
    }
]
