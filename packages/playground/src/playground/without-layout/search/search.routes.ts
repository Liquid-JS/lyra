import { Routes } from '@angular/router';
import { provideNbSidebar } from '@liquid-js/lyr-core';

export const SEARCH_ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideNbSidebar(),
    ],
    children: [
      {
        path: 'search-customized-test.component',
        loadComponent: () => import('./search-customized-test.component').then((m) => m.SearchCustomizedTestComponent),
      },
      {
        path: 'search-event.component',
        loadComponent: () => import('./search-event.component').then((m) => m.SearchEventComponent),
      },
      {
        path: 'search-showcase.component',
        loadComponent: () => import('./search-showcase.component').then((m) => m.SearchShowcaseComponent),
      },
      {
        path: 'search-test.component',
        loadComponent: () => import('./search-test.component').then((m) => m.SearchTestComponent),
      },
      {
        path: 'search-with-input-event.component',
        loadComponent: () => import('./search-with-input-event.component').then((m) => m.SearchWithInputEventComponent),
      },
    ],
  },
];
