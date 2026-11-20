import { Component } from '@angular/core';
import { NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent, NbButtonComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-button-showcase',
  templateUrl: './button-showcase.component.html',
  imports: [NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent, NbButtonComponent],
})
export class ButtonShowcaseComponent {
}
