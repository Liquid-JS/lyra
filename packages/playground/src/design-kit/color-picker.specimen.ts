import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NbColorPickerComponent } from '@liquid-js/lyr-extras/color-picker'

import { combinations, kit, SIZES, STATUSES } from './specimen'

/** Colour pickers closed in every size, status and state, and open, as the capture opens them. */
@Component({
    template: `
        <div class="specimens">
            @for (picker of pickers; track $index) {
            <nb-color-picker [attr.data-kit]="kit('color-picker', picker)"
                [attr.data-kit-state]="picker.state === 'hover' || picker.state === 'focus' ? picker.state : null"
                data-kit-target="input"
                [attr.data-kit-open]="picker.state === 'open' ? '' : null"
                [size]="picker.size"
                [status]="picker.status"
                [disabled]="picker.state === 'disabled'"
                [ngModel]="'#3469d1'" />
            }
        </div>
    `,
    imports: [FormsModule, NbColorPickerComponent]
})
export class ColorPickerSpecimenComponent {
    readonly kit = kit
    readonly pickers = [
        ...combinations({ size: SIZES, status: STATUSES, state: ['default', 'hover', 'focus', 'disabled'] as const }),
        ...combinations({ size: ['medium'] as const, status: ['basic'] as const, state: ['open'] as const })
    ]
}
