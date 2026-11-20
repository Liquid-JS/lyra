import { Routes } from '@angular/router'
import { provideNbDatepicker, provideNbDialog, provideNbToastr } from '@liquid-js/lyr-core'

/** The intranet's pages, in its frame. */
export const HUB_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./hub-shell.component').then((m) => m.HubShellComponent),
        // The requests' date pickers, the tickets' dialog, and the toasts that confirm what was sent.
        providers: [provideNbDatepicker(), provideNbDialog(), provideNbToastr()],
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'home' },
            {
                path: 'home',
                data: { title: 'Home' },
                loadComponent: () => import('./hub-home.component').then((m) => m.HubHomeComponent)
            },
            {
                path: 'people',
                data: { title: 'People' },
                loadComponent: () => import('./hub-people.component').then((m) => m.HubPeopleComponent)
            },
            {
                path: 'documents',
                data: { title: 'Documents' },
                loadComponent: () => import('./hub-documents.component').then((m) => m.HubDocumentsComponent)
            },
            {
                path: 'documents/new',
                data: { title: 'New document' },
                loadComponent: () => import('./hub-new-document.component').then((m) => m.HubNewDocumentComponent)
            },
            {
                path: 'requests',
                data: { title: 'Requests' },
                loadComponent: () => import('./hub-requests.component').then((m) => m.HubRequestsComponent)
            },
            {
                path: 'tickets',
                data: { title: 'Tickets' },
                loadComponent: () => import('./hub-tickets.component').then((m) => m.HubTicketsComponent)
            },
            {
                path: 'chat',
                data: { title: 'Chat' },
                loadComponent: () => import('./hub-chat.component').then((m) => m.HubChatComponent)
            },
            {
                path: 'settings',
                data: { title: 'Settings' },
                loadComponent: () => import('./hub-settings.component').then((m) => m.HubSettingsComponent)
            }
        ]
    }
]
