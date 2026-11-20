import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { DatePipe } from '@angular/common'
import { By } from '@angular/platform-browser'
import {
    NbCalendarMonthPickerComponent,
    NbDateService,
    NbNativeDateService,
    NbCalendarMonthCellComponent
} from '@liquid-js/lyr-core'

describe('Component: NbCalendarMonthPicker', () => {
    let fixture: ComponentFixture<NbCalendarMonthPickerComponent<Date, Date>>
    let component: NbCalendarMonthPickerComponent<Date, Date>
    let componentEl: DebugElement

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NbCalendarMonthPickerComponent],
            providers: [{ provide: NbDateService, useClass: NbNativeDateService }, DatePipe],
            schemas: [NO_ERRORS_SCHEMA]
        })
        fixture = TestBed.createComponent<NbCalendarMonthPickerComponent<Date, Date>>(NbCalendarMonthPickerComponent)
        component = fixture.componentInstance
        componentEl = fixture.debugElement
    })

    it('should contain calendar picker', () => {
        expect(componentEl.query(By.css('nb-calendar-picker'))).toBeDefined()
    })

    it('should provide default cell component', () => {
        expect(component.cellComponent()).toBe(NbCalendarMonthCellComponent)
    })

    it('should fire monthChange when cell selected', () => {
        const monthChangeSpy = vi.fn()
        component.monthChange.subscribe(monthChangeSpy)
        componentEl.query(By.css('nb-calendar-picker')).nativeElement.dispatchEvent(new CustomEvent('select'))
        expect(monthChangeSpy).toHaveBeenCalled()
    })

    it('should not have duplicate months', () => {
        fixture.componentRef.setInput('month', new Date(2019, 0, 30))

        let expectedMonthIndex = 0
        for (const monthRow of component.months()) {
            for (const month of monthRow) {
                expect(month.getMonth()).toEqual(expectedMonthIndex)
                expectedMonthIndex++
            }
        }
    })
})
