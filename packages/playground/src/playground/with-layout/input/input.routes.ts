import { Routes } from '@angular/router'

export const INPUT_ROUTES: Routes = [
    {
        path: 'input-colors.component',
        loadComponent: () => import('./input-colors.component').then((m) => m.InputColorsComponent)
    },
    {
        path: 'input-full-width.component',
        loadComponent: () => import('./input-full-width.component').then((m) => m.InputFullWidthComponent)
    },
    {
        path: 'input-shapes.component',
        loadComponent: () => import('./input-shapes.component').then((m) => m.InputShapesComponent)
    },
    {
        path: 'input-showcase.component',
        loadComponent: () => import('./input-showcase.component').then((m) => m.InputsShowcaseComponent)
    },
    {
        path: 'input-sizes.component',
        loadComponent: () => import('./input-sizes.component').then((m) => m.InputSizesComponent)
    },
    {
        path: 'input-types.component',
        loadComponent: () => import('./input-types.component').then((m) => m.InputTypesComponent)
    },
    {
        path: 'input-form.component',
        loadComponent: () => import('./input-form.component').then((m) => m.InputFormComponent)
    },
    {
        path: 'input-ghost.component',
        loadComponent: () => import('./input-ghost.component').then((m) => m.InputGhostComponent)
    },
    {
        path: 'input-number.component',
        loadComponent: () => import('./input-number.component').then((m) => m.InputNumberComponent)
    },
    {
        path: 'input-autosize.component',
        loadComponent: () => import('./input-autosize.component').then((m) => m.InputAutosizeComponent)
    }
]
