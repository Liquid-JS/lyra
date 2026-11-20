import { Routes } from '@angular/router'

/** Whole apps and sites built with Lyra, which the docs show with the theme being edited. */
export const SHOWCASE_ROUTES: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES)
    },
    {
        path: 'site',
        loadChildren: () => import('./site/site.routes').then((m) => m.SITE_ROUTES)
    },
    {
        path: 'mobile',
        loadChildren: () => import('./mobile/mobile.routes').then((m) => m.MOBILE_ROUTES)
    },
    {
        path: 'shop',
        loadChildren: () => import('./shop/shop.routes').then((m) => m.SHOP_ROUTES)
    },
    {
        path: 'saas',
        loadChildren: () => import('./saas/saas.routes').then((m) => m.SAAS_ROUTES)
    },
    {
        path: 'portfolio',
        loadChildren: () => import('./portfolio/portfolio.routes').then((m) => m.PORTFOLIO_ROUTES)
    },
    {
        path: 'pulse',
        loadChildren: () => import('./pulse/pulse.routes').then((m) => m.PULSE_ROUTES)
    },
    {
        path: 'book',
        loadChildren: () => import('./book/book.routes').then((m) => m.BOOK_ROUTES)
    },
    {
        path: 'summit',
        loadChildren: () => import('./summit/summit.routes').then((m) => m.SUMMIT_ROUTES)
    },
    {
        path: 'relay',
        loadChildren: () => import('./relay/relay.routes').then((m) => m.RELAY_ROUTES)
    },
    {
        path: 'hub',
        loadChildren: () => import('./hub/hub.routes').then((m) => m.HUB_ROUTES)
    },
    {
        path: 'learn',
        loadChildren: () => import('./learn/learn.routes').then((m) => m.LEARN_ROUTES)
    },
    {
        path: 'wallet',
        loadChildren: () => import('./wallet/wallet.routes').then((m) => m.WALLET_ROUTES)
    },
    {
        path: 'stay',
        loadChildren: () => import('./stay/stay.routes').then((m) => m.STAY_ROUTES)
    }
]
