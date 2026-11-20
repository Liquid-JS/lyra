import { NgModule } from '@angular/core';

import { NbButtonModule } from '@liquid-js/lyr-core/button';
import { NbIconModule } from '@liquid-js/lyr-core/icon';

import { NbCalendarDayCellComponent } from './components/calendar-day-picker/calendar-day-cell.component';
import { NbCalendarDayPickerComponent } from './components/calendar-day-picker/calendar-day-picker.component';
import { NbCalendarDaysNamesComponent } from './components/calendar-days-names/calendar-days-names.component';
import { NbCalendarMonthCellComponent } from './components/calendar-month-picker/calendar-month-cell.component';
import { NbCalendarMonthPickerComponent } from './components/calendar-month-picker/calendar-month-picker.component';
import { NbCalendarViewModeComponent } from './components/calendar-navigation/calendar-view-mode.component';
import {
  NbCalendarPageableNavigationComponent,
} from './components/calendar-navigation/calendar-pageable-navigation.component';
import { NbCalendarPickerComponent } from './components/calendar-picker/calendar-picker.component';
import { NbCalendarPickerRowComponent } from './components/calendar-picker/calendar-picker-row.component';
import { NbCalendarYearCellComponent } from './components/calendar-year-picker/calendar-year-cell.component';
import { NbCalendarYearPickerComponent } from './components/calendar-year-picker/calendar-year-picker.component';
import { NbCalendarWeekNumberComponent } from './components/calendar-week-number/calendar-week-number.component';

import { NbCalendarActionsComponent } from './components/calendar-actions/calendar-actions.component';

const COMPONENTS = [
  NbCalendarViewModeComponent,
  NbCalendarPageableNavigationComponent,
  NbCalendarDaysNamesComponent,
  NbCalendarYearPickerComponent,
  NbCalendarMonthPickerComponent,
  NbCalendarDayPickerComponent,
  NbCalendarDayCellComponent,
  NbCalendarActionsComponent,
  NbCalendarMonthCellComponent,
  NbCalendarYearCellComponent,
  NbCalendarPickerRowComponent,
  NbCalendarPickerComponent,
  NbCalendarWeekNumberComponent,
];

/**
 * The parts the calendars are built from, for building a calendar of your own: the day, month and year pickers and
 * their cells, the weekday names, the week numbers, the view mode and previous/next navigation, and the actions of a
 * time picker.
 *
 * For example, a full calendar:
 * @stacked-example(Full calendar, calendar-kit/calendar-kit-full-calendar.component)
 */
@NgModule({
  imports: [NbButtonModule, NbIconModule, ...COMPONENTS],
  exports: [...COMPONENTS],
})
export class NbCalendarKitModule {
}
