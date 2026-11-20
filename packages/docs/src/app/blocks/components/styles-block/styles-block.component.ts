import { Component, input } from '@angular/core'
import { NbCardComponent, NbCardBodyComponent } from '@liquid-js/lyr-core'
import { NgdPreparedComponent } from '../../../docs.model'
import { NgdFragmentTargetDirective } from '../../../@theme/components/fragment-target/fragment-target.directive'
import { NgdStylesTableBlockComponent } from '../styles-table-block/styles-table-block.component'

@Component({
    selector: 'ngd-styles-block',
    templateUrl: './styles-block.component.html',
    imports: [NbCardComponent, NgdFragmentTargetDirective, NbCardBodyComponent, NgdStylesTableBlockComponent]
})
export class NgdStylesBlockComponent {

    readonly source = input.required<NgdPreparedComponent>()
}
