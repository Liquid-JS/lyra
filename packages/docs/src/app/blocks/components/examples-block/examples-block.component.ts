import { Component, input } from '@angular/core'
import { NbCardComponent, NbCardBodyComponent } from '@liquid-js/lyr-core'
import { NgdPreparedComponent } from '../../../docs.model'
import { NgdFragmentTargetDirective } from '../../../@theme/components/fragment-target/fragment-target.directive'
import { NgdStackedExampleComponent } from '../stacked-example-block/stacked-examples.component'

@Component({
    selector: 'ngd-examples-block',
    templateUrl: './examples-block.component.html',
    imports: [NbCardComponent, NgdFragmentTargetDirective, NbCardBodyComponent, NgdStackedExampleComponent]
})
export class NgdExamplesBlockComponent {

    readonly source = input.required<NgdPreparedComponent>()

}
