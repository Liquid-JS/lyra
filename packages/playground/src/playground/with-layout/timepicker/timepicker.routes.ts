import { Routes } from '@angular/router'
import { provideNbTimepicker } from '@liquid-js/lyr-core'
import { provideNbDateFnsDate } from '@liquid-js/lyr-date-fns'

export const TIMEPICKER_ROUTES: Routes = [
    {
        path: '',
        providers: [
            provideNbTimepicker({ twelveHoursFormat: false }),
            provideNbDateFnsDate({})
        ],
        children: [
            {
                path: 'timepicker-showcase.component',
                loadComponent: () => import('./timepicker-showcase.component').then((m) => m.TimepickerShowcaseComponent)
            },
            {
                path: 'timepicker-twelve-hours-format.component',
                loadComponent: () => import('./timepicker-twelve-hours-format.component').then((m) => m.TimepickerTwelveHoursFormatComponent)
            },
            {
                path: 'timepicker-single-column.component',
                loadComponent: () => import('./timepicker-single-column.component').then((m) => m.TimepickerSingleColumnComponent)
            },
            {
                path: 'timepicker-with-seconds.component',
                loadComponent: () => import('./timepicker-with-seconds.component').then((m) => m.TimepickerWithSecondsComponent)
            },
            {
                path: 'timepicker-dynamic-inputs-showcase.component',
                loadComponent: () => import('./timepicker-dynamic-inputs-showcase.component').then((m) => m.TimepickerDynamicInputsShowcaseComponent)
            },
            {
                path: 'timepicker-form-control.component',
                loadComponent: () => import('./timepicker-form-control.component').then((m) => m.TimepickerFormControlComponent)
            },
            {
                path: 'timepicker-ng-model.component',
                loadComponent: () => import('./timepicker-ng-model.component').then((m) => m.TimepickerNgModelComponent)
            },
            {
                path: 'timepicker-validation.component',
                loadComponent: () => import('./timepicker-validation.component').then((m) => m.TimepickerValidationComponent)
            }
        ]
    }
]
