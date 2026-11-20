import { Component } from '@angular/core'
import { NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent, NbCalendarComponent } from '@liquid-js/lyr-core'
import { DatePipe } from '@angular/common'

@Component({
    selector: 'nb-calendar-bounding-month',
    templateUrl: './calendar-bounding-month.component.html',
    imports: [
        NbCardComponent,
        NbCardHeaderComponent,
        NbCardBodyComponent,
        NbCalendarComponent,
        DatePipe
    ]
})
export class CalendarBoundingMonthComponent {
    date = new Date()
}
