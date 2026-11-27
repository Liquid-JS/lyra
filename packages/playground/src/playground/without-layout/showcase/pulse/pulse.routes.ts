import { Routes } from '@angular/router'
import { provideNbDialog } from '@liquid-js/lyr-core'
import { NB_BAR_CHART_PARTS, NB_LINE_CHART_PARTS, provideNbCharts } from '@liquid-js/lyr-extras/chart'

/** Pulse's screens, in its frame. */
export const PULSE_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./pulse-shell.component').then((m) => m.PulseShellComponent),
        // The chart types the trends draw, and the dialogs today's screen opens.
        providers: [provideNbCharts(...NB_BAR_CHART_PARTS, ...NB_LINE_CHART_PARTS), provideNbDialog()],
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'today' },
            {
                path: 'today',
                data: { title: 'Today' },
                loadComponent: () => import('./pulse-today.component').then((m) => m.PulseTodayComponent)
            },
            {
                path: 'workout',
                data: { title: 'Workout', back: true },
                loadComponent: () => import('./pulse-workout.component').then((m) => m.PulseWorkoutComponent)
            },
            {
                path: 'trends',
                data: { title: 'Trends' },
                loadComponent: () => import('./pulse-trends.component').then((m) => m.PulseTrendsComponent)
            },
            {
                path: 'settings',
                data: { title: 'Settings' },
                loadComponent: () => import('./pulse-settings.component').then((m) => m.PulseSettingsComponent)
            }
        ]
    }
]
