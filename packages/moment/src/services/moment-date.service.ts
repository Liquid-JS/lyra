import { LOCALE_ID, inject, Service } from '@angular/core';

import { NbDateNameWidth, NbDateService } from '@liquid-js/lyr-core';

// moment is a CommonJS package whose only export is the moment function, so it has no named alternative.
import moment, { type LongDateFormatKey, type Moment } from 'moment';

@Service({ autoProvided: false })
export class NbMomentDateService extends NbDateService<Moment> {
  protected localeData = this.readMomentLocaleData(inject(LOCALE_ID));

  protected readonly TIME_ONLY_FORMAT_KEY: LongDateFormatKey = 'LT';
  constructor() {
    const locale = inject(LOCALE_ID);

    super();
    this.setLocale(locale);
  }

  override setLocale(locale: string) {
    super.setLocale(locale);
    this.setMomentLocaleData(locale);
  }

  setHours(date: Moment, hour: number): Moment {
    return this.clone(date).set({ hour });
  }

  setMinutes(date: Moment, minute: number): Moment {
    return this.clone(date).set({ minute });
  }

  setSeconds(date: Moment, second: number): Moment {
    return this.clone(date).set({ second });
  }

  setMilliseconds(date: Moment, milliseconds: number): Moment {
    return this.clone(date).set({ milliseconds });
  }

  addDay(date: Moment, days: number): Moment {
    return this.clone(date).add({ days });
  }

  addMonth(date: Moment, months: number): Moment {
    return this.clone(date).add({ months });
  }

  addYear(date: Moment, years: number): Moment {
    return this.clone(date).add({ years });
  }

  addMinutes(date: Moment, minute: number): Moment {
    return this.clone(date).add({ minute });
  }

  addHours(date: Moment, hour: number): Moment {
    return this.clone(date).add({ hour });
  }

  clone(date: Moment): Moment {
    return date.clone().locale(this.locale);
  }

  valueOf(date: Moment): number {
    return date.valueOf();
  }

  compareDates(date1: Moment, date2: Moment): number {
    return this.getYear(date1) - this.getYear(date2) ||
      this.getMonth(date1) - this.getMonth(date2) ||
      this.getDate(date1) - this.getDate(date2);
  }

  createDate(year: number, month: number, date: number): Moment {
    return moment([year, month, date]);
  }

  format(date: Moment, format: string): string {
    if (date) {
      return date.format(format || this.localeData.defaultFormat);
    }

    return '';
  }

  getLocaleTimeFormat(): string {
    return moment.localeData().longDateFormat(this.TIME_ONLY_FORMAT_KEY);
  }

  getDate(date: Moment): number {
    return this.clone(date).date();
  }

  getDayOfWeek(date: Moment): number {
    return this.clone(date).day();
  }

  getDayOfWeekNames(style: NbDateNameWidth = 'narrow'): string[] {
    return this.localeData.days[style];
  }

  getFirstDayOfWeek(): number {
    return this.localeData.firstDayOfWeek;
  }

  getMonth(date: Moment): number {
    return date.month();
  }

  getHours(date: Moment): number {
    return date.hour();
  }

  getMinutes(date: Moment): number {
    return date.minute();
  }

  getSeconds(date: Moment): number {
    return date.second();
  }

  getMilliseconds(date: Moment): number {
    return date.milliseconds();
  }

  getMonthEnd(date: Moment): Moment {
    return this.clone(date).endOf('month');
  }

  getMonthName(date: Moment, style: NbDateNameWidth = 'abbreviated'): string {
    const month = this.getMonth(date);
    return this.getMonthNameByIndex(month, style);
  }

  getMonthNameByIndex(month: number, style: NbDateNameWidth = 'abbreviated'): string {
    return this.localeData.months[style][month];
  }

  getMonthStart(date: Moment): Moment {
    return this.clone(date).startOf('month');
  }

  getNumberOfDaysInMonth(date: Moment): number {
    return this.clone(date).daysInMonth();
  }

  getYear(date: Moment): number {
    return this.clone(date).year();
  }

  getYearEnd(date: Moment): Moment {
    return this.clone(date).endOf('year');
  }

  getYearStart(date: Moment): Moment {
    return this.clone(date).startOf('year');
  }

  isSameDay(date1: Moment, date2: Moment): boolean {
    return this.isSameMonth(date1, date2) && this.getDate(date1) === this.getDate(date2);
  }

  isSameMonth(date1: Moment, date2: Moment): boolean {
    return this.isSameYear(date1, date2) && this.getMonth(date1) === this.getMonth(date2);
  }

  isSameYear(date1: Moment, date2: Moment): boolean {
    return this.getYear(date1) === this.getYear(date2);
  }

  isValidDateString(date: string, format: string): boolean {
    return this.parse(date, format).isValid();
  }

  isValidTimeString(date: string, format: string): boolean {
    return moment(date, format, true).isValid();
  }

  parse(date: string, format: string): Moment {
    return moment(date, format || this.localeData.defaultFormat);
  }

  today(): Moment {
    return moment();
  }

  getId(): string {
    return 'moment';
  }

  protected setMomentLocaleData(locale: string) {
    this.localeData = this.readMomentLocaleData(locale);
  }

  /** The first day of the week, the default format, and the names of the months and days of `locale`, from moment. */
  protected readMomentLocaleData(locale: string): {
    firstDayOfWeek: number;
    defaultFormat: string;
    months: Record<NbDateNameWidth, string[]>;
    days: Record<NbDateNameWidth, string[]>;
  } {
    const momentLocaleData = moment.localeData(locale);
    const monthsShort = momentLocaleData.monthsShort();

    return {
      firstDayOfWeek: momentLocaleData.firstDayOfWeek(),
      defaultFormat: momentLocaleData.longDateFormat('L'),
      // Moment has two widths of month names and three of weekday names; the others take the nearest, and narrow month
      // names are the first letter of the short ones, as CLDR's mostly are ("J", "F", "M"; "J" for "janv.").
      months: {
        narrow: monthsShort.map((name) => (Array.from(name)[0] ?? '').toLocaleUpperCase(locale)),
        abbreviated: monthsShort,
        short: monthsShort,
        wide: momentLocaleData.months(),
      },
      days: {
        narrow: momentLocaleData.weekdaysMin(),
        abbreviated: momentLocaleData.weekdaysShort(),
        short: momentLocaleData.weekdaysShort(),
        wide: momentLocaleData.weekdays(),
      },
    };
  }

  getWeekNumber(date: Moment): number {
    return date.week();
  }

  getDateFormat(): string {
    return 'YYYY-MM-DD';
  }

  override getMonthFormat(): string {
    return 'YYYY-MM';
  }

  override getYearFormat(): string {
    return 'YYYY';
  }

  getTwelveHoursFormat(): string {
    return 'hh:mm A';
  }
}
