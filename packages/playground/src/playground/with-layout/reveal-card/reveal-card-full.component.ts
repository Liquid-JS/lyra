import { Component } from '@angular/core';
import {
  NbRevealCardComponent,
  NbCardFrontComponent,
  NbCardBackComponent,
  NbCardComponent,
  NbCardHeaderComponent,
  NbCardBodyComponent,
  NbCardFooterComponent,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-reveal-card-full',
  templateUrl: './reveal-card-full.component.html',
  imports: [
    NbRevealCardComponent,
    NbCardFrontComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbCardFooterComponent,
    NbCardBackComponent,
  ],
})
export class RevealCardFullComponent {
}
