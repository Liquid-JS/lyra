import { Component, ViewEncapsulation } from '@angular/core'
import { NbCardBodyComponent, NbCardComponent, NbCardHeaderComponent } from '@liquid-js/lyr-core'
import { NbMarkdownRendererComponent } from '@liquid-js/lyr-extras/markdown-renderer'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'

@Component({
    selector: 'nb-markdown-renderer-example',
    templateUrl: './markdown-renderer.component.html',
    styleUrl: './markdown-renderer.component.scss',
    // The renderer's content is its own elements, which the app's styles reach without view encapsulation.
    encapsulation: ViewEncapsulation.None,
    imports: [NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent, NbMarkdownRendererComponent]
})
export class MarkdownRendererComponent {
    // The app's own processor: GitHub's extensions, and the text's characters as they're written.
    readonly processor = remark().use(remarkGfm).freeze()

    readonly markdown = [
        '### Version 2.4',
        '',
        '- Exports keep the colours of the chart',
        '- Faster search in long lists',
        '',
        '### Version 2.3',
        '',
        '| Change | Area |',
        '| ------ | ---- |',
        '| New date range picker | Forms |',
        '| Bigger touch targets | Phone layout |'
    ].join('\n')
}
