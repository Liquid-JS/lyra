import { inject, LOCALE_ID } from '@angular/core'

export enum NbDayPeriod {
    AM = 'AM', // before midday, 0 - 11 in 24-hour format.
    PM = 'PM' // after midday, 12 - 23 in 24-hour format.
}

/**
 * How long a month or weekday name is: `narrow` ("J", "S"), `abbreviated` ("Jan", "Sun"), `short` ("Su", for weekdays)
 * or `wide` ("January", "Sunday").
 */
export type NbDateNameWidth = 'narrow' | 'abbreviated' | 'short' | 'wide'

export abstract class NbDateService<D> {
    readonly DAYS_IN_WEEK: number = 7

    /**
     * Number of hours in an AM or PM day period.
     */
    readonly HOURS_IN_DAY_PERIOD = 12

    protected locale = inject(LOCALE_ID)

    setLocale(locale: string) {
        this.locale = locale
    }

    /**
     * Whether the date is after `start` and before `end`, neither included.
     */
    isBetween(date: D, start: D, end: D): boolean {
        return this.compareDates(date, start) > 0 && this.compareDates(date, end) < 0
    };

    /**
     * Whether two dates are on the same day; `false` when either is missing.
     */
    isSameDaySafe(date1?: D, date2?: D): boolean {
        return !!date1 && !!date2 && this.isSameDay(date1, date2)
    };

    /**
     * Whether two dates are in the same month; `false` when either is missing.
     */
    isSameMonthSafe(date1?: D, date2?: D): boolean {
        return !!date1 && !!date2 && this.isSameMonth(date1, date2)
    }

    /**
     * Whether two dates are in the same year; `false` when either is missing.
     */
    isSameYearSafe(date1?: D, date2?: D): boolean {
        return !!date1 && !!date2 && this.isSameYear(date1, date2)
    }

    /**
     * A copy of the date with the hour set.
     */
    abstract setHours(date: D, hour: number): D

    /**
     * A copy of the date with the minute set.
     */
    abstract setMinutes(date: D, minute: number): D

    /**
     * A copy of the date with the second set.
     */
    abstract setSeconds(date: D, second: number): D

    /**
     * A copy of the date with the milliseconds set.
     */
    abstract setMilliseconds(date: D, second: number): D
    /**
     * Whether the text is a date `parse` reads in the format given.
     */
    abstract isValidDateString(date: string, format?: string): boolean

    /**
     * Whether the text is a time `parse` reads in the format given.
     */
    abstract isValidTimeString(date: string, format: string): boolean

    abstract today(): D

    /**
     * The locale's short time format, e.g. `h:mm a`.
     */
    abstract getLocaleTimeFormat(): string

    /**
     * The day of the month, from 1.
     */
    abstract getDate(date: D): number

    abstract getHours(date: D): number

    abstract getMinutes(date: D): number

    abstract getSeconds(date: D): number

    abstract getMilliseconds(date: D): number

    /**
     * The month, 0 for January.
     */
    abstract getMonth(date: D): number

    abstract getYear(date: D): number

    /**
     * The day of the week, 0 for Sunday.
     */
    abstract getDayOfWeek(date: D): number

    /**
     * The locale's first day of the week: 0 for Sunday, 1 for Monday and so on.
     */
    abstract getFirstDayOfWeek(): number

    /**
     * The weekend days of the current locale, 0 being Sunday; Saturday and Sunday where the browser doesn't provide
     * the locale's week info.
     */
    getWeekendDays(): number[] {
        try {
            const locale = new Intl.Locale(this.locale) as Intl.Locale & {
                getWeekInfo?: () => { weekend: number[] }
                weekInfo?: { weekend: number[] }
            }
            const weekend = (locale.getWeekInfo?.() ?? locale.weekInfo)?.weekend
            if (weekend) {
                // Intl numbers the days from 1 (Monday) to 7 (Sunday).
                return weekend.map((day) => day % 7)
            }
        } catch {
            // An unknown locale, fall back to the default weekend.
        }
        return [6, 0]
    }

    /**
     * The locale's name of the date's month, abbreviated by default.
     */
    abstract getMonthName(date: D, style?: NbDateNameWidth): string

    /**
     * The locale's name of a month, 0 for January, abbreviated by default.
     */
    abstract getMonthNameByIndex(month: number, style?: NbDateNameWidth): string

    /**
     * The locale's weekday names, Sunday first, short by default.
     */
    abstract getDayOfWeekNames(style?: NbDateNameWidth): string[]

    /**
     * Reads a date from text in the format given.
     */
    abstract parse(date: string, format?: string): D

    /**
     * Writes the date in the format given.
     */
    abstract format(date: D, format?: string): string

    /**
     * A date from a year, a month (0 for January) and a day of the month.
     */
    abstract createDate(year: number, month: number, date: number): D

    abstract isSameYear(date1: D, date2: D): boolean

    abstract isSameMonth(date1: D, date2: D): boolean

    abstract isSameDay(date1: D, date2: D): boolean

    /**
     * Negative when the first date is earlier than the second, positive when later, and 0 when they are the same.
     */
    abstract compareDates(date1: D, date2: D): number

    abstract clone(date: D): D

    /**
     * The first day of the date's month.
     */
    abstract getMonthStart(date: D): D

    /**
     * The last day of the date's month.
     */
    abstract getMonthEnd(date: D): D

    /**
     * The first day of the date's year.
     */
    abstract getYearStart(date: D): D

    /**
     * The last day of the date's year.
     */
    abstract getYearEnd(date: D): D

    /**
     * The number of days in the date's month.
     */
    abstract getNumberOfDaysInMonth(date: D): number

    /**
     * A copy of the date, `days` days later, or earlier when negative.
     */
    abstract addDay(date: D, days: number): D

    /**
     * A copy of the date, `months` months later, or earlier when negative.
     */
    abstract addMonth(date: D, months: number): D

    /**
     * A copy of the date, `hour` hours later, or earlier when negative.
     */
    abstract addHours(date: D, hour: number): D

    /**
     * A copy of the date, `minute` minutes later, or earlier when negative.
     */
    abstract addMinutes(date: D, minute: number): D

    /**
     * A copy of the date, `years` years later, or earlier when negative.
     */
    abstract addYear(date: D, years: number): D

    /**
     * Names the service, e.g. `native`.
     */
    abstract getId(): string

    abstract getWeekNumber(date: D): number

    /**
     * The format of a date, e.g. in a datepicker's input.
     */
    abstract getDateFormat(): string

    /** The format of a month and its year, e.g. for a month picker; in ISO form, `yyyy-MM`, unless overridden. */
    getMonthFormat(): string {
        return 'yyyy-MM'
    }

    /** The format of a year, e.g. for a year picker; `yyyy`, unless overridden. */
    getYearFormat(): string {
        return 'yyyy'
    }

    abstract getTwelveHoursFormat(): string

    /**
     * The date as a number, e.g. its milliseconds since the epoch.
     */
    abstract valueOf(date: D): number

    isSameHourAndMinute(date1: D, date2: D): boolean {
        return this.isSameHour(date1, date2) && this.isSameMinute(date1, date2)
    }

    isSameHour(date1: D, date2: D): boolean {
        return this.getHours(date1) === this.getHours(date2)
    }

    isSameMinute(date1: D, date2: D): boolean {
        return this.getMinutes(date1) === this.getMinutes(date2)
    }

    getTwentyFourHoursFormat(): string {
        return 'HH:mm'
    }

    getTwentyFourHoursFormatWithSeconds(): string {
        return 'HH:mm:ss'
    }

    getTwelveHoursFormatWithSeconds(): string {
        return 'hh:mm:ss a'
    }

    getDayPeriod(date: D): NbDayPeriod {
        const isFirstDayPeriod = this.getHours(date) < this.HOURS_IN_DAY_PERIOD
        if (isFirstDayPeriod) {
            return NbDayPeriod.AM
        } else {
            return NbDayPeriod.PM
        }
    }
}
