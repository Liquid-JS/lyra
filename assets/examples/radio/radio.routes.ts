import { Routes } from '@angular/router'

export const RADIO_ROUTES: Routes = [
    {
        path: 'radio-disabled.component',
        loadComponent: () => import('./radio-disabled.component').then((m) => m.RadioDisabledComponent)
    },
    {
        path: 'radio-showcase.component',
        loadComponent: () => import('./radio-showcase.component').then((m) => m.RadioShowcaseComponent)
    },
    {
        path: 'radio-statuses.component',
        loadComponent: () => import('./radio-statuses.component').then((m) => m.RadioStatusesComponent)
    },
    {
        path: 'radio-disabled-group.component',
        loadComponent: () => import('./radio-disabled-group.component').then((m) => m.RadioDisabledGroupComponent)
    },
    {
        path: 'radio-form.component',
        loadComponent: () => import('./radio-form.component').then((m) => m.RadioFormComponent)
    },
    {
        path: 'radio-sizes.component',
        loadComponent: () => import('./radio-sizes.component').then((m) => m.RadioSizesComponent)
    }
]
