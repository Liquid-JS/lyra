import { Routes } from '@angular/router';
import { provideNbDatepicker, provideNbDialog, provideNbToastr } from '@liquid-js/lyr-core';

import { StayTripService } from './stay-trip.service';

/** Stay's screens, in its frame: the search, a place, paying for a stay, and your trips. */
export const STAY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./stay-shell.component').then((m) => m.StayShellComponent),
    // The trip being booked and the trips booked, kept between the screens; the date pickers, dialogs and toasts the
    // screens use.
    providers: [StayTripService, provideNbDatepicker(), provideNbDialog(), provideNbToastr({ duration: 4000 })],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'search' },
      {
        path: 'search',
        data: { title: 'Search' },
        loadComponent: () => import('./stay-search.component').then((m) => m.StaySearchComponent),
      },
      {
        path: 'listing',
        data: { title: 'Listing' },
        loadComponent: () => import('./stay-listing.component').then((m) => m.StayListingComponent),
      },
      {
        path: 'listing/:id',
        data: { title: 'Listing' },
        loadComponent: () => import('./stay-listing.component').then((m) => m.StayListingComponent),
      },
      {
        path: 'booking',
        data: { title: 'Booking' },
        loadComponent: () => import('./stay-booking.component').then((m) => m.StayBookingComponent),
      },
      {
        path: 'trips',
        data: { title: 'Trips' },
        loadComponent: () => import('./stay-trips.component').then((m) => m.StayTripsComponent),
      },
    ],
  },
];
