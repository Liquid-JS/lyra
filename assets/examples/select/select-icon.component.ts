import { Component } from '@angular/core'
import {
    NbCardComponent,
    NbCardBodyComponent,
    NbFormFieldComponent,
    NbIconComponent,
    NbPrefixDirective,
    NbSelectComponent,
    NbOptionComponent
} from '@liquid-js/lyr-core'

@Component({
    templateUrl: './select-icon.component.html',
    imports: [
        NbCardComponent,
        NbCardBodyComponent,
        NbFormFieldComponent,
        NbIconComponent,
        NbPrefixDirective,
        NbSelectComponent,
        NbOptionComponent
    ]
})
export class SelectIconComponent {}
