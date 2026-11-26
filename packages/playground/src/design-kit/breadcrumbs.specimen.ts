import { Component } from '@angular/core'
import { NbBreadcrumbComponent, NbBreadcrumbsComponent } from '@liquid-js/lyr-core'

import { kit } from './specimen'

/** A trail of two links and the current page. */
@Component({
    template: `
        <div class="specimens">
            <nb-breadcrumbs [attr.data-kit]="kit('breadcrumbs', {})">
                <nb-breadcrumb><a href="#">Home</a></nb-breadcrumb>
                <nb-breadcrumb><a href="#">Projects</a></nb-breadcrumb>
                <nb-breadcrumb>Design kit</nb-breadcrumb>
            </nb-breadcrumbs>
        </div>
    `,
    imports: [NbBreadcrumbsComponent, NbBreadcrumbComponent]
})
export class BreadcrumbsSpecimenComponent {
    readonly kit = kit
}
