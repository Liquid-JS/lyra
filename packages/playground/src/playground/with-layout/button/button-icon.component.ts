import { Component } from '@angular/core'
import {
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbButtonComponent,
    NbIconComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-button-icon',
    templateUrl: './button-icon.component.html',
    imports: [
        NbCardComponent,
        NbCardHeaderComponent,
        NbCardBodyComponent,
        NbButtonComponent,
        NbIconComponent
    ]
})
export class ButtonIconComponent {
}
