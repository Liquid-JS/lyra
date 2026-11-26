import { Component } from '@angular/core'
import { NbToggleComponent } from '@liquid-js/lyr-core'

import { combinations, kit, SIZES, STATUSES } from './specimen'

@Component({
    template: `
        <div class="specimens">
            @for (item of items; track $index) {
            <nb-toggle [attr.data-kit]="kit('toggle', item)"
                [attr.data-kit-state]="item.state === 'disabled' ? null : item.state"
                data-kit-target=".native-input"
                data-kit-target-hover=".toggle"
                [size]="item.size"
                [status]="item.status"
                [checked]="item.value === 'on'"
                [disabled]="item.state === 'disabled'">Label</nb-toggle>
            }
        </div>
    `,
    imports: [NbToggleComponent]
})
export class ToggleSpecimenComponent {
    readonly kit = kit
    readonly items = combinations({
        size: SIZES,
        status: STATUSES,
        state: ['default', 'hover', 'focus', 'active', 'disabled'] as const,
        value: ['off', 'on'] as const
    })
}
