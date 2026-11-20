import { assert } from 'vitest'
import { Component } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import {
    NbBaseCalendarComponent,
    NbCalendarComponent,
    NbCalendarModule,
    NbCalendarViewMode,
    NbCalendarYearModelService,
    NbThemeModule
} from '@liquid-js/lyr-core'

describe('NbBaseCalendarComponent', () => {
    let fixture: ComponentFixture<NbBaseCalendarComponent<Date, Date>>
    let calendarComponent: NbBaseCalendarComponent<Date, Date>

    const visibleDate = () => {
        const date = calendarComponent.visibleDate()
        assert(date, 'no visible date')
        return date
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NbCalendarModule, NbThemeModule.forRoot()]
        })

        fixture = TestBed.createComponent<NbBaseCalendarComponent<Date, Date>>(NbBaseCalendarComponent)
        calendarComponent = fixture.componentInstance
        fixture.detectChanges()
    })

    describe('navigatePrev', () => {
        it('should navigate to previous month in date view mode', () => {
            fixture.componentRef.setInput('startView', NbCalendarViewMode.DATE)
            fixture.componentRef.setInput('visibleDate', new Date(2018, 1, 1))

            calendarComponent.navigatePrev()

            expect(visibleDate().getMonth()).toBe(0)
        })

        it('should navigate to previous year in month view mode', () => {
            fixture.componentRef.setInput('startView', NbCalendarViewMode.MONTH)
            fixture.componentRef.setInput('visibleDate', new Date(2018, 0, 1))

            calendarComponent.navigatePrev()

            expect(visibleDate().getFullYear()).toBe(2017)
        })

        it('should navigate to previous years range in year view mode', () => {
            const initialDate = new Date(2018, 0, 1)
            const yearModelService: NbCalendarYearModelService<Date> = TestBed.inject(NbCalendarYearModelService)
            const expectedDate = initialDate.getFullYear() - yearModelService.getYearsInView()

            fixture.componentRef.setInput('startView', NbCalendarViewMode.YEAR)
            fixture.componentRef.setInput('visibleDate', initialDate)

            calendarComponent.navigatePrev()

            expect(visibleDate().getFullYear()).toBe(expectedDate)
        })
    })

    describe('navigateNext', () => {
        it('should navigate to next month in date view mode', () => {
            fixture.componentRef.setInput('startView', NbCalendarViewMode.DATE)
            fixture.componentRef.setInput('visibleDate', new Date(2018, 0, 1))

            calendarComponent.navigateNext()

            expect(visibleDate().getMonth()).toBe(1)
        })

        it('should navigate to next year in month view mode', () => {
            fixture.componentRef.setInput('startView', NbCalendarViewMode.MONTH)
            fixture.componentRef.setInput('visibleDate', new Date(2018, 0, 1))

            calendarComponent.navigateNext()

            expect(visibleDate().getFullYear()).toBe(2019)
        })

        it('should navigate to next years range in year view mode', () => {
            const initialDate = new Date(2018, 0, 1)
            const yearModelService: NbCalendarYearModelService<Date> = TestBed.inject(NbCalendarYearModelService)
            const expectedDate = initialDate.getFullYear() + yearModelService.getYearsInView()

            fixture.componentRef.setInput('startView', NbCalendarViewMode.YEAR)
            fixture.componentRef.setInput('visibleDate', initialDate)

            calendarComponent.navigateNext()

            expect(visibleDate().getFullYear()).toBe(expectedDate)
        })
    })

    describe('onChangeViewMode', () => {
        it('should change view mode to year in date view mode', () => {
            fixture.componentRef.setInput('startView', NbCalendarViewMode.DATE)
            calendarComponent.onChangeViewMode()
            expect(calendarComponent.activeViewMode()).toBe(NbCalendarViewMode.YEAR)
        })

        it('should change view mode to date in month view mode', () => {
            fixture.componentRef.setInput('startView', NbCalendarViewMode.MONTH)
            calendarComponent.onChangeViewMode()
            expect(calendarComponent.activeViewMode()).toBe(NbCalendarViewMode.DATE)
        })

        it('should change view mode to date in year view mode', () => {
            fixture.componentRef.setInput('startView', NbCalendarViewMode.YEAR)
            calendarComponent.onChangeViewMode()
            expect(calendarComponent.activeViewMode()).toBe(NbCalendarViewMode.DATE)
        })
    })
})

@Component({
    template: `
    <form (submit)="submitted = submitted + 1; $event.preventDefault()">
      <nb-calendar />
    </form>
  `,
    imports: [NbCalendarModule]
})
class NbCalendarInFormTestComponent {
    submitted = 0
}

describe('nb-calendar inside a form', () => {
    it('should not submit the form when navigating', () => {
        TestBed.configureTestingModule({
            imports: [NbCalendarModule, NbThemeModule.forRoot(), NbCalendarInFormTestComponent]
        })
        const fixture = TestBed.createComponent(NbCalendarInFormTestComponent)
        fixture.detectChanges()

        fixture.nativeElement.querySelector('.next-month').click()
        fixture.nativeElement.querySelector('nb-calendar-view-mode button').click()
        fixture.detectChanges()

        expect(fixture.componentInstance.submitted).toBe(0)
    })
})

describe('nb-calendar initial month', () => {
    it('should open on the month of the bound date', () => {
        TestBed.configureTestingModule({
            imports: [NbCalendarModule, NbThemeModule.forRoot()]
        })
        const fixture = TestBed.createComponent(NbCalendarComponent)
        fixture.componentRef.setInput('date', new Date(2020, 4, 17))
        fixture.detectChanges()

        expect(fixture.nativeElement.querySelector('nb-calendar-view-mode').textContent).toContain('May 2020')
    })
})
