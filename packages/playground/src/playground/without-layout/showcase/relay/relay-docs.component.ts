import { Component } from '@angular/core'
import { NbTocComponent } from '@liquid-js/lyr-core'
import { NbMarkdownViewerComponent } from '@liquid-js/lyr-extras/markdown-viewer'

import { DOCS_MARKDOWN, DOCS_NAV } from './relay-data'

/** A page of the docs: the guides down the side, the page from its markdown, and its headings to jump to. */
@Component({
    selector: 'npg-relay-docs',
    templateUrl: './relay-docs.component.html',
    styleUrls: ['./relay-docs.component.scss'],
    imports: [NbMarkdownViewerComponent, NbTocComponent]
})
export class RelayDocsComponent {
    readonly nav = DOCS_NAV
    readonly current = 'Verifying signatures'
    readonly markdown = DOCS_MARKDOWN
}
