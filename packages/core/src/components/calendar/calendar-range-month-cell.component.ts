import { Component, computed, DestroyRef, inject, input, output } from '@angular/core'

import { NbCalendarCell, NbCalendarSize, NbCalendarSizeValues, NbDateService } from '@liquid-js/lyr-core/calendar-kit'
import { NbCalendarRange } from './calendar-range.component'
import { NbBaseCalendarRangeCell } from './base-calendar-range-cell'

@Component({
    selector: 'nb-calendar-range-month-cell',
    templateUrl: './calendar-range-month-cell.component.html',
    host: {
        'class': 'month-cell range-cell',
        '[class.selected]': 'selected()',
        '[class.in-range]': 'inRange()',
        '[class.start]': 'rangeStart()',
        '[class.end]': 'rangeEnd()',
        '[class.today]': 'today()',
        '[class.disabled]': 'disabled()',
        '[class.size-large]': 'isLarge()',
        '(click)': 'onClick()'
    }
})
export class NbCalendarRangeMonthCellComponent<D> extends NbBaseCalendarRangeCell<D>
    implements NbCalendarCell<D, NbCalendarRange<D>> {
    protected readonly destroyRef = inject(DestroyRef)
    protected readonly dateService = inject<NbDateService<D>>(NbDateService)

    get month(): string {
        return this.dateService.getMonthName(this.date())
    }

    readonly date = input.required<D>()
    readonly visibleDate = input<D>()

    readonly selectedValue = input<NbCalendarRange<D>>()
    readonly min = input<D>()
    readonly max = input<D>()

    readonly size = input<NbCalendarSize, NbCalendarSizeValues>(NbCalendarSize.MEDIUM, {
        transform: (size) => size as NbCalendarSize
    })

    readonly select = output<D>()

    readonly selected = computed((): boolean => {
        if (this.inRange()) {
            return true
        }

        const selectedValue = this.selectedValue()
        if (selectedValue) {
            return this.dateService.isSameMonthSafe(this.date(), selectedValue.start)
        }

        return false
    })

    readonly inRange = computed((): boolean => {
        const range = this.completeRange()
        if (range) {
            return this.isInRage(this.date(), range)
        }
        return false
    })

    readonly rangeStart = computed((): boolean => {
        const range = this.completeRange()
        if (range) {
            return this.dateService.isSameMonth(this.date(), range.start)
        }
        return false
    })

    readonly rangeEnd = computed((): boolean => {
        const range = this.completeRange()
        if (range) {
            return this.dateService.isSameMonth(this.date(), range.end)
        }
        return false
    })

    readonly today = computed((): boolean => this.dateService.isSameMonthSafe(this.date(), this.dateService.today()))

    readonly disabled = computed((): boolean => this.smallerThanMin() || this.greaterThanMax())

    readonly isLarge = computed((): boolean => this.size() === NbCalendarSize.LARGE)

    onClick() {
        if (this.disabled()) {
            return
        }

        // Emitted once the click is handled, as the calendar's cells always did.
        const date = this.date()
        queueMicrotask(() => !this.destroyRef.destroyed && this.select.emit(date))
    }

    protected smallerThanMin(): boolean {
        const min = this.min()
        return !!this.date() && !!min && this.dateService.compareDates(this.monthEnd(), min) < 0
    }

    protected greaterThanMax(): boolean {
        const max = this.max()
        return !!this.date() && !!max && this.dateService.compareDates(this.monthStart(), max) > 0
    }

    protected monthStart(): D {
        return this.dateService.getMonthStart(this.date())
    }

    protected monthEnd(): D {
        return this.dateService.getMonthEnd(this.date())
    }

    protected isInRage(date: D, range: NbCalendarRange<D>): boolean {
        if (range.start && range.end) {
            const cellDate = this.dateService.getMonthStart(date)
            const start = this.dateService.getMonthStart(range.start)
            const end = this.dateService.getMonthStart(range.end)

            const isGreaterThanStart = this.dateService.compareDates(cellDate, start) >= 0
            const isLessThanEnd = this.dateService.compareDates(cellDate, end) <= 0

            return isGreaterThanStart && isLessThanEnd
        }

        return this.dateService.isSameMonth(date, range.start)
    }
}
