import { Component, signal, ViewEncapsulation } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import {
    NbComponentOrCustomStatus,
    NbComponentSize,
    NbFormFieldModule,
    NbInputModule,
    NbSelectModule,
    NbThemeModule
} from '@liquid-js/lyr-core'

@Component({
    // The theme applies in an element with its class.
    template: `
    <div class="nb-theme-default">
    <nb-form-field class="icon">
      <span nbPrefix class="icon-box"></span>
      <input nbInput />
    </nb-form-field>
    <nb-form-field class="text">
      <input nbInput />
      @if (showUnit()) {
        <span nbSuffix>{{ unit() }}</span>
      }
    </nb-form-field>
    </div>
  `,
    styleUrl: './form-field.component.spec.scss',
    // As big as a medium addon's icon.
    styles: '.icon-box { display: block; width: 1.25rem; height: 1.25rem; }',
    encapsulation: ViewEncapsulation.None,
    imports: [NbFormFieldModule, NbInputModule]
})
class FormFieldHostComponent {
    readonly unit = signal('deg')
    readonly showUnit = signal(true)
}

describe('NbFormFieldComponent', () => {
    let fixture: ComponentFixture<FormFieldHostComponent>

    // Addon widths are measured with a ResizeObserver, which reports before the next paint.
    const render = async () => {
        fixture.detectChanges()
        await fixture.whenStable()
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    }
    const field = (name: string) => fixture.nativeElement.querySelector(`nb-form-field.${name}`) as HTMLElement
    const addon = (name: string) => field(name).querySelector('.nb-form-field-addon') as HTMLElement
    const input = (name: string) => field(name).querySelector('input') as HTMLInputElement
    const width = (element: HTMLElement) => element.getBoundingClientRect().width

    beforeEach(async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] })
        fixture = TestBed.createComponent(FormFieldHostComponent)
        await render()
    })

    it('should keep an icon addon square, and pad the input by its width', () => {
        const icon = addon('icon')

        // form-field-addon-medium-width and height.
        expect(width(icon)).toBe(40)
        expect(icon.getBoundingClientRect().height).toBe(40)
        expect(parseFloat(getComputedStyle(input('icon')).paddingInlineStart)).toBeCloseTo(width(icon), 1)
    })

    it('should grow an addon to fit its text, and pad the input by its width', async () => {
        fixture.componentInstance.unit.set('degrees Celsius')
        await render()
        const text = addon('text')

        expect(width(text)).toBeGreaterThan(width(addon('icon')) * 2)
        expect(parseFloat(getComputedStyle(input('text')).paddingInlineEnd)).toBeCloseTo(width(text), 1)
        // The addon overlaps the input's padding, inside its border.
        expect(text.getBoundingClientRect().right).toBeCloseTo(input('text').getBoundingClientRect().right, 1)
    })

    it('should follow the addon as its text changes', async () => {
        const before = width(addon('text'))
        fixture.componentInstance.unit.set('%')
        await render()

        expect(width(addon('text'))).toBeLessThan(before)
        expect(parseFloat(getComputedStyle(input('text')).paddingInlineEnd)).toBeCloseTo(width(addon('text')), 1)
    })

    it('should drop the padding with the addon', async () => {
        fixture.componentInstance.showUnit.set(false)
        await render()

        expect(addon('text')).toBeNull()
        expect(field('text').style.getPropertyValue('--nb-form-field-suffix-width')).toBe('')
        expect(parseFloat(getComputedStyle(input('text')).paddingInlineEnd)).toBe(
            parseFloat(getComputedStyle(input('text')).paddingInlineStart)
        )
    })
})

@Component({
    template: `
    <div class="nb-theme-default">
    @if (shown()) {
      <nb-form-field class="leaving" animate.leave="nb-form-field-spec-leave">
        <span nbPrefix class="wide-box"></span>
        <input nbInput />
      </nb-form-field>
    }
    </div>
  `,
    styleUrl: './form-field.component.spec.scss',
    styles: `
    .wide-box { display: block; width: 4rem; height: 1.25rem; }
    .nb-form-field-spec-leave { animation: nb-form-field-spec-hold 1s; }
    @keyframes nb-form-field-spec-hold { to { opacity: 1; } }
  `,
    encapsulation: ViewEncapsulation.None,
    imports: [NbFormFieldModule, NbInputModule]
})
class FormFieldLeavingHostComponent {
    readonly shown = signal(true)
}

describe('NbFormFieldComponent leaving', () => {
    it('should keep padding the control by its addon while it leaves with an animation', async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()], animationsEnabled: true })
        const fixture = TestBed.createComponent(FormFieldLeavingHostComponent)
        fixture.detectChanges()
        await fixture.whenStable()
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
        const field = fixture.nativeElement.querySelector('nb-form-field.leaving') as HTMLElement
        const padding = () => parseFloat(getComputedStyle(field.querySelector('input') as HTMLInputElement).paddingInlineStart)
        const before = padding()
        expect(before).toBeGreaterThan(60)

        fixture.componentInstance.shown.set(false)
        fixture.detectChanges()

        expect(field.isConnected).toBe(true)
        expect(padding()).toBe(before)
    })
})

@Component({
    template: `
    <nb-form-field class="state">
      <span nbPrefix>@</span>
      <input nbInput [status]="status()" [fieldSize]="size()" [fullWidth]="fullWidth()" [disabled]="disabled()" />
    </nb-form-field>
    <nb-form-field class="select">
      <span nbPrefix>P</span>
      <nb-select>
        <nb-option value="a">A</nb-option>
      </nb-select>
      <span nbSuffix>S</span>
    </nb-form-field>
  `,
    imports: [NbFormFieldModule, NbInputModule, NbSelectModule]
})
class FormFieldStateHostComponent {
    readonly status = signal<NbComponentOrCustomStatus>('basic')
    readonly size = signal<NbComponentSize>('medium')
    readonly fullWidth = signal(false)
    readonly disabled = signal(false)
}

describe('NbFormFieldComponent state', () => {
    let fixture: ComponentFixture<FormFieldStateHostComponent>
    const field = (name: string) => fixture.nativeElement.querySelector(`nb-form-field.${name}`) as HTMLElement
    const addon = () => field('state').querySelector('.nb-form-field-addon') as HTMLElement

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] })
        fixture = TestBed.createComponent(FormFieldStateHostComponent)
        document.body.appendChild(fixture.nativeElement)
        fixture.detectChanges()
    })

    afterEach(() => fixture.destroy())

    it("should size the field and its addon by the control's size", () => {
        expect(field('state').classList).toContain('nb-form-field-size-medium')
        expect(addon().classList).toContain('nb-form-field-prefix-medium')

        fixture.componentInstance.size.set('large')
        fixture.detectChanges()

        expect(field('state').classList).toContain('nb-form-field-size-large')
        expect(field('state').classList).not.toContain('nb-form-field-size-medium')
        expect(addon().classList).toContain('nb-form-field-prefix-large')
    })

    it('should limit its width unless the control is full width', () => {
        expect(field('state').classList).toContain('nb-form-field-limited-width')

        fixture.componentInstance.fullWidth.set(true)
        fixture.detectChanges()

        expect(field('state').classList).not.toContain('nb-form-field-limited-width')
    })

    it("should colour the addon by the control's status, highlighted while it has focus", async () => {
        fixture.componentInstance.status.set('danger')
        fixture.detectChanges()
        expect(addon().classList).toContain('nb-form-field-addon-danger')

        field('state').querySelector('input')?.focus()
        await fixture.whenStable()
        fixture.detectChanges()

        expect(addon().classList).toContain('nb-form-field-addon-danger-highlight')
        expect(addon().classList).not.toContain('nb-form-field-addon-danger')
    })

    it('should show a disabled addon for a disabled control, focused or not', () => {
        fixture.componentInstance.status.set('danger')
        fixture.componentInstance.disabled.set(true)
        fixture.detectChanges()
        // The control reads its disabled state on the next check.
        fixture.detectChanges()

        expect(addon().classList).toContain('nb-form-field-addon-disabled')
        expect(addon().classList).not.toContain('nb-form-field-addon-danger')
    })

    it('should leave out the addons a control does not take', () => {
    // A select takes a prefix, but its arrow is at its end.
        const select = field('select')
        expect(select.querySelectorAll('.nb-form-field-addon').length).toBe(1)
        expect(select.querySelector('.nb-form-field-addon')?.textContent?.trim()).toBe('P')
        expect(select.querySelector('.nb-form-field-control-with-suffix')).toBeNull()
    })
})

@Component({
    template: '<nb-form-field><span>No control</span></nb-form-field>',
    imports: [NbFormFieldModule]
})
class FormFieldWithoutControlComponent {}

describe('NbFormFieldComponent without a control', () => {
    it('should say it needs one', () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] })
        const fixture = TestBed.createComponent(FormFieldWithoutControlComponent)

        expect(() => fixture.detectChanges()).toThrow(/must contain \[nbInput\]/)
    })
})
