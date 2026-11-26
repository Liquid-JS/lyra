import { Component } from '@angular/core'
import { NbSliderComponent } from '@liquid-js/lyr-core'

import { combinations, kit, SIZES, STATUSES } from './specimen'

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
                [value]="slider.range ? { start: 20, end: 70 } : 40"
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
    readonly sliders = combinations({
        size: SIZES,
        range: [false, true],
        status: STATUSES,
        state: ['default', 'hover', 'focus', 'active', 'disabled'] as const
    })
}
