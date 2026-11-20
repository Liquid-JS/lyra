import { Component, inject } from '@angular/core'
import { NbLayoutDirectionService, NbLayoutDirection } from '@liquid-js/lyr-core'

@Component({
    selector: 'npg-layout-direction-toggle',
    styleUrls: ['./layout-direction-toggle.component.scss'],
    templateUrl: './layout-direction-toggle.component.html'
})
export class LayoutDirectionToggleComponent {
    private readonly directionService = inject(NbLayoutDirectionService)

    get isRtl() {
        return this.directionService.isRtl()
    }

    toggleFlow() {
        const oppositeDirection = this.isRtl ? NbLayoutDirection.LTR : NbLayoutDirection.RTL
        this.directionService.setDirection(oppositeDirection)
    }
}
