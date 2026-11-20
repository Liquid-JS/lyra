import { Component, signal, ViewEncapsulation } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import {
    NbButtonModule,
    NbFormFieldModule,
    NbInputGroupModule,
    NbInputModule,
    NbSelectModule,
    NbThemeModule
} from '@liquid-js/lyr-core'

@Component({
    // The theme applies in an element with its class.
    template: `
    <div [attr.dir]="dir()" class="container nb-theme-default">
      <nb-input-group class="joined" aria-label="Price">
        <input nbInput aria-label="Amount" />
        <nb-select selected="eur" aria-label="Currency"><nb-option value="eur">EUR</nb-option></nb-select>
        <button nbButton>Convert</button>
      </nb-input-group>
      <nb-input-group class="field">
        <nb-form-field>
          <input nbInput aria-label="Password" />
          <button nbSuffix nbButton ghost class="addon">Show</button>
        </nb-form-field>
        <button nbButton class="after">Save</button>
      </nb-input-group>
      <nb-input-group class="full">
        <input nbInput fullWidth aria-label="Phone number" />
        <button nbButton>Verify</button>
      </nb-input-group>
    </div>
  `,
    styleUrl: './input-group.component.spec.scss',
    styles: '.container { width: 40rem; }',
    encapsulation: ViewEncapsulation.None,
    imports: [NbButtonModule, NbFormFieldModule, NbInputGroupModule, NbInputModule, NbSelectModule]
})
class InputGroupHostComponent {
    readonly dir = signal('ltr')
}

describe('NbInputGroupComponent', () => {
    let fixture: ComponentFixture<InputGroupHostComponent>

    const render = async () => {
        fixture.detectChanges()
        await fixture.whenStable()
    }
    const group = (name: string) => fixture.nativeElement.querySelector(`nb-input-group.${name}`) as HTMLElement
    const box = (element: Element) => element.getBoundingClientRect()
    // Whether each corner is rounded: top start, bottom start, top end, bottom end.
    const corners = (element: Element) => {
        const style = getComputedStyle(element)
        return [
            style.borderStartStartRadius,
            style.borderEndStartRadius,
            style.borderStartEndRadius,
            style.borderEndEndRadius
        ].map((radius) => parseFloat(radius) > 0)
    }
    const controls = () => {
        const joined = group('joined')
        return [joined.querySelector('input'), joined.querySelector('.select-button'), joined.querySelector('button[nbButton]')]
    }

    beforeEach(async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] })
        fixture = TestBed.createComponent(InputGroupHostComponent)
        await render()
    })

    it('should be a group', () => {
        expect(group('joined').getAttribute('role')).toBe('group')
    })

    it('should round only the outer corners of the controls', () => {
        const [input, select, button] = controls()

        expect(corners(input as Element)).toEqual([true, true, false, false])
        expect(corners(select as Element)).toEqual([false, false, false, false])
        expect(corners(button as Element)).toEqual([false, false, true, true])
    })

    it('should overlap the borders of adjacent controls', () => {
        const [input, select, button] = controls().map((control) => box(control as Element))

        expect(select.left - input.right).toBe(-1)
        expect(button.left - select.right).toBe(-1)
        expect(input.height).toBe(select.height)
        expect(button.height).toBe(input.height)
    })

    it('should mirror the corners right to left', async () => {
        fixture.componentInstance.dir.set('rtl')
        await render()
        const [input, , button] = controls()

        expect(corners(input as Element)).toEqual([true, true, false, false])
        expect(box(input as Element).left).toBeGreaterThan(box(button as Element).right)
    })

    it('should join the control in a form field, but not the buttons in its addons', () => {
        const field = group('field')

        expect(corners(field.querySelector('input') as Element)).toEqual([true, true, false, false])
        expect(corners(field.querySelector('.addon') as Element)).toEqual([true, true, true, true])
        expect(corners(field.querySelector('.after') as Element)).toEqual([false, false, true, true])
    })

    it('should raise the control with focus above its neighbours', () => {
        const [input, select] = controls();
        (select as HTMLElement).focus()

        expect(Number(getComputedStyle(group('joined').children[1]).zIndex)).toBeGreaterThan(
            Number(getComputedStyle(group('joined').children[0]).zIndex) || 0
        )
        expect(document.activeElement).not.toBe(input)
    })

    it('should be as wide as its controls, or fill its container with a full width control', () => {
        const joined = group('joined')
        const full = group('full')
        const container = box(fixture.nativeElement.querySelector('.container'))
        const [input, , button] = controls()

        expect(box(joined).width).toBeCloseTo(box(button as Element).right - box(input as Element).left, 0)
        expect(box(full).width).toBe(container.width)
        // The full width input takes what the button leaves.
        expect(box(full.querySelector('input') as Element).right - 1).toBeCloseTo(box(full.querySelector('button') as Element).left, 0)
        expect(box(full.querySelector('button') as Element).right).toBeCloseTo(container.right, 0)
    })
})
