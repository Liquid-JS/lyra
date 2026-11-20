import { Routes } from '@angular/router';

/** A product's site: its landing page and its blog, in the site's header and footer. */
export const SITE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./site-shell.component').then((m) => m.SiteShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', loadComponent: () => import('./site-home.component').then((m) => m.SiteHomeComponent) },
      { path: 'blog', loadComponent: () => import('./site-blog.component').then((m) => m.SiteBlogComponent) },
      { path: 'article', loadComponent: () => import('./site-article.component').then((m) => m.SiteArticleComponent) },
    ],
  },
  {
    path: 'site-mockup.component',
    loadComponent: () => import('./site-mockup.component').then((m) => m.SiteMockupComponent),
  },
];
