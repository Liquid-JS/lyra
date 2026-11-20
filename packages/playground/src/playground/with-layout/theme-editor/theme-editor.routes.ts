import { Routes } from '@angular/router'

export const THEME_EDITOR_ROUTES: Routes = [
    {
        path: 'theme-editor-preview.component',
        loadComponent: () => import('./theme-editor-preview.component').then((m) => m.ThemeEditorPreviewComponent)
    },
    {
        path: 'theme-editor-states.component',
        loadComponent: () => import('./theme-editor-states.component').then((m) => m.ThemeEditorStatesComponent)
    }
]
