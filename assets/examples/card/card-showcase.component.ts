import { Component } from '@angular/core'
import { NbCardComponent, NbCardBodyComponent } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-card-showcase',
    templateUrl: './card-showcase.component.html',
    imports: [NbCardComponent, NbCardBodyComponent]
})
export class CardShowcaseComponent {
}
