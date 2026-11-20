import { ComponentFixture, TestBed } from '@angular/core/testing'
import { DatePipe } from '@angular/common'
import { NbCalendarDaysNamesComponent, NbDateService, NbNativeDateService } from '@liquid-js/lyr-core'

describe('Component: NbCalendarDaysNames', () => {
    let fixture: ComponentFixture<NbCalendarDaysNamesComponent<Date>>
    let componentEl: HTMLElement

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NbCalendarDaysNamesComponent],
            providers: [{ provide: NbDateService, useClass: NbNativeDateService }, DatePipe]
        })
        fixture = TestBed.createComponent<NbCalendarDaysNamesComponent<Date>>(NbCalendarDaysNamesComponent)
        componentEl = fixture.debugElement.nativeElement
        fixture.detectChanges()
    })

    it('should render seven days', () => {
        const days = componentEl.querySelectorAll('div')
        expect(days.length).toBe(7)
    })

    it('should render two holidays', () => {
        const days = componentEl.querySelectorAll('.holiday')
        expect(days.length).toBe(2)
    })

    it('should contain narrow names', () => {
        const days = componentEl.querySelectorAll('div')
        days.forEach((day) => {
            expect(day.textContent.length).toBe(2)
        })
    })
})

describe('Component: NbCalendarDaysNames with a locale weekend', () => {
    it('should mark the weekend days of the locale', () => {
        TestBed.configureTestingModule({
            imports: [NbCalendarDaysNamesComponent],
            providers: [{ provide: NbDateService, useClass: NbNativeDateService }, DatePipe]
        })
        // Friday and Saturday, e.g. in Israel
        vi.spyOn(TestBed.inject(NbDateService), 'getWeekendDays').mockReturnValue([5, 6])
        const fixture = TestBed.createComponent<NbCalendarDaysNamesComponent<Date>>(NbCalendarDaysNamesComponent)
        fixture.componentRef.setInput('firstDayOfWeek', 0)
        fixture.detectChanges()

        const days: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('.day'))
        const holidays = days.map((day) => day.classList.contains('holiday'))
        expect(holidays).toEqual([false, false, false, false, false, true, true])
    })
})

describe('NbDateService.getWeekendDays', () => {
    const weekendOf = (locale: string) => {
        const dateService = TestBed.runInInjectionContext(() => new NbNativeDateService())
        dateService.setLocale(locale)
        return dateService.getWeekendDays().sort()
    }

    it('should return the weekend of the locale', () => {
        expect(weekendOf('en-US')).toEqual([0, 6])
        expect(weekendOf('he-IL')).toEqual([5, 6])
    })

    it('should fall back to Saturday and Sunday for an invalid locale', () => {
        expect(weekendOf('not a locale')).toEqual([0, 6])
    })
})
