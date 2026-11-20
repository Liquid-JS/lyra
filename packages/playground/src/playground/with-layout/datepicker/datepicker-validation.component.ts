import { Component, inject } from '@angular/core';
import {
  NbDateService,
  NbCardComponent,
  NbCardBodyComponent,
  NbInputDirective,
  NbDatepickerDirective,
  NbDatepickerComponent,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-datepicker-validation',
  templateUrl: './datepicker-validation.component.html',
  styleUrls: ['./datepicker-example.scss'],
  imports: [
    NbCardComponent,
    NbCardBodyComponent,
    NbInputDirective,
    NbDatepickerDirective,
    NbDatepickerComponent,
  ],
})
export class DatepickerValidationComponent {
  protected readonly dateService = inject<NbDateService<Date>>(NbDateService);

  min: Date;
  max: Date;

  constructor() {
    this.min = this.dateService.addMonth(this.dateService.today(), -1);
    this.max = this.dateService.addMonth(this.dateService.today(), 1);
  }
}
