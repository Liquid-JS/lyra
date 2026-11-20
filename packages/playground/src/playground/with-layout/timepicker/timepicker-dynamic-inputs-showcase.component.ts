import { Component, signal } from '@angular/core';
import {
  NbCardComponent,
  NbCardBodyComponent,
  NbInputDirective,
  NbTimePickerDirective,
  NbTimePickerComponent,
  NbButtonComponent,
} from '@liquid-js/lyr-core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'npg-timepicker-dynamic-inputs-showcase',
  templateUrl: './timepicker-dynamic-inputs-showcase.component.html',
  styles: [
    `
      section {
        margin-bottom: 2rem;
      }

      button + button {
        margin-inline-start: 1rem;
      }
    `,
  ],
  imports: [
    NbCardComponent,
    NbCardBodyComponent,
    NbInputDirective,
    FormsModule,
    NbTimePickerDirective,
    NbTimePickerComponent,
    NbButtonComponent,
  ],
})
export class TimepickerDynamicInputsShowcaseComponent {
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

  readonly format = signal<string | undefined>(undefined);
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
    this.format.set(this.format() === undefined ? 'mm:HH' : undefined);
  }
}
