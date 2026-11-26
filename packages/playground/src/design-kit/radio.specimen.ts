import { Component } from '@angular/core'
import { NbRadioComponent } from '@liquid-js/lyr-core'

import { combinations, kit, SIZES, STATUSES } from './specimen'

/** Each radio has a name of its own, as radios sharing one are a group, where only one is checked. */
@Component({
    template: `
        <div class="specimens">
            @for (item of items; track $index) {
            <nb-radio [attr.data-kit]="kit('radio', item)"
                [attr.data-kit-state]="item.state === 'disabled' ? null : item.state"
                data-kit-target=".native-input"
                data-kit-target-hover="label"
                [name]="'kit-radio-' + $index"
                [size]="item.size"
                [status]="item.status"
                [checked]="item.value === 'checked'"
                [disabled]="item.state === 'disabled'">Label</nb-radio>
            }
        </div>
    `,
    imports: [NbRadioComponent]
})
export class RadioSpecimenComponent {
    readonly kit = kit
    readonly items = combinations({
        size: SIZES,
        status: STATUSES,
        state: ['default', 'hover', 'focus', 'active', 'disabled'] as const,
        value: ['unchecked', 'checked'] as const
    })
}
