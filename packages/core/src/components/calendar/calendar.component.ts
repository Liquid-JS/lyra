import { Component, input, model, output, Type } from '@angular/core';

import { NbCalendarCell, NbCalendarSize, NbCalendarViewMode, NbCalendarSizeValues, NbCalendarViewModeValues, NbCalendarPickerMode } from '@liquid-js/lyr-core/calendar-kit';
import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';
import { NbBaseCalendarComponent } from './base-calendar.component';

/**
 * Picks a date from a grid of days, months or years.
 *
 * ```html
 * <nb-calendar [(date)]="date"></nb-calendar>
 * <nb-calendar [date]="date" (dateChange)="handleDateChange($event)"></nb-calendar>
 * ```
 *
 * Basic usage example
 * @stacked-example(Showcase, calendar/calendar-showcase.component)
 *
 * The grid works by keyboard: the arrow keys move between cells, Home and End to the ends of the row, Page Up and
 * Page Down by a month (with Shift, a year) among days or by a page among months and years, and Enter or Space picks
 * the cell. The cells are named with their full dates for assistive technologies.
 *
 * ### Installation
 *
 * Import `NbCalendarComponent` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbCalendarComponent],
 * })
 * export class PageComponent { }
 * ```
 *
 * With NgModules:
 *
 * Import `NbCalendarModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbCalendarModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * `NbCalendarRangeComponent`, from `NbCalendarRangeModule` or on its own, picks a range of dates:
 *
 * ```html
 * <nb-calendar-range [(range)]="range"></nb-calendar-range>
 * <nb-calendar-range [range]="range" (rangeChange)="handleRangeChange($event)"></nb-calendar-range>
 * ```
 *
 * @stacked-example(Range, calendar/calendar-range-showcase.component)
 *
 * The header, with the view mode button and the previous and next buttons, goes with `showNavigation="false"`:
 * @stacked-example(Without navigation, calendar/calendar-without-navigation.component)
 *
 * The days of the months around the one shown fill its first and last weeks; `boundingMonth="false"` leaves those
 * cells empty:
 * @stacked-example(Bounding months, calendar/calendar-bounding-month.component)
 *
 * `startView` opens the calendar on its years, its months or its days (`date`, the default):
 * @stacked-example(Start view, calendar/calendar-start-view.component)
 *
 * `pickerMode="month"` or `"year"` makes the calendar pick a month or a year: it starts on the months or the years, and
 * picks the first day of the one chosen. A month picker's title still changes to the years.
 *
 * `size="large"` is a larger calendar:
 * @stacked-example(Size, calendar/calendar-size.component)
 *
 * Days before `min` and after `max` are disabled, as are the months and years with no day in between:
 * @stacked-example(Borders, calendar/calendar-min-max.component)
 *
 * `filter` disables the days for which it returns `false`, here the weekends:
 * @stacked-example(Filter, calendar/calendar-filter.component)
 *
 * `showWeekNumber` adds a column with the week numbers:
 * @stacked-example(Week number, calendar/calendar-week-number.component)
 *
 * Custom cell components render the days, months or years, e.g. a day cell with a price under its date. They
 * implement `NbCalendarCell`:
 * @stacked-example(Custom day cell, calendar/calendar-custom-day-cell-showcase.component)
 *
 * @styles
 *
 * calendar-width:
 * calendar-background-color:
 * calendar-border-color:
 * calendar-border-style:
 * calendar-border-width:
 * calendar-border-radius:
 * calendar-text-color:
 * calendar-text-font-family:
 * calendar-text-font-size:
 * calendar-text-font-weight:
 * calendar-text-line-height:
 * calendar-picker-padding-top:
 * calendar-picker-padding-bottom:
 * calendar-picker-padding-start:
 * calendar-picker-padding-end:
 * calendar-navigation-text-color:
 * calendar-navigation-text-font-family:
 * calendar-navigation-title-text-font-size:
 * calendar-navigation-title-text-font-weight:
 * calendar-navigation-title-text-line-height:
 * calendar-navigation-padding:
 * calendar-cell-inactive-text-color:
 * calendar-cell-disabled-text-color:
 * calendar-cell-hover-background-color:
 * calendar-cell-hover-border-color:
 * calendar-cell-hover-text-color:
 * calendar-cell-hover-text-font-size:
 * calendar-cell-hover-text-font-weight:
 * calendar-cell-hover-text-line-height:
 * calendar-cell-active-background-color:
 * calendar-cell-active-border-color:
 * calendar-cell-active-text-color:
 * calendar-cell-active-text-font-size:
 * calendar-cell-active-text-font-weight:
 * calendar-cell-active-text-line-height:
 * calendar-cell-today-background-color:
 * calendar-cell-today-border-color:
 * calendar-cell-today-text-color:
 * calendar-cell-today-text-font-size:
 * calendar-cell-today-text-font-weight:
 * calendar-cell-today-text-line-height:
 * calendar-cell-today-hover-background-color:
 * calendar-cell-today-hover-border-color:
 * calendar-cell-today-active-background-color:
 * calendar-cell-today-active-border-color:
 * calendar-cell-today-disabled-border-color:
 * calendar-cell-today-selected-background-color:
 * calendar-cell-today-selected-border-color:
 * calendar-cell-today-selected-text-color:
 * calendar-cell-today-selected-hover-background-color:
 * calendar-cell-today-selected-hover-border-color:
 * calendar-cell-today-selected-active-background-color:
 * calendar-cell-today-selected-active-border-color:
 * calendar-cell-range-joined-border-radius:
 * calendar-cell-today-in-range-background-color:
 * calendar-cell-today-in-range-border-color:
 * calendar-cell-today-in-range-text-color:
 * calendar-cell-today-in-range-hover-background-color:
 * calendar-cell-today-in-range-hover-border-color:
 * calendar-cell-today-in-range-active-background-color:
 * calendar-cell-today-in-range-active-border-color:
 * calendar-cell-selected-background-color:
 * calendar-cell-selected-border-color:
 * calendar-cell-selected-text-color:
 * calendar-cell-selected-text-font-size:
 * calendar-cell-selected-text-font-weight:
 * calendar-cell-selected-text-line-height:
 * calendar-cell-selected-hover-background-color:
 * calendar-cell-selected-hover-border-color:
 * calendar-cell-selected-active-background-color:
 * calendar-cell-selected-active-border-color:
 * calendar-day-cell-width:
 * calendar-day-cell-height:
 * calendar-month-cell-width:
 * calendar-month-cell-height:
 * calendar-year-cell-width:
 * calendar-year-cell-height:
 * calendar-weekday-background:
 * calendar-weekday-divider-color:
 * calendar-weekday-divider-width:
 * calendar-weekday-text-color:
 * calendar-weekday-text-font-size:
 * calendar-weekday-text-font-weight:
 * calendar-weekday-text-line-height:
 * calendar-weekday-holiday-text-color:
 * calendar-weekday-height:
 * calendar-weekday-width:
 * calendar-weeknumber-background:
 * calendar-weeknumber-divider-color:
 * calendar-weeknumber-divider-width:
 * calendar-weeknumber-text-color:
 * calendar-weeknumber-text-font-size:
 * calendar-weeknumber-text-font-weight:
 * calendar-weeknumber-text-line-height:
 * calendar-weeknumber-height:
 * calendar-weeknumber-width:
 * calendar-large-width:
 * calendar-day-cell-large-width:
 * calendar-day-cell-large-height:
 * calendar-weekday-large-height:
 * calendar-weekday-large-width:
 * calendar-weeknumber-large-height:
 * calendar-weeknumber-large-width:
 * calendar-month-cell-large-width:
 * calendar-month-cell-large-height:
 * calendar-year-cell-large-width:
 * calendar-year-cell-large-height:
 * */
@Component({
  selector: 'nb-calendar',
  templateUrl: './calendar.component.html',
  imports: [NbBaseCalendarComponent],
})
export class NbCalendarComponent<D> {
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
   * What the calendar picks: a day (`date`, default), a month or a year, as the first day of the month or year.
   */
  readonly pickerMode = input<NbCalendarPickerMode>('date');

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
  readonly dayCellComponent = input<Type<NbCalendarCell<D, D>>>();

  /**
   * A component to render the months with, implementing `NbCalendarCell`.
   */
  readonly monthCellComponent = input<Type<NbCalendarCell<D, D>>>();

  /**
   * A component to render the years with, implementing `NbCalendarCell`.
   */
  readonly yearCellComponent = input<Type<NbCalendarCell<D, D>>>();

  /**
   * Size of the calendar and its cells: `medium` (default) or `large`.
   */
  readonly size = input<NbCalendarSize, NbCalendarSizeValues>(NbCalendarSize.MEDIUM, {
    transform: (size) => size as NbCalendarSize,
  });

  /**
   * The date whose month the calendar shows; the selected date, or today, by default. It supports two-way binding,
   * which follows the user's navigation.
   */
  readonly visibleDate = model<D>();

  /**
   * Shows the header with the view mode button and the previous and next buttons (default).
   */
  readonly showNavigation = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty });

  /**
   * The selected date.
   */
  readonly date = input<D>();

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
  readonly dateChange = output<D>();
}
