import { Component } from '@angular/core';
import {
  NbCardBodyComponent,
  NbCardComponent,
  NbFormFieldComponent,
  NbInputDirective,
  NbPrefixDirective,
  NbSuffixDirective,
} from '@liquid-js/lyr-core';

@Component({
  templateUrl: './form-field-text.component.html',
  imports: [
    NbCardComponent,
    NbCardBodyComponent,
    NbFormFieldComponent,
    NbInputDirective,
    NbPrefixDirective,
    NbSuffixDirective,
  ],
})
export class FormFieldTextComponent {}
