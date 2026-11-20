import { Component } from '@angular/core'
import { NbCardComponent, NbCardBodyComponent, NbActionsComponent, NbActionComponent } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-action-dot-mode',
    templateUrl: './action-dot-mode.component.html',
    imports: [NbCardComponent, NbCardBodyComponent, NbActionsComponent, NbActionComponent]
})
export class ActionDotModeComponent {
}
