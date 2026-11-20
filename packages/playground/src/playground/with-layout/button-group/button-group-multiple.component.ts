import { Component } from '@angular/core'
import {
    NbCardComponent,
    NbCardBodyComponent,
    NbButtonGroupComponent,
    NbButtonToggleDirective
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-button-group-multiple',
    templateUrl: './button-group-multiple.component.html',
    imports: [NbCardComponent, NbCardBodyComponent, NbButtonGroupComponent, NbButtonToggleDirective]
})
export class ButtonGroupMultipleComponent {
}
