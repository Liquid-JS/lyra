import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  NbButtonComponent,
  NbCardBodyComponent,
  NbCardComponent,
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
import { ANYONE, BookBookingService } from './book-booking.service';
import { BookBooking, BookBookingStatus, daysFromToday, serviceOf } from './book-data';

const STATUS_TAG: Record<BookBookingStatus, { text: string; status: NbComponentStatus }> = {
  confirmed: { text: 'Confirmed', status: 'success' },
  completed: { text: 'Completed', status: 'basic' },
  cancelled: { text: 'Cancelled', status: 'danger' },
};

/** The customer's appointments: the ones ahead, which they can move or cancel, and the ones behind, to book again. */
@Component({
  selector: 'npg-book-bookings',
  templateUrl: './book-bookings.component.html',
  styleUrls: ['./book-bookings.component.scss'],
  imports: [
    DatePipe,
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbIconComponent,
    NbTabComponent,
    NbTabsetComponent,
    NbTagComponent,
    NbUserComponent,
    RouterLink,
  ],
})
export class BookBookingsComponent {
  private readonly bookings = inject(BookBookingService);
  private readonly dialog = inject(NbDialogService);
  private readonly toastr = inject(NbToastrService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly anyone = ANYONE;
  readonly portrait = portrait;
  readonly serviceOf = serviceOf;
  readonly tagOf = (status: BookBookingStatus) => STATUS_TAG[status];

  private readonly today = daysFromToday(0);

  readonly upcoming = computed(() =>
    this.bookings
      .bookings()
      .filter((booking) => booking.status === 'confirmed' && booking.date >= this.today)
      .sort((a, b) => a.date.getTime() - b.date.getTime()),
  );

  readonly past = computed(() =>
    this.bookings
      .bookings()
      .filter((booking) => booking.status !== 'confirmed' || booking.date < this.today)
      .sort((a, b) => b.date.getTime() - a.date.getTime()),
  );

  /** Starts a new booking of the same service. */
  rebook(booking: BookBooking) {
    this.bookings.start(booking.serviceId);
    void this.router.navigate(['../book'], { relativeTo: this.route });
  }

  async cancel(booking: BookBooking) {
    const service = serviceOf(booking.serviceId);
    const cancelled = await this.dialog.confirm({
      title: 'Cancel this booking?',
      message: `${service?.name ?? 'The appointment'} on ${booking.date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} at ${booking.time}. The time goes back to the diary for someone else.`,
      confirmText: 'Cancel booking',
      cancelText: 'Keep it',
      status: 'danger',
    });
    if (cancelled) {
      this.bookings.cancel(booking.reference);
      this.toastr.show('We hope to see you another time.', 'Booking cancelled', { status: 'basic', icon: 'checkmark-outline' });
    }
  }
}
