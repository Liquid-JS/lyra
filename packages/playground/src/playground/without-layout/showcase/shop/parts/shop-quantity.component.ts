import { Component, input, model } from '@angular/core';
import { NbButtonComponent, NbIconComponent } from '@liquid-js/lyr-core';

/** A quantity with buttons to take one off or add one; `min` is the fewest it goes down to. */
@Component({
  selector: 'npg-shop-quantity',
  template: `
    <button
      nbButton
      ghost
      size="small"
      type="button"
      [attr.aria-label]="'One fewer ' + label()"
      [disabled]="quantity() <= min()"
      (click)="quantity.set(quantity() - 1)">
      <nb-icon icon="minus-outline" />
    </button>
    <span class="value" aria-live="polite" [attr.aria-label]="quantity() + ' ' + label()">{{ quantity() }}</span>
    <button
      nbButton
      ghost
      size="small"
      type="button"
      [attr.aria-label]="'One more ' + label()"
      (click)="quantity.set(quantity() + 1)">
      <nb-icon icon="plus-outline" />
    </button>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      border: 1px solid var(--border-basic-color-4);
      border-radius: var(--border-radius);
    }

    .value {
      min-width: 2rem;
      text-align: center;
      font-weight: 600;
    }
  `,
  imports: [NbButtonComponent, NbIconComponent],
})
export class ShopQuantityComponent {
  readonly quantity = model(1);
  readonly min = input(1);
  /** What's counted, for screen readers, e.g. the product's name. */
  readonly label = input('');
}
