import { Component } from '@angular/core'
import { NbDividerComponent } from '@liquid-js/lyr-core'

import { kit } from './specimen'

/** Dividers across, with and without a label, and down. */
@Component({
    template: `
        <div class="specimens">
            <nb-divider [attr.data-kit]="kit('divider', { kind: 'plain' })"
                style="width: 20rem" />
            <nb-divider [attr.data-kit]="kit('divider', { kind: 'label' })"
                style="width: 20rem">or</nb-divider>
            <div style="height: 4rem; display: flex">
                <nb-divider [attr.data-kit]="kit('divider', { kind: 'vertical' })"
                    vertical />
            </div>
        </div>
    `,
    imports: [NbDividerComponent]
})
export class DividerSpecimenComponent {
    readonly kit = kit
}
