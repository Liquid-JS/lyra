import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  NbButtonComponent,
  NbCardBodyComponent,
  NbCardComponent,
  NbCheckboxComponent,
  NbInputDirective,
  NbOptionComponent,
  NbSelectComponent,
  NbValidationModule,
} from '@liquid-js/lyr-core';

@Component({
  templateUrl: './validation-showcase.component.html',
  styleUrls: ['./validation-example.scss'],
  imports: [
    ReactiveFormsModule,
    NbCardComponent,
    NbCardBodyComponent,
    NbInputDirective,
    NbSelectComponent,
    NbOptionComponent,
    NbCheckboxComponent,
    NbButtonComponent,
    NbValidationModule,
  ],
})
export class ValidationShowcaseComponent {
  readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    plan: new FormControl('', Validators.required),
    terms: new FormControl(false, Validators.requiredTrue),
  });
}
