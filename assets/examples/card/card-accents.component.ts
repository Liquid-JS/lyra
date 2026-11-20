import { Component } from '@angular/core'
import { NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-card-accents',
    templateUrl: './card-accents.component.html',
    imports: [NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent]
})
export class CardAccentsComponent {
}
