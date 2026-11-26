import { Component } from '@angular/core'
import { NbPageIndicatorComponent } from '@liquid-js/lyr-core'

import { combinations, kit, STATUSES } from './specimen'

/** Five pages, on the second, in each status. */
@Component({
    template: `
        <div class="specimens">
            @for (indicator of indicators; track $index) {
            <nb-page-indicator [attr.data-kit]="kit('page-indicator', indicator)"
                [status]="indicator.status"
                [count]="5"
                [page]="1" />
            }
        </div>
    `,
    imports: [NbPageIndicatorComponent]
})
export class PageIndicatorSpecimenComponent {
    readonly kit = kit
    readonly indicators = combinations({ status: STATUSES })
}
