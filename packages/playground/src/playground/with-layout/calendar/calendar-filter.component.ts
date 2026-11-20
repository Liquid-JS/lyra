import { Component } from '@angular/core';
import { NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent, NbCalendarComponent } from '@liquid-js/lyr-core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'nb-calendar-filter',
  templateUrl: './calendar-filter.component.html',
  imports: [
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbCalendarComponent,
    DatePipe,
  ],
})
export class CalendarFilterComponent {
  date = new Date();
  filter = (date: Date) => date.getDay() !== 0 && date.getDay() !== 6;
}
