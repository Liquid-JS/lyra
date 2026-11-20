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
    selector: 'nb-reveal-card-showcase',
    templateUrl: './reveal-card-showcase.component.html',
    imports: [
        NbRevealCardComponent,
        NbCardFrontComponent,
        NbCardComponent,
        NbCardHeaderComponent,
        NbCardBodyComponent,
        NbCardBackComponent
    ]
})
export class RevealCardShowcaseComponent {
}
