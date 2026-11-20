import { Component, signal } from '@angular/core';
import {
  NbCardComponent,
  NbCardBodyComponent,
  NbInputDirective,
  NbDatepickerDirective,
  NbDatepickerComponent,
  NbButtonComponent,
  NbSelectComponent,
  NbOptionComponent,
} from '@liquid-js/lyr-core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'npg-datepicker-dynamic-inputs-showcase',
  templateUrl: './datepicker-dynamic-inputs-showcase.component.html',
  styles: [
    `
      section {
        margin-bottom: 2rem;
      }

      section > * + * {
        margin-inline-start: 1rem;
      }
    `,
  ],
  imports: [
    NbCardComponent,
    NbCardBodyComponent,
    NbInputDirective,
    FormsModule,
    NbDatepickerDirective,
    NbDatepickerComponent,
    NbButtonComponent,
    NbSelectComponent,
    NbOptionComponent,
  ],
})
export class DatepickerDynamicInputsShowcaseComponent {
  now = new Date();

  readonly format = signal('dd/MM/yyyy HH:mm');
  formatToggleTimer?: ReturnType<typeof setInterval>;
  readonly firstDayOfWeek = signal<number | undefined>(undefined);
  firstDayOfWeekToggleTimer?: ReturnType<typeof setInterval>;

  toggleFormatSwitching() {
    if (this.formatToggleTimer === undefined) {
      this.formatToggleTimer = setInterval(() => {
        this.toggleFormat();
      }, 1000);
    } else {
      clearInterval(this.formatToggleTimer);
      this.formatToggleTimer = undefined;
    }
  }

  toggleFormat() {
    this.format.set(this.format() === 'dd/MM/yyyy HH:mm' ? 'HH:mm dd/MM/yyyy' : 'dd/MM/yyyy HH:mm');
  }

  toggleFirstDayOfWeekSwitching() {
    if (this.firstDayOfWeekToggleTimer === undefined) {
      this.firstDayOfWeekToggleTimer = setInterval(() => {
        this.toggleFirstDayOfWeek();
      }, 1000);
    } else {
      clearInterval(this.firstDayOfWeekToggleTimer);
      this.firstDayOfWeekToggleTimer = undefined;
    }
  }

  toggleFirstDayOfWeek() {
    this.firstDayOfWeek.update((day) => ((day ?? 0) + 1) % 7);
  }
}
