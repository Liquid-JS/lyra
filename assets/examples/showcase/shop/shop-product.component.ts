import { CurrencyPipe } from '@angular/common'
import { Component, computed, inject, linkedSignal, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, RouterLink } from '@angular/router'
import {
    NbAccordionComponent,
    NbAccordionItemBodyComponent,
    NbAccordionItemComponent,
    NbAccordionItemHeaderComponent,
    NbBadgeComponent,
    NbBreadcrumbComponent,
    NbBreadcrumbsComponent,
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardLinkDirective,
    NbCardMediaDirective,
    NbIconComponent,
    NbRadioComponent,
    NbRadioGroupComponent,
    NbUserComponent
} from '@liquid-js/lyr-core'

import { ShopCart } from './shop-cart.service'
import { findProduct, SHOP_PRODUCTS } from './shop-data'
import { ShopPictureComponent } from './parts/shop-picture.component'
import { ShopQuantityComponent } from './parts/shop-quantity.component'
import { ShopRatingComponent } from './parts/shop-rating.component'

const REVIEWS = [
    { name: 'Emma Brown', rating: 5, date: 'October 2026', text: 'Exactly as pictured, and it arrived in two days.' },
    { name: 'Liam Walker', rating: 4, date: 'September 2026', text: 'Great quality for the price. I would buy it again.' }
]

/** A product: its picture, price, colours and quantity, details and reviews, and others like it. */
@Component({
    templateUrl: './shop-product.component.html',
    styleUrls: ['./shop-product.component.scss'],
    imports: [
        CurrencyPipe,
        FormsModule,
        NbAccordionComponent,
        NbAccordionItemBodyComponent,
        NbAccordionItemComponent,
        NbAccordionItemHeaderComponent,
        NbBadgeComponent,
        NbBreadcrumbComponent,
        NbBreadcrumbsComponent,
        NbButtonComponent,
        NbCardBodyComponent,
        NbCardComponent,
        NbCardLinkDirective,
        NbCardMediaDirective,
        NbIconComponent,
        NbRadioComponent,
        NbRadioGroupComponent,
        NbUserComponent,
        RouterLink,
        ShopPictureComponent,
        ShopQuantityComponent,
        ShopRatingComponent
    ]
})
export class ShopProductComponent {
    protected readonly cart = inject(ShopCart)

    /** The route's parameters, with the product's id. */
    protected readonly params = toSignal(inject(ActivatedRoute).paramMap, { requireSync: true })

    readonly product = computed(() => findProduct(this.params().get('id')) ?? SHOP_PRODUCTS[0])
    readonly colour = linkedSignal(() => this.product().colours[0]?.name ?? '')
    /** How many to add, back to one for another product. */
    readonly quantity = linkedSignal({ source: this.product, computation: () => 1 })
    readonly related = computed(() => {
        const product = this.product()
        const same = SHOP_PRODUCTS.filter((item) => item.id !== product.id && item.category === product.category)
        return [...same, ...SHOP_PRODUCTS.filter((item) => item.id !== product.id && !same.includes(item))].slice(0, 4)
    })
    readonly reviews = REVIEWS

    readonly added = signal(false)
    protected addedTimer?: ReturnType<typeof setTimeout>

    add() {
        this.cart.add(this.product(), this.colour(), this.quantity())
        this.added.set(true)
        clearTimeout(this.addedTimer)
        this.addedTimer = setTimeout(() => this.added.set(false), 2000)
    }
}
