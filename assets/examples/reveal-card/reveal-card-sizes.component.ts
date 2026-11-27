import { Component } from '@angular/core'
import {
    NbRevealCardComponent,
    NbCardFrontComponent,
    NbCardBackComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-reveal-card-sizes',
    templateUrl: './reveal-card-sizes.component.html',
    styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
  `,
    imports: [
        NbRevealCardComponent,
        NbCardFrontComponent,
        NbCardComponent,
        NbCardHeaderComponent,
        NbCardBodyComponent,
        NbCardBackComponent
    ]
})
export class RevealCardSizesComponent {
}
