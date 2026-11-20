import { Component, signal, ViewEncapsulation } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { form, FormField } from '@angular/forms/signals'
import type { MaskType } from 'maska'
import { userEvent } from 'vitest/browser'

import {
    NbInputDirective,
    NbThemeModule,
    NbValidationModule,
    provideNbTexts,
    provideNbValidation
} from '@liquid-js/lyr-core'
import { NbMaskDirective, NbMaskOptions, NbMaskValue } from '@liquid-js/lyr-extras/mask'

@Component({
    // The theme applies in an element with its class.
    template: `
    <div class="nb-theme-default">
      <input
        nbInput
        type="tel"
        aria-label="Phone"
        [nbMask]="mask()"
        [nbMaskOptions]="options()"
        [nbMaskValue]="valueType()"
        [formControl]="phone"
        nbValidation
        #validation="nbValidation"
        #masked="nbMask"
      />
      <nb-validation-errors [for]="validation" />
      <button class="after">After</button>
    </div>
  `,
    styleUrl: '../../styles/spec-theme.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbMaskDirective, NbInputDirective, NbValidationModule, ReactiveFormsModule]
})
class MaskHostComponent {
    readonly phone = new FormControl<string | null>(null)
    readonly mask = signal<MaskType>('(###) ###-####')
    readonly options = signal<NbMaskOptions>({})
    readonly valueType = signal<NbMaskValue>('unmasked')
}

describe('NbMaskDirective', () => {
    let fixture: ComponentFixture<MaskHostComponent>
    let host: MaskHostComponent
    let field: HTMLInputElement

    const render = async () => {
        fixture.detectChanges()
        await fixture.whenStable()
    }
    const type = async (text: string) => {
        await userEvent.click(field)
        await userEvent.keyboard('{End}')
        await userEvent.keyboard(text)
        await render()
    }
    const errors = () => (fixture.nativeElement.querySelector('nb-validation-errors') as HTMLElement).textContent?.trim()

    const create = async (providers = new Array<unknown>()) => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()], providers: providers as [] })
        fixture = TestBed.createComponent(MaskHostComponent)
        host = fixture.componentInstance
        field = fixture.nativeElement.querySelector('input')
        await render()
    }

    afterEach(() => fixture.destroy())

    describe('with the default texts', () => {
        beforeEach(() => create())

        it('should format what is typed and give the form the characters typed', async () => {
            await type('2015550123')

            expect(field.value).toBe('(201) 555-0123')
            expect(host.phone.value).toBe('2015550123')
            expect(host.phone.valid).toBe(true)
            expect(host.phone.dirty).toBe(true)
        })

        it('should give the form the text as shown', async () => {
            host.valueType.set('masked')
            await render()
            await type('2015550123')

            expect(host.phone.value).toBe('(201) 555-0123')
        })

        it('should show a form value formatted, without reporting a change', async () => {
            host.phone.setValue('2015550123')
            await render()

            expect(field.value).toBe('(201) 555-0123')
            expect(host.phone.value).toBe('2015550123')
            expect(host.phone.dirty).toBe(false)
        })

        it('should keep the last value while the text does not fill the mask, with the parse error', async () => {
            await type('20155')
            expect(field.value).toBe('(201) 55')
            expect(host.phone.value).toBeNull()
            expect(host.phone.errors).toEqual({ nbMask: { kind: 'nbMask', message: 'Complete the value' } })

            await userEvent.click(fixture.nativeElement.querySelector('.after'))
            await render()
            expect(errors()).toBe('Complete the value')

            await type('50123')
            expect(host.phone.valid).toBe(true)
        })

        it('should let an empty field pass', async () => {
            await type('2')
            await userEvent.clear(field)
            await render()

            expect(host.phone.value).toBeNull()
            expect(host.phone.valid).toBe(true)
        })

        it('should give the form the new value when the kind of value changes', async () => {
            await type('2015550123')
            host.valueType.set('masked')
            await render()

            expect(host.phone.value).toBe('(201) 555-0123')
        })

        it('should pick the mask that fits from a list', async () => {
            host.mask.set(['#### ####', '#### #### ####'])
            await render()
            await type('12345678')
            expect(field.value).toBe('1234 5678')
            expect(host.phone.valid).toBe(true)

            await type('9012')
            expect(field.value).toBe('1234 5678 9012')
        })

        it("should format numbers in the locale's format, which have no length to fill", async () => {
            host.mask.set(null)
            host.options.set({ number: { locale: 'en', fraction: 2 } })
            await render()
            await type('1234567.891')

            expect(field.value).toBe('1,234,567.89')
            expect(host.phone.valid).toBe(true)
        })

        it('should be disabled with its control', async () => {
            host.phone.disable()
            await render()

            expect(field.disabled).toBe(true)
        })
    })

    it('should take the message the app sets for its kind', async () => {
        await create([provideNbValidation({ messages: { nbMask: 'Finish typing the number' } })])
        await type('201')

        expect(host.phone.errors).toEqual({ nbMask: { kind: 'nbMask', message: 'Finish typing the number' } })
    })

    it('should take its message from the texts', async () => {
        await create([provideNbTexts({ mask: { incomplete: 'Fill in the whole number' } })])
        await type('201')

        expect(host.phone.errors).toEqual({ nbMask: { kind: 'nbMask', message: 'Fill in the whole number' } })
    })
})

@Component({
    template: `
    <div class="nb-theme-default">
      <form>
        <input nbInput name="phone" aria-label="Phone" nbMask="(###) ###-####" [(ngModel)]="phone" nbValidation #v="nbValidation" />
        <nb-validation-errors [for]="v" />
      </form>
    </div>
  `,
    styleUrl: '../../styles/spec-theme.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbMaskDirective, NbInputDirective, NbValidationModule, FormsModule]
})
class TemplateDrivenHostComponent {
    phone = '2015550123'
}

@Component({
    template: `
    <div class="nb-theme-default">
      <input nbInput aria-label="Phone" nbMask="(###) ###-####" [formField]="contact.phone" nbValidation #v="nbValidation" />
      <nb-validation-errors [for]="v" />
    </div>
  `,
    styleUrl: '../../styles/spec-theme.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbMaskDirective, NbInputDirective, NbValidationModule, FormField]
})
class SignalFormsHostComponent {
    readonly model = signal({ phone: '2015550123' })
    readonly contact = form(this.model)
}

describe('NbMaskDirective in other forms', () => {
    let fixture: ComponentFixture<unknown>

    const render = async () => {
        fixture.detectChanges()
        await fixture.whenStable()
    }
    const field = () => fixture.nativeElement.querySelector('input') as HTMLInputElement
    const errors = () => (fixture.nativeElement.querySelector('nb-validation-errors') as HTMLElement).textContent?.trim()
    const retype = async (text: string) => {
    // Replaces the text at once, without first emptying the field, which would empty the value.
        await userEvent.fill(field(), text)
        field().dispatchEvent(new Event('blur'))
        await render()
    }

    const create = async (host: new () => unknown) => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] })
        fixture = TestBed.createComponent(host)
        await render()
        await render()
    }

    afterEach(() => fixture.destroy())

    it('should work with ngModel', async () => {
        await create(TemplateDrivenHostComponent)
        const host = fixture.componentInstance as TemplateDrivenHostComponent
        expect(field().value).toBe('(201) 555-0123')

        await retype('41555')
        expect(host.phone).toBe('2015550123')
        expect(errors()).toBe('Complete the value')

        await retype('4155550199')
        expect(host.phone).toBe('4155550199')
        expect(errors()).toBe('')
    })

    it('should work with signal forms', async () => {
        await create(SignalFormsHostComponent)
        const host = fixture.componentInstance as SignalFormsHostComponent
        expect(field().value).toBe('(201) 555-0123')

        await retype('41555')
        expect(host.model().phone).toBe('2015550123')
        expect(host.contact.phone().invalid()).toBe(true)
        expect(errors()).toBe('Complete the value')

        await retype('4155550199')
        expect(host.model().phone).toBe('4155550199')
        expect(errors()).toBe('')
    })
})
