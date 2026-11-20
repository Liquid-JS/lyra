import {
    Component,
    computed,
    inject,
    input,
    output,
    Type
} from '@angular/core'
import { batch } from '../../helpers'
import { NbCalendarCell, NbCalendarSize, NbCalendarSizeValues } from '../../model'
import { NbDateService } from '../../services/date.service'
import { NbCalendarPickerComponent } from '../calendar-picker/calendar-picker.component'
import { NbCalendarMonthCellComponent } from './calendar-month-cell.component'

export const MONTHS_IN_VIEW = 12
export const MONTHS_IN_COLUMN = 4

/**
 * The twelve months of a year to pick from, in rows of four.
 */
@Component({
    selector: 'nb-calendar-month-picker',
    templateUrl: './calendar-month-picker.component.html',
    imports: [NbCalendarPickerComponent],
    host: {
        '[class.size-large]': 'large()'
    }
})
export class NbCalendarMonthPickerComponent<D, T> {
    protected readonly dateService = inject<NbDateService<D>>(NbDateService)

    readonly min = input<D>()

    readonly max = input<D>()

    readonly filter = input<(date: D) => boolean>()
    readonly size = input<NbCalendarSize, NbCalendarSizeValues>(NbCalendarSize.MEDIUM, {
        transform: (size) => size as NbCalendarSize
    })

    /**
     * A date in the year whose months are shown.
     */
    readonly month = input.required<D>()

    /**
     * The selected date, whose month the cells show as selected.
     */
    readonly date = input<D>()

    readonly monthChange = output<D>()

    readonly cellComponentInput = input<Type<NbCalendarCell<D, T>>>(undefined, { alias: 'cellComponent' })
    readonly cellComponent = computed<Type<NbCalendarCell<D, T | D>>>(
        () => this.cellComponentInput() || NbCalendarMonthCellComponent<D>
    )

    readonly large = computed(() => this.size() === NbCalendarSize.LARGE)

    readonly months = computed<D[][]>(() => {
        const month = this.month()
        const date = this.dateService.getDate(month)
        const year = this.dateService.getYear(month)
        const firstMonth = this.dateService.createDate(year, 0, date)
        const months = [firstMonth]

        for (let monthIndex = 1; monthIndex < MONTHS_IN_VIEW; monthIndex++) {
            months.push(this.dateService.addMonth(firstMonth, monthIndex))
        }

        return batch(months, MONTHS_IN_COLUMN)
    })

    onSelect(month: D) {
        this.monthChange.emit(month)
    }
}
