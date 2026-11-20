import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { NbIconComponent } from '@liquid-js/lyr-core';

/** A rating out of five: the stars, the figure, and how many reviews it's from. */
@Component({
  selector: 'npg-learn-stars',
  template: `
    <span class="stars" role="img" [attr.aria-label]="rating() + ' out of 5'">
      @for (star of stars; track star) {
        <nb-icon [icon]="star <= Math.round(rating()) ? 'star' : 'star-outline'" />
      }
    </span>
    <span class="figure">{{ rating() | number: '1.1-1' }}</span>
    @if (reviews(); as reviews) {
      <span class="reviews">({{ reviews | number }})</span>
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.875rem;
      white-space: nowrap;
    }

    .stars {
      display: inline-flex;
      color: var(--color-warning-default);
    }

    .figure {
      font-weight: 600;
    }

    .reviews {
      color: var(--text-hint-color);
    }
  `,
  imports: [DecimalPipe, NbIconComponent],
})
export class LearnStarsComponent {
  readonly rating = input.required<number>();
  readonly reviews = input<number>();
  protected readonly stars = [1, 2, 3, 4, 5];
  protected readonly Math = Math;
}
