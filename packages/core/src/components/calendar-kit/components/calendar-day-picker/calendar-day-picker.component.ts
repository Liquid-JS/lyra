import {
    Component,
    computed,
    inject,
    input,
    output,
    Type
} from '@angular/core'

import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base'
import { NbCalendarCell, NbCalendarSize, NbCalendarSizeValues } from '../../model'
import { NbCalendarMonthModelService } from '../../services/calendar-month-model.service'
import { NbCalendarWeekNumberComponent } from '../calendar-week-number/calendar-week-number.component'
import { NbCalendarDaysNamesComponent } from '../calendar-days-names/calendar-days-names.component'
import { NbCalendarPickerComponent } from '../calendar-picker/calendar-picker.component'
import { NbCalendarDayCellComponent } from './calendar-day-cell.component'

/**
 * A month of days to pick from: the weekday names, the grid of days and, with `showWeekNumber`, the week numbers.
 */
@Component({
    selector: 'nb-calendar-day-picker',
    templateUrl: './calendar-day-picker.component.html',
    styleUrls: ['./calendar-day-picker.component.scss'],
    imports: [NbCalendarWeekNumberComponent, NbCalendarDaysNamesComponent, NbCalendarPickerComponent],
    host: {
        '[class.size-large]': 'large()'
    }
})
export class NbCalendarDayPickerComponent<D, T> {
    private readonly monthModel = inject<NbCalendarMonthModelService<D>>(NbCalendarMonthModelService)

    /**
     * A date in the month shown.
     */
    readonly visibleDate = input.required<D>()

    /**
     * Fills the first and last weeks with the days of the months around the one shown; without it those cells are
     * empty.
     */
    readonly boundingMonths = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty })

    /**
     * The earliest date that can be picked; earlier days are disabled, its own day whatever its time.
     */
    readonly min = input<D>()

    /**
     * The latest date that can be picked; later days are disabled, its own day whatever its time.
     */
    readonly max = input<D>()

    /**
     * Disables the days for which it returns `false`.
     */
    readonly filter = input<(date: D) => boolean>()

    /**
     * A component to render the days with, implementing `NbCalendarCell`; `nb-calendar-day-cell` by default.
     */
    readonly cellComponentInput = input<Type<NbCalendarCell<D, T>>>(undefined, { alias: 'cellComponent' })
    readonly cellComponent = computed<Type<NbCalendarCell<D, T | D>>>(
        () => this.cellComponentInput() || NbCalendarDayCellComponent
    )

    /**
     * Size of the cells: `medium` (default) or `large`.
     */
    readonly size = input<NbCalendarSize, NbCalendarSizeValues>(NbCalendarSize.MEDIUM, {
        transform: (size) => size as NbCalendarSize
    })

    /**
     * The selected value, which the cells show as selected.
     */
    readonly date = input<T>()

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

    /**
     * Emits the picked day.
     */
    readonly dateChange = output<D>()

    readonly large = computed(() => this.size() === NbCalendarSize.LARGE)

    /**
     * The days shown, by week; the cells of the months around are `undefined` without `boundingMonths`.
     */
    readonly weeks = computed<Array<Array<D | undefined>>>(() =>
        this.monthModel.createDaysGrid(this.visibleDate(), this.boundingMonths(), this.firstDayOfWeek())
    )

    onSelect(day: D) {
        this.dateChange.emit(day)
    }
}
