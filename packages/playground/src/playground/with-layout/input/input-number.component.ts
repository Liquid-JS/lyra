import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  NbCardBodyComponent,
  NbCardComponent,
  NbFormFieldModule,
  NbInputModule,
  NbValidationModule,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-input-number',
  templateUrl: './input-number.component.html',
  imports: [
    ReactiveFormsModule,
    NbCardComponent,
    NbCardBodyComponent,
    NbFormFieldModule,
    NbInputModule,
    NbValidationModule,
  ],
})
export class InputNumberComponent {
  readonly radiansToDegrees = 180 / Math.PI;

  // A fraction, shown as a percent.
  readonly opacity = new FormControl(0.5);
  // Radians, shown in degrees.
  readonly rotation = new FormControl(Math.PI / 2);
}
