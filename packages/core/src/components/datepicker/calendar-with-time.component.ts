import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  viewChild,
} from '@angular/core';
import { NbCalendarComponent } from '@liquid-js/lyr-core/calendar';
import { NbSelectedTimePayload } from '@liquid-js/lyr-core/timepicker';
import { NbDateService } from '@liquid-js/lyr-core/calendar-kit';
import { NbCalendarTimeModelService } from '@liquid-js/lyr-core/calendar-kit';
import { NbCalendarSize } from '@liquid-js/lyr-core/calendar-kit';
import { NbPortalOutletDirective } from '@liquid-js/lyr-core/cdk';
import { NbTimePickerComponent } from '@liquid-js/lyr-core/timepicker';
import { NbCardComponent, NbCardBodyComponent, NbCardFooterComponent } from '@liquid-js/lyr-core/card';
import { NbBaseCalendarComponent } from '@liquid-js/lyr-core/calendar';
import { NbCalendarActionsComponent } from '@liquid-js/lyr-core/calendar-kit';
import { ɵconvertToOptionalBoolProperty as convertToOptionalBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';

/**
 * A calendar with a time picker beside it, which `nb-date-timepicker` opens: the date and time are edited together
 * and emitted when the user applies them, or sets the current time.
 */
@Component({
  selector: 'nb-calendar-with-time',
  templateUrl: './calendar-with-time.component.html',
  styleUrls: ['./calendar-with-time-container.component.scss'],
  imports: [
    NbCardComponent,
    NbCardBodyComponent,
    NbBaseCalendarComponent,
    NbTimePickerComponent,
    NbPortalOutletDirective,
    NbCardFooterComponent,
    NbCalendarActionsComponent,
  ],
})
export class NbCalendarWithTimeComponent<D> extends NbCalendarComponent<D> implements AfterViewInit {
  protected readonly dateService = inject<NbDateService<D>>(NbDateService);
  readonly cd = inject(ChangeDetectorRef);
  protected readonly calendarTimeModelService = inject<NbCalendarTimeModelService<D>>(NbCalendarTimeModelService);

  /**
   * Shows times in the 12-hour format, e.g. 07:00 PM.
   */
  readonly twelveHoursFormat = input<boolean | undefined, NbBooleanInput>(undefined, {
    transform: convertToOptionalBoolProperty,
  });

  /**
   * Shows the AM/PM label with `twelveHoursFormat`.
   */
  readonly showAmPmLabel = input<boolean | undefined, NbBooleanInput>(undefined, {
    transform: convertToOptionalBoolProperty,
  });

  /**
   * Adds a seconds column to the time picker; ignored with `singleColumn`.
   */
  readonly withSeconds = input<boolean | undefined, NbBooleanInput>(undefined, {
    transform: convertToOptionalBoolProperty,
  });

  /**
   * Lists whole times in one column, `step` minutes apart, instead of hour and minute columns.
   */
  readonly singleColumn = input<boolean | undefined, NbBooleanInput>(undefined, {
    transform: convertToOptionalBoolProperty,
  });

  /**
   * Minutes between the times a `singleColumn` picker lists, e.g. 20 for 12:00, 12:20, 12:40; 60 by default.
   */
  readonly step = input<number>();

  /**
   * The format the time picker shows times in.
   */
  readonly timeFormat = input<string>();

  /**
   * Text above the time picker.
   */
  readonly title = input<string>();

  /** Text of the button that applies the value; "ok" by default. */
  readonly applyButtonText = input<string>();

  /** Text of the button that sets the current time; "now" by default. */
  readonly currentTimeButtonText = input<string>();

  /** Shows the button that sets the current time. */
  readonly showCurrentTimeButton = input<boolean | undefined, NbBooleanInput>(undefined, {
    transform: convertToOptionalBoolProperty,
  });

  readonly portalOutlet = viewChild.required(NbPortalOutletDirective);
  readonly timepicker = viewChild.required<NbTimePickerComponent<D>>(NbTimePickerComponent);

  /**
   * The date and time being edited: `date`, or midnight today, until the user saves it.
   */
  readonly selectedDate = linkedSignal(() => this.date() ?? this.calendarTimeModelService.getResetTime());

  ngAfterViewInit() {
    this.portalOutlet().attachTemplatePortal(this.timepicker().portal());
  }

  onDateValueChange(date: D) {
    const hours = this.dateService.getHours(this.selectedDate());
    const minutes = this.dateService.getMinutes(this.selectedDate());
    const seconds = this.dateService.getSeconds(this.selectedDate());
    const milliseconds = this.dateService.getMilliseconds(this.selectedDate());

    let newDate = this.dateService.setHours(date, hours);
    newDate = this.dateService.setMinutes(newDate, minutes);
    newDate = this.dateService.setSeconds(newDate, seconds);
    newDate = this.dateService.setMilliseconds(newDate, milliseconds);

    this.selectedDate.set(newDate);
  }

  onTimeChange(selectedTime: NbSelectedTimePayload<D>) {
    let newDate = this.dateService.clone(this.selectedDate());

    newDate = this.dateService.setHours(newDate, this.dateService.getHours(selectedTime.time));
    newDate = this.dateService.setMinutes(newDate, this.dateService.getMinutes(selectedTime.time));
    newDate = this.dateService.setSeconds(newDate, this.dateService.getSeconds(selectedTime.time));
    newDate = this.dateService.setMilliseconds(newDate, this.dateService.getMilliseconds(selectedTime.time));

    this.selectedDate.set(newDate);
  }

  saveValue() {
    this.dateChange.emit(this.selectedDate());
  }

  saveCurrentTime() {
    this.dateChange.emit(this.dateService.today());
  }

  readonly showSeconds = computed(() => this.withSeconds() && !this.singleColumn());

  readonly isLarge = computed(() => this.size() === NbCalendarSize.LARGE);
}
