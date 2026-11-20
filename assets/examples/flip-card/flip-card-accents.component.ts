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
    selector: 'nb-flip-card-accents',
    templateUrl: './flip-card-accents.component.html',
    imports: [
        NbFlipCardComponent,
        NbCardFrontComponent,
        NbCardComponent,
        NbCardHeaderComponent,
        NbCardBodyComponent,
        NbCardBackComponent
    ]
})
export class FlipCardAccentsComponent {
}
