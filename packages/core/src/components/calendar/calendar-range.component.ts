import { Component, computed, ElementRef, forwardRef, inject, input, linkedSignal, model, Type, untracked } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

import { NbCalendarCell, NbCalendarSize, NbCalendarViewMode, NbCalendarSizeValues, NbCalendarViewModeValues, NbDateService } from '@liquid-js/lyr-core/calendar-kit'
import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base'
import { NbCalendarRangeDayCellComponent } from './calendar-range-day-cell.component'
import { NbCalendarRangeYearCellComponent } from './calendar-range-year-cell.component'
import { NbCalendarRangeMonthCellComponent } from './calendar-range-month-cell.component'
import { NbBaseCalendarComponent } from './base-calendar.component'

export interface NbCalendarRange<D> {
    start: D
    end?: D
}

/**
 * Picks a range of dates: the first date picked is its start, the second its end, and a date before the start becomes
 * the start, the old start the end.
 *
 * ```html
 * <nb-calendar-range [(range)]="range"></nb-calendar-range>
 * <nb-calendar-range [range]="range" (rangeChange)="handleRangeChange($event)"></nb-calendar-range>
 * ```
 *
 * Basic usage example
 *
 * @stacked-example(Range, calendar/calendar-range-showcase.component)
 *
 * ### Installation
 *
 * Import `NbCalendarRangeComponent` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbCalendarRangeComponent],
 * })
 * export class PageComponent { }
 * ```
 *
 * With NgModules:
 *
 * Import `NbCalendarRangeModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbCalendarRangeModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 *
 * ### Usage
 *
 * It has the calendar's inputs; see the [Calendar component docs](components/more/calendar).
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
    selector: 'nb-calendar-range',
    templateUrl: './calendar-range.component.html',
    imports: [NbBaseCalendarComponent],
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NbCalendarRangeComponent), multi: true }],
    host: {
        '[attr.aria-disabled]': 'isDisabled() || null',
        '(focusout)': 'onFocusOut($event)'
    }
})
export class NbCalendarRangeComponent<D> implements ControlValueAccessor {
    protected readonly dateService = inject<NbDateService<D>>(NbDateService)
    protected readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef)

    /**
     * Fills the first and last weeks with the days of the months around the one shown; without it those cells are
     * empty.
     */
    readonly boundingMonth = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty })

    /**
     * The view the calendar opens on: `date` (default), `month` or `year`.
     */
    readonly startView = input<NbCalendarViewMode, NbCalendarViewModeValues>(NbCalendarViewMode.DATE, {
        transform: (viewMode) => viewMode as NbCalendarViewMode
    })

    /**
     * The earliest date that can be picked: earlier days are disabled, its own day whatever its time, and so are the
     * months and years that end before it.
     */
    readonly min = input<D>()

    /**
     * The latest date that can be picked: later days are disabled, its own day whatever its time, and so are the
     * months and years that start after it.
     */
    readonly max = input<D>()

    /**
     * Disables the days for which it returns `false`. Months and years aren't filtered.
     */
    readonly filter = input<(date: D) => boolean>()

    /**
     * A component to render the days with, implementing `NbCalendarCell`; one that shows the range by default.
     */
    readonly dayCellComponentInput = input<Type<NbCalendarCell<D, NbCalendarRange<D>>>>(undefined, {
        alias: 'dayCellComponent'
    })
    readonly dayCellComponent = computed<Type<NbCalendarCell<D, NbCalendarRange<D>>>>(
        () => this.dayCellComponentInput() || NbCalendarRangeDayCellComponent
    )

    /**
     * A component to render the months with, implementing `NbCalendarCell`; one that shows the range by default.
     */
    readonly monthCellComponentInput = input<Type<NbCalendarCell<D, NbCalendarRange<D>>>>(undefined, {
        alias: 'monthCellComponent'
    })
    readonly monthCellComponent = computed<Type<NbCalendarCell<D, NbCalendarRange<D>>>>(
        () => this.monthCellComponentInput() || NbCalendarRangeMonthCellComponent<D>
    )

    /**
     * A component to render the years with, implementing `NbCalendarCell`; one that shows the range by default.
     */
    readonly yearCellComponentInput = input<Type<NbCalendarCell<D, NbCalendarRange<D>>>>(undefined, {
        alias: 'yearCellComponent'
    })
    readonly yearCellComponent = computed<Type<NbCalendarCell<D, NbCalendarRange<D>>>>(
        () => this.yearCellComponentInput() || NbCalendarRangeYearCellComponent<D>
    )

    /**
     * Size of the calendar and its cells: `medium` (default) or `large`.
     */
    readonly size = input<NbCalendarSize, NbCalendarSizeValues>(NbCalendarSize.MEDIUM, {
        transform: (size) => size as NbCalendarSize
    })

    /**
     * The date whose month the calendar shows; the range's start, or today, by default. It supports two-way binding,
     * which follows the user's navigation.
     */
    readonly visibleDate = model<D>()

    /**
     * Shows the header with the view mode button and the previous and next buttons (default).
     */
    readonly showNavigation = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty })

    /**
     * The selected range. `rangeChange` emits once with the start alone, and again with the end.
     */
    readonly range = model<NbCalendarRange<D>>()

    /** Disables every day; a form control's disabled state does too. */
    readonly disabled = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /** Whether the days are disabled: the `disabled` input, or the form's disabled state, whichever changed last. */
    readonly isDisabled = linkedSignal(() => this.disabled())

    /** The days that can be picked: none while disabled, else those `filter` allows. */
    protected readonly pickable = computed(() => (this.isDisabled() ? () => false : this.filter()))

    protected onChange: (value: NbCalendarRange<D>) => void = () => {}
    protected onTouched: () => void = () => {}

    /**
     * Shows a column with the week numbers before the days; off by default.
     */
    readonly showWeekNumber = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * The header of the week numbers column; `#` by default.
     */
    readonly weekNumberSymbol = input<string>()

    /**
     * The first day of the week: 0 for Sunday, 1 for Monday and so on; the locale's by default.
     */
    readonly firstDayOfWeek = input<number>()

    /** @internal */
    pick(date: D) {
        const { start, end } = this.range() ?? { start: null, end: null }
        const next = start && !end ? this.withEnd(start, date) : { start: date }
        this.range.set(next)
        this.onChange(next)
        this.onTouched()
    }

    private withEnd(start: D, date: D): NbCalendarRange<D> {
        return this.dateService.compareDates(date, start) > 0 ? { start, end: date } : { start: date, end: start }
    }

    /** @internal */
    onFocusOut(event: FocusEvent) {
        if (!this.hostElement.nativeElement.contains(event.relatedTarget as Node | null)) {
            this.onTouched()
        }
    }

    // Untracked, as forms write values from wherever the app sets them.
    writeValue(value: NbCalendarRange<D> | null | undefined) {
        untracked(() => this.range.set(value ?? undefined))
    }

    registerOnChange(fn: (value: NbCalendarRange<D>) => void) {
        this.onChange = fn
    }

    registerOnTouched(fn: () => void) {
        this.onTouched = fn
    }

    setDisabledState(isDisabled: boolean) {
        this.isDisabled.set(isDisabled)
    }
}
