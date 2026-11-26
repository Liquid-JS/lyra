import { Component } from '@angular/core'
import { NbProgressBarComponent } from '@liquid-js/lyr-core'

import { combinations, kit, SIZES, STATUSES } from './specimen'

/** Progress at 60%, with its value shown, as a bar and a ring, in each size and status. */
@Component({
    template: `
        <div class="specimens">
            @for (bar of bars; track $index) {
            <nb-progress-bar [attr.data-kit]="kit('progress-bar', bar)"
                [shape]="bar.shape"
                [size]="bar.size"
                [status]="bar.status"
                [value]="60"
                displayValue
                aria-label="Progress"
                [style.width]="bar.shape === 'bar' ? '16rem' : null" />
            }
        </div>
    `,
    imports: [NbProgressBarComponent]
})
export class ProgressBarSpecimenComponent {
    readonly kit = kit
    readonly bars = combinations({ shape: ['bar', 'ring'] as const, size: SIZES, status: STATUSES })
}
