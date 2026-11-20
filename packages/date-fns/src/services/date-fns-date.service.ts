import { inject, Service } from '@angular/core';

import { NB_DATE_SERVICE_OPTIONS, NbNativeDateService } from '@liquid-js/lyr-core';

import { format as formatDate, getWeek, parse } from 'date-fns';

export interface NbDateFnsOptions {
  /** The format `format` and `parse` use when they're given none; without it they need one every time. */
  format: string;
  /** date-fns's options for `parse`, `format` and `getWeek`, e.g. the locale. */
  parseOptions: {};
  formatOptions: {};
  getWeekOptions: {};
}

@Service({ autoProvided: false })
export class NbDateFnsDateService extends NbNativeDateService {
  protected options: Partial<NbDateFnsOptions> = inject(NB_DATE_SERVICE_OPTIONS, { optional: true }) || {};

  override format(date: Date, format: string): string {
    if (date) {
      return formatDate(date, this.resolveFormat(format), this.options.formatOptions);
    }

    return '';
  }

  override parse(date: string, format: string): Date {
    const resolved = format || this.options.format;
    // Without a format the text can't be parsed; date-fns returns an invalid date for that, and so does this.
    return resolved ? parse(date, resolved, new Date(), this.options.parseOptions) : new Date(NaN);
  }

  override getId(): string {
    return 'date-fns';
  }

  /** The format given, or the options'; throws without either. */
  protected resolveFormat(format: string): string {
    const resolved = format || this.options.format;
    if (resolved === undefined) {
      throw new Error('format is required when using NbDateFnsDateModule');
    }
    return resolved;
  }

  override getWeekNumber(date: Date): number {
    return getWeek(date, this.options.getWeekOptions);
  }

  override getDateFormat(): string {
    // `yyyy` is the calendar year; `YYYY` is the week-numbering year, which date-fns rejects by default.
    return 'yyyy-MM-dd';
  }
}
