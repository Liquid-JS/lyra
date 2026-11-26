import { Component } from '@angular/core'
import { NbAlertComponent } from '@liquid-js/lyr-core'

import { combinations, kit, SIZES, STATUSES } from './specimen'

@Component({
    template: `
        <div class="specimens">
            @for (alert of alerts; track $index) {
            <nb-alert [attr.data-kit]="kit('alert', alert)"
                [size]="alert.size"
                [status]="alert.status"
                [appearance]="alert.appearance"
                [closable]="alert.closable"
                style="width: 20rem">Message</nb-alert>
            }
        </div>
    `,
    imports: [NbAlertComponent]
})
export class AlertSpecimenComponent {
    readonly kit = kit
    readonly alerts = combinations({
        size: SIZES,
        closable: [false, true],
        appearance: ['filled', 'outline', 'accent'] as const,
        status: STATUSES
    })
}
