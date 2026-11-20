import { Component } from '@angular/core';
import {
  NbRevealCardComponent,
  NbCardFrontComponent,
  NbCardBackComponent,
  NbCardComponent,
  NbCardHeaderComponent,
  NbCardBodyComponent,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-reveal-card-colors',
  templateUrl: './reveal-card-colors.component.html',
  imports: [
    NbRevealCardComponent,
    NbCardFrontComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbCardBackComponent,
  ],
})
export class RevealCardColorsComponent {
}
