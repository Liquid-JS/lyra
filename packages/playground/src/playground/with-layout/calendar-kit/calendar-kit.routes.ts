import { Routes } from '@angular/router'

export const CALENDAR_KIT_ROUTES: Routes = [
    {
        path: 'calendar-kit-full-calendar.component',
        loadComponent: () => import('./calendar-kit-full-calendar.component').then((m) => m.CalendarKitFullCalendarShowcaseComponent)
    }
]
