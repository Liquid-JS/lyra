import { Component, DestroyRef, inject, input, output } from '@angular/core'
import { NbButtonComponent } from '@liquid-js/lyr-core/button'
import { NbIconComponent } from '@liquid-js/lyr-core/icon'
import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base'
import { NbCalendarViewMode, NbCalendarViewModeValues } from '../../model'
import { NbCalendarYearModelService } from '../../services/calendar-year-model.service'
import { NbDateService } from '../../services/date.service'

/**
 * A calendar's title: the month and year, the year or the years shown, as a button that changes the view.
 */
@Component({
    selector: 'nb-calendar-view-mode',
    templateUrl: './calendar-view-mode.component.html',
    imports: [NbButtonComponent, NbIconComponent]
})
export class NbCalendarViewModeComponent<D> {
    static ngAcceptInputType_viewMode: NbCalendarViewModeValues
    protected readonly destroyRef = inject(DestroyRef)
    protected readonly dateService = inject<NbDateService<D>>(NbDateService)
    protected readonly yearModelService = inject<NbCalendarYearModelService<D>>(NbCalendarYearModelService)

    readonly date = input<D>()
    readonly viewMode = input<NbCalendarViewMode>(NbCalendarViewMode.DATE)
    /** Whether the calendar has another view to change to; without one, the text shows on its own. */
    readonly changeable = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty })
    readonly changeMode = output<void>()

    onClick() {
    // Emitted once the click is handled, as the view mode button always did.
        queueMicrotask(() => !this.destroyRef.destroyed && this.changeMode.emit())
    }

    getText(): string {
        const date = this.date()
        if (!date) {
            return ''
        }

        switch (this.viewMode()) {
            case NbCalendarViewMode.DATE: {
                const month = this.dateService.getMonthName(date, 'wide')
                const year = this.dateService.getYear(date)
                return `${month} ${year}`
            }
            case NbCalendarViewMode.MONTH:
                return `${this.dateService.getYear(date)}`
            case NbCalendarViewMode.YEAR:
                return `${this.getFirstYear(date)} - ${this.getLastYear(date)}`
        }
    }

    getIcon(): string {
        if (this.viewMode() === NbCalendarViewMode.DATE) {
            return 'chevron-down-outline'
        }

        return 'chevron-up-outline'
    }

    protected getFirstYear(date: D): string {
        const years = this.yearModelService.getViewYears(date)
        return this.dateService.getYear(years[0][0]).toString()
    }

    protected getLastYear(date: D): string {
        const years = this.yearModelService.getViewYears(date)
        const lastRow = years[years.length - 1]
        const lastYear = lastRow[lastRow.length - 1]

        return this.dateService.getYear(lastYear).toString()
    }
}
