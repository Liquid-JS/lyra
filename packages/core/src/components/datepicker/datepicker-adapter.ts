import { Type, inject, Service } from '@angular/core';

import { NbCalendarRange } from '@liquid-js/lyr-core/calendar';
import { NbDatepickerComponent, NbRangepickerComponent } from './datepicker.component';
import { NbDatepickerAdapter } from './datepicker.directive';
import { NbDateService } from '@liquid-js/lyr-core/calendar-kit';
import { NbDateTimePickerComponent } from './date-timepicker.component';

/**
 * The adapter of `nb-datepicker`: the date service's parsing and formatting.
 */
@Service({ autoProvided: false })
export class NbDateAdapterService<D> extends NbDatepickerAdapter<D> {
  protected readonly dateService = inject<NbDateService<D>>(NbDateService);

  picker: Type<NbDatepickerComponent<D>> = NbDatepickerComponent;

  parse(date: string, format?: string): D {
    return this.dateService.parse(date, format);
  }

  format(date?: D, format?: string): string {
    return date ? this.dateService.format(date, format) : '';
  }

  isValid(date: string, format?: string): boolean {
    return this.dateService.isValidDateString(date, format);
  }
}

/**
 * The adapter of `nb-rangepicker`: a range is written as `start - end`, and read back from that.
 */
@Service({ autoProvided: false })
export class NbRangeAdapterService<D> extends NbDatepickerAdapter<NbCalendarRange<D>> {
  protected readonly dateService = inject<NbDateService<D>>(NbDateService);

  picker: Type<NbRangepickerComponent<D>> = NbRangepickerComponent;

  parse(range: string, format?: string): NbCalendarRange<D> {
    const [start, end] = this.split(range, format);
    return {
      start: this.dateService.parse(start, format),
      end: end ? this.dateService.parse(end, format) : undefined,
    };
  }

  format(range?: NbCalendarRange<D>, format?: string): string {
    if (!range) {
      return '';
    }

    const start = this.dateService.format(range.start, format);
    const isStartValid = this.dateService.isValidDateString(start, format);

    if (!isStartValid) {
      return '';
    }

    const end = range.end ? this.dateService.format(range.end, format) : '';
    const isEndValid = this.dateService.isValidDateString(end, format);

    if (isEndValid) {
      return `${start} - ${end}`;
    } else {
      return start;
    }
  }

  isValid(range: string, format?: string): boolean {
    const [start, end] = this.split(range, format);
    return (
      !!end && this.dateService.isValidDateString(start, format) && this.dateService.isValidDateString(end, format)
    );
  }
  /**
   * Splits a range typed into the input into its start and end. `format()` joins them with ` - `; a bare `-` is
   * accepted too, unless the date format itself contains dashes (such as `yyyy-MM-dd`).
   */
  protected split(range: string, format?: string): [string, string | undefined] {
    const separator = /\s+-\s+/;
    if (separator.test(range)) {
      const [start, end] = range.split(separator);
      return [start.trim(), end?.trim() || undefined];
    }
    if (!format?.includes('-')) {
      const [start, end] = range.split('-');
      return [start.trim(), end?.trim() || undefined];
    }
    return [range.trim(), undefined];
  }
}

/**
 * The adapter of `nb-date-timepicker`: as the date adapter, but `min` and `max` are compared with the time.
 */
@Service({ autoProvided: false })
export class NbDateTimeAdapterService<D> extends NbDatepickerAdapter<D> {
  protected readonly dateService = inject<NbDateService<D>>(NbDateService);

  picker: Type<NbDateTimePickerComponent<D>> = NbDateTimePickerComponent;
  override readonly comparesTime = true;

  parse(date: string, format?: string): D {
    return this.dateService.parse(date, format);
  }

  format(date?: D, format?: string): string {
    return date ? this.dateService.format(date, format) : '';
  }

  isValid(date: string, format?: string): boolean {
    return this.dateService.isValidDateString(date, format);
  }
}
