import { Routes } from '@angular/router';

export const WITHOUT_LAYOUT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./playground-base.component').then((m) => m.PlaygroundBaseComponent),
    children: [
      {
        path: 'showcase',
        loadChildren: () => import('./showcase/showcase.routes').then((m) => m.SHOWCASE_ROUTES),
      },
      {
        path: 'context-menu',
        loadChildren: () => import('./context-menu/context-menu.routes').then((m) => m.CONTEXT_MENU_ROUTES),
      },
      {
        path: 'layout',
        loadChildren: () => import('./layout/layout.routes').then((m) => m.LAYOUT_ROUTES),
      },
      {
        path: 'scroll',
        loadChildren: () => import('./scroll/scroll.routes').then((m) => m.SCROLL_ROUTES),
      },
      {
        path: 'search',
        loadChildren: () => import('./search/search.routes').then((m) => m.SEARCH_ROUTES),
      },
      {
        path: 'sidebar',
        loadChildren: () => import('./sidebar/sidebar.routes').then((m) => m.SIDEBAR_ROUTES),
      },
      {
        path: 'menu',
        loadChildren: () => import('./menu/menu.routes').then((m) => m.MENU_ROUTES),
      },
      {
        path: 'user',
        loadChildren: () => import('./user/user.routes').then((m) => m.USER_ROUTES),
      },
      {
        path: 'azure',
        loadChildren: () => import('./azure/azure.routes').then((m) => m.AZURE_ROUTES),
      },
      {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
      },
      {
        path: 'firebase',
        loadChildren: () => import('./firebase/firebase.routes').then((m) => m.FIREBASE_ROUTES),
      },
      {
        path: 'smart-home',
        loadChildren: () => import('./smart-home/smart-home.routes').then((m) => m.SMART_HOME_ROUTES),
      },
    ],
  },
];
