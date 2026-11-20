import { CurrencyPipe } from '@angular/common'
import { Component, computed, inject, linkedSignal, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import {
    NbBadgeComponent,
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardFooterComponent,
    NbCardLinkDirective,
    NbCardMediaDirective,
    NbIconComponent,
    NbOptionComponent,
    NbPaginationComponent,
    NbSelectComponent,
    NbTagComponent,
    NbTagListComponent
} from '@liquid-js/lyr-core'

import { ShopCart } from './shop-cart.service'
import { SHOP_CATEGORIES, SHOP_PRODUCTS } from './shop-data'
import { ShopPictureComponent } from './parts/shop-picture.component'
import { ShopRatingComponent } from './parts/shop-rating.component'

// Twelve fill whole rows of four, three, two or one.
const PAGE_SIZE = 12

/** A shop's products: by category, sorted, a page at a time, each added to the cart in one click. */
@Component({
    templateUrl: './shop-products.component.html',
    styleUrls: ['./shop-products.component.scss'],
    imports: [
        CurrencyPipe,
        NbBadgeComponent,
        NbButtonComponent,
        NbCardBodyComponent,
        NbCardComponent,
        NbCardFooterComponent,
        NbCardLinkDirective,
        NbCardMediaDirective,
        NbIconComponent,
        NbOptionComponent,
        NbPaginationComponent,
        NbSelectComponent,
        NbTagComponent,
        NbTagListComponent,
        RouterLink,
        ShopPictureComponent,
        ShopRatingComponent
    ]
})
export class ShopProductsComponent {
    protected readonly cart = inject(ShopCart)

    readonly categories = SHOP_CATEGORIES
    readonly pageSize = PAGE_SIZE
    readonly category = signal('All')
    readonly sort = signal<'popular' | 'price' | 'rating'>('popular')

    readonly products = computed(() => {
        const category = this.category()
        const products = SHOP_PRODUCTS.filter((product) => category === 'All' || product.category === category)
        const sort = this.sort()
        return sort === 'price'
            ? [...products].sort((a, b) => a.price - b.price)
            : sort === 'rating'
                ? [...products].sort((a, b) => b.rating - a.rating)
                : [...products].sort((a, b) => b.reviews - a.reviews)
    })
    /** The page shown, back to the first when the category or order changes. */
    readonly page = linkedSignal({ source: this.products, computation: () => 0 })
    readonly shown = computed(() => this.products().slice(this.page() * PAGE_SIZE, (this.page() + 1) * PAGE_SIZE))

    /** The product just added, whose button says so for a moment. */
    readonly added = signal<string | undefined>(undefined)
    protected addedTimer?: ReturnType<typeof setTimeout>

    add(id: string) {
        const product = SHOP_PRODUCTS.find((item) => item.id === id)
        if (product) {
            this.cart.add(product)
            this.added.set(id)
            clearTimeout(this.addedTimer)
            this.addedTimer = setTimeout(() => this.added.set(undefined), 1500)
        }
    }
}
