import { Component } from '@angular/core'
import { NbCardComponent, NbCardBodyComponent, NbSpinnerDirective } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-spinner-sizes',
    templateUrl: './spinner-sizes.component.html',
    imports: [NbCardComponent, NbSpinnerDirective, NbCardBodyComponent]
})
export class SpinnerSizesComponent {
}
