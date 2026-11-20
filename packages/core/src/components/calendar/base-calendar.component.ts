import {
  Component,
  computed,
  forwardRef,
  inject,
  input,
  linkedSignal,
  model,
  output,
  signal,
  Type,
} from '@angular/core';

import { NbCalendarYearModelService } from '@liquid-js/lyr-core/calendar-kit';
import { NbCalendarCell, NbCalendarSize, NbCalendarViewMode, NbCalendarSizeValues, NbCalendarViewModeValues, NbCalendarPickerMode } from '@liquid-js/lyr-core/calendar-kit';
import { NbDateService } from '@liquid-js/lyr-core/calendar-kit';
import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';
import { NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent } from '@liquid-js/lyr-core/card';
import { NbCalendarViewModeComponent } from '@liquid-js/lyr-core/calendar-kit';
import { NbCalendarPageableNavigationComponent } from '@liquid-js/lyr-core/calendar-kit';
import { NbCalendarDayPickerComponent } from '@liquid-js/lyr-core/calendar-kit';
import { NbCalendarYearPickerComponent } from '@liquid-js/lyr-core/calendar-kit';
import { NbCalendarMonthPickerComponent } from '@liquid-js/lyr-core/calendar-kit';
import { ɵNB_CALENDAR_KEYBOARD as NB_CALENDAR_KEYBOARD, ɵNbCalendarKeyboard as NbCalendarKeyboard } from '@liquid-js/lyr-core/calendar-kit';

/**
 * What `nb-calendar` and `nb-calendar-range` are built on: it keeps the view and the date shown, and moves between
 * the day, month and year pickers.
 */
@Component({
  selector: 'nb-base-calendar',
  templateUrl: './base-calendar.component.html',
  imports: [
    NbCardComponent,
    NbCardHeaderComponent,
    NbCalendarViewModeComponent,
    NbCalendarPageableNavigationComponent,
    NbCardBodyComponent,
    NbCalendarDayPickerComponent,
    NbCalendarYearPickerComponent,
    NbCalendarMonthPickerComponent,
  ],
  providers: [{ provide: NB_CALENDAR_KEYBOARD, useExisting: forwardRef(() => NbBaseCalendarComponent) }],
  host: {
    '[class.has-navigation]': 'showNavigation()',
    '[class.has-week-number]': 'showWeekNumber()',
    '[class.size-large]': 'large()',
  },
})
export class NbBaseCalendarComponent<D, T> implements NbCalendarKeyboard<D> {
  protected readonly dateService = inject<NbDateService<D>>(NbDateService);
  protected readonly yearModelService = inject<NbCalendarYearModelService<D>>(NbCalendarYearModelService);

  /**
   * Fills the first and last weeks with the days of the months around the one shown; without it those cells are
   * empty.
   */
  readonly boundingMonth = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty });

  /**
   * The view the calendar opens on: `date` (default), `month` or `year`. A month or year `pickerMode` opens on its
   * own view instead.
   */
  readonly startView = input<NbCalendarViewMode, NbCalendarViewModeValues>(NbCalendarViewMode.DATE, {
    transform: (viewMode) => viewMode as NbCalendarViewMode,
  });

  /**
   * What the calendar picks: a day (`date`, default), a month or a year. A month or year picker starts on its view,
   * and picks the first day of the month or year.
   */
  readonly pickerMode = input<NbCalendarPickerMode>('date');

  /**
   * The view the calendar shows: `startView`, or the picker mode's view, until a user navigates to another one.
   */
  readonly activeViewMode = linkedSignal(() => {
    switch (this.pickerMode()) {
      case 'month':
        return NbCalendarViewMode.MONTH;
      case 'year':
        return NbCalendarViewMode.YEAR;
      default:
        return this.startView();
    }
  });

  /**
   * The earliest date that can be picked: earlier days are disabled, its own day whatever its time, and so are the
   * months and years that end before it.
   */
  readonly min = input<D>();

  /**
   * The latest date that can be picked: later days are disabled, its own day whatever its time, and so are the
   * months and years that start after it.
   */
  readonly max = input<D>();

  /**
   * Disables the days for which it returns `false`. Months and years aren't filtered.
   */
  readonly filter = input<(date: D) => boolean>();

  /**
   * A component to render the days with, implementing `NbCalendarCell`.
   */
  readonly dayCellComponent = input<Type<NbCalendarCell<D, T>>>();

  /**
   * A component to render the months with, implementing `NbCalendarCell`.
   */
  readonly monthCellComponent = input<Type<NbCalendarCell<D, T>>>();

  /**
   * A component to render the years with, implementing `NbCalendarCell`.
   */
  readonly yearCellComponent = input<Type<NbCalendarCell<D, T>>>();

  /**
   * Size of the calendar and its cells: `medium` (default) or `large`.
   */
  readonly size = input<NbCalendarSize, NbCalendarSizeValues>(NbCalendarSize.MEDIUM, {
    transform: (size) => size as NbCalendarSize,
  });

  /**
   * The date whose month the calendar shows; today by default. It supports two-way binding.
   */
  readonly visibleDate = model<D>();

  /**
   * The date whose month the calendar shows: `visibleDate`, or today.
   */
  readonly shownDate = computed(() => this.visibleDate() ?? this.dateService.today());

  /**
   * Shows the header with the view mode button and the previous and next buttons (default).
   */
  readonly showNavigation = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty });

  /**
   * The selected value, a date or a range, which the cells show as selected.
   */
  readonly date = input<T>();

  /**
   * Shows a column with the week numbers before the days; off by default.
   */
  readonly showWeekNumber = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /**
   * The header of the week numbers column; `#` by default.
   */
  readonly weekNumberSymbol = input<string>();

  /**
   * The first day of the week: 0 for Sunday, 1 for Monday and so on; the locale's by default.
   */
  readonly firstDayOfWeek = input<number>();

  /**
   * Emits the picked day, or the first day of the picked month or year in those picker modes.
   */
  readonly dateChange = output<T>();

  readonly large = computed(() => {
    return this.size() === NbCalendarSize.LARGE;
  });

  ViewMode = NbCalendarViewMode;

  setViewMode(viewMode: NbCalendarViewMode) {
    this.activeViewMode.set(viewMode);
  }

  setVisibleDate(visibleDate: D) {
    this.visibleDate.set(visibleDate);
  }

  /**
   * Whether the keyboard is in the calendar's grid, so the grid of the next view, e.g. the days after picking a month,
   * takes focus.
   * @internal
   */
  readonly keyboardFocus = signal(false);

  /**
   * Shows the period with a date, for the keyboard moving past the dates shown.
   * @internal
   */
  showDate(date: D) {
    this.setVisibleDate(date);
  }

  prevMonth() {
    this.changeVisibleMonth(-1);
  }

  nextMonth() {
    this.changeVisibleMonth(1);
  }

  prevYear() {
    this.changeVisibleYear(-1);
  }

  nextYear() {
    this.changeVisibleYear(1);
  }

  prevYears() {
    this.changeVisibleYears(-1);
  }

  nextYears() {
    this.changeVisibleYears(1);
  }

  navigatePrev() {
    switch (this.activeViewMode()) {
      case NbCalendarViewMode.DATE:
        return this.prevMonth();
      case NbCalendarViewMode.MONTH:
        return this.prevYear();
      case NbCalendarViewMode.YEAR:
        return this.prevYears();
    }
  }

  navigateNext() {
    switch (this.activeViewMode()) {
      case NbCalendarViewMode.DATE:
        return this.nextMonth();
      case NbCalendarViewMode.MONTH:
        return this.nextYear();
      case NbCalendarViewMode.YEAR:
        return this.nextYears();
    }
  }

  onChangeViewMode() {
    switch (this.pickerMode()) {
      // A year picker has only its years.
      case 'year':
        return;
      case 'month':
        return this.setViewMode(
          this.activeViewMode() === NbCalendarViewMode.MONTH ? NbCalendarViewMode.YEAR : NbCalendarViewMode.MONTH,
        );
    }
    if (this.activeViewMode() === NbCalendarViewMode.DATE) {
      return this.setViewMode(NbCalendarViewMode.YEAR);
    }

    this.setViewMode(NbCalendarViewMode.DATE);
  }

  /** A month picked: the date, for a month picker, or its days. */
  onMonthPicked(month: D) {
    this.setVisibleDate(month);
    if (this.pickerMode() === 'month') {
      this.dateChange.emit(this.dateService.getMonthStart(month) as unknown as T);
      return;
    }
    this.setViewMode(NbCalendarViewMode.DATE);
  }

  /** A year picked: the date, for a year picker, or its months. */
  onYearPicked(year: D) {
    this.setVisibleDate(year);
    if (this.pickerMode() === 'year') {
      this.dateChange.emit(this.dateService.getYearStart(year) as unknown as T);
      return;
    }
    this.setViewMode(NbCalendarViewMode.MONTH);
  }

  private changeVisibleMonth(direction: number) {
    this.visibleDate.set(this.dateService.addMonth(this.shownDate(), direction));
  }

  private changeVisibleYear(direction: number) {
    this.visibleDate.set(this.dateService.addYear(this.shownDate(), direction));
  }

  private changeVisibleYears(direction: number) {
    const years = direction * this.yearModelService.getYearsInView();
    this.visibleDate.set(this.dateService.addYear(this.shownDate(), years));
  }
}
