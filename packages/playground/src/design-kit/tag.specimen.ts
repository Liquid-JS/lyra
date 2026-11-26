import { afterNextRender, Component, viewChildren } from '@angular/core'
import { NbTagComponent } from '@liquid-js/lyr-core'

import { combinations, kit, SIZES, STATUSES } from './specimen'

@Component({
    template: `
        <div class="specimens">
            @for (tag of tags; track $index) {
            <nb-tag [attr.data-kit]="kit('tag', tag)"
                [attr.data-kit-state]="tag.state"
                text="Tag"
                [appearance]="tag.appearance"
                [status]="tag.status"
                [size]="tag.size"
                [removable]="tag.removable"
                [selected]="tag.state === 'selected'" />
            }
        </div>
    `,
    imports: [NbTagComponent]
})
export class TagSpecimenComponent {
    readonly kit = kit
    readonly tags = combinations({
        size: SIZES,
        removable: [false, true],
        appearance: ['filled', 'outline', 'hero'] as const,
        status: STATUSES,
        state: ['default', 'hover', 'active', 'selected'] as const
    })

    private readonly rendered = viewChildren(NbTagComponent)

    constructor() {
        // A tag list marks the tag the keyboard is on as active; here it's marked as a list would.
        afterNextRender(() => {
            this.rendered().forEach((tag, index) => {
                if (this.tags[index].state === 'active') {
                    tag.setActiveStyles()
                }
            })
        })
    }
}
