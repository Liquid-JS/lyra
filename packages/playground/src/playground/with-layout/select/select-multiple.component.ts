import { Component, signal } from '@angular/core';
import { NbCardComponent, NbCardBodyComponent, NbSelectComponent, NbOptionComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-select-multiple',
  templateUrl: './select-multiple.component.html',
  imports: [NbCardComponent, NbCardBodyComponent, NbSelectComponent, NbOptionComponent],
})
export class SelectMultipleComponent {
  // A multiple select gives the selected options' values as an array.
  readonly selected = signal(new Array<string>());
}
