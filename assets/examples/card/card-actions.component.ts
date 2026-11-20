import { Component } from '@angular/core'
import { NbButtonModule, NbCardModule, NbIconModule } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-card-actions-example',
    templateUrl: './card-actions.component.html',
    imports: [NbCardModule, NbButtonModule, NbIconModule]
})
export class CardActionsComponent {}
