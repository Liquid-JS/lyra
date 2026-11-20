import { Routes } from '@angular/router'
import { provideNbDialog, provideNbToastr } from '@liquid-js/lyr-core'

/** Book's screens, in its frame. */
export const BOOK_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./book-shell.component').then((m) => m.BookShellComponent),
        // The dialog that confirms a cancellation, and the toast that follows it.
        providers: [provideNbDialog(), provideNbToastr()],
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'home' },
            {
                path: 'home',
                data: { title: 'Home' },
                loadComponent: () => import('./book-home.component').then((m) => m.BookHomeComponent)
            },
            {
                path: 'book',
                data: { title: 'Book' },
                loadComponent: () => import('./book-book.component').then((m) => m.BookBookComponent)
            },
            {
                path: 'confirmed',
                data: { title: 'Confirmed' },
                loadComponent: () => import('./book-confirmed.component').then((m) => m.BookConfirmedComponent)
            },
            {
                path: 'bookings',
                data: { title: 'My bookings' },
                loadComponent: () => import('./book-bookings.component').then((m) => m.BookBookingsComponent)
            }
        ]
    }
]
