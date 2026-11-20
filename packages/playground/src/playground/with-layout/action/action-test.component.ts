import { Component } from '@angular/core'
import {
    NbLayoutComponent,
    NbLayoutHeaderComponent,
    NbLayoutColumnComponent,
    NbActionsComponent,
    NbActionComponent,
    NbUserComponent,
    NbCardComponent,
    NbCardBodyComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-action-test',
    templateUrl: './action-test.component.html',
    imports: [
        NbLayoutComponent,
        NbLayoutHeaderComponent,
        NbActionsComponent,
        NbActionComponent,
        NbUserComponent,
        NbLayoutColumnComponent,
        NbCardComponent,
        NbCardBodyComponent
    ]
})
export class ActionTestComponent {
    actionOnClick(event: any) {
        console.info(event)
    }
}
