import { Component } from '@angular/core'
import { NbUserComponent } from '@liquid-js/lyr-core'

import { combinations, kit, SIZES } from './specimen'

/** Users with initials, their name and title, in each size and shape, and with the picture alone. */
@Component({
    template: `
        <div class="specimens">
            @for (user of users; track $index) {
            <nb-user [attr.data-kit]="kit('user', user)"
                name="Jane Doe"
                title="Designer"
                [size]="user.size"
                [shape]="user.shape"
                [onlyPicture]="user.content === 'picture'" />
            }
        </div>
    `,
    imports: [NbUserComponent]
})
export class UserSpecimenComponent {
    readonly kit = kit
    readonly users = combinations({
        content: ['full', 'picture'] as const,
        size: SIZES,
        shape: ['round', 'semi-round', 'rectangle'] as const
    })
}
