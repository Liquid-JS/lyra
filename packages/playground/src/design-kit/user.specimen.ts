import { Component } from '@angular/core'
import { NbUserComponent } from '@liquid-js/lyr-core'

import { combinations, kit, SIZES } from './specimen'

/**
 * Users with their name and title, in each size and shape, and with the picture alone: each with initials, and with a
 * picture, a placeholder a design's image override replaces.
 */
@Component({
    template: `
        <div class="specimens">
            @for (user of users; track $index) {
            <nb-user [attr.data-kit]="kit('user', user)"
                name="Jane Doe"
                title="Designer"
                [size]="user.size"
                [shape]="user.shape"
                [onlyPicture]="user.content === 'picture'"
                [picture]="user.avatar === 'image' ? picture : ''" />
            }
        </div>
    `,
    imports: [NbUserComponent]
})
export class UserSpecimenComponent {
    readonly kit = kit
    readonly picture = '/assets/design-kit/avatar.png'
    readonly users = combinations({
        content: ['full', 'picture'] as const,
        size: SIZES,
        shape: ['round', 'semi-round', 'rectangle'] as const,
        avatar: ['initials', 'image'] as const
    })
}
