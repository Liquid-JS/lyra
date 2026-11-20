import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NbButtonComponent, NbCardBodyComponent, NbCardComponent, NbValidationModule } from '@liquid-js/lyr-core';
import { NbColorPickerComponent } from '@liquid-js/lyr-extras/color-picker';

@Component({
  selector: 'nb-color-picker-validation',
  templateUrl: './color-picker-validation.component.html',
  styleUrls: ['./color-picker-validation.component.scss'],
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    NbCardComponent,
    NbCardBodyComponent,
    NbButtonComponent,
    NbValidationModule,
    NbColorPickerComponent,
  ],
})
export class ColorPickerValidationComponent {
  readonly form = new FormGroup({
    brand: new FormControl<string | null>('#3366ff', Validators.required),
    accent: new FormControl<string | null>(null),
  });

  /** The values, once the form is sent without errors. */
  readonly saved = signal<object | undefined>(undefined);

  save() {
    this.form.markAllAsTouched();
    this.saved.set(this.form.valid ? this.form.getRawValue() : undefined);
  }
}
