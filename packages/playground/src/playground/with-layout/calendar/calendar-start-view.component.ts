import { Component } from '@angular/core';
import { NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent, NbCalendarComponent } from '@liquid-js/lyr-core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'nb-calendar-start-view',
  templateUrl: './calendar-start-view.component.html',
  imports: [
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbCalendarComponent,
    DatePipe,
  ],
})
export class CalendarStartViewComponent {
  date = new Date();
}
