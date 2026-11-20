import { DatePipe } from '@angular/common'
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import {
    NbCalendarDayPickerComponent,
    NbCalendarDayCellComponent,
    NbCalendarMonthModelService,
    NbCalendarKitModule,
    NbDateService,
    NbNativeDateService
} from '@liquid-js/lyr-core'

describe('Component: NbCalendarDayPicker', () => {
    let component: NbCalendarDayPickerComponent<Date, Date>
    let fixture: ComponentFixture<NbCalendarDayPickerComponent<Date, Date>>
    let componentEl: DebugElement

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NbCalendarKitModule],
            providers: [NbCalendarMonthModelService, DatePipe, { provide: NbDateService, useClass: NbNativeDateService }],
            schemas: [NO_ERRORS_SCHEMA]
        })
        fixture = TestBed.createComponent<NbCalendarDayPickerComponent<Date, Date>>(NbCalendarDayPickerComponent)
        component = fixture.componentInstance
        componentEl = fixture.debugElement

        fixture.componentRef.setInput('visibleDate', new Date())
        fixture.componentRef.setInput('date', new Date())
        fixture.detectChanges()
    })

    it('should render days names', () => {
        expect(componentEl.query(By.css('nb-calendar-days-names'))).toBeTruthy()
    })

    it('should render calendar picker', () => {
        expect(componentEl.query(By.css('nb-calendar-picker'))).toBeTruthy()
    })

    it('should provide default cell component', () => {
        expect(component.cellComponent()).toBe(NbCalendarDayCellComponent)
    })

    it('should fire dateChange when cell selected', () => {
        const dateChangeSpy = vi.fn()
        component.dateChange.subscribe(dateChangeSpy)
        componentEl.query(By.css('nb-calendar-picker')).nativeElement.dispatchEvent(new CustomEvent('select'))
        expect(dateChangeSpy).toHaveBeenCalled()
    })
})
