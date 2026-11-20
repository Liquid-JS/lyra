import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NbAlertComponent, NbCardBodyComponent, NbCardComponent } from '@liquid-js/lyr-core'
import { NbMarkdownViewerComponent } from '@liquid-js/lyr-extras/markdown-viewer'
import { RemarkModule } from 'ngx-remark'

@Component({
    selector: 'nb-markdown-viewer-templates',
    templateUrl: './markdown-viewer-templates.component.html',
    imports: [
        NbCardComponent,
        NbCardBodyComponent,
        NbAlertComponent,
        NbMarkdownViewerComponent,
        RemarkModule,
        RouterLink
    ]
})
export class MarkdownViewerTemplatesComponent {
    readonly markdown = [
        'The [editor](/markdown/markdown-editor-showcase.component) writes markdown, and',
        '[CommonMark](https://commonmark.org) describes it.',
        '',
        '> Block quotes are alerts here.'
    ].join('\n')

    isExternal(url: string) {
        return /^([a-z]+:)?\/\//i.test(url)
    }
}
