import { DecimalPipe } from '@angular/common'
import { Component, input } from '@angular/core'
import { NbIconComponent } from '@liquid-js/lyr-core'

/** A place's rating, as a star and its score, with how many reviews it's from if they're given. */
@Component({
    selector: 'npg-stay-rating',
    template: `
    <nb-icon icon="star" aria-hidden="true" />
    <span class="score">{{ rating() | number: '1.1-1' }}</span>
    @if (reviews(); as reviews) {
      <span class="reviews">({{ reviews }})</span>
    }
  `,
    styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      white-space: nowrap;
    }

    nb-icon {
      color: var(--color-warning-500);
      font-size: 1em;
    }

    .score {
      font-weight: 600;
    }

    .reviews {
      color: var(--text-hint-color);
    }
  `,
    host: { 'role': 'img', '[attr.aria-label]': 'label()' },
    imports: [DecimalPipe, NbIconComponent]
})
export class StayRatingComponent {
    readonly rating = input.required<number>()
    readonly reviews = input<number>()

    protected label() {
        const reviews = this.reviews()
        return `Rated ${this.rating()} out of 5${reviews ? ` from ${reviews} reviews` : ''}`
    }
}
