import { Component } from '@angular/core'
import { NbProgressBarComponent } from '@liquid-js/lyr-core'

import { combinations, kit, SIZES, STATUSES } from './specimen'

/**
 * Progress with its value shown, as a bar and a ring, in each size: at 60% in each status, and bars from 0 to 100% in
 * steps of 10 in the primary one.
 */
@Component({
    template: `
        <div class="specimens">
            @for (bar of bars; track $index) {
            <nb-progress-bar [attr.data-kit]="kit('progress-bar', bar)"
                [shape]="bar.shape"
                [size]="bar.size"
                [status]="bar.status"
                [value]="bar.value"
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
    readonly bars = [
        ...combinations({ shape: ['bar', 'ring'] as const, size: SIZES, value: [60], status: STATUSES }),
        // A ring's arc is a gradient its status's style holds, which a swap would keep: rings show 60% alone.
        ...combinations({ shape: ['bar'] as const, size: SIZES, value: [0, 10, 20, 30, 40, 50, 70, 80, 90, 100], status: ['primary'] as const })
    ]
}
