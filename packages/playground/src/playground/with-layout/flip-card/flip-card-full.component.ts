import { Component } from '@angular/core';
import {
  NbFlipCardComponent,
  NbCardFrontComponent,
  NbCardBackComponent,
  NbCardComponent,
  NbCardHeaderComponent,
  NbCardBodyComponent,
  NbCardFooterComponent,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-flip-card-full',
  templateUrl: './flip-card-full.component.html',
  imports: [
    NbFlipCardComponent,
    NbCardFrontComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbCardFooterComponent,
    NbCardBackComponent,
  ],
})
export class FlipCardFullComponent {
}
