import { Component } from '@angular/core'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { NbInputDirective, NbLabelComponent, NbValidationDirective, NbValidationErrorsComponent } from '@liquid-js/lyr-core'

import { combinations, kit, SIZES } from './specimen'

/** A field as the docs lay one out: a label, the control, and its hint or error under it. */
@Component({
    template: `
        <div class="specimens">
            @for (field of fields; track $index) {
            <div class="kit-field"
                [attr.data-kit]="kit('field', field)"
                [attr.data-kit-state]="field.state === 'focus' ? 'focus' : null"
                data-kit-target="input">
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
        required: [false, true],
        message: ['hint', 'error'] as const,
        state: ['default', 'focus'] as const
    })

    // An error shows once the field is touched: an address that isn't one.
    readonly controls = this.fields.map((field) => {
        const control = new FormControl(field.message === 'error' ? 'name@' : 'name@example.com', field.required ? [Validators.required, Validators.email] : [Validators.email])
        control.markAsTouched()
        return control
    })
}
