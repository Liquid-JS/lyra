import { Component, LOCALE_ID, signal, ViewEncapsulation } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { FormControl } from '@angular/forms'
import { form, FormField } from '@angular/forms/signals'
import type { CountryCode } from 'libphonenumber-js'

import {
    NbInputDirective,
    NbThemeModule,
    NbValidationModule,
    provideNbTexts,
    nbValidationParam,
    provideNbValidation
} from '@liquid-js/lyr-core'
import { nbPhoneNumber, nbPhoneNumberValidator } from '@liquid-js/lyr-extras/phone-input'

describe('nbPhoneNumberValidator', () => {
    const create = (providers = new Array<unknown>()) =>
        TestBed.configureTestingModule({ providers: [{ provide: LOCALE_ID, useValue: 'en-GB' }, ...(providers as [])] })

    it("should read numbers in the locale's country, made in an injection context", () => {
        create()
        const control = TestBed.runInInjectionContext(() => new FormControl('', nbPhoneNumberValidator()))

        control.setValue('07400 123456')
        expect(control.valid).toBe(true)

        control.setValue('07400 12')
        expect(control.errors).toEqual({
            nbPhoneNumber: { kind: 'nbPhoneNumber', problem: 'invalid', message: 'Enter a valid phone number' }
        })

        control.setValue('')
        expect(control.valid).toBe(true)
    })

    it('should need a calling code or a country outside an injection context', () => {
        const control = new FormControl('07400 123456', nbPhoneNumberValidator())
        expect(control.errors?.['nbPhoneNumber'].problem).toBe('invalid')

        control.setValue('+44 7400 123456')
        expect(control.valid).toBe(true)

        control.setValidators(nbPhoneNumberValidator({ country: 'GB' }))
        control.setValue('07400 123456')
        expect(control.valid).toBe(true)
    })

    it('should accept only numbers of the given countries, which can change', () => {
        const countries = signal<CountryCode[]>(['US', 'CA'])
        const control = new FormControl('+44 7400 123456', nbPhoneNumberValidator({ countries }))
        expect(control.errors).toEqual({
            nbPhoneNumber: {
                kind: 'nbPhoneNumber',
                problem: 'country',
                message: 'Enter a phone number from one of the allowed countries'
            }
        })

        control.setValue('+1 201 555 0123')
        expect(control.valid).toBe(true)

        countries.set(['GB'])
        control.updateValueAndValidity()
        expect(control.errors?.['nbPhoneNumber'].problem).toBe('country')
    })

    it('should take the message it is given', () => {
        const control = new FormControl('+44 7400 123456', nbPhoneNumberValidator({ countries: ['US'], message: 'US only' }))
        expect(control.errors?.['nbPhoneNumber'].message).toBe('US only')

        control.setValidators(
            nbPhoneNumberValidator({ message: (problem) => (problem === 'invalid' ? 'Not a number' : 'Wrong country') })
        )
        control.setValue('123')
        expect(control.errors?.['nbPhoneNumber'].message).toBe('Not a number')
    })

    it('should take the message the app sets for its kind', () => {
        create([
            provideNbValidation({
                messages: {
                    nbPhoneNumber: (error) =>
                        nbValidationParam(error, 'problem') === 'country' ? 'Wrong country' : 'Not a number'
                }
            })
        ])
        const control = TestBed.runInInjectionContext(
            () => new FormControl('+44 7400 123456', nbPhoneNumberValidator({ countries: ['US'] }))
        )

        expect(control.errors?.['nbPhoneNumber'].message).toBe('Wrong country')
    })

    it('should take its messages from the texts', () => {
        create([provideNbTexts({ phoneInput: { invalid: 'Not a phone number' } })])
        const control = TestBed.runInInjectionContext(() => new FormControl('123', nbPhoneNumberValidator()))

        expect(control.errors?.['nbPhoneNumber'].message).toBe('Not a phone number')
    })
})

@Component({
    template: `
    <div class="nb-theme-default">
      <input nbInput data-control="phone" [formField]="form.phone" nbValidation #phone="nbValidation" />
      <nb-validation-errors [for]="phone" />
    </div>
  `,
    styleUrl: '../../styles/spec-theme.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [FormField, NbInputDirective, NbValidationModule]
})
class SignalFormsHostComponent {
    readonly model = signal({ phone: '' })
    readonly form = form(this.model, (path) => {
        nbPhoneNumber(path.phone, { countries: ['GB', 'IE'] })
    })
}

describe('nbPhoneNumber', () => {
    it('should validate a phone number in signal forms, with its message', async () => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot()],
            providers: [{ provide: LOCALE_ID, useValue: 'en-GB' }]
        })
        const fixture = TestBed.createComponent(SignalFormsHostComponent)
        const host = fixture.componentInstance
        const errors = () => (fixture.nativeElement.querySelector('nb-validation-errors') as HTMLElement).textContent?.trim()
        fixture.detectChanges()

        expect(host.form.phone().valid()).toBe(true)

        host.model.set({ phone: '07400 123456' })
        expect(host.form.phone().valid()).toBe(true)

        host.model.set({ phone: '+1 201 555 0123' })
        host.form.phone().markAsTouched()
        fixture.detectChanges()
        await fixture.whenStable()
        expect(host.form.phone().errors()).toEqual([
            expect.objectContaining({ kind: 'nbPhoneNumber', problem: 'country' })
        ])
        expect(errors()).toBe('Enter a phone number from one of the allowed countries')

        host.model.set({ phone: '0740' })
        fixture.detectChanges()
        await fixture.whenStable()
        expect(errors()).toBe('Enter a valid phone number')
    })
})
