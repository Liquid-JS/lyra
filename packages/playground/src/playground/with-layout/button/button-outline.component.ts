import { Component } from '@angular/core';
import { NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent, NbButtonComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-button-outline',
  templateUrl: './button-outline.component.html',
  imports: [NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent, NbButtonComponent],
})
export class ButtonOutlineComponent {
}
