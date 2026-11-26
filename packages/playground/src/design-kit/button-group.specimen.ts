import { Component } from '@angular/core'
import { NbButtonGroupComponent, NbButtonToggleDirective } from '@liquid-js/lyr-core'

import { combinations, kit, SIZES, STATUSES } from './specimen'

@Component({
    template: `
        <div class="specimens">
            @for (group of groups; track $index) {
            <nb-button-group [attr.data-kit]="kit('button-group', group)"
                [size]="group.size"
                [shape]="group.shape"
                [appearance]="group.appearance"
                [status]="group.status"
                [disabled]="group.disabled">
                <!-- kit-pressed only names the pressed toggle's layers in the design kit. -->
                <button nbButtonToggle
                    class="kit-pressed"
                    [pressed]="true">One</button>
                <button nbButtonToggle>Two</button>
                <button nbButtonToggle>Three</button>
            </nb-button-group>
            }
        </div>
    `,
    imports: [NbButtonGroupComponent, NbButtonToggleDirective]
})
export class ButtonGroupSpecimenComponent {
    readonly kit = kit
    readonly groups = combinations({
        size: SIZES,
        shape: ['rectangle', 'semi-round', 'round'] as const,
        appearance: ['filled', 'outline', 'ghost'] as const,
        status: STATUSES,
        disabled: [false, true]
    })
}
