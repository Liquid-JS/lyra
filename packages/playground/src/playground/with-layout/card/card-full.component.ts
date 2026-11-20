import { Component } from '@angular/core'
import {
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbCardFooterComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-card-full',
    templateUrl: './card-full.component.html',
    imports: [NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent, NbCardFooterComponent]
})
export class CardFullComponent {
}
