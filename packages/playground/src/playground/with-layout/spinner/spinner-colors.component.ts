import { Component } from '@angular/core';
import { NbCardComponent, NbCardBodyComponent, NbSpinnerDirective } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-spinner-colors',
  templateUrl: './spinner-colors.component.html',
  styleUrls: ['./spinner-colors.component.scss'],
  imports: [NbCardComponent, NbSpinnerDirective, NbCardBodyComponent],
})
export class SpinnerColorsComponent {
}
