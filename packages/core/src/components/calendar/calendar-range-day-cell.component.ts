import { Component, computed, DestroyRef, inject, input, output } from '@angular/core'

import { NbCalendarCell, NbCalendarSize, NbCalendarSizeValues, NbDateService } from '@liquid-js/lyr-core/calendar-kit'
import { NbCalendarRange } from './calendar-range.component'
import { NbBaseCalendarRangeCell } from './base-calendar-range-cell'

@Component({
    selector: 'nb-calendar-range-day-cell',
    template: `
    <div class="cell-content">{{ day }}</div>
  `,
    host: {
        'class': 'range-cell day-cell',
        '[class.in-range]': 'inRange()',
        '[class.start]': 'start()',
        '[class.end]': 'end()',
        '[class.today]': 'today()',
        '[class.bounding-month]': 'boundingMonth()',
        '[class.selected]': 'selected()',
        '[class.empty]': 'empty()',
        '[class.disabled]': 'disabled()',
        '[class.size-large]': 'isLarge()',
        '(click)': 'onClick()'
    }
})
export class NbCalendarRangeDayCellComponent<D> extends NbBaseCalendarRangeCell<D>
    implements NbCalendarCell<D, NbCalendarRange<D>> {
    protected readonly destroyRef = inject(DestroyRef)
    protected readonly dateService = inject<NbDateService<D>>(NbDateService)

    readonly date = input<D>()

    readonly selectedValue = input<NbCalendarRange<D>>()

    readonly visibleDate = input<D>()

    readonly min = input<D>()

    readonly max = input<D>()

    readonly filter = input<(date: D) => boolean>()

    readonly size = input<NbCalendarSize, NbCalendarSizeValues>(NbCalendarSize.MEDIUM, {
        transform: (size) => size as NbCalendarSize
    })

    readonly select = output<D>()

    readonly inRange = computed((): boolean => {
        const date = this.date()
        const range = this.completeRange()
        if (date && range) {
            return this.isInRange(date, range)
        }

        return false
    })

    readonly start = computed((): boolean => {
        const date = this.date()
        const range = this.completeRange()
        return !!date && !!range && this.dateService.isSameDay(date, range.start)
    })

    readonly end = computed((): boolean => {
        const date = this.date()
        const range = this.completeRange()
        return !!date && !!range && this.dateService.isSameDay(date, range.end)
    })

    readonly today = computed((): boolean => {
        const date = this.date()
        return !!date && this.dateService.isSameDay(date, this.dateService.today())
    })

    readonly boundingMonth = computed((): boolean => !this.dateService.isSameMonthSafe(this.date(), this.visibleDate()))

    readonly selected = computed((): boolean => {
        if (this.inRange()) {
            return true
        }

        const selectedValue = this.selectedValue()
        if (selectedValue) {
            return this.dateService.isSameDaySafe(this.date(), selectedValue.start)
        }

        return false
    })

    readonly empty = computed((): boolean => !this.date())

    readonly disabled = computed((): boolean => this.smallerThanMin() || this.greaterThanMax() || this.dontFitFilter())

    readonly isLarge = computed((): boolean => this.size() === NbCalendarSize.LARGE)

    get day(): number | undefined {
        const date = this.date()
        return date ? this.dateService.getDate(date) : undefined
    }

    onClick() {
        const date = this.date()
        if (this.disabled() || !date) {
            return
        }

        // Emitted once the click is handled, as the calendar's cells always did.
        queueMicrotask(() => !this.destroyRef.destroyed && this.select.emit(date))
    }

    protected smallerThanMin(): boolean {
    // Cells are midnight; a min with a time of day still allows its own day.
        const date = this.date()
        const min = this.min()
        return (
            !!date &&
            !!min &&
            !this.dateService.isSameDaySafe(date, min) &&
            this.dateService.compareDates(date, min) < 0
        )
    }

    protected greaterThanMax(): boolean {
        const date = this.date()
        const max = this.max()
        return (
            !!date &&
            !!max &&
            !this.dateService.isSameDaySafe(date, max) &&
            this.dateService.compareDates(date, max) > 0
        )
    }

    protected dontFitFilter(): boolean {
        const date = this.date()
        const filter = this.filter()
        return !!date && !!filter && !filter(date)
    }

    protected isInRange(date: D, { start, end }: Required<NbCalendarRange<D>>): boolean {
        const isGreaterThanStart = this.dateService.compareDates(date, start) >= 0
        const isLessThanEnd = this.dateService.compareDates(date, end) <= 0

        return isGreaterThanStart && isLessThanEnd
    }
}
