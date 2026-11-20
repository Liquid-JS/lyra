import { Component } from '@angular/core'
import {
    NbCardComponent,
    NbCardBodyComponent,
    NbActionsComponent,
    NbActionComponent,
    NbProgressBarComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-progress-bar-interactive',
    templateUrl: './progress-bar-interactive.component.html',
    styles: [
        `
      .container {
        display: flex;
        align-items: center;
      }

      nb-progress-bar {
        flex: 1;
      }
    `
    ],
    imports: [
        NbCardComponent,
        NbCardBodyComponent,
        NbActionsComponent,
        NbActionComponent,
        NbProgressBarComponent
    ]
})
export class ProgressBarInteractiveComponent {
    value = 25

    setValue(newValue: number) {
        this.value = Math.min(Math.max(newValue, 0), 100)
    }

    get status() {
        if (this.value <= 25) {
            return 'danger'
        } else if (this.value <= 50) {
            return 'warning'
        } else if (this.value <= 75) {
            return 'info'
        } else {
            return 'success'
        }
    }
}
