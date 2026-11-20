import { Routes } from '@angular/router';

export const PLAYGROUND_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () => import('./with-layout/with-layout.routes').then((m) => m.WITH_LAYOUT_ROUTES),
  },
  {
    path: '',
    loadChildren: () => import('./without-layout/without-layout.routes').then((m) => m.WITHOUT_LAYOUT_ROUTES),
  },
];
