import { Type, inject, Service } from '@angular/core'

import { NbCalendarRange } from '@liquid-js/lyr-core/calendar'
import { NbDateService } from '@liquid-js/lyr-core/calendar-kit'
import { NbDatepickerComponent, NbRangepickerComponent } from './datepicker.component'
import { NbDatepickerAdapter } from './datepicker.directive'
import { NbDateTimePickerComponent } from './date-timepicker.component'

/**
 * The adapter of `nb-datepicker`: the date service's parsing and formatting.
 */
@Service({ autoProvided: false })
export class NbDateAdapterService<D> extends NbDatepickerAdapter<D> {
    protected readonly dateService = inject<NbDateService<D>>(NbDateService)

    picker: Type<NbDatepickerComponent<D>> = NbDatepickerComponent

    parse(date: string, format?: string): D {
        return this.dateService.parse(date, format)
    }

    format(date?: D, format?: string): string {
        return date ? this.dateService.format(date, format) : ''
    }

    isValid(date: string, format?: string): boolean {
        return this.dateService.isValidDateString(date, format)
    }
}

/**
 * The adapter of `nb-rangepicker`: a range is written as `start – end`, with an en dash, in the picker's `format`, and
 * its start in `startFormat` where both are in one year, e.g. `Nov 1 – Nov 24, 2026`; it's read back from that, with a
 * hyphen too, a start in `startFormat` taking the end's year.
 */
@Service({ autoProvided: false })
export class NbRangeAdapterService<D> extends NbDatepickerAdapter<NbCalendarRange<D>> {
    protected readonly dateService = inject<NbDateService<D>>(NbDateService)

    picker: Type<NbRangepickerComponent<D>> = NbRangepickerComponent

    parse(range: string, format?: string, startFormat?: string): NbCalendarRange<D> {
        const [start, end] = this.split(range, format)
        return {
            start: this.shortStart(start, startFormat, end, format) ?? this.dateService.parse(start, format),
            end: end ? this.dateService.parse(end, format) : undefined
        }
    }

    format(range?: NbCalendarRange<D>, format?: string, startFormat?: string): string {
        if (!range) {
            return ''
        }

        const full = this.dateService.format(range.start, format)
        if (!this.dateService.isValidDateString(full, format)) {
            return ''
        }

        const end = range.end ? this.dateService.format(range.end, format) : ''
        if (!range.end || !this.dateService.isValidDateString(end, format)) {
            return full
        }
        // The start without the year it shares with the end, in its own format, if the picker gives one.
        const start = startFormat && this.dateService.isSameYear(range.start, range.end) ? this.dateService.format(range.start, startFormat) : full
        return `${start} – ${end}`
    }

    /**
     * The start written as `startFormat` writes it, e.g. `Nov 1`, in the end's year; undefined if it's written otherwise
     * or the end isn't a date.
     */
    protected shortStart(start: string, startFormat?: string, end?: string, format?: string): D | undefined {
        if (!startFormat || !end || !this.dateService.isValidDateString(end, format)) {
            return undefined
        }
        const short = this.dateService.parse(start, startFormat)
        // Only what the format writes: a lenient parser reads more, e.g. `Nov 1` as a day in 2001.
        if (!this.dateService.isValidDateString(start, startFormat) || this.dateService.format(short, startFormat) !== start) {
            return undefined
        }
        const year = this.dateService.getYear(this.dateService.parse(end, format))
        return this.dateService.createDate(year, this.dateService.getMonth(short), this.dateService.getDate(short))
    }

    isValid(range: string, format?: string, startFormat?: string): boolean {
        const [start, end] = this.split(range, format)
        if (!end) {
            return false
        }
        return (
            (this.dateService.isValidDateString(start, format) || !!this.shortStart(start, startFormat, end, format)) &&
            this.dateService.isValidDateString(end, format)
        )
    }
    /**
     * Splits a range typed into the input into its start and end. `format()` joins them with ` – `; a hyphen or an em
     * dash with spaces is read too, and a bare dash unless the date format itself contains dashes (e.g. `yyyy-MM-dd`).
     */
    protected split(range: string, format?: string): [string, string | undefined] {
        const separator = /\s+[-–—]\s+/
        if (separator.test(range)) {
            const [start, end] = range.split(separator)
            return [start.trim(), end?.trim() || undefined]
        }
        if (!format?.includes('-')) {
            const [start, end] = range.split(/[-–]/)
            return [start.trim(), end?.trim() || undefined]
        }
        return [range.trim(), undefined]
    }
}

/**
 * The adapter of `nb-date-timepicker`: as the date adapter, but `min` and `max` are compared with the time.
 */
@Service({ autoProvided: false })
export class NbDateTimeAdapterService<D> extends NbDatepickerAdapter<D> {
    protected readonly dateService = inject<NbDateService<D>>(NbDateService)

    picker: Type<NbDateTimePickerComponent<D>> = NbDateTimePickerComponent
    override readonly comparesTime = true

    parse(date: string, format?: string): D {
        return this.dateService.parse(date, format)
    }

    format(date?: D, format?: string): string {
        return date ? this.dateService.format(date, format) : ''
    }

    isValid(date: string, format?: string): boolean {
        return this.dateService.isValidDateString(date, format)
    }
}
