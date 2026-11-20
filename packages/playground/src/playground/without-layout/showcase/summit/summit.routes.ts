import { Routes } from '@angular/router'
import { provideNbDialog, provideNbToastr } from '@liquid-js/lyr-core'

/** Summit's screens, in its frame. */
export const SUMMIT_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./summit-shell.component').then((m) => m.SummitShellComponent),
        // The speakers' dialog and the checkout's toast.
        providers: [provideNbDialog(), provideNbToastr()],
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'home' },
            {
                path: 'home',
                data: { title: 'Home' },
                loadComponent: () => import('./summit-home.component').then((m) => m.SummitHomeComponent)
            },
            {
                path: 'agenda',
                data: { title: 'Agenda' },
                loadComponent: () => import('./summit-agenda.component').then((m) => m.SummitAgendaComponent)
            },
            {
                path: 'speakers',
                data: { title: 'Speakers' },
                loadComponent: () => import('./summit-speakers.component').then((m) => m.SummitSpeakersComponent)
            },
            {
                path: 'tickets',
                data: { title: 'Tickets' },
                loadComponent: () => import('./summit-tickets.component').then((m) => m.SummitTicketsComponent)
            }
        ]
    }
]
