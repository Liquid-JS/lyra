import { Routes } from '@angular/router'

export const FORM_FIELD_ROUTES: Routes = [
    {
        path: 'form-field-showcase.component',
        loadComponent: () => import('./form-field-showcase.component').then((m) => m.FormFieldShowcaseComponent)
    },
    {
        path: 'form-field-password.component',
        loadComponent: () => import('./form-field-password.component').then((m) => m.FormFieldPasswordComponent)
    },
    {
        path: 'form-field-input.component',
        loadComponent: () => import('./form-field-input.component').then((m) => m.FormFieldInputComponent)
    },
    {
        path: 'form-field-text.component',
        loadComponent: () => import('./form-field-text.component').then((m) => m.FormFieldTextComponent)
    }
]
