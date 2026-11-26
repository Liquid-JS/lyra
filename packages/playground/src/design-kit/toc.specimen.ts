import { Component } from '@angular/core'
import { NbTocComponent } from '@liquid-js/lyr-core'

import { kit } from './specimen'

/** A table of contents of an article's headings, nested, beside the article. */
@Component({
    template: `
        <div class="specimens">
            <article #article
                style="width: 20rem">
                <h2>Getting started</h2>
                <h3>Install</h3>
                <h3>Set up a theme</h3>
                <h2>Components</h2>
                <h3>Buttons</h3>
                <h2>Customising</h2>
            </article>
            <nb-toc [attr.data-kit]="kit('toc', {})"
                [container]="article"
                style="width: 14rem" />
        </div>
    `,
    imports: [NbTocComponent]
})
export class TocSpecimenComponent {
    readonly kit = kit
}
