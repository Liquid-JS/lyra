import { Component, input } from '@angular/core'
import { NgdMarkdownComponent } from '../../../@theme/components/markdown/markdown.component'
import { NgdDocProp } from '../../../docs.model'

@Component({
    selector: 'ngd-prop-block',
    templateUrl: './prop-block.component.html',
    imports: [NgdMarkdownComponent]
})
export class NgdPropBlockComponent {

    readonly properties = input(new Array<NgdDocProp>())
    readonly name = input<string>()
    readonly slag = input<string>()
}
