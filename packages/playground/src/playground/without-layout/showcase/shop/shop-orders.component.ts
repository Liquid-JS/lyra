import { CurrencyPipe, DatePipe } from '@angular/common'
import { Component, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import {
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardFooterComponent,
    NbCardHeaderComponent,
    NbIconComponent,
    NbUserComponent
} from '@liquid-js/lyr-core'

import { ShopCart } from './shop-cart.service'
import { ORDER_STATUS, orderTotal, ShopOrder } from './shop-data'
import { ShopPictureComponent } from './parts/shop-picture.component'

/** The customer's account: their details and the orders they placed, each to buy again. */
@Component({
    templateUrl: './shop-orders.component.html',
    styleUrls: ['./shop-orders.component.scss'],
    imports: [
        CurrencyPipe,
        DatePipe,
        NbButtonComponent,
        NbCardBodyComponent,
        NbCardComponent,
        NbCardFooterComponent,
        NbCardHeaderComponent,
        NbIconComponent,
        NbUserComponent,
        RouterLink,
        ShopPictureComponent
    ]
})
export class ShopOrdersComponent {
    protected readonly cart = inject(ShopCart)
    protected readonly statuses = ORDER_STATUS
    protected readonly total = orderTotal

    /** The order just put in the cart again, whose button says so for a moment. */
    readonly reordered = signal<string | undefined>(undefined)
    protected reorderedTimer?: ReturnType<typeof setTimeout>

    reorder(order: ShopOrder) {
        this.cart.reorder(order)
        this.reordered.set(order.number)
        clearTimeout(this.reorderedTimer)
        this.reorderedTimer = setTimeout(() => this.reordered.set(undefined), 2000)
    }
}
