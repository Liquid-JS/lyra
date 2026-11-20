import { Component } from '@angular/core';
import {
  NbCardComponent,
  NbCardHeaderComponent,
  NbCardBodyComponent,
  NbRadioGroupComponent,
  NbRadioComponent,
} from '@liquid-js/lyr-core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'nb-radio-disabled',
  templateUrl: './radio-disabled.component.html',
  imports: [
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbRadioGroupComponent,
    FormsModule,
    NbRadioComponent,
  ],
})
export class RadioDisabledComponent {
  options = [
    { value: 'This is value 1', label: 'Option 1' },
    { value: 'This is value 2', label: 'Option 2', disabled: true },
    { value: 'This is value 3', label: 'Option 3' },
    { value: 'This is value 4', label: 'Option 4', disabled: true },
    { value: 'This is value 5', label: 'Option 5' },
  ];
  option?: string;
}
