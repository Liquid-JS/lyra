import { Component } from '@angular/core'
import {
    NbIconConfig,
    NbCardComponent,
    NbCardBodyComponent,
    NbActionsComponent,
    NbActionComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-action-showcase',
    templateUrl: './action-showcase.component.html',
    imports: [NbCardComponent, NbCardBodyComponent, NbActionsComponent, NbActionComponent]
})
export class ActionShowcaseComponent {
    disabledIconConfig: NbIconConfig = { icon: 'settings-2-outline', pack: 'icons' }
}
