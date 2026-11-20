import { Component } from '@angular/core'
import {
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbInputDirective,
    NbInputGroupComponent,
    NbOptionComponent,
    NbSelectComponent
} from '@liquid-js/lyr-core'

@Component({
    templateUrl: './input-group-full-width.component.html',
    imports: [
        NbButtonComponent,
        NbCardBodyComponent,
        NbCardComponent,
        NbInputDirective,
        NbInputGroupComponent,
        NbOptionComponent,
        NbSelectComponent
    ]
})
export class InputGroupFullWidthComponent {}
