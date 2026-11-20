import { Component } from '@angular/core';
import {
  NbCardComponent,
  NbCardBodyComponent,
  NbFormFieldComponent,
  NbIconComponent,
  NbPrefixDirective,
  NbInputDirective,
} from '@liquid-js/lyr-core';

@Component({
  templateUrl: './form-field-input.component.html',
  imports: [
    NbCardComponent,
    NbCardBodyComponent,
    NbFormFieldComponent,
    NbIconComponent,
    NbPrefixDirective,
    NbInputDirective,
  ],
})
export class FormFieldInputComponent {}
