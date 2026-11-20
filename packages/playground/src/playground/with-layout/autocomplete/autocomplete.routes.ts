import { Routes } from '@angular/router'

export const AUTOCOMPLETE_ROUTES: Routes = [
    {
        path: 'autocomplete-showcase.component',
        loadComponent: () => import('./autocomplete-showcase.component').then((m) => m.AutocompleteShowcaseComponent)
    },
    {
        path: 'autocomplete-form.component',
        loadComponent: () => import('./autocomplete-form.component').then((m) => m.AutocompleteFormComponent)
    },
    {
        path: 'autocomplete-group.component',
        loadComponent: () => import('./autocomplete-group.component').then((m) => m.AutocompleteGroupComponent)
    },
    {
        path: 'autocomplete-custom-display.component',
        loadComponent: () => import('./autocomplete-custom-display.component').then((m) => m.AutocompleteCustomDisplayComponent)
    },
    {
        path: 'autocomplete-active-first.component',
        loadComponent: () => import('./autocomplete-active-first.component').then((m) => m.AutocompleteActiveFirstComponent)
    },
    {
        path: 'autocomplete-disabled.component',
        loadComponent: () => import('./autocomplete-disabled.component').then((m) => m.AutocompleteDisabledComponent)
    }
]
