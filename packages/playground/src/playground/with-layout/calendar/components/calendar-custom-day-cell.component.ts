import { Component } from '@angular/core';
import { NbCalendarDayCellComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-calendar-custom-day-cell',
  styles: [
    `
      .cell-content {
        flex-direction: column;
      }
    `,
  ],
  templateUrl: './calendar-custom-day-cell.component.html',
})
export class CalendarCustomDayCellComponent extends NbCalendarDayCellComponent<Date> {}
