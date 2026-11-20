import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NbButtonComponent,
  NbButtonGroupComponent,
  NbButtonToggleDirective,
  NbCalendarComponent,
  NbCardBodyComponent,
  NbCardComponent,
  NbCardHeaderComponent,
  NbCheckboxComponent,
  NbIconComponent,
  NbInputDirective,
  NbRadioComponent,
  NbRadioGroupComponent,
  NbStepComponent,
  NbStepperComponent,
  NbStepperNextDirective,
  NbStepperPreviousDirective,
  NbValidationModule,
} from '@liquid-js/lyr-core';
import { NbPhoneInputComponent } from '@liquid-js/lyr-extras/phone-input';

import { portrait } from '../shared/showcase-images';
import { ANYONE, BookBookingService } from './book-booking.service';
import { daysFromToday, PRACTITIONERS, SERVICES, SLOTS, slotTaken } from './book-data';

/** Booking an appointment in five steps: the service, who gives it, when, who's coming, and a look before confirming. */
@Component({
  selector: 'npg-book-book',
  templateUrl: './book-book.component.html',
  styleUrls: ['./book-book.component.scss'],
  imports: [
    DatePipe,
    NbButtonComponent,
    NbButtonGroupComponent,
    NbButtonToggleDirective,
    NbCalendarComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbCheckboxComponent,
    NbIconComponent,
    NbInputDirective,
    NbPhoneInputComponent,
    NbRadioComponent,
    NbRadioGroupComponent,
    NbStepComponent,
    NbStepperComponent,
    NbStepperNextDirective,
    NbStepperPreviousDirective,
    NbValidationModule,
    ReactiveFormsModule,
  ],
})
export class BookBookComponent {
  protected readonly booking = inject(BookBookingService);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);

  readonly services = SERVICES;
  readonly slots = SLOTS;
  readonly anyone = ANYONE;
  readonly portrait = portrait;

  /** From today, for the next eight weeks. */
  readonly today = daysFromToday(0);
  readonly lastDay = daysFromToday(56);

  /** The practitioners who give the service picked. */
  readonly practitioners = computed(() => {
    const id = this.booking.serviceId();
    return PRACTITIONERS.filter((person) => !id || person.services.includes(id));
  });

  /** The slots of the day picked, and which are taken. */
  readonly daySlots = computed(() => {
    const date = this.booking.date();
    return date ? SLOTS.map((time) => ({ time, taken: slotTaken(date, time) })) : [];
  });

  readonly details = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: Validators.required }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phone: new FormControl('', { nonNullable: true, validators: Validators.required }),
    notes: new FormControl('', { nonNullable: true }),
    consent: new FormControl(false, { nonNullable: true, validators: Validators.requiredTrue }),
  });

  // Each step is done once its choice is made; the stepper reads these as it moves on.
  readonly serviceStep = this.stepOf(() => !!this.booking.serviceId());
  readonly practitionerStep = this.stepOf(() => !!this.booking.practitioner());
  readonly timeStep = this.stepOf(() => !!this.booking.date() && !!this.booking.time());

  constructor() {
    // A service picked on the home page starts the booking with it.
    const service = this.route.snapshot.queryParamMap.get('service');
    if (service) {
      this.booking.start(service);
    }
    const details = this.booking.details();
    if (details) {
      this.details.patchValue(details);
    }
  }

  /** Only days the studio is open: not Sundays. */
  readonly openDay = (date: Date) => date.getDay() !== 0;

  pickService(id: string) {
    this.booking.serviceId.set(id);
    // The practitioner picked may not give the new service.
    const practitioner = this.booking.practitioner();
    if (practitioner && practitioner !== ANYONE && !this.practitioners().some(({ name }) => name === practitioner)) {
      this.booking.practitioner.set(undefined);
    }
  }

  pickDate(date: Date) {
    this.booking.date.set(date);
    this.booking.time.set(undefined);
  }

  pickTime(time: unknown) {
    this.booking.time.set(typeof time === 'string' ? time : undefined);
  }

  saveDetails() {
    this.details.markAllAsTouched();
    if (this.details.valid) {
      this.booking.details.set(this.details.getRawValue());
    }
  }

  confirm() {
    if (this.booking.confirm()) {
      void this.router.navigate(['../confirmed'], { relativeTo: this.route });
    }
  }

  private stepOf(valid: () => boolean) {
    return {
      get valid() {
        return valid();
      },
      reset: () => undefined,
    };
  }
}
