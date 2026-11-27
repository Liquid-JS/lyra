import { Component, signal, ViewEncapsulation } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { form, FormField, required } from '@angular/forms/signals'
import { userEvent } from 'vitest/browser'

import { NbSwatchModule, NbThemeModule, NbValidationModule } from '@liquid-js/lyr-core'

// A colour the shopper has to choose, as each kind of form has it.
@Component({
    template: `
    <div class="nb-theme-default">
      <nb-swatch-group aria-label="Colour" [formControl]="control" nbValidation #validation="nbValidation">
        <nb-swatch value="navy" label="Navy" color="#1f2a44" />
        <nb-swatch value="sand" label="Sand" color="#d8c6a5" />
      </nb-swatch-group>
      <nb-validation-errors [for]="validation" />
    </div>
  `,
    styleUrl: './swatch.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbSwatchModule, NbValidationModule, ReactiveFormsModule]
})
class ReactiveHostComponent {
    readonly control = new FormControl<string | null>(null, Validators.required)
    value = () => this.control.value
}

@Component({
    template: `
    <div class="nb-theme-default">
      <nb-swatch-group aria-label="Colour" name="colour" [(ngModel)]="colour" required nbValidation #validation="nbValidation">
        <nb-swatch value="navy" label="Navy" color="#1f2a44" />
        <nb-swatch value="sand" label="Sand" color="#d8c6a5" />
      </nb-swatch-group>
      <nb-validation-errors [for]="validation" />
    </div>
  `,
    styleUrl: './swatch.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbSwatchModule, NbValidationModule, FormsModule]
})
class TemplateHostComponent {
    colour: string | null = null
    value = () => this.colour
}

@Component({
    template: `
    <div class="nb-theme-default">
      <nb-swatch-group aria-label="Colour" [formField]="order.colour" nbValidation #validation="nbValidation">
        <nb-swatch value="navy" label="Navy" color="#1f2a44" />
        <nb-swatch value="sand" label="Sand" color="#d8c6a5" />
      </nb-swatch-group>
      <nb-validation-errors [for]="validation" />
    </div>
  `,
    styleUrl: './swatch.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbSwatchModule, NbValidationModule, FormField]
})
class SignalHostComponent {
    readonly model = signal<{ colour: string | null }>({ colour: null })
    readonly order = form(this.model, (path) => required(path.colour))
    value = () => this.model().colour
}

describe('nb-swatch-group in forms', () => {
    const hosts = [
        ['reactive', ReactiveHostComponent],
        ['template-driven', TemplateHostComponent],
        ['signal', SignalHostComponent]
    ] as const

    for (const [name, host] of hosts) {
        it(`should require a choice, and take it, in ${name} forms`, async () => {
            TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot(), host] })
            const fixture = TestBed.createComponent<{ value: () => string | null }>(host)
            document.body.appendChild(fixture.nativeElement)
            const render = async () => {
                fixture.detectChanges()
                await fixture.whenStable()
                fixture.detectChanges()
            }
            await render()
            const group = fixture.nativeElement.querySelector('nb-swatch-group') as HTMLElement
            const buttons = Array.from(fixture.nativeElement.querySelectorAll('nb-swatch .swatch')) as HTMLButtonElement[]
            const errors = () => (fixture.nativeElement.querySelector('nb-validation-errors') as HTMLElement).textContent?.trim()

            // Leaving it without a choice shows the error.
            buttons[0].focus()
            buttons[0].blur()
            await render()
            expect(group.getAttribute('aria-invalid')).toBe('true')
            expect(errors()).not.toBe('')

            await userEvent.click(buttons[1])
            await render()
            expect(fixture.componentInstance.value()).toBe('sand')
            expect(group.getAttribute('aria-invalid')).not.toBe('true')
            expect(errors()).toBe('')
            fixture.destroy()
        })
    }
})

interface Colour {
    id: string
    name: string
}

@Component({
    template: `
    <div class="nb-theme-default">
      <nb-swatch-group aria-label="Colours" [multiple]="multiple" [compareWith]="sameColour" [formControl]="control">
        @for (colour of colours; track colour.id) {
        <nb-swatch [value]="colour" [label]="colour.name" color="#888888" />
        }
      </nb-swatch-group>
    </div>
  `,
    styleUrl: './swatch.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbSwatchModule, ReactiveFormsModule]
})
class RestoreHostComponent {
    multiple = true
    readonly colours: Colour[] = [{ id: 'navy', name: 'Navy' }, { id: 'sand', name: 'Sand' }, { id: 'red', name: 'Red' }]
    // Restored from storage: equal to the swatches' values, not the same objects.
    readonly control = new FormControl<Colour[] | Colour | null>([{ id: 'red', name: 'Red' }, { id: 'navy', name: 'Navy' }])
    readonly sameColour = (a: Colour, b: Colour) => a.id === b.id
}

describe('nb-swatch-group restoring a value', () => {
    async function render(change?: (host: RestoreHostComponent) => void) {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot(), RestoreHostComponent] })
        const fixture = TestBed.createComponent(RestoreHostComponent)
        change?.(fixture.componentInstance)
        document.body.appendChild(fixture.nativeElement)
        fixture.detectChanges()
        await fixture.whenStable()
        const pressed = () => (Array.from(fixture.nativeElement.querySelectorAll('nb-swatch .swatch')) as HTMLButtonElement[]).map((button) => button.getAttribute(fixture.componentInstance.multiple ? 'aria-pressed' : 'aria-checked'))
        return { fixture, pressed, buttons: () => Array.from(fixture.nativeElement.querySelectorAll('nb-swatch .swatch')) as HTMLButtonElement[] }
    }

    it('should choose the swatches the form\'s value holds when it starts, matched by compareWith', async () => {
        const { fixture, pressed } = await render()
        expect(pressed()).toEqual(['true', 'false', 'true'])
        fixture.destroy()
    })

    it('should follow the form as it\'s set and reset, and add to what it restored', async () => {
        const { fixture, pressed, buttons } = await render()
        const control = fixture.componentInstance.control
        control.setValue([{ id: 'sand', name: 'Sand' }])
        fixture.detectChanges()
        expect(pressed()).toEqual(['false', 'true', 'false'])
        await userEvent.click(buttons()[2])
        expect((control.value as Colour[]).map((colour) => colour.id)).toEqual(['sand', 'red'])
        control.reset([{ id: 'navy', name: 'Navy' }, { id: 'red', name: 'Red' }])
        fixture.detectChanges()
        expect(pressed()).toEqual(['true', 'false', 'true'])
        control.setValue(null)
        fixture.detectChanges()
        expect(pressed()).toEqual(['false', 'false', 'false'])
        fixture.destroy()
    })

    it('should restore a single choice, and unchoose what the form clears', async () => {
        const { fixture, pressed, buttons } = await render((host) => {
            host.multiple = false
            host.control.setValue({ id: 'sand', name: 'Sand' })
        })
        expect(pressed()).toEqual(['false', 'true', 'false'])
        expect(buttons()[1].tabIndex).toBe(0)
        await userEvent.click(buttons()[0])
        expect((fixture.componentInstance.control.value as Colour).id).toBe('navy')
        fixture.componentInstance.control.setValue(null)
        fixture.detectChanges()
        expect(pressed()).toEqual(['false', 'false', 'false'])
        fixture.destroy()
    })
})
