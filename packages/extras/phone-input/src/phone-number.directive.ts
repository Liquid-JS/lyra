import { Directive, effect, ElementRef, forwardRef, inject, input } from '@angular/core'
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms'
import type { CountryCode } from 'libphonenumber-js'

import {
    NB_PHONE_NUMBER_ERROR,
    NbPhoneNumberMessage,
    phoneNumberContext,
    validatePhoneNumber
} from './phone-number.validator'

/**
 * Validates a phone number in template-driven forms, as `nbPhoneNumberValidator` does in reactive forms:
 *
 * ```html
 * <input nbInput type="tel" name="phone" ngModel nbPhoneNumber [nbPhoneNumberCountries]="['US', 'CA']" />
 * ```
 */
@Directive({
    selector: '[nbPhoneNumber][ngModel],[nbPhoneNumber][formControl],[nbPhoneNumber][formControlName]',
    providers: [{ provide: NG_VALIDATORS, useExisting: forwardRef(() => NbPhoneNumberValidatorDirective), multi: true }],
    host: {
    // On a plain text field, the number reads left to right from the left in any page, as a tel field's does.
        '[style.text-align]': "isInput ? 'left' : null",
        '[style.unicode-bidi]': "isInput ? 'plaintext' : null"
    }
})
export class NbPhoneNumberValidatorDirective implements Validator {
    /** The country of numbers without a calling code; the app locale's country by default. */
    readonly country = input<CountryCode>(undefined, { alias: 'nbPhoneNumberCountry' })
    /** The countries whose numbers pass, all by default. */
    readonly countries = input<ReadonlyArray<CountryCode>>(undefined, { alias: 'nbPhoneNumberCountries' })
    /** The message of its errors, in place of the app's. */
    readonly message = input<NbPhoneNumberMessage>(undefined, { alias: 'nbPhoneNumberMessage' })

    // By tag name, which a server's DOM also has.
    protected readonly isInput = inject<ElementRef<Element>>(ElementRef).nativeElement.tagName === 'INPUT'
    protected readonly context = phoneNumberContext()
    protected onValidatorChange: () => void = () => {}

    constructor() {
    // Other options can change whether the value passes.
        effect(() => {
            this.country()
            this.countries()
            this.message()
            this.onValidatorChange()
        })
    }

    validate(control: AbstractControl): ValidationErrors | null {
        const error = validatePhoneNumber(
            control.value,
            { country: this.country(), countries: this.countries(), message: this.message() },
            this.context
        )
        return error ? { [NB_PHONE_NUMBER_ERROR]: error } : null
    }

    registerOnValidatorChange(fn: () => void) {
        this.onValidatorChange = fn
    }
}
