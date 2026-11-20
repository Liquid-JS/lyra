import { Routes } from '@angular/router'

export const TAG_ROUTES: Routes = [
    {
        path: 'tag-showcase.component',
        loadComponent: () => import('./tag-showcase.component').then((m) => m.TagShowcaseComponent)
    },
    {
        path: 'tag-appearance.component',
        loadComponent: () => import('./tag-appearance.component').then((m) => m.TagAppearanceComponent)
    },
    {
        path: 'tag-input.component',
        loadComponent: () => import('./tag-input.component').then((m) => m.TagInputComponent)
    },
    {
        path: 'tag-list-sizes.component',
        loadComponent: () => import('./tag-list-sizes.component').then((m) => m.TagListSizesComponent)
    },
    {
        path: 'tag-input-with-autocomplete.component',
        loadComponent: () => import('./tag-input-with-autocomplete.component').then((m) => m.TagInputWithAutocompleteComponent)
    },
    {
        path: 'tag-status.component',
        loadComponent: () => import('./tag-status.component').then((m) => m.TagStatusComponent)
    },
    {
        path: 'tag-removable.component',
        loadComponent: () => import('./tag-removable.component').then((m) => m.TagRemovableComponent)
    },
    {
        path: 'tag-form.component',
        loadComponent: () => import('./tag-form.component').then((m) => m.TagFormComponent)
    }
]
