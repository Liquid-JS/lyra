import { Routes } from '@angular/router'

export const ACCORDION_ROUTES: Routes = [
    {
        path: 'accordion-multi.component',
        loadComponent: () => import('./accordion-multi.component').then((m) => m.AccordionMultiComponent)
    },
    {
        path: 'accordion-showcase.component',
        loadComponent: () => import('./accordion-showcase.component').then((m) => m.AccordionShowcaseComponent)
    },
    {
        path: 'accordion-test.component',
        loadComponent: () => import('./accordion-test.component').then((m) => m.AccordionTestComponent)
    },
    {
        path: 'accordion-toggle.component',
        loadComponent: () => import('./accordion-toggle.component').then((m) => m.AccordionToggleComponent)
    }
]
