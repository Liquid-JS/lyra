import { Component } from '@angular/core'
import { NbButtonComponent, NbIconComponent } from '@liquid-js/lyr-core'

import { combinations, kit, SIZES, STATUSES } from './specimen'

const APPEARANCES = ['filled', 'outline', 'ghost', 'hero'] as const
const SHAPES = ['rectangle', 'semi-round', 'round'] as const
const STATES = ['default', 'hover', 'focus', 'active', 'disabled'] as const

/**
 * Buttons, with text and with an icon alone: every appearance, status and state, in every size for buttons with
 * text, at medium for icon buttons; and every size and shape, with an icon before or after the text too, and as wide as
 * its container, at rest.
 */
@Component({
    template: `
        <div class="specimens">
            @for (button of buttons; track $index) {
            <button nbButton
                [attr.data-kit]="kit('button', button)"
                [attr.data-kit-state]="button.state === 'disabled' ? null : button.state"
                [appearance]="button.appearance"
                [status]="button.status"
                [size]="button.size"
                [shape]="button.shape"
                [fullWidth]="button.fullWidth"
                [style.width]="button.fullWidth ? '20rem' : null"
                [disabled]="button.state === 'disabled'">
                @if (button.icon === 'start') {
                <nb-icon icon="star-outline" />
                }
                Button
                @if (button.icon === 'end') {
                <nb-icon icon="arrow-forward-outline" />
                }
            </button>
            }
            @for (button of iconButtons; track $index) {
            <button nbButton
                [attr.data-kit]="kit('icon-button', button)"
                [attr.data-kit-state]="button.state === 'disabled' ? null : button.state"
                [appearance]="button.appearance"
                [status]="button.status"
                [size]="button.size"
                [shape]="button.shape"
                [disabled]="button.state === 'disabled'"
                aria-label="Star">
                <nb-icon icon="star-outline" />
            </button>
            }
        </div>
    `,
    imports: [NbButtonComponent, NbIconComponent]
})
export class ButtonSpecimenComponent {
    readonly kit = kit
    // Every size in every look, as a label's text style is a size's; shapes and icons at rest.
    readonly buttons = unique([
        ...combinations({ size: SIZES, shape: ['rectangle'] as const, icon: ['none'] as const, fullWidth: [false], appearance: APPEARANCES, status: STATUSES, state: STATES }),
        ...combinations({ size: SIZES, shape: SHAPES, icon: ['none', 'start', 'end'] as const, fullWidth: [false], appearance: ['filled'] as const, status: ['primary'] as const, state: ['default'] as const }),
        // As wide as its container, e.g. a form's submit button on a phone.
        ...combinations({ size: SIZES, shape: SHAPES, icon: ['none'] as const, fullWidth: [true], appearance: ['filled'] as const, status: ['primary'] as const, state: ['default'] as const })
    ])

    readonly iconButtons = unique([
        ...combinations({ size: ['medium'] as const, shape: ['rectangle'] as const, appearance: APPEARANCES, status: STATUSES, state: STATES }),
        ...combinations({ size: SIZES, shape: SHAPES, appearance: ['filled'] as const, status: ['primary'] as const, state: ['default'] as const })
    ])
}

function unique<T>(list: T[]): T[] {
    const seen = new Set<string>()
    return list.filter((item) => !seen.has(JSON.stringify(item)) && !!seen.add(JSON.stringify(item)))
}
