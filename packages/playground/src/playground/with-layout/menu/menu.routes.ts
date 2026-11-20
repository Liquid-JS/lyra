import { Routes } from '@angular/router';
import { provideNbMenu } from '@liquid-js/lyr-core';

export const MENU_ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideNbMenu(),
    ],
    children: [
      {
        path: 'menu-horizontal.component',
        loadComponent: () => import('./menu-horizontal.component').then((m) => m.MenuHorizontalComponent),
      },
      {
        path: 'menu-children.component',
        loadComponent: () => import('./menu-children.component').then((m) => m.MenuChildrenComponent),
      },
      {
        path: 'menu-showcase.component',
        loadComponent: () => import('./menu-showcase.component').then((m) => m.MenuShowcaseComponent),
      },
      {
        path: 'menu-autocollapse.component',
        loadComponent: () => import('./menu-autocollapse.component').then((m) => m.MenuAutoCollapseComponent),
      },
      {
        path: 'menu-link-params.component',
        loadComponent: () => import('./menu-link-params.component').then((m) => m.MenuLinkParamsComponent),
      },
      {
        path: 'menu-badge.component',
        loadComponent: () => import('./menu-badge.component').then((m) => m.MenuBadgeComponent),
      },
      {
        path: 'menu-service.component',
        loadComponent: () => import('./menu-service.component').then((m) => m.MenuServiceComponent),
        children: [
          {
            path: '2',
            loadComponent: () => import('./menu-service-children').then((m) => m.MenuServiceItem2Component),
          },
          {
            path: '3',
            loadComponent: () => import('./menu-service-children').then((m) => m.MenuServiceItem3Component),
            children: [
              {
                path: '1',
                loadComponent: () => import('./menu-service-children').then((m) => m.MenuServiceItem31Component),
              },
              {
                path: '2',
                loadComponent: () => import('./menu-service-children').then((m) => m.MenuServiceItem32Component),
              },
              {
                path: '3',
                loadComponent: () => import('./menu-service-children').then((m) => m.MenuServiceItem33Component),
                children: [
                  {
                    path: '1',
                    loadComponent: () => import('./menu-service-children').then((m) => m.MenuServiceItem331Component),
                  },
                  {
                    path: '2',
                    loadComponent: () => import('./menu-service-children').then((m) => m.MenuServiceItem332Component),
                  },
                ],
              },
            ],
          },
          {
            path: '',
            loadComponent: () => import('./menu-service-children').then((m) => m.MenuServiceItem1Component),
          },
        ],
      },
    ],
  },
];
