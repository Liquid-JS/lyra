import { CurrencyPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';

import { deliveryPrice, FREE_DELIVERY_FROM, ShopDeliveryOption } from '../shop-data';

/** An order's subtotal, delivery and total, and how much more makes standard delivery free. */
@Component({
  selector: 'npg-shop-order-summary',
  template: `
    <dl>
      <dt>Subtotal</dt>
      <dd>{{ subtotal() | currency: 'USD' }}</dd>
      <dt>Delivery</dt>
      <dd>{{ delivery() ? (delivery() | currency: 'USD') : 'Free' }}</dd>
      <dt class="total">Total</dt>
      <dd class="total">{{ subtotal() + delivery() | currency: 'USD' }}</dd>
    </dl>
    @if (option() === 'standard' && subtotal() < freeFrom) {
      <p class="hint">Add {{ freeFrom - subtotal() | currency: 'USD' }} more for free delivery.</p>
    }
  `,
  styles: `
    dl {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 0.5rem 0;
      margin: 0;
    }

    dd {
      margin: 0;
      text-align: end;
    }

    .total {
      margin-top: 0.5rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--divider-color);
      font-weight: 700;
      font-size: 1.125rem;
    }

    .hint {
      margin: 1rem 0 0;
      color: var(--text-hint-color);
      font-size: 0.875rem;
    }
  `,
  imports: [CurrencyPipe],
})
export class ShopOrderSummaryComponent {
  readonly subtotal = input.required<number>();
  readonly option = input<ShopDeliveryOption>('standard');
  protected readonly delivery = computed(() => deliveryPrice(this.option(), this.subtotal()));
  protected readonly freeFrom = FREE_DELIVERY_FROM;
}
