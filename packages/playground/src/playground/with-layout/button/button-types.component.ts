import { Component } from '@angular/core';
import { NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent, NbButtonComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-button-types',
  templateUrl: './button-types.component.html',
  imports: [NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent, NbButtonComponent],
})
export class ButtonTypesComponent {
  onClick() {
    return false;
  }
}
