import { Routes } from '@angular/router'

export const SLIDER_ROUTES: Routes = [
    {
        path: 'slider-showcase.component',
        loadComponent: () => import('./slider-showcase.component').then((m) => m.SliderShowcaseComponent)
    },
    {
        path: 'slider-sizes.component',
        loadComponent: () => import('./slider-sizes.component').then((m) => m.SliderSizesComponent)
    },
    {
        path: 'slider-open.component',
        loadComponent: () => import('./slider-open.component').then((m) => m.SliderOpenComponent)
    },
    {
        path: 'slider-transform.component',
        loadComponent: () => import('./slider-transform.component').then((m) => m.SliderTransformComponent)
    }
]
