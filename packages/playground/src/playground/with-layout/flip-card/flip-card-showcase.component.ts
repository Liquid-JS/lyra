import { Component } from '@angular/core'
import {
    NbFlipCardComponent,
    NbCardFrontComponent,
    NbCardBackComponent,
    NbCardComponent,
    NbCardBodyComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-flip-card-showcase',
    templateUrl: './flip-card-showcase.component.html',
    imports: [
        NbFlipCardComponent,
        NbCardFrontComponent,
        NbCardComponent,
        NbCardBodyComponent,
        NbCardBackComponent
    ]
})
export class FlipCardShowcaseComponent {
}
