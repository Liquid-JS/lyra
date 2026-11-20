import { Component } from '@angular/core';
import { NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent, NbCalendarComponent } from '@liquid-js/lyr-core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'nb-calendar-showcase',
  templateUrl: './calendar-showcase.component.html',
  imports: [
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbCalendarComponent,
    DatePipe,
  ],
})
export class CalendarShowcaseComponent {
  date = new Date();
}
