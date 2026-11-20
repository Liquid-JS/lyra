import { Component, ComponentRef, inject, input, Type } from '@angular/core';
import { outputFromObservable, outputToObservable } from '@angular/core/rxjs-interop';
import { EMPTY, Observable } from 'rxjs';

import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';
import { setComponentContext } from '@liquid-js/lyr-core/cdk';
import { NbCalendarTimeModelService } from '@liquid-js/lyr-core/calendar-kit';
import { NbCalendarWithTimeComponent } from './calendar-with-time.component';
import { NbBasePickerComponent } from './datepicker.component';

/**
 * The calendar with a time picker an `input[nbDatepicker]` opens to pick a date and time, with `nb-calendar`'s
 * options. The value is applied with the OK button, or set to now with the current time button.
 */
@Component({
  selector: 'nb-date-timepicker',
  template: '',
})
export class NbDateTimePickerComponent<D>
  extends NbBasePickerComponent<D, D, NbCalendarWithTimeComponent<D>> {
  protected readonly calendarWithTimeModelService = inject<NbCalendarTimeModelService<D>>(NbCalendarTimeModelService);

  protected override get pickerClass(): Type<NbCalendarWithTimeComponent<D>> {
    return NbCalendarWithTimeComponent;
  }

  override get value(): D | undefined {
    return this.picker ? this.picker.selectedDate() : undefined;
  }
  override set value(date: D | undefined) {
    const pickerRef = this.pickerRef;
    if (!pickerRef) {
      this.queue = date;
      return;
    }

    if (date) {
      this.visibleDate.set(date);
      setComponentContext(pickerRef, { visibleDate: date, date });
    }
  }

  /**
   * Minutes between the times a `singleColumn` picker lists, e.g. 20 for 12:00, 12:20, 12:40; 60 by default.
   */
  readonly step = input<number>();

  /** Text above the time picker. */
  readonly title = input<string>();
  /** Text of the button that applies the value; "ok" by default. */
  readonly applyButtonText = input<string>();
  /** Text of the button that sets the current time; "now" by default. */
  readonly currentTimeButtonText = input<string>();
  /** Shows the button that sets the current time (default). */
  readonly showCurrentTimeButton = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty });

  /**
   * Shows times in the 12-hour format, e.g. 07:00 PM.
   */
  readonly twelveHoursFormat = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /**
   * Shows the AM/PM label with `twelveHoursFormat` (default).
   */
  readonly showAmPmLabel = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty });

  /**
   * Adds a seconds column to the time picker; ignored with `singleColumn`.
   */
  readonly withSeconds = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /**
   * Lists whole times in one column, `step` minutes apart, instead of hour and minute columns.
   */
  readonly singleColumn = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /**
   * Emits the date with its time when the user applies it, or sets the current time.
   */
  readonly dateTimeChange = outputFromObservable(this.valueChange as Observable<D>);

  /**
   * The date format: the `format` input, or one built from the time inputs.
   */
  override get format(): string {
    return this.formatInput() || this.buildTimeFormat();
  }

  // The format is always set here, so the base check that one is set doesn't apply.
  override ngOnInit() {
    this.init$.next();
  }

  protected override patchWithInputs(pickerRef: ComponentRef<NbCalendarWithTimeComponent<D>>) {
    let timeFormat: string;
    if (this.twelveHoursFormat()) {
      timeFormat = this.dateService.getTwelveHoursFormat();
    } else {
      timeFormat =
        this.withSeconds() && !this.singleColumn()
          ? this.dateService.getTwentyFourHoursFormatWithSeconds()
          : this.dateService.getTwentyFourHoursFormat();
    }
    setComponentContext(pickerRef, {
      singleColumn: this.singleColumn(),
      twelveHoursFormat: this.twelveHoursFormat(),
      showAmPmLabel: this.showAmPmLabel(),
      withSeconds: this.withSeconds(),
      step: this.step(),
      title: this.title(),
      applyButtonText: this.applyButtonText(),
      currentTimeButtonText: this.currentTimeButtonText(),
      showCurrentTimeButton: this.showCurrentTimeButton(),
      timeFormat,
    });
    super.patchWithInputs(pickerRef);
  }

  protected override get pickerValueChange(): Observable<D> {
    // It's subscribed to once the picker is created.
    return this.picker ? outputToObservable(this.picker.dateChange) : EMPTY;
  }

  protected override writeQueue() {
    if (this.queue) {
      const date = this.queue;
      this.queue = undefined;
      this.value = date;
    }
  }

  protected buildTimeFormat(): string {
    if (this.singleColumn()) {
      return this.calendarWithTimeModelService.buildDateFormat(this.twelveHoursFormat());
    } else {
      return this.calendarWithTimeModelService.buildDateFormat(this.twelveHoursFormat(), this.withSeconds());
    }
  }
}
