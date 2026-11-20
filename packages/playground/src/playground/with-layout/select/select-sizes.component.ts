import { Component } from '@angular/core';
import {
  NbComponentSize,
  NbCardComponent,
  NbCardBodyComponent,
  NbSelectComponent,
  NbOptionComponent,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-select-sizes',
  templateUrl: './select-sizes.component.html',
  imports: [NbCardComponent, NbCardBodyComponent, NbSelectComponent, NbOptionComponent],
})
export class SelectSizesComponent {
  sizes: NbComponentSize[] = ['tiny', 'small', 'medium', 'large', 'giant'];
}
