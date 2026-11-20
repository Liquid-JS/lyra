import { Routes } from '@angular/router'

export const STEPPER_ROUTES: Routes = [
    {
        path: 'stepper-showcase.component',
        loadComponent: () => import('./stepper-showcase.component').then((m) => m.StepperShowcaseComponent)
    },
    {
        path: 'stepper-test.component',
        loadComponent: () => import('./stepper-test.component').then((m) => m.StepperTestComponent)
    },
    {
        path: 'stepper-validation.component',
        loadComponent: () => import('./stepper-validation.component').then((m) => m.StepperValidationComponent)
    },
    {
        path: 'stepper-vertical.component',
        loadComponent: () => import('./stepper-vertical.component').then((m) => m.StepperVerticalComponent)
    },
    {
        path: 'stepper-disabled-step-nav.component',
        loadComponent: () => import('./stepper-disabled-step-nav.component').then((m) => m.StepperDisabledStepNavComponent)
    },
    {
        path: 'stepper-linear.component',
        loadComponent: () => import('./stepper-linear.component').then((m) => m.StepperLinearComponent)
    },
    {
        path: 'stepper-step-change-event.component',
        loadComponent: () => import('./stepper-step-change-event.component').then((m) => m.StepperStepChangeEventComponent)
    }
]
