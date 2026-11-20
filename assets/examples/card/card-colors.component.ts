import { Component } from '@angular/core'
import {
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbCardFooterComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-card-colors',
    templateUrl: './card-colors.component.html',
    imports: [NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent, NbCardFooterComponent]
})
export class CardColorsComponent {
}
