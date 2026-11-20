import { Component } from '@angular/core';
import {
  NbCardComponent,
  NbCardBodyComponent,
  NbInputDirective,
  NbDatepickerDirective,
  NbDatepickerComponent,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-datepicker-filter',
  templateUrl: './datepicker-filter.component.html',
  styleUrls: ['./datepicker-example.scss'],
  imports: [
    NbCardComponent,
    NbCardBodyComponent,
    NbInputDirective,
    NbDatepickerDirective,
    NbDatepickerComponent,
  ],
})
export class DatepickerFilterComponent {
  filterFn = (date: Date) => date.getDay() === 0;
}
