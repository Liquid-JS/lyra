import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { RouterModule } from '@angular/router'
import { NbDatepickerModule, NbThemeModule, NbTimepickerModule } from '@liquid-js/lyr-core'

@Component({
    template: '<nb-calendar-with-time [(date)]="date" />',
    imports: [RouterModule, NbDatepickerModule, NbTimepickerModule]
})
class NbCalendarWithTimeTestComponent {
    date = new Date(2025, 9, 23, 9, 15)
}

describe('Component: NbCalendarWithTimeComponent', () => {
    it('should render the timepicker on start', () => {
        TestBed.configureTestingModule({
            imports: [
                RouterModule.forRoot([]),
                NbThemeModule.forRoot(),
                NbDatepickerModule.forRoot(),
                NbTimepickerModule.forRoot(),
                NbCalendarWithTimeTestComponent
            ]
        })
        const fixture = TestBed.createComponent(NbCalendarWithTimeTestComponent)
        fixture.detectChanges()

        const timeSection = fixture.debugElement.query(By.css('.timepicker-section'))
        expect(timeSection.queryAll(By.css('nb-list-item')).length).toBeGreaterThan(0)
    })
})
