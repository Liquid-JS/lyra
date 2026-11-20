import { Component, inject } from '@angular/core'
import {
    NbDateService,
    NbCalendarRange,
    NbCardComponent,
    NbCardBodyComponent,
    NbButtonComponent,
    NbCalendarComponent,
    NbCalendarRangeComponent
} from '@liquid-js/lyr-core'

@Component({
    templateUrl: './calendar-week-number.component.html',
    styles: [
        `
      button {
        margin-bottom: 1rem;
      }
    `
    ],
    imports: [
        NbCardComponent,
        NbCardBodyComponent,
        NbButtonComponent,
        NbCalendarComponent,
        NbCalendarRangeComponent
    ]
})
export class CalendarWeekNumberComponent {
    showWeekNumber = false
    size: 'large' | 'medium' = 'medium'
    date: Date
    dateRange: NbCalendarRange<Date>

    constructor() {
        const dateService = inject<NbDateService<Date>>(NbDateService)

        this.date = dateService.today()
        const yesterday = dateService.addDay(this.date, -1)
        const tomorrow = dateService.addDay(this.date, 1)
        this.dateRange = { start: yesterday, end: tomorrow }
    }

    toggleWeekNumber() {
        this.showWeekNumber = !this.showWeekNumber
    }

    toggleSize() {
        this.size = this.size === 'medium' ? 'large' : 'medium'
    }
}
