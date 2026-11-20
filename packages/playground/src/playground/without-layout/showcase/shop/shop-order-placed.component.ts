import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NbButtonComponent, NbCardBodyComponent, NbCardComponent, NbIconComponent } from '@liquid-js/lyr-core';

import { ShopCart } from './shop-cart.service';
import { orderTotal, SHOP_PAST_ORDERS, ShopOrder } from './shop-data';
import { ShopPictureComponent } from './parts/shop-picture.component';

/** An order's confirmation: thanks, its number, what happens next and what's in it. */
@Component({
  templateUrl: './shop-order-placed.component.html',
  styleUrls: ['./shop-order-placed.component.scss'],
  imports: [
    CurrencyPipe,
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbIconComponent,
    RouterLink,
    ShopPictureComponent,
  ],
})
export class ShopOrderPlacedComponent {
  protected readonly cart = inject(ShopCart);

  /** The order just placed, or a sample one when the page is opened on its own. */
  readonly order = computed<ShopOrder>(
    () => this.cart.placed() ?? { ...SHOP_PAST_ORDERS[0], number: '10483', date: new Date(), status: 'Processing' },
  );
  readonly total = computed(() => orderTotal(this.order()));

  readonly steps = [
    { title: 'Order placed', icon: 'checkmark-outline', done: true },
    { title: 'Packed', icon: 'archive-outline', done: false },
    { title: 'On its way', icon: 'paper-plane-outline', done: false },
    { title: 'Delivered', icon: 'home-outline', done: false },
  ];
}
