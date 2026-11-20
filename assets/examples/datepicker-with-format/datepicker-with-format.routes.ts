import { Routes } from '@angular/router'
import { provideNbDatepicker, provideNbTimepicker } from '@liquid-js/lyr-core'
import { provideNbDateFnsDate } from '@liquid-js/lyr-date-fns'

export const DATEPICKER_WITH_FORMAT_ROUTES: Routes = [
    {
        path: '',
        providers: [
            provideNbDatepicker(),
            provideNbTimepicker(),
            provideNbDateFnsDate({})
        ],
        children: [
            {
                path: 'date-timepicker-dynamic-inputs-showcase.component',
                loadComponent: () => import('./date-timepicker-dynamic-inputs-showcase.component').then((m) => m.DateTimepickerDynamicInputsShowcaseComponent)
            },
            {
                path: 'datepicker-dynamic-inputs-showcase.component',
                loadComponent: () => import('./datepicker-dynamic-inputs-showcase.component').then((m) => m.DatepickerDynamicInputsShowcaseComponent)
            },
            {
                path: 'rangepicker-dynamic-inputs-showcase.component',
                loadComponent: () => import('./rangepicker-dynamic-inputs-showcase.component').then((m) => m.RangepickerDynamicInputsShowcaseComponent)
            }
        ]
    }
]
