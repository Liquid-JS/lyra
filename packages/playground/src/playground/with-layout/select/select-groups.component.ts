import { Component } from '@angular/core'
import {
    NbCardComponent,
    NbCardBodyComponent,
    NbSelectComponent,
    NbOptionGroupComponent,
    NbOptionComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-select-groups',
    templateUrl: './select-groups.component.html',
    imports: [
        NbCardComponent,
        NbCardBodyComponent,
        NbSelectComponent,
        NbOptionGroupComponent,
        NbOptionComponent
    ]
})
export class SelectGroupsComponent {}
