import { Component, signal } from '@angular/core';
import {
  NbCardComponent,
  NbCardBodyComponent,
  NbInputDirective,
  NbDatepickerDirective,
  NbDateTimePickerComponent,
  NbButtonComponent,
  NbSelectComponent,
  NbOptionComponent,
} from '@liquid-js/lyr-core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'npg-date-timepicker-dynamic-inputs-showcase',
  templateUrl: './date-timepicker-dynamic-inputs-showcase.component.html',
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
    NbDateTimePickerComponent,
    NbButtonComponent,
    NbSelectComponent,
    NbOptionComponent,
  ],
})
export class DateTimepickerDynamicInputsShowcaseComponent {
  now = new Date();

  readonly withSeconds = signal(true);
  secondsToggleTimer?: ReturnType<typeof setInterval>;

  toggleSecondsSwitching() {
    if (this.secondsToggleTimer === undefined) {
      this.secondsToggleTimer = setInterval(() => {
        this.toggleWithSeconds();
      }, 1000);
    } else {
      clearInterval(this.secondsToggleTimer);
      this.secondsToggleTimer = undefined;
    }
  }

  toggleWithSeconds() {
    this.withSeconds.set(!this.withSeconds());
  }

  readonly singleColumn = signal(false);
  singleColumnToggleTimer?: ReturnType<typeof setInterval>;

  toggleSingleColumnSwitching() {
    if (this.singleColumnToggleTimer === undefined) {
      this.singleColumnToggleTimer = setInterval(() => {
        this.toggleSingleColumn();
      }, 1000);
    } else {
      clearInterval(this.singleColumnToggleTimer);
      this.singleColumnToggleTimer = undefined;
    }
  }

  toggleSingleColumn() {
    this.singleColumn.set(!this.singleColumn());
  }

  readonly step = signal(45);
  stepToggleTimer?: ReturnType<typeof setInterval>;

  toggleStepSwitching() {
    if (this.stepToggleTimer === undefined) {
      this.stepToggleTimer = setInterval(() => {
        this.toggleStep();
      }, 1000);
    } else {
      clearInterval(this.stepToggleTimer);
      this.stepToggleTimer = undefined;
    }
  }

  toggleStep() {
    this.step.set(this.step() === 45 ? 15 : 45);
  }

  readonly twelveHoursFormat = signal(true);
  twelveHoursFormatToggleTimer?: ReturnType<typeof setInterval>;

  toggleTwelveHoursFormatSwitching() {
    if (this.twelveHoursFormatToggleTimer === undefined) {
      this.twelveHoursFormatToggleTimer = setInterval(() => {
        this.toggleTwelveHoursFormat();
      }, 1000);
    } else {
      clearInterval(this.twelveHoursFormatToggleTimer);
      this.twelveHoursFormatToggleTimer = undefined;
    }
  }

  toggleTwelveHoursFormat() {
    this.twelveHoursFormat.set(!this.twelveHoursFormat());
  }

  readonly format = signal('dd/MM/yyyy HH:mm');
  formatToggleTimer?: ReturnType<typeof setInterval>;

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

  readonly firstDayOfWeek = signal<number | undefined>(undefined);
  firstDayOfWeekToggleTimer?: ReturnType<typeof setInterval>;

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
