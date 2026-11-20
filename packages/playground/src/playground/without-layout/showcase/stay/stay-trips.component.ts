import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, TemplateRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  NbButtonComponent,
  NbCardBodyComponent,
  NbCardComponent,
  NbCardFooterComponent,
  NbCardHeaderComponent,
  NbComponentStatus,
  NbDialogService,
  NbIconComponent,
  NbTabComponent,
  NbTabsetComponent,
  NbTagComponent,
  NbToastrService,
  NbUserComponent,
} from '@liquid-js/lyr-core';

import { portrait } from '../shared/showcase-images';
import { nightsBetween, StayTrip } from './stay-data';
import { StayRatingComponent } from './parts/stay-rating.component';
import { StayTripService } from './stay-trip.service';

const STATUS: Record<StayTrip['status'], NbComponentStatus> = {
  Confirmed: 'success',
  Pending: 'warning',
  Completed: 'basic',
  Cancelled: 'danger',
};

/** Your trips: the ones coming up, with what you can still do about them, and the ones you've taken. */
@Component({
  selector: 'npg-stay-trips',
  templateUrl: './stay-trips.component.html',
  styleUrls: ['./stay-trips.component.scss'],
  imports: [
    DatePipe,
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardFooterComponent,
    NbCardHeaderComponent,
    NbIconComponent,
    NbTabComponent,
    NbTabsetComponent,
    NbTagComponent,
    NbUserComponent,
    NgTemplateOutlet,
    RouterLink,
    StayRatingComponent,
  ],
})
export class StayTripsComponent {
  protected readonly trips = inject(StayTripService);
  private readonly dialogService = inject(NbDialogService);
  private readonly toastr = inject(NbToastrService);

  readonly upcoming = computed(() =>
    this.trips
      .trips()
      .filter((trip) => trip.status === 'Confirmed' || trip.status === 'Pending')
      .sort((a, b) => a.checkIn.getTime() - b.checkIn.getTime()),
  );
  readonly past = computed(() =>
    this.trips
      .trips()
      .filter((trip) => trip.status === 'Completed' || trip.status === 'Cancelled')
      .sort((a, b) => b.checkIn.getTime() - a.checkIn.getTime()),
  );

  /** The tag colour of a trip's status. */
  readonly statusOf = (trip: StayTrip) => STATUS[trip.status];
  readonly nights = nightsBetween;
  readonly hostPhoto = portrait;

  cancel(dialog: TemplateRef<unknown>, trip: StayTrip) {
    this.dialogService.open(dialog, { context: trip });
  }

  confirmCancel(trip: StayTrip) {
    this.trips.cancel(trip.id);
    this.toastr.show(`Your stay at ${trip.listing.name} is cancelled; the refund takes 3 to 5 days.`, 'Cancelled', {
      status: 'basic',
    });
  }

  message(trip: StayTrip) {
    this.toastr.show(`A chat with ${trip.listing.host} would open here.`, 'Message the host', { status: 'info' });
  }

  directions(trip: StayTrip) {
    this.toastr.show(`Directions to ${trip.listing.place} would open in your maps app.`, 'Get directions', {
      status: 'info',
    });
  }

  review(trip: StayTrip) {
    this.toastr.show(`Thanks for staying at ${trip.listing.name}; your review helps the next guest.`, 'Write a review', {
      status: 'primary',
    });
  }
}
