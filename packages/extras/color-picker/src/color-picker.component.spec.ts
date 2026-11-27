import { Component, Provider, signal, ViewEncapsulation } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { form, FormField } from '@angular/forms/signals'
import { userEvent } from 'vitest/browser'

import {
    NbComponentSize,
    NbComponentStatus,
    NbInputModule,
    NbThemeModule,
    NbValidationModule,
    provideNbComponentDefaults,
    provideNbTexts
} from '@liquid-js/lyr-core'
import { NbColorPickerComponent } from '@liquid-js/lyr-extras/color-picker'

@Component({
    // The theme applies in an element with its class.
    template: `
    <div class="nb-theme-default" dir="ltr">
      <!-- Above the field, so the dialog doesn't cover it. -->
      <button class="after">After</button>
      <nb-color-picker
        [formControl]="color"
        [size]="size()"
        [clearable]="clearable()"
        [presets]="presets()"
        [ghost]="ghost()"
        [status]="status()"
        [readonly]="readonly()"
        outputFormat="hex"
        nbValidation
        #validation="nbValidation"
      />
      <nb-validation-errors [for]="validation" />
      <!-- The input the dialog's inputs are compared with. -->
      <input nbInput class="reference" aria-label="Reference" />
    </div>
  `,
    styleUrl: '../../styles/spec-theme.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbColorPickerComponent, NbInputModule, ReactiveFormsModule, NbValidationModule]
})
class ColorPickerHostComponent {
    readonly color = new FormControl<string | null>('#3366ff')
    readonly size = signal<NbComponentSize | undefined>('medium')
    readonly clearable = signal(true)
    readonly presets = signal<string[] | undefined>(undefined)
    readonly ghost = signal(false)
    readonly status = signal<NbComponentStatus | 'control'>('basic')
    readonly readonly = signal(false)
}

describe('NbColorPickerComponent', () => {
    let fixture: ComponentFixture<ColorPickerHostComponent>
    let host: ColorPickerHostComponent
    let field: HTMLInputElement

    const element = (selector: string) => fixture.nativeElement.querySelector(selector) as HTMLElement
    const render = async () => {
        fixture.detectChanges()
        await fixture.whenStable()
    }
    const dialog = () => document.querySelector('.color-picker') as HTMLElement | null
    const clearButton = () => fixture.nativeElement.querySelector('button[nbSuffix]') as HTMLButtonElement | null
    const errors = () => element('nb-validation-errors').textContent?.trim()
    const swatch = () =>
        getComputedStyle(element('.swatch > span')).getPropertyValue('--nb-color-picker-swatch').replace(/\s/g, '')
    /** Replaces the text, as the user would type it. */
    const retype = async (text: string) => {
        await userEvent.fill(field, text)
        await render()
    }
    /** Opens the dialog as the user does, by the field, which opens it shortly after it has focus. */
    const openDialog = async () => {
        await userEvent.click(field)
        await expect.poll(dialog).toBeTruthy()
        await render()
    }
    const leave = async () => {
        await userEvent.click(element('.after'))
        await render()
    }

    const create = async (providers: Provider[] = []) => {
    // The dialog is in the overlay container, at the end of the document.
        document.body.classList.add('nb-theme-default')
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()], providers })
        fixture = TestBed.createComponent(ColorPickerHostComponent)
        host = fixture.componentInstance
        await render()
        field = element('input') as HTMLInputElement
    }

    afterEach(() => {
        fixture.destroy()
        document.body.classList.remove('nb-theme-default')
        document.querySelectorAll('.cdk-overlay-container').forEach((container) => container.remove())
    })

    it('should take the app\'s defaults for fields, as nbInput does, its clear button the field\'s size', async () => {
        await create([provideNbComponentDefaults({ input: { size: 'large', shape: 'round' } })])
        host.size.set(undefined)
        await render()
        expect(field.classList).toContain('size-large')
        expect(field.classList).toContain('shape-round')
        expect(clearButton()?.classList).toContain('size-large')
    })

    it('should be read-only as a field is: no dialog, no clear button, the text not changed', async () => {
        await create()
        host.readonly.set(true)
        await render()
        expect(field.readOnly).toBe(true)
        expect(clearButton()).toBeNull()

        await userEvent.click(field)
        await new Promise((resolve) => setTimeout(resolve, 300))
        expect(dialog()).toBeNull()
    })

    it('should show the form value in the field and the swatch', async () => {
        await create()
        expect(field.value).toBe('#3366ff')
        expect(swatch()).toBe('rgb(51,102,255)')

        host.color.setValue('#00d68f')
        await render()
        expect(field.value).toBe('#00d68f')
        expect(swatch()).toBe('rgb(0,214,143)')
    })

    it('should show the colour over a checkerboard, so transparency shows, and nothing without one', async () => {
        await create()
        const dot = element('.swatch > span')
        host.color.setValue('rgba(255, 61, 113, 0.5)')
        await render()
        expect(swatch()).toBe('rgba(255,61,113,0.50)')
        expect(getComputedStyle(dot).backgroundImage).toContain('conic-gradient')

        host.color.setValue(null)
        await render()
        expect(getComputedStyle(dot).backgroundImage).toBe('none')
    })

    it('should take a typed colour, and show it in the value format once the field is left', async () => {
        await create()
        await retype('rgb(255, 61, 113)')

        expect(host.color.value).toBe('#ff3d71')
        expect(swatch()).toBe('rgb(255,61,113)')
        // What the user typed stays while they type.
        expect(field.value).toBe('rgb(255, 61, 113)')

        await leave()
        expect(field.value).toBe('#ff3d71')
        expect(host.color.touched).toBe(true)
    })

    it('should keep the value for text that isn\'t a colour, with a parse error', async () => {
        await create()
        // Before the dialog first opens, e.g. text the browser fills in.
        field.value = 'blue-ish'
        field.dispatchEvent(new Event('input'))
        await render()
        expect(dialog()).toBeNull()
        expect(host.color.value).toBe('#3366ff')
        expect(host.color.errors).toEqual({ nbColorPicker: { kind: 'nbColorPicker', message: 'Enter a valid color' } })

        // With the dialog open, as the user opens it.
        await openDialog()
        await retype('#12345')
        expect(dialog()).toBeTruthy()
        expect(host.color.value).toBe('#3366ff')

        // The text stays, so the user can correct it, and the field shows the error.
        await leave()
        expect(field.value).toBe('#12345')
        expect(errors()).toBe('Enter a valid color')
        expect(field.getAttribute('aria-invalid')).toBe('true')
        expect(field.classList).toContain('status-danger')

        await retype('#00d68f')
        expect(host.color.value).toBe('#00d68f')
        expect(host.color.errors).toBeNull()
    })

    it('should clear the colour when the text is emptied, unless it isn\'t clearable', async () => {
        await create()
        await retype('')
        expect(host.color.value).toBeNull()
        expect(host.color.errors).toBeNull()

        host.color.setValue('#3366ff')
        host.clearable.set(false)
        await render()
        await retype('')
        expect(host.color.value).toBe('#3366ff')
        expect(host.color.errors?.['nbColorPicker']).toBeTruthy()
    })

    it('should clear the colour with a labelled button, shown while there is one', async () => {
        await create([provideNbTexts({ colorPicker: { clear: 'Remove the color' } })])
        expect(clearButton()?.getAttribute('aria-label')).toBe('Remove the color')

        clearButton()?.click()
        await render()
        expect(host.color.value).toBeNull()
        expect(field.value).toBe('')
        expect(clearButton()).toBeNull()

        host.color.setValue('#3366ff')
        host.clearable.set(false)
        await render()
        expect(clearButton()).toBeNull()
    })

    it('should follow the form when it is disabled, without the clear button', async () => {
        await create()
        host.color.disable()
        await render()

        expect(field.disabled).toBe(true)
        expect(clearButton()).toBeNull()

        field.dispatchEvent(new Event('focus'))
        await render()
        expect(dialog()).toBeNull()
    })

    it('should be named and sized like a field', async () => {
        await create()
        expect(field.getAttribute('aria-label')).toBe('Color')
        expect(field.getAttribute('aria-haspopup')).toBe('dialog')

        host.size.set('large')
        await render()
        expect(field.classList).toContain('size-large')
    })

    it('should have the ghost look, and a white clear button on colour', async () => {
        await create()
        expect(field.classList).not.toContain('input-ghost')
        expect(clearButton()?.classList).toContain('status-basic')

        host.ghost.set(true)
        host.status.set('control')
        await render()
        expect(field.classList).toContain('input-ghost')
        expect(field.classList).toContain('status-control')
        expect(clearButton()?.classList).toContain('status-control')
    })

    it('should open a dialog in the colours of the theme, with the texts of the app', async () => {
        await create([provideNbTexts({ colorPicker: { presetColors: 'Brand colors', ok: 'Apply' } })])
        host.presets.set(['#3366ff', '#00d68f'])
        await render()
        await openDialog()

        const picker = dialog() as HTMLElement
        expect(picker.querySelector('.color-picker__preset-label')?.textContent?.trim()).toBe('Brand colors')

        const input = picker.querySelector('input') as HTMLInputElement
        const theme = (variable: string) => {
            const probe = document.createElement('span')
            probe.style.color = `var(--${variable})`
            document.body.appendChild(probe)
            const color = getComputedStyle(probe).color
            probe.remove()
            return color
        }
        // The colours of a field at rest.
        const reference = getComputedStyle(element('input.reference'))
        expect(getComputedStyle(input).backgroundColor).toBe(reference.backgroundColor)
        expect(getComputedStyle(input).borderTopColor).toBe(reference.borderTopColor)
        // Framed in its own theme variables, which follow the date picker's.
        const frame = getComputedStyle(picker.closest('nb-color-picker-dialog') as HTMLElement)
        expect(frame.backgroundColor).toBe(theme('color-picker-background-color'))
        expect(frame.borderTopColor).toBe(theme('color-picker-border-color'))
        expect(getComputedStyle(picker).color).toBe(theme('text-basic-color'))
    })

    it('should open the dialog below the field, which says it has one and whether it\'s open', async () => {
        await create()
        expect(field.getAttribute('aria-haspopup')).toBe('dialog')
        expect(field.getAttribute('aria-expanded')).toBe('false')

        await openDialog()
        expect(field.getAttribute('aria-expanded')).toBe('true')
        expect(field.getAttribute('aria-controls')).toBe(dialog()?.closest('[id]')?.id)
        const frame = (dialog() as HTMLElement).closest('nb-color-picker-dialog') as HTMLElement
        expect(frame.getBoundingClientRect().top).toBeGreaterThan(field.getBoundingClientRect().bottom)
        expect(dialog()?.getAttribute('role')).toBe('dialog')

        await leave()
        expect(dialog()).toBeNull()
        expect(field.getAttribute('aria-expanded')).toBe('false')
        expect(host.color.touched).toBe(true)
    })

    it('should move into the dialog with Arrow Down, and close it with Escape, keeping the colour', async () => {
        await create()
        host.presets.set(['#3366ff', '#00d68f'])
        await render()
        field.focus()
        await userEvent.keyboard('{ArrowDown}')
        await expect.poll(() => dialog()?.contains(document.activeElement)).toBe(true);

        (dialog()?.querySelectorAll('.color-picker__preset-item')[1] as HTMLElement).click()
        await render()
        expect(host.color.value).toBe('#00d68f')

        await userEvent.keyboard('{Escape}')
        await render()
        expect(dialog()).toBeNull()
        expect(document.activeElement).toBe(field)
        expect(host.color.value).toBe('#00d68f')
        expect(field.value).toBe('#00d68f')
    })

    it('should keep the colour with Enter in the dialog, and return to the field', async () => {
        await create()
        host.presets.set(['#3366ff', '#00d68f'])
        await render()
        field.focus()
        await userEvent.keyboard('{ArrowDown}')
        await expect.poll(() => dialog()?.contains(document.activeElement)).toBe(true)

        const preset = dialog()?.querySelectorAll<HTMLElement>('.color-picker__preset-item')[1] as HTMLElement
        preset.focus()
        await userEvent.keyboard('{Enter}')
        await render()
        expect(dialog()).toBeNull()
        expect(document.activeElement).toBe(field)
        expect(host.color.value).toBe('#00d68f')
    })

    it('should show a colour picked in the colours in the field, which keeps focus', async () => {
        await create()
        await openDialog()
        const colors = dialog()?.querySelector('.color-picker__sv') as HTMLElement
        await userEvent.click(colors, { position: { x: 30, y: 30 } })
        await render()
        expect(document.activeElement).toBe(field)
        expect(host.color.value).not.toBe('#3366ff')
        expect(field.value).toBe(host.color.value)
    })

    it('should take a typed colour without transparency, which the value\'s format has none of', async () => {
        await create()
        await retype('#00d68f80')
        expect(host.color.value).toBe('#00d68f')
        await retype('rgb(0, 214, 143)')
        expect(host.color.value).toBe('#00d68f')
    })

    it('should give the form a colour picked in the dialog, and touch it when the dialog closes', async () => {
        await create()
        host.presets.set(['#3366ff', '#00d68f'])
        await render()
        await openDialog();

        (dialog()?.querySelectorAll('.color-picker__preset-item')[1] as HTMLElement).click()
        await render()
        expect(host.color.value).toBe('#00d68f')

        await userEvent.keyboard('{Escape}')
        await leave()
        expect(host.color.touched).toBe(true)
    })
})

@Component({
    template: `
    <div class="nb-theme-default">
      <button class="after">After</button>
      <form>
        <nb-color-picker name="color" [(ngModel)]="color" nbValidation #validation="nbValidation" />
        <nb-validation-errors [for]="validation" />
      </form>
    </div>
  `,
    styleUrl: '../../styles/spec-theme.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbColorPickerComponent, FormsModule, NbValidationModule]
})
class TemplateDrivenHostComponent {
    color: string | null = '#3366ff'
}

@Component({
    template: `
    <div class="nb-theme-default">
      <button class="after">After</button>
      <nb-color-picker [formField]="brand.color" nbValidation #validation="nbValidation" />
      <nb-validation-errors [for]="validation" />
    </div>
  `,
    styleUrl: '../../styles/spec-theme.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbColorPickerComponent, FormField, NbValidationModule]
})
class SignalFormsHostComponent {
    readonly model = signal<{ color: string | null }>({ color: '#3366ff' })
    readonly brand = form(this.model)
}

describe('NbColorPickerComponent in other forms', () => {
    let fixture: ComponentFixture<unknown>

    const render = async () => {
        fixture.detectChanges()
        await fixture.whenStable()
    }
    const field = () => fixture.nativeElement.querySelector('nb-color-picker input') as HTMLInputElement
    const errors = () => (fixture.nativeElement.querySelector('nb-validation-errors') as HTMLElement).textContent?.trim()
    const retype = async (text: string) => {
        await userEvent.fill(field(), text)
        await userEvent.click(fixture.nativeElement.querySelector('.after'))
        await render()
    }

    const create = async (host: new () => unknown) => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] })
        fixture = TestBed.createComponent(host)
        await render()
        await render()
    }

    afterEach(() => {
        fixture.destroy()
        document.querySelectorAll('.cdk-overlay-container').forEach((container) => container.remove())
    })

    it('should work with ngModel', async () => {
        await create(TemplateDrivenHostComponent)
        const host = fixture.componentInstance as TemplateDrivenHostComponent
        expect(field().value).toBe('#3366ff')

        await retype('#12345')
        expect(host.color).toBe('#3366ff')
        expect(errors()).toBe('Enter a valid color')

        await retype('#00d68f')
        expect(host.color).toBe('#00d68f')
        expect(errors()).toBe('')
    })

    it('should work with signal forms', async () => {
        await create(SignalFormsHostComponent)
        const host = fixture.componentInstance as SignalFormsHostComponent
        expect(field().value).toBe('#3366ff')

        await retype('#12345')
        expect(host.model().color).toBe('#3366ff')
        expect(host.brand.color().errors().map((error) => error.kind)).toEqual(['nbColorPicker'])
        expect(errors()).toBe('Enter a valid color')

        await retype('#00d68f')
        expect(host.model().color).toBe('#00d68f')
        expect(host.brand.color().valid()).toBe(true)
        expect(errors()).toBe('')
    })
})
