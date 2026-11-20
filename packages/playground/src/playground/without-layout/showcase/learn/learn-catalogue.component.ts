import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  NbAccordionComponent,
  NbAccordionItemBodyComponent,
  NbAccordionItemComponent,
  NbAccordionItemHeaderComponent,
  NbButtonComponent,
  NbCardBodyComponent,
  NbCardComponent,
  NbCardMediaDirective,
  NbCheckboxComponent,
  NbFormFieldComponent,
  NbIconComponent,
  NbInputDirective,
  NbPaginationComponent,
  NbPrefixDirective,
  NbProgressBarComponent,
  NbRadioComponent,
  NbRadioGroupComponent,
  NbTagComponent,
  NbTagListComponent,
} from '@liquid-js/lyr-core';

import { portrait } from '../shared/showcase-images';
import {
  cover,
  LEARN_CATEGORIES,
  LEARN_COURSES,
  LEARN_LEVELS,
  LearnCategory,
  LearnCourse,
  LearnLevel,
} from './learn-data';
import { LearnCourseCardComponent } from './parts/learn-course-card.component';

type Duration = 'short' | 'medium' | 'long';
type Price = 'low' | 'mid' | 'high';
type Sort = 'popular' | 'rating' | 'price';

const DURATIONS: { id: Duration; label: string; fits: (hours: number) => boolean }[] = [
  { id: 'short', label: 'Under 6 hours', fits: (hours) => hours < 6 },
  { id: 'medium', label: '6 to 10 hours', fits: (hours) => hours >= 6 && hours <= 10 },
  { id: 'long', label: 'Over 10 hours', fits: (hours) => hours > 10 },
];
const PRICES: { id: Price; label: string; fits: (price: number) => boolean }[] = [
  { id: 'low', label: 'Under $60', fits: (price) => price < 60 },
  { id: 'mid', label: '$60 to $90', fits: (price) => price >= 60 && price <= 90 },
  { id: 'high', label: 'Over $90', fits: (price) => price > 90 },
];

/** The catalogue: a search, the categories, filters, the courses the learner is on, and the rest in a grid. */
@Component({
  selector: 'npg-learn-catalogue',
  templateUrl: './learn-catalogue.component.html',
  styleUrls: ['./learn-catalogue.component.scss'],
  imports: [
    LearnCourseCardComponent,
    NbAccordionComponent,
    NbAccordionItemBodyComponent,
    NbAccordionItemComponent,
    NbAccordionItemHeaderComponent,
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardMediaDirective,
    NbCheckboxComponent,
    NbFormFieldComponent,
    NbIconComponent,
    NbInputDirective,
    NbPaginationComponent,
    NbPrefixDirective,
    NbProgressBarComponent,
    NbRadioComponent,
    NbRadioGroupComponent,
    NbTagComponent,
    NbTagListComponent,
    NgTemplateOutlet,
    RouterLink,
  ],
})
export class LearnCatalogueComponent {
  readonly categories = LEARN_CATEGORIES;
  readonly levels = LEARN_LEVELS;
  readonly durations = DURATIONS;
  readonly prices = PRICES;
  readonly pageSize = 6;

  readonly query = signal('');
  readonly category = signal<'All' | LearnCategory>('All');
  readonly pickedLevels = signal(new Set<LearnLevel>());
  readonly pickedDurations = signal(new Set<Duration>());
  readonly pickedPrices = signal(new Set<Price>());
  readonly sort = signal<Sort>('popular');
  readonly page = signal(0);

  /** The courses the learner has started, to pick up where they left off. */
  readonly continuing = LEARN_COURSES.filter((course) => course.progress);

  readonly filtered = computed<LearnCourse[]>(() => {
    const query = this.query().trim().toLowerCase();
    const category = this.category();
    const levels = this.pickedLevels();
    const durations = this.pickedDurations();
    const prices = this.pickedPrices();
    const sort = this.sort();
    return LEARN_COURSES.filter(
      (course) =>
        (!query || `${course.title} ${course.subtitle} ${course.instructor}`.toLowerCase().includes(query)) &&
        (category === 'All' || course.category === category) &&
        (!levels.size || levels.has(course.level)) &&
        (!durations.size || DURATIONS.some((item) => durations.has(item.id) && item.fits(course.hours))) &&
        (!prices.size || PRICES.some((item) => prices.has(item.id) && item.fits(course.price))),
    ).sort((a, b) =>
      sort === 'rating' ? b.rating - a.rating : sort === 'price' ? a.price - b.price : b.reviews - a.reviews,
    );
  });

  readonly shown = computed(() => {
    const start = this.page() * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });

  readonly filterCount = computed(
    () => this.pickedLevels().size + this.pickedDurations().size + this.pickedPrices().size,
  );

  protected readonly cover = cover;
  protected readonly portrait = portrait;

  search(query: string) {
    this.query.set(query);
    this.page.set(0);
  }

  pickCategory(category: 'All' | LearnCategory) {
    this.category.set(category);
    this.page.set(0);
  }

  toggleLevel(level: LearnLevel, on: boolean) {
    this.pickedLevels.update((picked) => toggled(picked, level, on));
    this.page.set(0);
  }

  toggleDuration(duration: Duration, on: boolean) {
    this.pickedDurations.update((picked) => toggled(picked, duration, on));
    this.page.set(0);
  }

  togglePrice(price: Price, on: boolean) {
    this.pickedPrices.update((picked) => toggled(picked, price, on));
    this.page.set(0);
  }

  sortBy(sort: unknown) {
    if (sort === 'popular' || sort === 'rating' || sort === 'price') {
      this.sort.set(sort);
    }
  }

  clear() {
    this.pickedLevels.set(new Set());
    this.pickedDurations.set(new Set());
    this.pickedPrices.set(new Set());
    this.sort.set('popular');
    this.page.set(0);
  }
}

// A set with the item added or removed, as a new set, so a signal sees the change.
function toggled<T>(set: Set<T>, item: T, on: boolean): Set<T> {
  const next = new Set(set);
  if (on) {
    next.add(item);
  } else {
    next.delete(item);
  }
  return next;
}
