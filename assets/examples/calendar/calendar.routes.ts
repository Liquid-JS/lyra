import { Routes } from '@angular/router'

export const CALENDAR_ROUTES: Routes = [
    {
        path: 'calendar-bounding-month.component',
        loadComponent: () => import('./calendar-bounding-month.component').then((m) => m.CalendarBoundingMonthComponent)
    },
    {
        path: 'calendar-custom-day-cell-showcase.component',
        loadComponent: () => import('./calendar-custom-day-cell-showcase.component').then((m) => m.CalendarCustomDayCellShowcaseComponent)
    },
    {
        path: 'calendar-filter.component',
        loadComponent: () => import('./calendar-filter.component').then((m) => m.CalendarFilterComponent)
    },
    {
        path: 'calendar-min-max.component',
        loadComponent: () => import('./calendar-min-max.component').then((m) => m.CalendarMinMaxComponent)
    },
    {
        path: 'calendar-range-showcase.component',
        loadComponent: () => import('./calendar-range-showcase.component').then((m) => m.CalendarRangeShowcaseComponent)
    },
    {
        path: 'calendar-showcase.component',
        loadComponent: () => import('./calendar-showcase.component').then((m) => m.CalendarShowcaseComponent)
    },
    {
        path: 'calendar-size.component',
        loadComponent: () => import('./calendar-size.component').then((m) => m.CalendarSizeComponent)
    },
    {
        path: 'calendar-start-view.component',
        loadComponent: () => import('./calendar-start-view.component').then((m) => m.CalendarStartViewComponent)
    },
    {
        path: 'calendar-without-navigation.component',
        loadComponent: () => import('./calendar-without-navigation.component').then((m) => m.CalendarWithoutNavigationComponent)
    },
    {
        path: 'calendar-week-number.component',
        loadComponent: () => import('./calendar-week-number.component').then((m) => m.CalendarWeekNumberComponent)
    },
    {
        path: 'calendar-form.component',
        loadComponent: () => import('./calendar-form.component').then((m) => m.CalendarFormComponent)
    }
]
