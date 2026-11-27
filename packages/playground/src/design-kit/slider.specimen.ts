import { Component } from '@angular/core'
import { NbSliderComponent } from '@liquid-js/lyr-core'

import { combinations, kit, SIZES, STATUSES } from './specimen'

/**
 * Sliders in each size, status and state, single at 40 and ranges at 20–70; single ones from 0 to 100 in steps of 10 in
 * the primary status.
 */
@Component({
    template: `
        <div class="specimens">
            @for (slider of sliders; track $index) {
            <nb-slider [attr.data-kit]="kit('slider', slider)"
                [attr.data-kit-state]="slider.state"
                data-kit-target=".slider-thumb"
                [size]="slider.size"
                [status]="slider.status"
                [range]="slider.range"
                [value]="valueOf(slider)"
                [disabled]="slider.state === 'disabled'"
                [min]="0"
                [max]="100"
                aria-label="Value"
                style="width: 16rem" />
            }
        </div>
    `,
    imports: [NbSliderComponent]
})
export class SliderSpecimenComponent {
    readonly kit = kit
    readonly sliders = [
        ...combinations({ size: SIZES, range: [false], value: ['40'], status: STATUSES, state: STATES }),
        ...combinations({ size: SIZES, range: [true], value: ['20–70'], status: STATUSES, state: STATES }),
        // Where its thumb is changes its layout, so each value is a symbol, as a progress bar's: in steps of 10.
        ...combinations({ size: SIZES, range: [false], value: ['0', '10', '20', '30', '50', '60', '70', '80', '90', '100'], status: ['primary'] as const, state: ['default'] as const })
    ]

    /** A single slider's value, or a range's start and end, e.g. `20–70`. */
    valueOf({ value }: { value: string }): number | { start: number, end: number } {
        const [start, end] = value.split('–').map(Number)
        return end === undefined ? start : { start, end }
    }
}

const STATES = ['default', 'hover', 'focus', 'active', 'disabled'] as const
