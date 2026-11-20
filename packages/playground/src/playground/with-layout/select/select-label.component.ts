import { Component } from '@angular/core';
import {
  NbCardComponent,
  NbCardBodyComponent,
  NbSelectComponent,
  NbSelectLabelComponent,
  NbOptionComponent,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-select-label-showcase',
  templateUrl: './select-label.component.html',
  imports: [
    NbCardComponent,
    NbCardBodyComponent,
    NbSelectComponent,
    NbSelectLabelComponent,
    NbOptionComponent,
  ],
})
export class SelectLabelShowcaseComponent {
  selectedItem?: string;
}
