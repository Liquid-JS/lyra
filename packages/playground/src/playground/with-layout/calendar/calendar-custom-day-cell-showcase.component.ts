import { Component } from '@angular/core'
import { NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent, NbCalendarComponent } from '@liquid-js/lyr-core'
import { DatePipe } from '@angular/common'
import { CalendarCustomDayCellComponent } from './components/calendar-custom-day-cell.component'

@Component({
    selector: 'nb-calendar-custom-day-cell-showcase',
    templateUrl: './calendar-custom-day-cell-showcase.component.html',
    imports: [
        NbCardComponent,
        NbCardHeaderComponent,
        NbCardBodyComponent,
        NbCalendarComponent,
        DatePipe
    ]
})
export class CalendarCustomDayCellShowcaseComponent {
    date = new Date()
    dayCellComponent = CalendarCustomDayCellComponent
}
