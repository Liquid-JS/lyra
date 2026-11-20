import { Component, computed, inject, input } from '@angular/core'
import { NbCardComponent, NbCardBodyComponent } from '@liquid-js/lyr-core'
import { NgdTabbedService } from '../../../@theme/services'
import { NgdPreparedComponent } from '../../../docs.model'
import { NgdFragmentTargetDirective } from '../../../@theme/components/fragment-target/fragment-target.directive'
import { NgdMarkdownComponent } from '../../../@theme/components/markdown/markdown.component'
import { NgdLiveExampleBlockComponent } from '../live-example-block/live-example-block.component'
import { NgdInlineExampleBlockComponent } from '../inline-example-block/inline-example-block.component'
import { NgdStackedExampleComponent } from '../stacked-example-block/stacked-examples.component'
import { NgdPropsBlockComponent } from '../props-block/props-block.component'
import { NgdMethodsBlockComponent } from '../methods-block/methods-block.component'
import { NgdStylesTableBlockComponent } from '../styles-table-block/styles-table-block.component'

@Component({
    selector: 'ngd-component-block',
    templateUrl: './component-block.component.html',
    imports: [
        NgdMarkdownComponent,
        NbCardComponent,
        NgdFragmentTargetDirective,
        NbCardBodyComponent,
        NgdLiveExampleBlockComponent,
        NgdInlineExampleBlockComponent,
        NgdStackedExampleComponent,
        NgdPropsBlockComponent,
        NgdMethodsBlockComponent,
        NgdStylesTableBlockComponent
    ]
})
export class NgdComponentBlockComponent {
    private readonly tabbedService = inject(NgdTabbedService)

    readonly source = input.required<NgdPreparedComponent>()

    readonly overview = computed(() => this.source().overview)

    hasTheme(component: NgdPreparedComponent) {
        return this.tabbedService.componentHasTheme(component)
    }

    hasMethods(component: NgdPreparedComponent) {
        return this.tabbedService.componentHasMethods(component)
    }

    hasProps(component: NgdPreparedComponent) {
        return this.tabbedService.componentHasProps(component)
    }
}
