import { Component } from '@angular/core';
import {
  NbCardComponent,
  NbCardBodyComponent,
  NbFormFieldComponent,
  NbIconComponent,
  NbPrefixDirective,
  NbInputDirective,
  NbSuffixDirective,
  NbSelectComponent,
  NbOptionComponent,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'form-field-showcase-component',
  templateUrl: './form-field-showcase.component.html',
  imports: [
    NbCardComponent,
    NbCardBodyComponent,
    NbFormFieldComponent,
    NbIconComponent,
    NbPrefixDirective,
    NbInputDirective,
    NbSuffixDirective,
    NbSelectComponent,
    NbOptionComponent,
  ],
})
export class FormFieldShowcaseComponent {}
