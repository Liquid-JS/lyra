import { Component } from '@angular/core'
import { NbCheckboxComponent } from '@liquid-js/lyr-core'

import { combinations, kit, SIZES, STATUSES } from './specimen'

@Component({
    template: `
        <div class="specimens">
            @for (item of items; track $index) {
            <nb-checkbox [attr.data-kit]="kit('checkbox', item)"
                [attr.data-kit-state]="item.state === 'disabled' ? null : item.state"
                data-kit-target=".native-input"
                data-kit-target-hover=".custom-checkbox"
                [size]="item.size"
                [status]="item.status"
                [checked]="item.value !== 'unchecked'"
                [indeterminate]="item.value === 'indeterminate'"
                [disabled]="item.state === 'disabled'">Label</nb-checkbox>
            }
        </div>
    `,
    imports: [NbCheckboxComponent]
})
export class CheckboxSpecimenComponent {
    readonly kit = kit
    readonly items = combinations({
        size: SIZES,
        status: STATUSES,
        state: ['default', 'hover', 'focus', 'active', 'disabled'] as const,
        value: ['unchecked', 'checked', 'indeterminate'] as const
    })
}
