import { Component, inject } from '@angular/core';
import {
  NbDateService,
  NbCardComponent,
  NbCardHeaderComponent,
  NbCardBodyComponent,
  NbCalendarComponent,
} from '@liquid-js/lyr-core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'nb-calendar-min-max',
  templateUrl: './calendar-min-max.component.html',
  imports: [
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbCalendarComponent,
    DatePipe,
  ],
})
export class CalendarMinMaxComponent {
  date: Date;
  min: Date;
  max: Date;

  constructor() {
    const dateService = inject<NbDateService<Date>>(NbDateService);

    this.date = dateService.today();
    this.date.setDate(15);
    this.min = dateService.addDay(this.date, -7);
    this.max = dateService.addDay(this.date, 7);
  }
}
