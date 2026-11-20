import { Component } from '@angular/core';
import {
  NbCardComponent,
  NbCardBodyComponent,
  NbFormFieldComponent,
  NbInputDirective,
  NbButtonComponent,
  NbSuffixDirective,
  NbIconComponent,
} from '@liquid-js/lyr-core';

@Component({
  templateUrl: './form-field-password.component.html',
  imports: [
    NbCardComponent,
    NbCardBodyComponent,
    NbFormFieldComponent,
    NbInputDirective,
    NbButtonComponent,
    NbSuffixDirective,
    NbIconComponent,
  ],
})
export class FormFieldPasswordComponent {
  showPassword = true;

  getInputType() {
    if (this.showPassword) {
      return 'text';
    }
    return 'password';
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
}
