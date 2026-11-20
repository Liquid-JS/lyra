import { OutputRef, Signal } from '@angular/core'

export interface NbCalendarDay {
    name: string
    isHoliday: boolean
}

export type NbCalendarViewModeValues = 'year' | 'month' | 'date'

/** What a calendar picks: a day (`date`), a month or a year. */
export type NbCalendarPickerMode = 'date' | 'month' | 'year'
export enum NbCalendarViewMode {
    YEAR = 'year',
    MONTH = 'month',
    DATE = 'date'
}

export type NbCalendarSizeValues = 'medium' | 'large'
export enum NbCalendarSize {
    MEDIUM = 'medium',
    LARGE = 'large'
}

/**
 * A calendar cell, which the calendar pickers render with signal inputs and listen to through `select`.
 */
export interface NbCalendarCell<D, T> {
    date: Signal<D | undefined>
    select: OutputRef<D>
    selectedValue?: Signal<T | undefined>
    visibleDate?: Signal<D | undefined>
    min?: Signal<D | undefined>
    max?: Signal<D | undefined>
    filter?: Signal<((date: D) => boolean) | undefined>
    size?: Signal<NbCalendarSize>
}
