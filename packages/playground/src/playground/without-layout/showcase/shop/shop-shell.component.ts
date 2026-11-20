import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  NbBadgeComponent,
  NbButtonComponent,
  NbFormFieldComponent,
  NbIconComponent,
  NbInputDirective,
  NbLayoutColumnComponent,
  NbLayoutComponent,
  NbLayoutFooterComponent,
  NbLayoutHeaderComponent,
  NbPrefixDirective,
} from '@liquid-js/lyr-core';

import { ShopCart } from './shop-cart.service';

/** A shop's frame: a header with search, the customer's orders and the cart, and a small footer. */
@Component({
  selector: 'npg-shop-shell',
  templateUrl: './shop-shell.component.html',
  styleUrls: ['./shop-shell.component.scss'],
  imports: [
    NbBadgeComponent,
    NbButtonComponent,
    NbFormFieldComponent,
    NbIconComponent,
    NbInputDirective,
    NbLayoutColumnComponent,
    NbLayoutComponent,
    NbLayoutFooterComponent,
    NbLayoutHeaderComponent,
    NbPrefixDirective,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
})
export class ShopShellComponent {
  protected readonly cart = inject(ShopCart);
  readonly year = new Date().getFullYear();
}
