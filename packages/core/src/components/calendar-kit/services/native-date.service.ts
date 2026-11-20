import { LOCALE_ID, inject, Service } from '@angular/core'
import { FormatWidth, getLocaleTimeFormat, DatePipe, FormStyle, getLocaleDayNames, getLocaleFirstDayOfWeek, getLocaleMonthNames, TranslationWidth } from '@angular/common'
import { NbDateNameWidth, NbDateService } from './date.service'
import { nbParseDateFormat } from './native-date-parse'

/* eslint-disable @typescript-eslint/no-deprecated -- Angular's bundled locale data, see getLocaleTimeFormat() */
const TRANSLATION_WIDTHS: Record<NbDateNameWidth, TranslationWidth> = {
    narrow: TranslationWidth.Narrow,
    abbreviated: TranslationWidth.Abbreviated,
    short: TranslationWidth.Short,
    wide: TranslationWidth.Wide
}
/* eslint-enable @typescript-eslint/no-deprecated */

/**
 * The `NbDateService` for JavaScript `Date` objects, with names and formats from Angular's bundled locale data.
 */
@Service({ autoProvided: false })
export class NbNativeDateService extends NbDateService<Date> {
    protected datePipe = new DatePipe(this.locale)

    constructor() {
        const locale = inject(LOCALE_ID)

        super()
        this.setLocale(locale)
    }

    override setLocale(locale: string) {
        super.setLocale(locale)
        this.datePipe = new DatePipe(locale)
    }

    setHours(date: Date, hour: number): Date {
        const result: Date = this.clone(date)
        result.setHours(hour)

        return result
    }

    setMinutes(date: Date, minute: number): Date {
        const result: Date = this.clone(date)
        result.setMinutes(minute)

        return result
    }

    setSeconds(date: Date, second: number): Date {
        const result: Date = this.clone(date)
        result.setSeconds(second)

        return result
    }

    setMilliseconds(date: Date, second: number): Date {
        const result: Date = this.clone(date)
        result.setMilliseconds(second)

        return result
    }

    isValidDateString(date: string, format?: string): boolean {
        return !isNaN(this.parse(date, format).getTime())
    }

    isValidTimeString(date: string, format: string): boolean {
        return this.isValidDateString(date, format)
    }

    today(): Date {
        return new Date()
    }

    // Angular's locale data getters are deprecated in favour of Intl, but they read the CLDR data compiled into the app,
    // so names, the first weekday and the time pattern are the same in every browser; Intl follows each browser's own
    // CLDR version (in Safari, the OS's).
    /* eslint-disable @typescript-eslint/no-deprecated */
    getLocaleTimeFormat(): string {
        return getLocaleTimeFormat(this.locale, FormatWidth.Short)
    }
    /* eslint-enable @typescript-eslint/no-deprecated */

    getDate(date: Date): number {
        return date.getDate()
    }

    getMonth(date: Date): number {
        return date.getMonth()
    }

    getYear(date: Date): number {
        return date.getFullYear()
    }

    getDayOfWeek(date: Date): number {
        return date.getDay()
    }

    /* eslint-disable @typescript-eslint/no-deprecated -- Angular's bundled locale data, as in getLocaleTimeFormat() */
    getFirstDayOfWeek(): number {
        return getLocaleFirstDayOfWeek(this.locale)
    }

    getMonthName(date: Date, style: NbDateNameWidth = 'abbreviated'): string {
        return this.getMonthNameByIndex(date.getMonth(), style)
    }

    getMonthNameByIndex(index: number, style: NbDateNameWidth = 'abbreviated'): string {
        return getLocaleMonthNames(this.locale, FormStyle.Format, TRANSLATION_WIDTHS[style])[index]
    }

    getDayOfWeekNames(style: NbDateNameWidth = 'short'): string[] {
        return [...getLocaleDayNames(this.locale, FormStyle.Format, TRANSLATION_WIDTHS[style])]
    }
    /* eslint-enable @typescript-eslint/no-deprecated */

    format(date: Date, format?: string): string {
    // `DatePipe` returns null only for an empty value, never for a date.
        return this.datePipe.transform(date, format) ?? ''
    }

    /**
     * Reads a date in the format given, as `format` writes it: its years, months, days, weekdays, times and text, with
     * the locale's names, or a named date format such as `mediumDate`. Text that doesn't follow it, and any text without
     * a format or with one that has other parts, it reads as `Date.parse` does.
     *
     * A date in ISO form without a time, e.g. `2026-03-15`, `2026-03` or `2026`, is that local day; `Date.parse` takes
     * it as midnight UTC, which is the day before west of UTC.
     */
    parse(date: string, format?: string): Date {
        const create = (year: number, month: number, day: number) => this.createDate(year, month, day)
        const formatted = format ? nbParseDateFormat(date, format, this.locale, create) : undefined
        // In the format first, a day that doesn't exist included; text that doesn't follow it, e.g. another way of
        // writing the date, as `Date.parse` reads it.
        if (formatted) {
            return formatted
        }
        const iso = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(date.trim())
        if (iso) {
            const [year, month, day] = [Number(iso[1]), Number(iso[2] ?? 1) - 1, Number(iso[3] ?? 1)]
            const local = this.createDate(year, month, day)
            // Not a day that exists, e.g. 2026-02-30.
            return local.getMonth() === month && local.getDate() === day ? local : new Date(NaN)
        }
        return new Date(Date.parse(date))
    }

    addDay(date: Date, num: number): Date {
        return this.createDate(date.getFullYear(), date.getMonth(), date.getDate() + num)
    }

    addMonth(date: Date, num: number): Date {
        const month = this.createDate(date.getFullYear(), date.getMonth() + num, 1)
        // The day is clamped to the month's length; `Date` would overflow into the next month instead.
        month.setDate(Math.min(date.getDate(), this.getMonthEnd(month).getDate()))
        return month
    }

    addMinutes(date: Date, minute: number): Date {
        const result: Date = new Date(date)
        result.setMinutes(date.getMinutes() + minute)

        return result
    }

    addHours(date: Date, hour: number): Date {
        const result: Date = new Date(date)
        result.setHours(date.getHours() + hour)

        return result
    }

    getHours(date: Date): number {
        return date.getHours()
    }

    getMinutes(date: Date): number {
        return date.getMinutes()
    }

    getSeconds(date: Date): number {
        return date.getSeconds()
    }

    getMilliseconds(date: Date): number {
        return date.getMilliseconds()
    }

    addYear(date: Date, num: number): Date {
        return this.createDate(date.getFullYear() + num, date.getMonth(), date.getDate())
    }

    clone(date: Date): Date {
        return new Date(date.getTime())
    }

    compareDates(date1: Date, date2: Date): number {
        return date1.getTime() - date2.getTime()
    }

    createDate(year: number, month: number, date: number): Date {
        const result = new Date(year, month, date)

        // `Date` takes the years 0 to 99 as 1900 to 1999.
        if (year >= 0 && year < 100) {
            result.setFullYear(result.getFullYear() - 1900)
        }
        return result
    }

    getMonthEnd(date: Date): Date {
        return this.createDate(date.getFullYear(), date.getMonth() + 1, 0)
    }

    getMonthStart(date: Date): Date {
        return this.createDate(date.getFullYear(), date.getMonth(), 1)
    }

    getNumberOfDaysInMonth(date: Date): number {
        return this.getMonthEnd(date).getDate()
    }

    getYearEnd(date: Date): Date {
        return this.createDate(date.getFullYear(), 11, 31)
    }

    getYearStart(date: Date): Date {
        return this.createDate(date.getFullYear(), 0, 1)
    }

    valueOf(date: Date): number {
        return date.valueOf()
    }

    isSameDay(date1: Date, date2: Date): boolean {
        return this.isSameMonth(date1, date2) &&
            date1.getDate() === date2.getDate()
    }

    isSameMonth(date1: Date, date2: Date): boolean {
        return this.isSameYear(date1, date2) &&
            date1.getMonth() === date2.getMonth()
    }

    isSameYear(date1: Date, date2: Date): boolean {
        return date1.getFullYear() === date2.getFullYear()
    }

    getId(): string {
        return 'native'
    }

    getWeekNumber(date: Date): number {
    // `DatePipe` returns null only for an empty value, never for a date.
        return parseInt(this.datePipe.transform(date, 'w') ?? '', 10)
    }

    getDateFormat(): string {
        return 'yyyy-MM-dd'
    }

    getTwelveHoursFormat(): string {
        return 'hh:mm a'
    }
}
