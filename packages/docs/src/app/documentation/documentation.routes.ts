import { Routes } from '@angular/router';

import { NgdAreaEntry } from '../docs.model';
import { firstPageRedirect, firstTabRedirects } from './documentation-redirects';

/** An area's routes. Redirects happen here, so a page renders once, at its final URL. */
export const documentationRoutes = (area: NgdAreaEntry): Routes => [
  { path: '', pathMatch: 'full', redirectTo: firstPageRedirect },
  {
    path: '',
    loadComponent: () => import('./documentation.component').then((m) => m.NgdDocumentationComponent),
    children: [
      ...firstTabRedirects(area),
      {
        path: ':page',
        loadComponent: () => import('./page/page.component').then((m) => m.NgdPageComponent),
      },
      {
        path: ':page/:subPage',
        loadComponent: () => import('./page/page.component').then((m) => m.NgdPageComponent),
      },
      {
        path: ':page/:subPage/:tab',
        loadComponent: () => import('./page/page.component').then((m) => m.NgdPageComponent),
      },
    ],
  },
];
