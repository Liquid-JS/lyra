import { Component } from '@angular/core';
import {
  NbCardComponent,
  NbCardBodyComponent,
  NbSelectComponent,
  NbOptionComponent,
  NbOptionGroupComponent,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-select-disabled',
  templateUrl: './select-disabled.component.html',
  imports: [
    NbCardComponent,
    NbCardBodyComponent,
    NbSelectComponent,
    NbOptionComponent,
    NbOptionGroupComponent,
  ],
})
export class SelectDisabledComponent {}
