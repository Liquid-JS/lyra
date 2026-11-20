import { Component, computed, inject, input } from '@angular/core'
import { NgdMetadataService } from '../../../@theme/services'
import { NgdPreparedComponent } from '../../../docs.model'
import { NgdMarkdownComponent } from '../../../@theme/components/markdown/markdown.component'

@Component({
    selector: 'ngd-methods-block',
    templateUrl: './methods-block.component.html',
    imports: [NgdMarkdownComponent]
})
export class NgdMethodsBlockComponent {
    private readonly metadataService = inject(NgdMetadataService)

    readonly source = input.required<NgdPreparedComponent>()

    readonly methods = computed(() =>
        this.source().methods.filter((method) => this.metadataService.isPublic(method))
    )
}
