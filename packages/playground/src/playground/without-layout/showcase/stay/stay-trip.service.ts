import { computed, Injectable, signal } from '@angular/core';
import { NbCalendarRange } from '@liquid-js/lyr-core';

import {
  nightsBetween,
  STAY_CLEANING_FEE,
  STAY_FEATURED,
  STAY_SERVICE_FEE_RATE,
  STAY_TRIPS,
  StayListing,
  StayTrip,
} from './stay-data';

/** What a stay costs: the nights, the fees, and the total. */
export interface StayQuote {
  nights: number;
  stay: number;
  cleaning: number;
  service: number;
  total: number;
}

/**
 * What the app remembers between its screens: the trip being booked (the place, the dates and the guests), the
 * places saved, and the trips booked so far. An app would keep them on its server; the showcase keeps them in memory.
 */
@Injectable()
export class StayTripService {
  readonly listing = signal<StayListing>(STAY_FEATURED);
  readonly range = signal<NbCalendarRange<Date> | undefined>({
    start: new Date(2027, 2, 19),
    end: new Date(2027, 2, 23),
  });
  readonly guests = signal(2);
  readonly saved = signal(new Set<string>(['dune-house', 'sunlit-a-frame']));
  readonly trips = signal<StayTrip[]>(STAY_TRIPS);

  readonly nights = computed(() => {
    const range = this.range();
    return range?.end ? nightsBetween(range.start, range.end) : 0;
  });

  /** The booking's cost, for the nights chosen; a night at least, so the price breaks down before dates are picked. */
  readonly quote = computed<StayQuote>(() => {
    const nights = Math.max(1, this.nights());
    const stay = nights * this.listing().price;
    const service = Math.round(stay * STAY_SERVICE_FEE_RATE);
    return { nights, stay, cleaning: STAY_CLEANING_FEE, service, total: stay + STAY_CLEANING_FEE + service };
  });

  isSaved(id: string) {
    return this.saved().has(id);
  }

  toggleSaved(id: string) {
    this.saved.update((saved) => {
      const next = new Set(saved);
      if (!next.delete(id)) {
        next.add(id);
      }
      return next;
    });
  }

  /** Books the trip being planned, and returns it with its reference. */
  book(): StayTrip | undefined {
    const range = this.range();
    if (!range?.end) {
      return undefined;
    }
    const trip: StayTrip = {
      id: `trip-${Date.now()}`,
      listing: this.listing(),
      checkIn: range.start,
      checkOut: range.end,
      guests: this.guests(),
      status: 'Confirmed',
      reference: `STY-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    };
    this.trips.update((trips) => [trip, ...trips]);
    return trip;
  }

  cancel(id: string) {
    this.trips.update((trips) => trips.map((trip) => (trip.id === id ? { ...trip, status: 'Cancelled' } : trip)));
  }
}
