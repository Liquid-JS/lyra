import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NbButtonComponent, NbCardBodyComponent, NbCardComponent, NbIconComponent } from '@liquid-js/lyr-core';
import { NbQrCodeComponent } from '@liquid-js/lyr-extras/qr-code';

import { ANYONE, BookBookingService } from './book-booking.service';
import { serviceOf, STUDIO } from './book-data';

/** The booking just made: what, when, with whom, and a code to show at the desk. */
@Component({
  selector: 'npg-book-confirmed',
  templateUrl: './book-confirmed.component.html',
  styleUrls: ['./book-confirmed.component.scss'],
  imports: [
    DatePipe,
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbIconComponent,
    NbQrCodeComponent,
    RouterLink,
  ],
})
export class BookConfirmedComponent {
  private readonly bookings = inject(BookBookingService);

  readonly studio = STUDIO;
  readonly anyone = ANYONE;
  /** The booking just made, or one to show when the page opens on its own. */
  readonly booking = this.bookings.last() ?? this.bookings.sample();
  readonly service = serviceOf(this.booking.serviceId);
  /** What the desk scans: the booking's reference. */
  readonly code = `https://still.example/bookings/${this.booking.reference}`;
}
