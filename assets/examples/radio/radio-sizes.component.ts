import { Component } from '@angular/core'
import { NbCardBodyComponent, NbCardComponent, NbRadioComponent, NbRadioGroupComponent } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-radio-sizes',
    templateUrl: './radio-sizes.component.html',
    imports: [NbCardComponent, NbCardBodyComponent, NbRadioGroupComponent, NbRadioComponent]
})
export class RadioSizesComponent {
    readonly sizes = ['tiny', 'small', 'medium', 'large', 'giant'] as const
}
