import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  NbCardModule,
  NbDatepickerModule,
  NbInputModule,
  NbValidationModule,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-datepicker-picker-mode',
  templateUrl: './datepicker-picker-mode.component.html',
  styles: `
    .fields {
      display: grid;
      gap: 1rem;
      max-width: 16rem;
    }
  `,
  imports: [ReactiveFormsModule, NbCardModule, NbInputModule, NbDatepickerModule, NbValidationModule],
})
export class DatepickerPickerModeComponent {
  readonly expiry = new FormControl<Date | null>(new Date(2027, 4, 1));
  readonly graduation = new FormControl<Date | null>(null);
}
