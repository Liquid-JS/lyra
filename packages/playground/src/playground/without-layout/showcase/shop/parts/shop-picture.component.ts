import { Component, input } from '@angular/core';
import { NbIconComponent } from '@liquid-js/lyr-core';

import { ShopProduct } from '../shop-data';

/** A product's photo, filling the element, or its icon on a tinted ground when it has none. */
@Component({
  selector: 'npg-shop-picture',
  template: `
    @if (product().image; as image) {
      <img alt="" [attr.loading]="eager() ? null : 'lazy'" [src]="image" />
    } @else {
      <nb-icon [icon]="product().icon" />
    }
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background-color: var(--background-basic-color-2);
      color: var(--color-primary-default);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    nb-icon {
      width: 40%;
      max-width: 4rem;
      height: auto;
      aspect-ratio: 1;
      font-size: inherit;
    }
  `,
  imports: [NbIconComponent],
})
export class ShopPictureComponent {
  readonly product = input.required<ShopProduct>();
  /** Loads at once, for the picture a page opens with. */
  readonly eager = input(false);
}
