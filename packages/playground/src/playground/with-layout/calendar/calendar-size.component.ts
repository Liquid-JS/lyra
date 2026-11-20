import { Component } from '@angular/core';
import { NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent, NbCalendarComponent } from '@liquid-js/lyr-core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'nb-calendar-size',
  templateUrl: './calendar-size.component.html',
  imports: [
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbCalendarComponent,
    DatePipe,
  ],
})
export class CalendarSizeComponent {
  date = new Date();
}
