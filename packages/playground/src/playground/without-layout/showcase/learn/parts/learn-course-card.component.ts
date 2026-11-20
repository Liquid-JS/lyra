import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  NbCardBodyComponent,
  NbCardComponent,
  NbCardFooterComponent,
  NbCardLinkDirective,
  NbCardMediaDirective,
  NbIconComponent,
  NbProgressBarComponent,
  NbTagComponent,
  NbUserComponent,
} from '@liquid-js/lyr-core';

import { portrait } from '../../shared/showcase-images';
import { cover, LEARN_LEVEL_STATUS, LearnCourse } from '../learn-data';
import { LearnStarsComponent } from './learn-stars.component';

/** A course in the catalogue: its cover, level, title, instructor, rating and price, or how far along it is. */
@Component({
  selector: 'npg-learn-course-card',
  template: `
    @let course = this.course();
    <nb-card>
      <div nbCardMedia class="cover">
        <img [src]="cover(course)" alt="" [attr.loading]="eager() ? null : 'lazy'" width="800" height="500" />
        <nb-tag class="level" size="tiny" appearance="filled" [status]="levelStatus[course.level]" [text]="course.level" />
      </div>
      <nb-card-body>
        <p class="category caption-2">{{ course.category }}</p>
        <a nbCardLink class="title" routerLink="../course">{{ course.title }}</a>
        <nb-user size="tiny" [name]="course.instructor" [picture]="portrait(course.instructor)" />
        <npg-learn-stars [rating]="course.rating" [reviews]="course.reviews" />
      </nb-card-body>
      <nb-card-footer>
        @if (course.progress; as progress) {
          <div class="progress">
            <nb-progress-bar size="tiny" status="primary" [value]="progress" aria-label="Progress" />
            <span class="caption">{{ progress }}% complete</span>
          </div>
        } @else {
          <span class="meta caption"><nb-icon icon="clock-outline" /> {{ course.hours }} h · {{ course.lessons }} lessons</span>
          <span class="price subtitle">{{ course.price | currency: 'USD' : 'symbol' : '1.0-0' }}</span>
        }
      </nb-card-footer>
    </nb-card>
  `,
  styles: `
    :host {
      display: block;
    }

    nb-card {
      height: 100%;
      margin: 0;
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:hover,
      &:focus-within {
        transform: translateY(-0.125rem);
      }

      @media (prefers-reduced-motion: reduce) {
        transition: none;
      }
    }

    .cover {
      position: relative;
      aspect-ratio: 8 / 5;

      img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .level {
      position: absolute;
      inset-block-start: 0.75rem;
      inset-inline-start: 0.75rem;
    }

    nb-card-body {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .category {
      margin: 0;
      color: var(--text-primary-color);
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .title {
      color: var(--text-basic-color);
      font-family: var(--text-heading-4-font-family);
      font-size: 1.25rem;
      line-height: 1.3;
      text-decoration: none;
      text-wrap: balance;

      &:hover,
      &:focus-visible {
        color: var(--text-primary-color);
      }
    }

    nb-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
    }

    .meta {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      color: var(--text-hint-color);
    }

    .progress {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 0.375rem;

      .caption {
        color: var(--text-hint-color);
      }
    }
  `,
  imports: [
    CurrencyPipe,
    LearnStarsComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardFooterComponent,
    NbCardLinkDirective,
    NbCardMediaDirective,
    NbIconComponent,
    NbProgressBarComponent,
    NbTagComponent,
    NbUserComponent,
    RouterLink,
  ],
})
export class LearnCourseCardComponent {
  readonly course = input.required<LearnCourse>();
  /** Loads the cover right away, for the cards in view as the page opens. */
  readonly eager = input(false);

  protected readonly cover = cover;
  protected readonly portrait = portrait;
  protected readonly levelStatus = LEARN_LEVEL_STATUS;
}
