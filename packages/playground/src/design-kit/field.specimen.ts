import { Component } from '@angular/core'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { NbInputDirective, NbLabelComponent, NbValidationDirective, NbValidationErrorsComponent } from '@liquid-js/lyr-core'

import { combinations, kit, SIZES } from './specimen'

/** A field as the docs lay one out: a label, the control, an input or a textarea, and its hint or error under it. */
@Component({
    template: `
        <div class="specimens">
            @for (field of fields; track $index) {
            <div class="kit-field"
                [attr.data-kit]="kit('field', field)"
                [attr.data-kit-state]="field.state === 'focus' ? 'focus' : null"
                [attr.data-kit-target]="field.control">
                @if (field.control === 'textarea') {
                <label nbLabel
                    [for]="validation">Notes</label>
                <textarea nbInput
                    fullWidth
                    [fieldSize]="field.size"
                    [formControl]="controls[$index]"
                    nbValidation
                    #validation="nbValidation"
                    placeholder="Anything we should know"></textarea>
                <nb-validation-errors [for]="validation">Shown to the lender.</nb-validation-errors>
                } @else {
                <label nbLabel
                    [for]="validation">Email</label>
                <input nbInput
                    fullWidth
                    [fieldSize]="field.size"
                    [formControl]="controls[$index]"
                    nbValidation
                    #validation="nbValidation"
                    placeholder="name@example.com" />
                <nb-validation-errors [for]="validation">We'll send the receipt here.</nb-validation-errors>
                }
            </div>
            }
        </div>
    `,
    styles: `
        .kit-field {
            width: 16rem;
        }

        .kit-field .label {
            display: block;
            margin-bottom: 0.25rem;
        }
    `,
    imports: [ReactiveFormsModule, NbInputDirective, NbLabelComponent, NbValidationDirective, NbValidationErrorsComponent]
})
export class FieldSpecimenComponent {
    readonly kit = kit
    readonly fields = combinations({
        size: SIZES,
        control: ['input', 'textarea'] as const,
        required: [false, true],
        message: ['hint', 'error'] as const,
        state: ['default', 'focus'] as const
    })

    // An error shows once the field is touched: an address that isn't one, or notes too short.
    readonly controls = this.fields.map((field) => {
        const textarea = field.control === 'textarea'
        const value = textarea ? (field.message === 'error' ? 'Soon' : 'I\'ll pick it up after work.') : field.message === 'error' ? 'name@' : 'name@example.com'
        const rule = textarea ? Validators.minLength(10) : Validators.email
        const control = new FormControl(value, field.required ? [Validators.required, rule] : [rule])
        control.markAsTouched()
        return control
    })
}
