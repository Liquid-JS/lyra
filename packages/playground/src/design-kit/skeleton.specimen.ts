import { Component } from '@angular/core'
import { NbSkeletonDirective } from '@liquid-js/lyr-core'

import { kit } from './specimen'

/** A loading card's placeholder: an avatar circle beside two lines of text. */
@Component({
    template: `
        <div class="specimens">
            <div [attr.data-kit]="kit('skeleton', {})"
                style="display: flex; gap: 1rem; align-items: center; width: 20rem">
                <span nbSkeleton
                    nbSkeletonShape="circle"
                    style="width: 3rem; height: 3rem"></span>
                <span style="flex: auto; display: flex; flex-direction: column; gap: 0.5rem">
                    <span nbSkeleton
                        nbSkeletonWidth="60%">Name</span>
                    <span nbSkeleton>A line of text</span>
                </span>
            </div>
        </div>
    `,
    imports: [NbSkeletonDirective]
})
export class SkeletonSpecimenComponent {
    readonly kit = kit
}
