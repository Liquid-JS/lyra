import { Routes } from '@angular/router';

export const TABSET_ROUTES: Routes = [
  {
    path: 'route-tabset-showcase.component',
    loadComponent: () => import('./route-tabset-showcase.component').then((m) => m.RouteTabsetShowcaseComponent),
    children: [
      {
        path: '',
        redirectTo: 'tab1',
        pathMatch: 'full',
      },
      {
        path: 'tab1',
        loadComponent: () => import('./components/route-tabset-children.component').then((m) => m.RouteTabsetShowcaseChild1Component),
      },
      {
        path: 'tab2',
        loadComponent: () => import('./components/route-tabset-children.component').then((m) => m.RouteTabsetShowcaseChild2Component),
      },
      {
        path: 'tab3',
        loadComponent: () => import('./components/route-tabset-children.component').then((m) => m.RouteTabsetShowcaseChild3Component),
      },
    ],
  },
  {
    path: 'tabset-badge.component',
    loadComponent: () => import('./tabset-badge.component').then((m) => m.TabsetBadgeComponent),
  },
  {
    path: 'tabset-icon.component',
    loadComponent: () => import('./tabset-icon.component').then((m) => m.TabsetIconComponent),
  },
  {
    path: 'tabset-showcase.component',
    loadComponent: () => import('./tabset-showcase.component').then((m) => m.TabsetShowcaseComponent),
  },
  {
    path: 'tabset-test.component',
    loadComponent: () => import('./tabset-test.component').then((m) => m.TabsetTestComponent),
  },
  {
    path: 'tabset-test.component/:tab',
    loadComponent: () => import('./tabset-test.component').then((m) => m.TabsetTestComponent),
  },
  {
    path: 'tabset-width.component',
    loadComponent: () => import('./tabset-width.component').then((m) => m.TabsetWidthComponent),
  },
  {
    path: 'tabset-disabled.component',
    loadComponent: () => import('./tabset-disabled.component').then((m) => m.TabsetDisabledComponent),
  },
  {
    path: 'tabset-template-title.component',
    loadComponent: () => import('./tabset-template-title.component').then((m) => m.TabsetTemplateTitleComponent),
  },
];
