import { Component } from '@angular/core'
import { NbFormFieldComponent, NbIconComponent, NbInputDirective, NbPrefixDirective, NbSuffixDirective } from '@liquid-js/lyr-core'

import { combinations, kit, SIZES, STATUSES } from './specimen'

@Component({
    template: `
        <div class="specimens">
            @for (field of fields; track $index) {
            <nb-form-field [attr.data-kit]="kit('form-field', field)"
                [attr.data-kit-state]="field.state === 'disabled' ? null : field.state"
                data-kit-target="input">
                @if (field.addons !== 'suffix') {
                <nb-icon nbPrefix
                    icon="search-outline"
                    pack="icons" />
                }
                <input nbInput
                    [fieldSize]="field.size"
                    [status]="field.status"
                    [disabled]="field.state === 'disabled'"
                    placeholder="Placeholder"
                    aria-label="Field" />
                @if (field.addons !== 'prefix') {
                <nb-icon nbSuffix
                    icon="eye-outline"
                    pack="icons" />
                }
            </nb-form-field>
            }
        </div>
    `,
    imports: [NbFormFieldComponent, NbInputDirective, NbIconComponent, NbPrefixDirective, NbSuffixDirective]
})
export class FormFieldSpecimenComponent {
    readonly kit = kit
    readonly fields = combinations({
        size: SIZES,
        addons: ['prefix', 'suffix', 'both'] as const,
        status: STATUSES,
        state: ['default', 'hover', 'focus', 'disabled'] as const
    })
}
