import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  NbButtonComponent,
  NbCheckboxComponent,
  NbIconComponent,
  NbInputDirective,
  NbOptionComponent,
  NbSelectComponent,
  NbToastrService,
  NbValidationModule,
} from '@liquid-js/lyr-core';

import { BUDGETS, PHOTOGRAPHER, PROJECT_TYPES } from './portfolio-data';

/** Getting in touch: a form about the commission, checked as it's sent, and the studio's address, hours and socials. */
@Component({
  selector: 'npg-portfolio-contact',
  templateUrl: './portfolio-contact.component.html',
  styleUrls: ['./portfolio-contact.component.scss'],
  imports: [
    NbButtonComponent,
    NbCheckboxComponent,
    NbIconComponent,
    NbInputDirective,
    NbOptionComponent,
    NbSelectComponent,
    NbValidationModule,
    ReactiveFormsModule,
  ],
})
export class PortfolioContactComponent {
  private readonly toastr = inject(NbToastrService);

  readonly photographer = PHOTOGRAPHER;
  readonly projectTypes = PROJECT_TYPES;
  readonly budgets = BUDGETS;

  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: Validators.required }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    type: new FormControl('', { nonNullable: true, validators: Validators.required }),
    budget: new FormControl('', { nonNullable: true }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(40)] }),
    consent: new FormControl(false, { nonNullable: true, validators: Validators.requiredTrue }),
  });

  /** Sent: the form gives way to a note. */
  readonly sent = signal(false);

  send() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.sent.set(true);
    this.toastr.success('Emma will reply within two working days.', 'Message sent');
  }

  another() {
    this.form.reset();
    this.sent.set(false);
  }
}
