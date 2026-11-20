import { Routes } from '@angular/router'

export const BUTTON_ROUTES: Routes = [
    {
        path: 'button-colors.component',
        loadComponent: () => import('./button-colors.component').then((m) => m.ButtonColorsComponent)
    },
    {
        path: 'button-full-width.component',
        loadComponent: () => import('./button-full-width.component').then((m) => m.ButtonFullWidthComponent)
    },
    {
        path: 'button-hero.component',
        loadComponent: () => import('./button-hero.component').then((m) => m.ButtonHeroComponent)
    },
    {
        path: 'button-outline.component',
        loadComponent: () => import('./button-outline.component').then((m) => m.ButtonOutlineComponent)
    },
    {
        path: 'button-shapes.component',
        loadComponent: () => import('./button-shapes.component').then((m) => m.ButtonShapesComponent)
    },
    {
        path: 'button-showcase.component',
        loadComponent: () => import('./button-showcase.component').then((m) => m.ButtonShowcaseComponent)
    },
    {
        path: 'button-sizes.component',
        loadComponent: () => import('./button-sizes.component').then((m) => m.ButtonSizesComponent)
    },
    {
        path: 'button-types.component',
        loadComponent: () => import('./button-types.component').then((m) => m.ButtonTypesComponent)
    },
    {
        path: 'button-icon.component',
        loadComponent: () => import('./button-icon.component').then((m) => m.ButtonIconComponent)
    },
    {
        path: 'button-interactive.component',
        loadComponent: () => import('./button-interactive.component').then((m) => m.ButtonInteractiveComponent)
    },
    {
        path: 'button-loading.component',
        loadComponent: () => import('./button-loading.component').then((m) => m.ButtonLoadingComponent)
    }
]
