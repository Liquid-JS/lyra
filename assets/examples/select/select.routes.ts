import { Routes } from '@angular/router'

export const SELECT_ROUTES: Routes = [
    {
        path: 'select-clean.component',
        loadComponent: () => import('./select-clean.component').then((m) => m.SelectCleanComponent)
    },
    {
        path: 'select-disabled.component',
        loadComponent: () => import('./select-disabled.component').then((m) => m.SelectDisabledComponent)
    },
    {
        path: 'select-form.component',
        loadComponent: () => import('./select-form.component').then((m) => m.SelectFormComponent)
    },
    {
        path: 'select-groups.component',
        loadComponent: () => import('./select-groups.component').then((m) => m.SelectGroupsComponent)
    },
    {
        path: 'select-hero.component',
        loadComponent: () => import('./select-hero.component').then((m) => m.SelectHeroComponent)
    },
    {
        path: 'select-label.component',
        loadComponent: () => import('./select-label.component').then((m) => m.SelectLabelShowcaseComponent)
    },
    {
        path: 'select-multiple.component',
        loadComponent: () => import('./select-multiple.component').then((m) => m.SelectMultipleComponent)
    },
    {
        path: 'select-filled.component',
        loadComponent: () => import('./select-filled.component').then((m) => m.SelectFilledComponent)
    },
    {
        path: 'select-placeholder.component',
        loadComponent: () => import('./select-placeholder.component').then((m) => m.SelectPlaceholderComponent)
    },
    {
        path: 'select-shapes.component',
        loadComponent: () => import('./select-shapes.component').then((m) => m.SelectShapeComponent)
    },
    {
        path: 'select-showcase.component',
        loadComponent: () => import('./select-showcase.component').then((m) => m.SelectShowcaseComponent)
    },
    {
        path: 'select-sizes.component',
        loadComponent: () => import('./select-sizes.component').then((m) => m.SelectSizesComponent)
    },
    {
        path: 'select-status.component',
        loadComponent: () => import('./select-status.component').then((m) => m.SelectStatusComponent)
    },
    {
        path: 'select-interactive.component',
        loadComponent: () => import('./select-interactive.component').then((m) => m.SelectInteractiveComponent)
    },
    {
        path: 'select-test.component',
        loadComponent: () => import('./select-test.component').then((m) => m.SelectTestComponent)
    },
    {
        path: 'select-compare-with.component',
        loadComponent: () => import('./select-compare-with.component').then((m) => m.SelectCompareWithComponent)
    },
    {
        path: 'select-icon.component',
        loadComponent: () => import('./select-icon.component').then((m) => m.SelectIconComponent)
    },
    {
        path: 'select-nullable.component',
        loadComponent: () => import('./select-nullable.component').then((m) => m.SelectNullableComponent)
    },
    {
        path: 'select-chips.component',
        loadComponent: () => import('./select-chips.component').then((m) => m.SelectChipsComponent)
    },
    {
        path: 'select-search.component',
        loadComponent: () => import('./select-search.component').then((m) => m.SelectSearchComponent)
    },
    {
        path: 'select-all.component',
        loadComponent: () => import('./select-all.component').then((m) => m.SelectAllComponent)
    },
    {
        path: 'select-nested.component',
        loadComponent: () => import('./select-nested.component').then((m) => m.SelectNestedComponent)
    }
]
