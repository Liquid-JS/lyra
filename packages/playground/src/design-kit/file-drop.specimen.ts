import { Component } from '@angular/core'
import { NbFileDropComponent } from '@liquid-js/lyr-core'

import { combinations, kit, SIZES, STATUSES } from './specimen'

@Component({
    template: `
        <div class="specimens">
            @for (drop of drops; track $index) {
            <!-- Focus and dragging over are the component's own classes, set here as it sets them. -->
            <nb-file-drop [attr.data-kit]="kit('file-drop', drop)"
                [attr.data-kit-state]="drop.state === 'hover' ? 'hover' : null"
                [class.focused]="drop.state === 'focus'"
                [class.drag-over]="drop.state === 'drag-over'"
                [size]="drop.size"
                [shape]="drop.shape"
                [status]="drop.status"
                [disabled]="drop.state === 'disabled'" />
            }
        </div>
    `,
    imports: [NbFileDropComponent]
})
export class FileDropSpecimenComponent {
    readonly kit = kit
    readonly drops = combinations({
        size: SIZES,
        shape: ['rectangle', 'semi-round', 'round'] as const,
        status: STATUSES,
        state: ['default', 'hover', 'focus', 'drag-over', 'disabled'] as const
    })
}
