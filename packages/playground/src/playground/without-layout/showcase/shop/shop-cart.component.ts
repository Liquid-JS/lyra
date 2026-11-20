import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  NbButtonComponent,
  NbCardBodyComponent,
  NbCardComponent,
  NbCardFooterComponent,
  NbCardHeaderComponent,
  NbIconComponent,
} from '@liquid-js/lyr-core';

import { ShopCart } from './shop-cart.service';
import { ShopOrderSummaryComponent } from './parts/shop-order-summary.component';
import { ShopPictureComponent } from './parts/shop-picture.component';
import { ShopQuantityComponent } from './parts/shop-quantity.component';

/** The cart: its products with their quantities, and the order's total, on the way to checkout. */
@Component({
  templateUrl: './shop-cart.component.html',
  styleUrls: ['./shop-cart.component.scss'],
  imports: [
    CurrencyPipe,
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardFooterComponent,
    NbCardHeaderComponent,
    NbIconComponent,
    RouterLink,
    ShopOrderSummaryComponent,
    ShopPictureComponent,
    ShopQuantityComponent,
  ],
})
export class ShopCartComponent {
  protected readonly cart = inject(ShopCart);
}
