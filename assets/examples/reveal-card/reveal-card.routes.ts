import { Routes } from '@angular/router'

export const REVEAL_CARD_ROUTES: Routes = [
    {
        path: 'reveal-card-accents.component',
        loadComponent: () => import('./reveal-card-accents.component').then((m) => m.RevealCardAccentsComponent)
    },
    {
        path: 'reveal-card-colors.component',
        loadComponent: () => import('./reveal-card-colors.component').then((m) => m.RevealCardColorsComponent)
    },
    {
        path: 'reveal-card-full.component',
        loadComponent: () => import('./reveal-card-full.component').then((m) => m.RevealCardFullComponent)
    },
    {
        path: 'reveal-card-showcase.component',
        loadComponent: () => import('./reveal-card-showcase.component').then((m) => m.RevealCardShowcaseComponent)
    },
    {
        path: 'reveal-card-sizes.component',
        loadComponent: () => import('./reveal-card-sizes.component').then((m) => m.RevealCardSizesComponent)
    }
]
