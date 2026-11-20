import { Component, computed, DestroyRef, inject, input, output } from '@angular/core'

import { NbCalendarCell, NbCalendarSize, NbCalendarSizeValues, NbDateService } from '@liquid-js/lyr-core/calendar-kit'
import { NbCalendarRange } from './calendar-range.component'
import { NbBaseCalendarRangeCell } from './base-calendar-range-cell'

@Component({
    selector: 'nb-calendar-range-year-cell',
    templateUrl: './calendar-range-year-cell.component.html',
    host: {
        'class': 'year-cell range-cell',
        '[class.in-range]': 'inRange()',
        '[class.start]': 'rangeStart()',
        '[class.end]': 'rangeEnd()',
        '[class.selected]': 'selected()',
        '[class.today]': 'today()',
        '[class.disabled]': 'disabled()',
        '[class.size-large]': 'isLarge()',
        '(click)': 'onClick()'
    }
})
export class NbCalendarRangeYearCellComponent<D> extends NbBaseCalendarRangeCell<D>
    implements NbCalendarCell<D, NbCalendarRange<D>> {
    protected readonly destroyRef = inject(DestroyRef)
    protected readonly dateService = inject<NbDateService<D>>(NbDateService)

    readonly date = input.required<D>()

    readonly min = input<D>()

    readonly max = input<D>()

    readonly selectedValue = input<NbCalendarRange<D>>()

    readonly size = input<NbCalendarSize, NbCalendarSizeValues>(NbCalendarSize.MEDIUM, {
        transform: (size) => size as NbCalendarSize
    })

    readonly select = output<D>()

    readonly inRange = computed((): boolean => {
        const range = this.completeRange()
        return !!range && this.isInRange(this.date(), range)
    })

    readonly rangeStart = computed((): boolean => {
        const range = this.completeRange()
        return !!range && this.dateService.isSameYear(this.date(), range.start)
    })

    readonly rangeEnd = computed((): boolean => {
        const range = this.completeRange()
        return !!range && this.dateService.isSameYear(this.date(), range.end)
    })

    readonly selected = computed((): boolean => {
        if (this.inRange()) {
            return true
        }

        const selectedValue = this.selectedValue()
        if (selectedValue) {
            return this.dateService.isSameYearSafe(this.date(), selectedValue.start)
        }

        return false
    })

    readonly today = computed((): boolean => this.dateService.isSameYear(this.date(), this.dateService.today()))

    readonly disabled = computed((): boolean => this.smallerThanMin() || this.greaterThanMax())

    readonly isLarge = computed((): boolean => this.size() === NbCalendarSize.LARGE)

    get year(): number {
        return this.dateService.getYear(this.date())
    }

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
        return !!this.date() && !!min && this.dateService.compareDates(this.yearEnd(), min) < 0
    }

    protected greaterThanMax(): boolean {
        const max = this.max()
        return !!this.date() && !!max && this.dateService.compareDates(this.yearStart(), max) > 0
    }

    protected yearStart(): D {
        return this.dateService.getYearStart(this.date())
    }

    protected yearEnd(): D {
        return this.dateService.getYearEnd(this.date())
    }

    protected isInRange(date: D, { start, end }: NbCalendarRange<D>): boolean {
        if (start && end) {
            const cellYear = this.dateService.getYear(date)
            const startYear = this.dateService.getYear(start)
            const endYear = this.dateService.getYear(end)

            return cellYear >= startYear && cellYear <= endYear
        }

        return this.dateService.isSameYear(date, start)
    }
}
