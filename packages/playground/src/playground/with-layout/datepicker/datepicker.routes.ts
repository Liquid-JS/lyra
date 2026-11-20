import { Routes } from '@angular/router';
import { provideNbDatepicker, provideNbTimepicker } from '@liquid-js/lyr-core';

export const DATEPICKER_ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideNbDatepicker(),
      provideNbTimepicker(),
    ],
    children: [
      {
        path: 'datepicker-forms.component',
        loadComponent: () => import('./datepicker-forms.component').then((m) => m.DatepickerFormsComponent),
      },
      {
        path: 'datepicker-showcase.component',
        loadComponent: () => import('./datepicker-showcase.component').then((m) => m.DatepickerShowcaseComponent),
      },
      {
        path: 'date-timepicker-showcase.component',
        loadComponent: () => import('./date-timepicker-showcase.component').then((m) => m.DateTimepickerShowcaseComponent),
      },
      {
        path: 'date-timepicker-single-column.component',
        loadComponent: () => import('./date-timepicker-single-column.component').then((m) => m.DateTimepickerSingleColumnComponent),
      },
      {
        path: 'datepicker-validation.component',
        loadComponent: () => import('./datepicker-validation.component').then((m) => m.DatepickerValidationComponent),
      },
      {
        path: 'rangepicker-showcase.component',
        loadComponent: () => import('./rangepicker-showcase.component').then((m) => m.RangepickerShowcaseComponent),
      },
      {
        path: 'datepicker-filter.component',
        loadComponent: () => import('./datepicker-filter.component').then((m) => m.DatepickerFilterComponent),
      },
      {
        path: 'datepicker-picker-mode.component',
        loadComponent: () =>
          import('./datepicker-picker-mode.component').then((m) => m.DatepickerPickerModeComponent),
      },
    ],
  },
];
