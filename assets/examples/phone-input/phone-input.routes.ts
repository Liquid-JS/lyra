import { Routes } from '@angular/router'

export const PHONE_INPUT_ROUTES: Routes = [
    {
        path: 'phone-input-showcase.component',
        loadComponent: () => import('./phone-input-showcase.component').then((m) => m.PhoneInputShowcaseComponent)
    },
    {
        path: 'phone-input-sizes.component',
        loadComponent: () => import('./phone-input-sizes.component').then((m) => m.PhoneInputSizesComponent)
    },
    {
        path: 'phone-input-validation.component',
        loadComponent: () => import('./phone-input-validation.component').then((m) => m.PhoneInputValidationComponent)
    }
]
