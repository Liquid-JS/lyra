import { Component, signal } from '@angular/core'
import {
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbSpinnerDirective,
    NbButtonComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-app-spinner-card',
    templateUrl: './spinner-card.component.html',
    imports: [
        NbCardComponent,
        NbSpinnerDirective,
        NbCardHeaderComponent,
        NbCardBodyComponent,
        NbButtonComponent
    ]
})
export class SpinnerCardComponent {
    readonly loading = signal(false)

    toggleLoadingAnimation() {
        this.loading.set(true)
        setTimeout(() => this.loading.set(false), 3000)
    }
}
