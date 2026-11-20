import { Component, computed, inject, input } from '@angular/core'
import { NgdMetadataService } from '../../../@theme/services'
import { NgdDocProp, NgdPreparedComponent } from '../../../docs.model'
import { NgdPropBlockComponent } from '../prop-block/prop-block.component'

@Component({
    selector: 'ngd-props-block',
    templateUrl: './props-block.component.html',
    imports: [NgdPropBlockComponent]
})
export class NgdPropsBlockComponent {
    private readonly metadataService = inject(NgdMetadataService)

    readonly source = input.required<NgdPreparedComponent>()

    readonly inputs = computed(() => this.publicProps('input'))
    readonly outputs = computed(() => this.publicProps('output'))
    readonly props = computed(() => this.publicProps('property'))
    readonly name = computed(() => this.source().name)
    readonly slag = computed(() => this.source().slag)

    private publicProps(kind: NgdDocProp['kind']): NgdDocProp[] {
        return this.source().props.filter((item) => item.kind === kind).filter((m) => this.metadataService.isPublic(m))
    }
}
