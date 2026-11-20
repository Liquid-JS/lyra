import { Component, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormControl, ReactiveFormsModule } from '@angular/forms'

import { NbThemeModule, NbTimepickerModule } from '@liquid-js/lyr-core'

const time = (hours: number, minutes: number) => new Date(2026, 0, 15, hours, minutes)

@Component({
    template: `
    <input class="field" [formControl]="control" [nbTimepicker]="picker" />
    <nb-timepicker #picker [twelveHoursFormat]="false" [min]="min()" [max]="max()" />
    <button class="after">After</button>
  `,
    imports: [ReactiveFormsModule, NbTimepickerModule]
})
class TimepickerHostComponent {
    readonly control = new FormControl<Date | null>(time(12, 0))
    readonly min = signal<Date | undefined>(time(9, 0))
    readonly max = signal<Date | undefined>(time(17, 30))
}

describe('nbTimepicker validation', () => {
    let fixture: ComponentFixture<TimepickerHostComponent>
    let host: TimepickerHostComponent

    const render = async () => {
        fixture.detectChanges()
        await fixture.whenStable()
    }
    const field = () => fixture.nativeElement.querySelector('.field') as HTMLInputElement
    const type = async (text: string) => {
        field().value = text
        field().dispatchEvent(new Event('input'))
        await render()
    }
    const hours = () => Array.from(document.querySelectorAll('.values-list:first-of-type .list-item')) as HTMLElement[]
    const open = async () => {
        field().focus()
        // The focus trigger shows the picker after a short delay.
        await new Promise((resolve) => setTimeout(resolve, 150))
        await render()
    }

    beforeEach(async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot(), TimepickerHostComponent] })
        fixture = TestBed.createComponent(TimepickerHostComponent)
        host = fixture.componentInstance
        document.body.appendChild(fixture.nativeElement)
        await render()
    })

    afterEach(() => {
        fixture.destroy()
        document.querySelectorAll('.cdk-overlay-container').forEach((container) => container.remove())
    })

    it('should take a typed time in range', async () => {
        await type('10:30')
        expect(host.control.value?.getHours()).toBe(10)
        expect(host.control.value?.getMinutes()).toBe(30)
        expect(host.control.errors).toBeNull()
    })

    it('should keep the last time for text that isn\'t one, with a parse error, also once it closes', async () => {
        await open()
        await type('half past')
        expect(host.control.value?.getHours()).toBe(12)
        expect(host.control.errors).toEqual({
            nbTimepickerParse: { kind: 'nbTimepickerParse', message: 'Enter a valid time', value: 'half past' }
        })

        expect(host.control.touched).toBe(false);
        (fixture.nativeElement.querySelector('.after') as HTMLElement).focus()
        await render()
        expect(field().value).toBe('half past')
        // Leaving the input and the picker touches the control, so its error shows.
        expect(host.control.touched).toBe(true)
    })

    it('should report times before min and after max, by time of day', async () => {
        await type('08:15')
        expect(host.control.value?.getHours()).toBe(8)
        expect(host.control.errors?.['nbTimepickerMin']?.message).toBe('Pick a time at or after 09:00')

        await type('17:45')
        expect(host.control.errors?.['nbTimepickerMax']?.message).toBe('Pick a time at or before 17:30')

        // The limits' day doesn't matter, only their time.
        host.min.set(new Date(2030, 5, 1, 9, 0))
        await type('09:00')
        expect(host.control.errors).toBeNull()
    })

    it('should check again when the limits change', async () => {
        await type('08:15')
        expect(host.control.errors?.['nbTimepickerMin']).toBeTruthy()
        host.min.set(time(8, 0))
        await render()
        expect(host.control.errors).toBeNull()
    })

    it('should clear the time when the input is emptied, and empty the input for no time', async () => {
        await type('')
        expect(host.control.value).toBeNull()
        expect(host.control.errors).toBeNull()

        host.control.setValue(time(11, 0))
        await render()
        expect(field().value).toBe('11:00')
        host.control.setValue(null)
        await render()
        expect(field().value).toBe('')
    })

    it('should disable the times out of range in the list, and not pick them', async () => {
        await open()
        expect(hours()[8].classList).toContain('disabled')
        expect(hours()[9].classList).not.toContain('disabled')
        expect(hours()[17].classList).not.toContain('disabled')
        expect(hours()[18].classList).toContain('disabled')
        expect(hours()[8].querySelector('nb-timepicker-cell')?.getAttribute('aria-disabled')).toBe('true');

        (hours()[8].querySelector('nb-timepicker-cell') as HTMLElement).click()
        await render()
        expect(host.control.value?.getHours()).toBe(12);

        // Picking 17:00 keeps the minutes in range; after 17:30 they're disabled.
        (hours()[17].querySelector('nb-timepicker-cell') as HTMLElement).click()
        await render()
        const minutes = Array.from(document.querySelectorAll('.values-list:nth-of-type(2) .list-item')) as HTMLElement[]
        expect(minutes[30].classList).not.toContain('disabled')
        expect(minutes[31].classList).toContain('disabled')
        expect(host.control.value?.getHours()).toBe(17)
    })
})
