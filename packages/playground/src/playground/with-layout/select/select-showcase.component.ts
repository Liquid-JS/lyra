import { Component } from '@angular/core';
import { NbCardComponent, NbCardBodyComponent, NbSelectComponent, NbOptionComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-select-showcase',
  templateUrl: './select-showcase.component.html',
  imports: [NbCardComponent, NbCardBodyComponent, NbSelectComponent, NbOptionComponent],
})
export class SelectShowcaseComponent {
  selectedItem = '2';
}
