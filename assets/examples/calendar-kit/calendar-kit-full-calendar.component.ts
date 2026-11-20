import { Component } from '@angular/core'
import { NbCardComponent, NbCardBodyComponent, NbCalendarMonthPickerComponent } from '@liquid-js/lyr-core'
import { CalendarKitMonthCellComponent } from './components/calendar-kit-month-cell.component'

@Component({
    selector: 'nb-calendar-kit-full-calendar-showcase',
    templateUrl: './calendar-kit-full-calendar.component.html',
    imports: [NbCardComponent, NbCardBodyComponent, NbCalendarMonthPickerComponent]
})
export class CalendarKitFullCalendarShowcaseComponent {
    month = new Date()
    monthCellComponent = CalendarKitMonthCellComponent
}
