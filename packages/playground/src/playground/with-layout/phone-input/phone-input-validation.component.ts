import { JsonPipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  NbButtonComponent,
  NbCardBodyComponent,
  NbCardComponent,
  NbCheckboxComponent,
  NbInputDirective,
  NbValidationModule,
} from '@liquid-js/lyr-core';
import { NbPhoneInputComponent, nbPhoneNumberValidator } from '@liquid-js/lyr-extras/phone-input';

const OFFICES = ['US', 'GB', 'CA', 'AU', 'IE'] as const;

@Component({
  selector: 'nb-phone-input-validation',
  templateUrl: './phone-input-validation.component.html',
  styleUrls: ['./phone-input-validation.component.scss'],
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    NbCardComponent,
    NbCardBodyComponent,
    NbInputDirective,
    NbCheckboxComponent,
    NbButtonComponent,
    NbValidationModule,
    NbPhoneInputComponent,
  ],
})
export class PhoneInputValidationComponent {
  readonly form = new FormGroup({
    // The phone input checks its own numbers.
    mobile: new FormControl<string | null>(null, Validators.required),
    // ...and takes only numbers from the countries it lists.
    office: new FormControl<string | null>('+44 20 7946 0958'),
    hasFax: new FormControl(false, { nonNullable: true }),
    fax: new FormControl<string | null>({ value: null, disabled: true }, Validators.required),
    // A plain text field checks its number with the validator.
    support: new FormControl('', nbPhoneNumberValidator({ countries: ['US', 'CA'] })),
  });

  readonly offices = OFFICES;

  /** The values, once the form is sent without errors. */
  readonly saved = signal<object | undefined>(undefined);

  constructor() {
    const { hasFax, fax } = this.form.controls;
    const subscription = hasFax.valueChanges.subscribe((enabled) => (enabled ? fax.enable() : fax.disable()));
    inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
  }

  save() {
    this.form.markAllAsTouched();
    this.saved.set(this.form.valid ? this.form.getRawValue() : undefined);
  }
}
