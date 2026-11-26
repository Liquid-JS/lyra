import { Component } from '@angular/core'
import { NbOptionComponent, NbSelectComponent } from '@liquid-js/lyr-core'

import { combinations, kit, SIZES, STATUSES } from './specimen'

const APPEARANCES = ['outline', 'filled', 'hero', 'ghost'] as const
const SHAPES = ['rectangle', 'semi-round', 'round'] as const

/**
 * Selects closed in every appearance, status, state and content at medium, and in every size and shape at rest; and
 * open, with their option list, as the capture opens them (`data-kit-open`).
 */
@Component({
    template: `
        <div class="specimens">
            @for (select of selects; track $index) {
            <nb-select [attr.data-kit]="kit('select', select)"
                [attr.data-kit-state]="select.state === 'hover' || select.state === 'focus' ? select.state : null"
                data-kit-target=".select-button"
                [attr.data-kit-open]="select.state === 'open' ? '' : null"
                [size]="select.size"
                [shape]="select.shape"
                [appearance]="select.appearance"
                [status]="select.status"
                [disabled]="select.state === 'disabled'"
                [selected]="select.content === 'value' ? 'one' : null"
                placeholder="Placeholder"
                aria-label="Choice">
                <nb-option value="one">Option one</nb-option>
                <nb-option value="two">Option two</nb-option>
                <!-- kit-disabled only names the disabled option's layers in the design kit. -->
                <nb-option value="three"
                    class="kit-disabled"
                    disabled>Option three</nb-option>
            </nb-select>
            }
        </div>
    `,
    imports: [NbSelectComponent, NbOptionComponent]
})
export class SelectSpecimenComponent {
    readonly kit = kit
    readonly selects = unique([
        ...combinations({
            size: ['medium'] as const,
            shape: ['rectangle'] as const,
            appearance: APPEARANCES,
            status: STATUSES,
            state: ['default', 'hover', 'focus', 'disabled'] as const,
            content: ['placeholder', 'value'] as const
        }),
        ...combinations({ size: SIZES, shape: SHAPES, appearance: ['outline'] as const, status: ['basic'] as const, state: ['default'] as const, content: ['placeholder'] as const }),
        ...combinations({ size: ['medium'] as const, shape: ['rectangle'] as const, appearance: APPEARANCES, status: STATUSES, state: ['open'] as const, content: ['value'] as const }),
        ...combinations({ size: SIZES, shape: SHAPES, appearance: ['outline'] as const, status: ['basic'] as const, state: ['open'] as const, content: ['value'] as const })
    ])
}

function unique<T>(list: T[]): T[] {
    const seen = new Set<string>()
    return list.filter((item) => !seen.has(JSON.stringify(item)) && !!seen.add(JSON.stringify(item)))
}
