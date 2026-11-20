import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NbButtonComponent, NbCardBodyComponent, NbCardComponent, NbInputDirective, NbValidationModule } from '@liquid-js/lyr-core';

@Component({
  templateUrl: './validation-template-driven.component.html',
  styleUrls: ['./validation-example.scss'],
  imports: [FormsModule, NbCardComponent, NbCardBodyComponent, NbInputDirective, NbButtonComponent, NbValidationModule],
})
export class ValidationTemplateDrivenComponent {
  name = '';
  email = '';
}
