import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  NbButtonComponent,
  NbCardBodyComponent,
  NbCardComponent,
  NbCheckboxComponent,
  NbFormFieldComponent,
  NbIconComponent,
  NbInputDirective,
  NbLabelComponent,
  NbOptionComponent,
  NbPrefixDirective,
  NbRadioComponent,
  NbRadioGroupComponent,
  NbSelectComponent,
  NbToastrService,
  NbValidationDirective,
  NbValidationErrorsComponent,
} from '@liquid-js/lyr-core';
import { NbMaskDirective } from '@liquid-js/lyr-extras/mask';

import { StayTrip } from './stay-data';
import { StayRatingComponent } from './parts/stay-rating.component';
import { StayTripService } from './stay-trip.service';

/** Confirming and paying for a stay: the trip, how to pay, a word to the host, and what it comes to. */
@Component({
  selector: 'npg-stay-booking',
  templateUrl: './stay-booking.component.html',
  styleUrls: ['./stay-booking.component.scss'],
  imports: [
    CurrencyPipe,
    DatePipe,
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCheckboxComponent,
    NbFormFieldComponent,
    NbIconComponent,
    NbInputDirective,
    NbLabelComponent,
    NbMaskDirective,
    NbOptionComponent,
    NbPrefixDirective,
    NbRadioComponent,
    NbRadioGroupComponent,
    NbSelectComponent,
    NbValidationDirective,
    NbValidationErrorsComponent,
    ReactiveFormsModule,
    RouterLink,
    StayRatingComponent,
  ],
})
export class StayBookingComponent {
  protected readonly trips = inject(StayTripService);
  private readonly toastr = inject(NbToastrService);

  readonly countries = ['United States', 'United Kingdom', 'Canada', 'Ireland', 'Australia'];
  readonly guestOptions = [1, 2, 3, 4, 5, 6, 7, 8];

  readonly form = inject(FormBuilder).nonNullable.group({
    payment: ['full' as 'full' | 'split'],
    cardNumber: ['', [Validators.required, Validators.minLength(16)]],
    expiry: ['', [Validators.required, Validators.minLength(4)]],
    cvc: ['', [Validators.required, Validators.minLength(3)]],
    name: ['', Validators.required],
    country: ['United States', Validators.required],
    message: [''],
    agree: [false, Validators.requiredTrue],
  });

  /** The trip once it's booked. */
  readonly booked = signal<StayTrip | undefined>(undefined);

  /** Half now, half a month before the trip, when paying in parts. */
  get dueNow() {
    return this.form.controls.payment.value === 'split' ? Math.ceil(this.trips.quote().total / 2) : this.trips.quote().total;
  }

  confirm() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.toastr.show('Check the fields marked below.', 'Not quite there', { status: 'warning' });
      return;
    }
    const trip = this.trips.book();
    if (trip) {
      this.booked.set(trip);
      this.toastr.show(`${trip.listing.name} is yours from ${trip.checkIn.toLocaleDateString()}.`, 'You\'re booked', {
        status: 'success',
      });
    }
  }
}
