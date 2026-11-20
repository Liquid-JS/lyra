import { Routes } from '@angular/router'

export const POPOVER_ROUTES: Routes = [
    {
        path: 'popover-custom-component.component',
        loadComponent: () => import('./popover-custom-component.component').then((m) => m.PopoverCustomComponentComponent)
    },
    {
        path: 'popover-modes.component',
        loadComponent: () => import('./popover-modes.component').then((m) => m.PopoverModesComponent)
    },
    {
        path: 'popover-placements.component',
        loadComponent: () => import('./popover-placements.component').then((m) => m.PopoverPlacementsComponent)
    },
    {
        path: 'popover-showcase.component',
        loadComponent: () => import('./popover-showcase.component').then((m) => m.PopoverShowcaseComponent)
    },
    {
        path: 'popover-template-ref.component',
        loadComponent: () => import('./popover-template-ref.component').then((m) => m.PopoverTemplateRefComponent)
    },
    {
        path: 'popover-test.component',
        loadComponent: () => import('./popover-test.component').then((m) => m.PopoverTestComponent)
    },
    {
        path: 'popover-noop.component',
        loadComponent: () => import('./popover-noop.component').then((m) => m.PopoverNoopComponent)
    },
    {
        path: 'popover-dynamic.component',
        loadComponent: () => import('./popover-dynamic.component').then((m) => m.PopoverDynamicComponent)
    },
    {
        path: 'popover-dynamic-code.component',
        loadComponent: () => import('./popover-dynamic-code.component').then((m) => m.PopoverDynamicCodeComponent)
    }
]
