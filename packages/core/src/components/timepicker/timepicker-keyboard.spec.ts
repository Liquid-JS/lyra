import { Component } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormControl, ReactiveFormsModule } from '@angular/forms'

import { NbThemeModule, NbTimepickerModule } from '@liquid-js/lyr-core'

@Component({
    template: `
    <input [formControl]="control" [nbTimepicker]="timepicker" />
    <nb-timepicker #timepicker />
  `,
    imports: [ReactiveFormsModule, NbTimepickerModule]
})
class TimepickerHostComponent {
    readonly control = new FormControl<Date | null>(new Date(2026, 0, 15, 10, 30))
}

const press = (element: Element, key: string) =>
    element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))

describe('nbTimepicker by keyboard', () => {
    let fixture: ComponentFixture<TimepickerHostComponent>

    const field = () => fixture.nativeElement.querySelector('input') as HTMLInputElement
    const dialog = () => document.querySelector<HTMLElement>('.cdk-overlay-pane[role="dialog"]')
    const columns = () => [...(dialog()?.querySelectorAll<HTMLElement>('[role="listbox"]') ?? [])]
    const focused = () => document.activeElement as HTMLElement
    const render = async () => {
        fixture.detectChanges()
        await fixture.whenStable()
        fixture.detectChanges()
    }

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbTimepickerModule.forRoot(), TimepickerHostComponent]
        })
        fixture = TestBed.createComponent(TimepickerHostComponent)
        document.body.appendChild(fixture.nativeElement)
        await render()
    })

    afterEach(() => {
        fixture.destroy()
        document.querySelectorAll('.cdk-overlay-container').forEach((container) => container.remove())
    })

    it('should open a named dialog from the field with Arrow Down, with focus on the selected hour', async () => {
        expect(field().getAttribute('aria-haspopup')).toBe('dialog')
        expect(field().getAttribute('aria-expanded')).toBe('false')
        press(field(), 'ArrowDown')
        await render()
        await render()

        expect(dialog()?.getAttribute('aria-label')).toBe('Choose a time')
        expect(field().getAttribute('aria-expanded')).toBe('true')
        expect(field().getAttribute('aria-controls')).toBe(dialog()?.id)
        expect(columns().map((column) => column.getAttribute('aria-label'))).toEqual(['Hr', 'Min'])
        expect(focused().getAttribute('role')).toBe('option')
        expect(focused().getAttribute('aria-selected')).toBe('true')
        expect(focused().textContent?.trim()).toBe('10')
    })

    it('should move in a column with the arrow keys, and pick with Enter', async () => {
        press(field(), 'ArrowDown')
        await render()
        await render()

        press(focused(), 'ArrowDown')
        expect(focused().textContent?.trim()).toBe('11')
        expect(fixture.componentInstance.control.value?.getHours()).toBe(10)
        press(focused(), 'Enter')
        await render()
        expect(fixture.componentInstance.control.value?.getHours()).toBe(11)
        expect(focused().getAttribute('aria-selected')).toBe('true')

        press(focused(), 'Home')
        expect(focused().textContent?.trim()).toBe('00')
        press(focused(), 'End')
        expect(focused().textContent?.trim()).toBe('23')
    })

    it('should reach each column with Tab, at its selected time', async () => {
        const tabbable = (column: HTMLElement) => [...column.querySelectorAll('[role="option"][tabindex="0"]')]
        press(field(), 'ArrowDown')
        await render()
        await render()

        const [hours, minutes] = columns()
        expect(tabbable(hours).map((cell) => cell.textContent?.trim())).toEqual(['10'])
        expect(tabbable(minutes).map((cell) => cell.textContent?.trim())).toEqual(['30'])
    })

    it('should close with Escape, keeping the time, back to the field, and only the time picker', async () => {
        press(field(), 'ArrowDown')
        await render()
        await render()
        press(focused(), 'ArrowDown')
        press(focused(), 'Enter')
        await render()

        const handled = !press(focused(), 'Escape')
        await render()
        expect(handled).toBe(true)
        expect(dialog()).toBeNull()
        expect(focused()).toBe(field())
        expect(field().getAttribute('aria-expanded')).toBe('false')
        expect(fixture.componentInstance.control.value?.getHours()).toBe(11)

        // From the field, too, while it's open.
        press(field(), 'ArrowDown')
        await render()
        expect(!press(field(), 'Escape')).toBe(true)
        await render()
        expect(dialog()).toBeNull()
    })
})
