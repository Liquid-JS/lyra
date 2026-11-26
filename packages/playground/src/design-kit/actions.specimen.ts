import { Component } from '@angular/core'
import { NbActionComponent, NbActionsComponent } from '@liquid-js/lyr-core'

import { combinations, kit, SIZES } from './specimen'

/**
 * Actions with icons: one with a badge, one disabled, in each size; and, as parts for designs to compose their own,
 * an action in each size with an icon alone, a dot or a badge, at rest and disabled.
 */
@Component({
    template: `
        <div class="specimens">
            @for (actions of sets; track $index) {
            <nb-actions [attr.data-kit]="kit('actions', actions)"
                [size]="actions.size">
                <nb-action icon="search-outline" />
                <nb-action icon="bell-outline"
                    badgeDot
                    badgeStatus="danger" />
                <nb-action icon="settings-2-outline"
                    disabled />
            </nb-actions>
            }
            @for (action of parts; track $index) {
            <nb-actions [size]="action.size">
                <nb-action [attr.data-kit]="kit('action', action)"
                    icon="bell-outline"
                    [badgeDot]="action.content === 'dot'"
                    [badgeText]="action.content === 'badge' ? '3' : ''"
                    badgeStatus="danger"
                    [disabled]="action.state === 'disabled'" />
            </nb-actions>
            }
        </div>
    `,
    imports: [NbActionsComponent, NbActionComponent]
})
export class ActionsSpecimenComponent {
    readonly kit = kit
    readonly sets = combinations({ size: SIZES })
    readonly parts = combinations({ size: SIZES, content: ['icon', 'dot', 'badge'] as const, state: ['default', 'disabled'] as const })
}
