import { Component, inject, input } from '@angular/core'
import { NbCardComponent, NbCardBodyComponent } from '@liquid-js/lyr-core'
import { NgdTabbedService } from '../../../@theme/services'
import { NgdPreparedComponent } from '../../../docs.model'
import { NgdFragmentTargetDirective } from '../../../@theme/components/fragment-target/fragment-target.directive'
import { NgdPropsBlockComponent } from '../props-block/props-block.component'
import { NgdMethodsBlockComponent } from '../methods-block/methods-block.component'

@Component({
    selector: 'ngd-api-block',
    templateUrl: './api-block.component.html',
    imports: [
        NbCardComponent,
        NgdFragmentTargetDirective,
        NbCardBodyComponent,
        NgdPropsBlockComponent,
        NgdMethodsBlockComponent
    ]
})
export class NgdApiBlockComponent {
    private readonly tabbedService = inject(NgdTabbedService)

    readonly source = input.required<NgdPreparedComponent>()

    hasMethods(component: NgdPreparedComponent) {
        return this.tabbedService.componentHasMethods(component)
    }

    hasProps(component: NgdPreparedComponent) {
        return this.tabbedService.componentHasProps(component)
    }
}
