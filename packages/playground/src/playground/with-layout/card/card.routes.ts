import { Routes } from '@angular/router'

export const CARD_ROUTES: Routes = [
    {
        path: 'card-media.component',
        loadComponent: () => import('./card-media.component').then((m) => m.CardMediaComponent)
    },
    {
        path: 'card-accents.component',
        loadComponent: () => import('./card-accents.component').then((m) => m.CardAccentsComponent)
    },
    {
        path: 'card-colors.component',
        loadComponent: () => import('./card-colors.component').then((m) => m.CardColorsComponent)
    },
    {
        path: 'card-full.component',
        loadComponent: () => import('./card-full.component').then((m) => m.CardFullComponent)
    },
    {
        path: 'card-showcase.component',
        loadComponent: () => import('./card-showcase.component').then((m) => m.CardShowcaseComponent)
    },
    {
        path: 'card-sizes.component',
        loadComponent: () => import('./card-sizes.component').then((m) => m.CardSizesComponent)
    },
    {
        path: 'card-test.component',
        loadComponent: () => import('./card-test.component').then((m) => m.CardTestComponent)
    },
    {
        path: 'card-without-body.component',
        loadComponent: () => import('./card-without-body.component').then((m) => m.CardWithoutBodyComponent)
    },
    {
        path: 'card-sizes-combinations.component',
        loadComponent: () => import('./card-sizes-combinations.component').then((m) => m.CardSizesCombinationsComponent)
    },
    {
        path: 'card-actions.component',
        loadComponent: () => import('./card-actions.component').then((m) => m.CardActionsComponent)
    },
    {
        path: 'card-appearances.component',
        loadComponent: () => import('./card-appearances.component').then((m) => m.CardAppearancesComponent)
    },
    {
        path: 'card-interactive.component',
        loadComponent: () => import('./card-interactive.component').then((m) => m.CardInteractiveComponent)
    }
]
