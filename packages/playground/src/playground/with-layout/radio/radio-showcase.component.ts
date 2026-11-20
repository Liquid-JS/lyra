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
  selector: 'nb-radio-showcase',
  templateUrl: './radio-showcase.component.html',
  imports: [
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbRadioGroupComponent,
    FormsModule,
    NbRadioComponent,
  ],
})
export class RadioShowcaseComponent {
  options = [
    { value: 'This is value 1', label: 'Option 1' },
    { value: 'This is value 2', label: 'Option 2' },
    { value: 'This is value 3', label: 'Option 3' },
    { value: 'This is value 4', label: 'Option 4' },
  ];
  option?: string;
}
