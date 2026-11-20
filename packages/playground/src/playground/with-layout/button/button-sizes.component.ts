import { Component } from '@angular/core'
import { NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent, NbButtonComponent } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-button-sizes',
    templateUrl: './button-sizes.component.html',
    imports: [NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent, NbButtonComponent]
})
export class ButtonSizesComponent {
}
