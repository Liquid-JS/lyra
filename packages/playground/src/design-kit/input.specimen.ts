import { Component } from '@angular/core'
import { NbInputDirective } from '@liquid-js/lyr-core'

import { combinations, kit, SIZES, STATUSES } from './specimen'

@Component({
    template: `
        <div class="specimens">
            @for (field of fields; track $index) {
            <input nbInput
                [attr.data-kit]="kit('input', field)"
                [attr.data-kit-state]="field.state"
                [fieldSize]="field.size"
                [shape]="field.shape"
                [status]="field.status"
                [disabled]="field.state === 'disabled'"
                [value]="field.content === 'value' ? 'Value' : ''"
                placeholder="Placeholder"
                aria-label="Field" />
            }
        </div>
    `,
    imports: [NbInputDirective]
})
export class InputSpecimenComponent {
    readonly kit = kit
    readonly fields = combinations({
        size: SIZES,
        shape: ['rectangle', 'semi-round', 'round'] as const,
        status: STATUSES,
        state: ['default', 'hover', 'focus', 'disabled'] as const,
        content: ['placeholder', 'value'] as const
    })
}
