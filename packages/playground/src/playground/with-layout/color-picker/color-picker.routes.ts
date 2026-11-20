import { Routes } from '@angular/router'

export const COLOR_PICKER_ROUTES: Routes = [
    {
        path: 'color-picker-showcase.component',
        loadComponent: () => import('./color-picker-showcase.component').then((m) => m.ColorPickerShowcaseComponent)
    },
    {
        path: 'color-picker-sizes.component',
        loadComponent: () => import('./color-picker-sizes.component').then((m) => m.ColorPickerSizesComponent)
    },
    {
        path: 'color-picker-validation.component',
        loadComponent: () => import('./color-picker-validation.component').then((m) => m.ColorPickerValidationComponent)
    }
]
