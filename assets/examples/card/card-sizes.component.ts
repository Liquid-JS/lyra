import { Component } from '@angular/core'
import { NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-card-sizes',
    templateUrl: './card-sizes.component.html',
    imports: [NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent]
})
export class CardSizesComponent {
}
