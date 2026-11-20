import { Component, signal } from '@angular/core'
import { NbCardComponent, NbCardBodyComponent, NbButtonComponent, NbSpinnerDirective } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-app-spinner-button',
    templateUrl: './spinner-button.component.html',
    imports: [NbCardComponent, NbCardBodyComponent, NbButtonComponent, NbSpinnerDirective]
})
export class SpinnerButtonComponent {
    readonly loading = signal(false)

    toggleLoadingAnimation() {
        this.loading.set(true)
        setTimeout(() => this.loading.set(false), 3000)
    }
}
