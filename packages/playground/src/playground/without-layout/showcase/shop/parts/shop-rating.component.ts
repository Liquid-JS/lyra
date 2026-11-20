import { Component, input } from '@angular/core'
import { NbIconComponent } from '@liquid-js/lyr-core'

/** A rating out of five stars, with how many reviews it's from. */
@Component({
    selector: 'npg-shop-rating',
    template: `
    <span class="stars" role="img" [attr.aria-label]="rating() + ' out of 5'">
      @for (star of stars; track star) {
        <nb-icon [icon]="star <= rating() ? 'star' : 'star-outline'" />
      }
    </span>
    @if (reviews(); as reviews) {
      <span class="reviews">{{ reviews }} reviews</span>
    }
  `,
    styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .stars {
      display: inline-flex;
      color: var(--color-warning-default);
    }

    .reviews {
      color: var(--text-hint-color);
      font-size: 0.875rem;
    }
  `,
    imports: [NbIconComponent]
})
export class ShopRatingComponent {
    readonly rating = input.required<number>()
    readonly reviews = input<number>()
    protected readonly stars = [1, 2, 3, 4, 5]
}
