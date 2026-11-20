import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  NbButtonComponent,
  NbCardBodyComponent,
  NbCardComponent,
  NbInputDirective,
  NbValidationModule,
} from '@liquid-js/lyr-core';
import { NbMaskDirective } from '@liquid-js/lyr-extras/mask';

@Component({
  selector: 'nb-mask-validation',
  templateUrl: './mask-validation.component.html',
  styleUrls: ['./mask-example.scss'],
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    NbCardComponent,
    NbCardBodyComponent,
    NbInputDirective,
    NbButtonComponent,
    NbValidationModule,
    NbMaskDirective,
  ],
})
export class MaskValidationComponent {
  readonly form = new FormGroup({
    name: new FormControl('', Validators.required),
    card: new FormControl('', Validators.required),
    expiry: new FormControl('', Validators.required),
    code: new FormControl('', Validators.required),
  });

  /** The values, once the form is sent without errors. */
  readonly saved = signal<object | undefined>(undefined);

  save() {
    this.form.markAllAsTouched();
    this.saved.set(this.form.valid ? this.form.getRawValue() : undefined);
  }
}
