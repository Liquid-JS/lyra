import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NbPhoneInputComponent } from '@liquid-js/lyr-extras/phone-input'

import { combinations, kit, SIZES, STATUSES } from './specimen'

/** Phone inputs with a US number, in every size, status and state. */
@Component({
    template: `
        <div class="specimens">
            @for (phone of phones; track $index) {
            <nb-phone-input [attr.data-kit]="kit('phone-input', phone)"
                [attr.data-kit-state]="phone.state === 'hover' || phone.state === 'focus' ? phone.state : null"
                data-kit-target="input"
                [size]="phone.size"
                [status]="phone.status"
                [disabled]="phone.state === 'disabled'"
                [ngModel]="'+12025550123'" />
            }
        </div>
    `,
    imports: [FormsModule, NbPhoneInputComponent]
})
export class PhoneInputSpecimenComponent {
    readonly kit = kit
    readonly phones = combinations({ size: SIZES, status: STATUSES, state: ['default', 'hover', 'focus', 'disabled'] as const })
}
