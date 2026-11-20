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
    selector: 'nb-flip-card-colors',
    templateUrl: './flip-card-colors.component.html',
    imports: [
        NbFlipCardComponent,
        NbCardFrontComponent,
        NbCardComponent,
        NbCardHeaderComponent,
        NbCardBodyComponent,
        NbCardBackComponent
    ]
})
export class FlipCardColorsComponent {
}
