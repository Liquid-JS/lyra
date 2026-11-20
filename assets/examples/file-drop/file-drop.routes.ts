import { Routes } from '@angular/router'

export const FILE_DROP_ROUTES: Routes = [
    {
        path: 'file-drop-multiple.component',
        loadComponent: () => import('./file-drop-multiple.component').then((m) => m.FileDropMultipleComponent)
    },
    {
        path: 'file-drop-preview.component',
        loadComponent: () => import('./file-drop-preview.component').then((m) => m.FileDropPreviewComponent)
    },
    {
        path: 'file-drop-showcase.component',
        loadComponent: () => import('./file-drop-showcase.component').then((m) => m.FileDropShowcaseComponent)
    },
    {
        path: 'file-drop-sizes.component',
        loadComponent: () => import('./file-drop-sizes.component').then((m) => m.FileDropSizesComponent)
    }
]
