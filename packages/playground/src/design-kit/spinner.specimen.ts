import { Component } from '@angular/core'
import { NbSpinnerComponent } from '@liquid-js/lyr-core'

import { combinations, kit, SIZES, STATUSES } from './specimen'

/** Spinners with a message, in each size and status. */
@Component({
    template: `
        <div class="specimens">
            @for (spinner of spinners; track $index) {
            <div [attr.data-kit]="kit('spinner', spinner)"
                style="position: relative; width: 12rem; height: 8rem">
                <nb-spinner [size]="spinner.size"
                    [status]="spinner.status"
                    message="Loading" />
            </div>
            }
        </div>
    `,
    imports: [NbSpinnerComponent]
})
export class SpinnerSpecimenComponent {
    readonly kit = kit
    readonly spinners = combinations({ size: SIZES, status: STATUSES })
}
