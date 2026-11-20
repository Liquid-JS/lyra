import { Component } from '@angular/core'
import { NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent, NbCalendarComponent } from '@liquid-js/lyr-core'
import { DatePipe } from '@angular/common'

@Component({
    selector: 'nb-calendar-without-header',
    templateUrl: './calendar-without-navigation.component.html',
    imports: [
        NbCardComponent,
        NbCardHeaderComponent,
        NbCardBodyComponent,
        NbCalendarComponent,
        DatePipe
    ]
})
export class CalendarWithoutNavigationComponent {
    date = new Date()
}
