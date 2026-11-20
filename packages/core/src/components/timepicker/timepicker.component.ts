import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';
import { NbPortalDirective } from '@liquid-js/lyr-core/cdk';
import { NbPlatform } from '@liquid-js/lyr-core/base';
import { NbDateService, NbDayPeriod } from '@liquid-js/lyr-core/calendar-kit';
import { ɵrange as range, ɵrangeFromTo as rangeFromTo } from '@liquid-js/lyr-core/calendar-kit';
import { NbCalendarTimeModelService } from '@liquid-js/lyr-core/calendar-kit';
import {
  NB_TIME_PICKER_CONFIG,
  NbSelectedTimePayload,
  NbTimePickerConfig,
} from './model';
import { NbCardComponent, NbCardHeaderComponent, NbCardFooterComponent } from '@liquid-js/lyr-core/card';
import { NbListComponent, NbListItemComponent } from '@liquid-js/lyr-core/list';
import { NbTimePickerCellComponent } from './timepicker-cell.component';
import { NbCalendarActionsComponent } from '@liquid-js/lyr-core/calendar-kit';
import { injectNbTexts, NbLocalize } from '@liquid-js/lyr-core/base';

/** @internal */
declare const $localize: NbLocalize;

interface NbTimePartOption {
  value: number;
  text: string;
}

/** @internal */
const SECONDS_IN_DAY = 24 * 3600;

/**
 * The time picker's popup: columns of hours, minutes, seconds and AM/PM, or a single column of times, with the
 * format, limits and texts. An input with `nbTimepicker` opens it.
 */
@Component({
  selector: 'nb-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss'],
  exportAs: 'nbTimepicker',
  imports: [
    NbPortalDirective,
    NbCardComponent,
    NbCardHeaderComponent,
    NbListComponent,
    NbListItemComponent,
    NbTimePickerCellComponent,
    NbCardFooterComponent,
    NbCalendarActionsComponent,
  ],
})
export class NbTimePickerComponent<D> {
  // Without provideNbTimepicker(), the format follows the locale.
  protected readonly config = inject<NbTimePickerConfig>(NB_TIME_PICKER_CONFIG, { optional: true });
  protected readonly platformService = inject(NbPlatform);
  protected readonly calendarTimeModelService = inject<NbCalendarTimeModelService<D>>(NbCalendarTimeModelService);
  protected readonly dateService = inject<NbDateService<D>>(NbDateService);

  protected readonly texts = injectNbTexts('timepicker', () => ({
    hoursText: $localize`:@@nb.timepicker.hours:Hr`,
    minutesText: $localize`:@@nb.timepicker.minutes:Min`,
    secondsText: $localize`:@@nb.timepicker.seconds:Sec`,
    ampmText: $localize`:@@nb.timepicker.ampm:Am/Pm`,
    timeText: $localize`:@@nb.timepicker.time:Time`,
    dialogText: $localize`:@@nb.timepicker.dialog:Choose a time`,
  }));

  /** The texts, the config's `localization` over the `timepicker` texts of `NbTextsService`. */
  protected readonly localization = computed(() => ({ ...this.texts(), ...(this.config?.localization ?? {}) }));

  protected blur$: Subject<void> = new Subject<void>();

  readonly dayPeriodColumnOptions = [NbDayPeriod.AM, NbDayPeriod.PM];
  hostRef?: ElementRef;

  /**
   * Meant to emit when the time picker loses focus; nothing emits it at present.
   */
  get blur(): Observable<void> {
    return this.blur$.asObservable();
  }

  /**
   * The format times are shown and parsed in. By default the config's `format`, or else one built from
   * `twelveHoursFormat` and `withSeconds`.
   */
  readonly timeFormat = input<string>();

  /**
   * Shows 12-hour times with an AM/PM column. By default the `provideNbTimepicker()` config's, or else the locale's.
   */
  readonly twelveHoursFormat = input<boolean, NbBooleanInput>(
    this.config ? !!this.config.twelveHoursFormat : this.dateService.getLocaleTimeFormat().includes('h'),
    { transform: convertToBoolProperty },
  );

  /**
   * Whether the AM/PM column, in 12-hour format, has a header label.
   */
  readonly showAmPmLabel = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty });

  /**
   * Adds a seconds column. Ignored with `singleColumn`.
   */
  readonly withSeconds = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /**
   * One column of whole times, every `step` minutes, instead of a column per part.
   */
  readonly singleColumn = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /**
   * The minutes between the times of a single column. By default 60: 12:00, 13:00, 14:00…
   */
  readonly step = input<number>();

  /**
   * The time shown as selected. The `nbTimepicker` directive sets it from the input.
   */
  readonly date = model<D>();

  /**
   * Whether the footer with the apply and current-time buttons shows; the calendar with time turns it off.
   * @docs-private
   */
  readonly showFooter = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty });
  readonly applyButtonText = input<string>();
  readonly hoursText = input<string>();
  readonly minutesText = input<string>();
  readonly secondsText = input<string>();
  readonly ampmText = input<string>();
  readonly timeText = input<string>();

  /**
   * The earliest time to pick, as a time of day: earlier times are disabled in the list, and an earlier time in the
   * input has the `nbTimepickerMin` error.
   */
  readonly min = input<D>();

  /**
   * The latest time to pick, as a time of day: later times are disabled in the list, and a later time in the input has
   * the `nbTimepickerMax` error.
   */
  readonly max = input<D>();

  /** The range of times to pick, in seconds of the day. */
  protected readonly limits = computed(() => {
    const min = this.min();
    const max = this.max();
    return {
      min: min ? this.secondsOfDay(min) : 0,
      max: max ? this.secondsOfDay(max) : SECONDS_IN_DAY - 1,
    };
  });

  protected readonly hoursLabel = computed(() => this.hoursText() ?? this.localization().hoursText);
  protected readonly minutesLabel = computed(() => this.minutesText() ?? this.localization().minutesText);
  protected readonly secondsLabel = computed(() => this.secondsText() ?? this.localization().secondsText);
  protected readonly ampmLabel = computed(() => this.ampmText() ?? this.localization().ampmText);
  protected readonly timeLabel = computed(() => this.timeText() ?? this.localization().timeText);
  /** Names the time picker's popup. */
  readonly dialogLabel = computed(() => this.localization().dialogText);
  readonly currentTimeButtonText = input<string>();

  /**
   * Emits every picked time. `save` is set when the apply or current-time button applies it; the directive then
   * closes the picker.
   */
  readonly onSelectTime = output<NbSelectedTimePayload<D>>();

  readonly portal = viewChild.required(NbPortalDirective);

  /**
   * The time format the timepicker formats and parses with: `timeFormat`, the config's format, or one built from
   * the other inputs.
   */
  readonly computedTimeFormat = computed(() => this.timeFormat() || this.config?.format || this.buildTimeFormat());

  readonly isAM = computed(() => {
    const date = this.date();
    return !!date && this.dateService.getDayPeriod(date) === NbDayPeriod.AM;
  });

  readonly showSeconds = computed(() => this.withSeconds() && !this.singleColumn());

  readonly fullTimeOptions = computed<D[]>(() =>
    this.singleColumn() ? this.calendarTimeModelService.getHoursRange(this.step()) : [],
  );
  readonly hoursColumnOptions = computed(() => this.generateHours());
  /** Whether a time of the single column is the selected one; without one, Tab reaches its first. */
  protected readonly hasSelectedFullTime = computed(() =>
    this.fullTimeOptions().some((value) => this.isSelectedFullTimeValue(value)),
  );
  readonly minutesColumnOptions = computed(() => this.generateMinutesOrSeconds());
  readonly secondsColumnOptions = computed(() => (this.showSeconds() ? this.generateMinutesOrSeconds() : []));

  setHost(hostRef: ElementRef) {
    this.hostRef = hostRef;
  }

  attach(hostRef: ElementRef) {
    this.hostRef = hostRef;
  }

  setCurrentTime() {
    const today = this.dateService.today();
    this.date.set(today);
    this.onSelectTime.emit({
      time: today,
      save: true,
    });
  }

  setHour(value: number) {
    const date = this.date();
    if (date && !this.isDisabledHour(value)) {
      this.updateValue(this.clamp(this.dateService.setHours(date, value)));
    }
  }

  setMinute(value: number) {
    const date = this.date();
    if (date && !this.isDisabledMinute(value)) {
      this.updateValue(this.clamp(this.dateService.setMinutes(date, value)));
    }
  }

  setSecond(value: number) {
    const date = this.date();
    if (date && !this.isDisabledSecond(value)) {
      this.updateValue(this.dateService.setSeconds(date, value));
    }
  }

  selectFullTime(value: D) {
    if (!this.isDisabledFullTime(value)) {
      this.updateValue(value);
    }
  }

  changeDayPeriod(dayPeriodToSet: NbDayPeriod) {
    const date = this.date();
    if (!date || this.dateService.getDayPeriod(date) === dayPeriodToSet || this.isDisabledDayPeriod(dayPeriodToSet)) {
      return;
    }

    // Subtract hours when switching to AM (before midday, 0-11 in 24-hour) from PM (after midday, 12-24 in 24-hour),
    // otherwise add hours because switching to PM from AM.
    const direction = dayPeriodToSet === NbDayPeriod.AM ? -1 : 1;
    const increment = direction * this.dateService.HOURS_IN_DAY_PERIOD;
    this.updateValue(this.clamp(this.dateService.addHours(date, increment)));
  }

  /** Whether no time in an hour can be picked. */
  isDisabledHour(hour: number): boolean {
    return this.outside(hour * 3600, hour * 3600 + 3599);
  }

  /** Whether no time in a minute of the picked hour can be picked. */
  isDisabledMinute(minute: number): boolean {
    const date = this.date();
    const start = (date ? this.dateService.getHours(date) * 3600 : 0) + minute * 60;
    return this.outside(start, start + 59);
  }

  /** Whether a second of the picked hour and minute can't be picked. */
  isDisabledSecond(second: number): boolean {
    const date = this.date();
    const start = date ? this.dateService.getHours(date) * 3600 + this.dateService.getMinutes(date) * 60 : 0;
    return this.outside(start + second, start + second);
  }

  /** Whether no time before or after midday can be picked. */
  isDisabledDayPeriod(dayPeriod: NbDayPeriod): boolean {
    const half = (SECONDS_IN_DAY / 2);
    return dayPeriod === NbDayPeriod.AM ? this.outside(0, half - 1) : this.outside(half, SECONDS_IN_DAY - 1);
  }

  /** Whether a time of the single column can't be picked. */
  isDisabledFullTime(time: D): boolean {
    const seconds = this.secondsOfDay(time);
    return this.outside(seconds, seconds);
  }

  /** Whether a time is before `min`, after `max`, or neither, by its time of day. */
  compareToLimits(time: D): -1 | 0 | 1 {
    const seconds = this.secondsOfDay(time);
    const { min, max } = this.limits();
    return seconds < min ? -1 : seconds > max ? 1 : 0;
  }

  /** Whether all of a span of seconds of the day is out of range. */
  protected outside(from: number, to: number): boolean {
    const { min, max } = this.limits();
    return to < min || from > max;
  }

  /** A time moved into range, e.g. after picking an hour whose earlier minutes are out of it. */
  protected clamp(time: D): D {
    const limit = this.compareToLimits(time) < 0 ? this.min() : this.compareToLimits(time) > 0 ? this.max() : undefined;
    if (!limit) {
      return time;
    }
    let clamped = this.dateService.setHours(time, this.dateService.getHours(limit));
    clamped = this.dateService.setMinutes(clamped, this.dateService.getMinutes(limit));
    return this.dateService.setSeconds(clamped, this.withSeconds() ? this.dateService.getSeconds(limit) : 0);
  }

  protected secondsOfDay(time: D): number {
    const hours = this.dateService.getHours(time);
    const minutes = this.dateService.getMinutes(time);
    return hours * 3600 + minutes * 60 + this.dateService.getSeconds(time);
  }

  updateValue(date: D) {
    this.onSelectTime.emit({ time: date });
  }

  saveValue() {
    const date = this.date();
    if (date) {
      this.onSelectTime.emit({
        time: date,
        save: true,
      });
    }
  }

  trackByTimeValues(index: number, item: NbTimePartOption): number {
    return item.value;
  }

  trackBySingleColumnValue(index: number, item: D) {
    return this.dateService.valueOf(item);
  }

  trackByDayPeriod(index: number, item: NbDayPeriod): string {
    return item;
  }

  isSelectedHour(val: number): boolean {
    const date = this.date();
    if (date) {
      return this.dateService.getHours(date) === val;
    }

    return false;
  }

  isSelectedMinute(val: number): boolean {
    const date = this.date();
    if (date) {
      return this.dateService.getMinutes(date) === val;
    }

    return false;
  }

  isSelectedSecond(val: number): boolean {
    const date = this.date();
    if (date) {
      return this.dateService.getSeconds(date) === val;
    }

    return false;
  }

  isSelectedDayPeriod(dayPeriod: NbDayPeriod): boolean {
    const date = this.date();
    if (date) {
      return dayPeriod === this.dateService.getDayPeriod(date);
    }

    return false;
  }

  getFullTimeString(item: D): string {
    return this.dateService.format(item, this.computedTimeFormat()).toUpperCase();
  }

  isSelectedFullTimeValue(value: D): boolean {
    const date = this.date();
    if (date) {
      return this.dateService.isSameHourAndMinute(value, date);
    }

    return false;
  }

  /**
   * The arrow keys, Home, End, Page Up and Page Down move focus in a column; Enter and Space pick the time there.
   * @internal
   */
  protected onColumnKeydown(event: KeyboardEvent) {
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }
    const options = [...(event.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('[role="option"]')];
    const current = options.findIndex((option) => option.contains(event.target as Node));
    const last = options.length - 1;
    const pageSize = 5;
    const targets: Partial<Record<string, number>> = {
      ArrowDown: current + 1,
      ArrowUp: current - 1,
      Home: 0,
      End: last,
      PageDown: current + pageSize,
      PageUp: current - pageSize,
    };
    const target = targets[event.key];
    if (target === undefined || current < 0) {
      return;
    }
    event.preventDefault();
    options[Math.max(0, Math.min(last, target))]?.focus();
  }

  isFirefox(): boolean {
    return this.platformService.FIREFOX;
  }

  protected generateHours(): NbTimePartOption[] {
    if (!this.twelveHoursFormat()) {
      return range(24, (v: number) => {
        return { value: v, text: this.calendarTimeModelService.paddToTwoSymbols(v) };
      });
    }

    if (this.isAM()) {
      return range(12, (v: number) => {
        const text = v === 0 ? 12 : v;
        return { value: v, text: this.calendarTimeModelService.paddToTwoSymbols(text) };
      });
    }

    return rangeFromTo(12, 24, (v: number) => {
      const text = v === 12 ? 12 : v - 12;
      return { value: v, text: this.calendarTimeModelService.paddToTwoSymbols(text) };
    });
  }

  protected generateMinutesOrSeconds(): NbTimePartOption[] {
    return range(60, (v: number) => {
      return { value: v, text: this.calendarTimeModelService.paddToTwoSymbols(v) };
    });
  }

  buildTimeFormat(): string {
    if (this.twelveHoursFormat()) {
      return `${
        this.withSeconds() && !this.singleColumn()
          ? this.dateService.getTwelveHoursFormatWithSeconds()
          : this.dateService.getTwelveHoursFormat()
      }`;
    } else {
      return `${
        this.withSeconds() && !this.singleColumn()
          ? this.dateService.getTwentyFourHoursFormatWithSeconds()
          : this.dateService.getTwentyFourHoursFormat()
      }`;
    }
  }

}
