import { Routes } from '@angular/router'

import { ShopCart } from './shop-cart.service'

/** A shop: its products, a product, the cart, checkout and the customer's orders, sharing one cart. */
export const SHOP_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./shop-shell.component').then((m) => m.ShopShellComponent),
        providers: [ShopCart],
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'products' },
            {
                path: 'products',
                loadComponent: () => import('./shop-products.component').then((m) => m.ShopProductsComponent)
            },
            {
                path: 'products/:id',
                loadComponent: () => import('./shop-product.component').then((m) => m.ShopProductComponent)
            },
            { path: 'cart', loadComponent: () => import('./shop-cart.component').then((m) => m.ShopCartComponent) },
            {
                path: 'checkout',
                loadComponent: () => import('./shop-checkout.component').then((m) => m.ShopCheckoutComponent)
            },
            {
                path: 'order-placed',
                loadComponent: () => import('./shop-order-placed.component').then((m) => m.ShopOrderPlacedComponent)
            },
            { path: 'orders', loadComponent: () => import('./shop-orders.component').then((m) => m.ShopOrdersComponent) }
        ]
    }
]
