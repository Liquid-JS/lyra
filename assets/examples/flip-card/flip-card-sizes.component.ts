import { Component } from '@angular/core'
import {
    NbFlipCardComponent,
    NbCardFrontComponent,
    NbCardBackComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-flip-card-sizes',
    templateUrl: './flip-card-sizes.component.html',
    styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
  `,
    imports: [
        NbFlipCardComponent,
        NbCardFrontComponent,
        NbCardComponent,
        NbCardHeaderComponent,
        NbCardBodyComponent,
        NbCardBackComponent
    ]
})
export class FlipCardSizesComponent {
}
