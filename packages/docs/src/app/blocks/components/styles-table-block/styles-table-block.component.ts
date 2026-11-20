import { Component, computed, input } from '@angular/core'
import { NgdPreparedComponent } from '../../../docs.model'
import { NgdColorSwatchDirective } from '../../../@theme/components/color-swatch/color-swatch.directive'
import { NgdMarkdownComponent } from '../../../@theme/components/markdown/markdown.component'

@Component({
    selector: 'ngd-styles-table-block',
    templateUrl: './styles-table-block.component.html',
    imports: [NgdColorSwatchDirective, NgdMarkdownComponent]
})
export class NgdStylesTableBlockComponent {
    readonly source = input.required<NgdPreparedComponent>()

    /** Each group's variables, with the value and parent `docs:prepare` gave them from the default theme. */
    readonly classStyles = computed(() => this.source().styles.map((group) => group.styles))
}
