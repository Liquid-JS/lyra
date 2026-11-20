import { Component } from '@angular/core';
import {
  NbComponentStatus,
  NbCardComponent,
  NbCardBodyComponent,
  NbRadioGroupComponent,
  NbRadioComponent,
} from '@liquid-js/lyr-core';

@Component({
  templateUrl: './radio-statuses.component.html',
  styleUrls: ['./radio-statuses-group.component.scss'],
  imports: [NbCardComponent, NbCardBodyComponent, NbRadioGroupComponent, NbRadioComponent],
})
export class RadioStatusesComponent {
  options = [
    { value: 'This is value 1', label: 'Option 1', checked: true },
    { value: 'This is value 2', label: 'Option 2' },
    { value: 'This is value 3', label: 'Option 3' },
    { value: 'This is value 4', label: 'Option 4', disabled: true },
  ];

  statuses: NbComponentStatus[] = ['basic', 'primary', 'success', 'warning', 'danger', 'info', 'control'];
}
