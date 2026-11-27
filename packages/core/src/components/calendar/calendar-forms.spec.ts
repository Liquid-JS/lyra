import { Component, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { form, FormField, required } from '@angular/forms/signals'

import { NbCalendarModule, NbCalendarRange, NbCalendarRangeModule, NbThemeModule } from '@liquid-js/lyr-core'

@Component({
    template: `
    <nb-calendar class="reactive" [formControl]="day" />
    <nb-calendar class="template" [(ngModel)]="modelDay" />
    <nb-calendar class="signal" [formField]="dayForm.day" />
    <nb-calendar-range class="range" [formControl]="stay" />
  `,
    imports: [NbCalendarModule, NbCalendarRangeModule, ReactiveFormsModule, FormsModule, FormField]
})
class CalendarFormsHostComponent {
    readonly day = new FormControl<Date | null>(new Date(2026, 10, 9), Validators.required)
    modelDay: Date | undefined = new Date(2026, 10, 12)
    readonly dayModel = signal<{ day: Date | null }>({ day: new Date(2026, 10, 20) })
    readonly dayForm = form(this.dayModel, (path) => required(path.day))
    readonly stay = new FormControl<NbCalendarRange<Date> | null>({ start: new Date(2026, 10, 2), end: new Date(2026, 10, 5) })
}

describe('calendars in forms', () => {
    let fixture: ComponentFixture<CalendarFormsHostComponent>
    let host: CalendarFormsHostComponent

    const render = async () => {
        fixture.detectChanges()
        await fixture.whenStable()
        fixture.detectChanges()
    }
    const calendar = (name: string) => fixture.nativeElement.querySelector(`.${name}`) as HTMLElement
    const cell = (name: string, label: string) => calendar(name).querySelector(`[aria-label="${label}"]`) as HTMLElement
    const selected = (name: string) => Array.from(calendar(name).querySelectorAll('[role="gridcell"][aria-selected="true"]')).map((element) => element.getAttribute('aria-label'))

    beforeEach(async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot(), CalendarFormsHostComponent] })
        fixture = TestBed.createComponent(CalendarFormsHostComponent)
        host = fixture.componentInstance
        await render()
    })

    it('should show the value each form has when it appears', () => {
        expect(selected('reactive')).toEqual(['Monday, November 9, 2026'])
        expect(selected('template')).toEqual(['Thursday, November 12, 2026'])
        expect(selected('signal')).toEqual(['Friday, November 20, 2026'])
    })

    it('should give the form the day picked, and mark it touched', async () => {
        cell('reactive', 'Wednesday, November 18, 2026').click()
        await render()
        expect(host.day.value).toEqual(new Date(2026, 10, 18))
        expect(host.day.touched).toBe(true)

        cell('signal', 'Monday, November 23, 2026').click()
        await render()
        expect(host.dayModel().day).toEqual(new Date(2026, 10, 23))
    })

    it('should show a value the form sets or resets later', async () => {
        host.day.setValue(new Date(2026, 10, 27))
        await render()
        expect(selected('reactive')).toEqual(['Friday, November 27, 2026'])

        host.day.reset(null)
        await render()
        expect(selected('reactive')).toEqual([])
        expect(host.day.hasError('required')).toBe(true)
    })

    it('should disable every day while the form control is disabled', async () => {
        host.day.disable()
        await render()
        const days = Array.from(calendar('reactive').querySelectorAll('nb-calendar-day-cell:not(.bounding-month)'))
        expect(days.length).toBeGreaterThan(27)
        expect(days.every((day) => day.classList.contains('disabled'))).toBe(true)
        expect(calendar('reactive').getAttribute('aria-disabled')).toBe('true')

        cell('reactive', 'Wednesday, November 18, 2026').click()
        await render()
        expect(host.day.value).toEqual(new Date(2026, 10, 9))

        host.day.enable()
        await render()
        expect(calendar('reactive').querySelector('nb-calendar-day-cell.disabled:not(.bounding-month)')).toBeNull()
    })

    it('should give the form the range picked, its start and then its end', async () => {
        cell('range', 'Tuesday, November 10, 2026').click()
        await render()
        expect(host.stay.value).toEqual({ start: new Date(2026, 10, 10) })

        cell('range', 'Saturday, November 14, 2026').click()
        await render()
        expect(host.stay.value).toEqual({ start: new Date(2026, 10, 10), end: new Date(2026, 10, 14) })

        host.stay.setValue({ start: new Date(2026, 10, 16), end: new Date(2026, 10, 17) })
        await render()
        expect(selected('range')).toEqual(['Monday, November 16, 2026', 'Tuesday, November 17, 2026'])
    })
})
