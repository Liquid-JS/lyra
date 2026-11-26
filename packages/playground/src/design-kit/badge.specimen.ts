import { Component } from '@angular/core'
import { NbBadgeComponent } from '@liquid-js/lyr-core'

import { combinations, kit, STATUSES } from './specimen'

@Component({
    template: `
        <div class="specimens">
            @for (badge of badges; track $index) {
            <nb-badge [attr.data-kit]="kit('badge', badge)"
                [text]="badge.dotMode ? '' : '99+'"
                [dotMode]="badge.dotMode"
                [status]="badge.status"
                position="inline" />
            }
        </div>
    `,
    imports: [NbBadgeComponent]
})
export class BadgeSpecimenComponent {
    readonly kit = kit
    readonly badges = combinations({ dotMode: [false, true], status: STATUSES })
}
