import { Component, inject } from '@angular/core'

import {
    NbCalendarRange,
    NbDateService,
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbCalendarRangeComponent
} from '@liquid-js/lyr-core'
import { DatePipe } from '@angular/common'

@Component({
    selector: 'nb-calendar-range-showcase',
    templateUrl: './calendar-range-showcase.component.html',
    imports: [
        NbCardComponent,
        NbCardHeaderComponent,
        NbCardBodyComponent,
        NbCalendarRangeComponent,
        DatePipe
    ]
})
export class CalendarRangeShowcaseComponent {
    protected readonly dateService = inject<NbDateService<Date>>(NbDateService)

    range: NbCalendarRange<Date>

    constructor() {
        this.range = {
            start: this.dateService.addDay(this.monthStart, 3),
            end: this.dateService.addDay(this.monthEnd, -3)
        }
    }

    get monthStart(): Date {
        return this.dateService.getMonthStart(new Date())
    }

    get monthEnd(): Date {
        return this.dateService.getMonthEnd(new Date())
    }
}
