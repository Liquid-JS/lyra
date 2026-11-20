import { Component, computed, inject, input, output } from '@angular/core'
import {
    NbCalendarCell,
    NbCalendarDayPickerComponent,
    NbDateService,
    NbCalendarDayPickerComponent as NbCalendarDayPickerComponent_1
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-calendar-kit-month-cell',
    templateUrl: './calendar-kit-month-cell.component.html',
    styles: [
        `
      :host {
        flex: 1 0 auto;
        padding: 1rem;
      }
    `
    ],
    imports: [NbCalendarDayPickerComponent_1]
})
export class CalendarKitMonthCellComponent
    extends NbCalendarDayPickerComponent<Date, Date>
    implements NbCalendarCell<Date, Date> {
    private readonly dateService = inject<NbDateService<Date>>(NbDateService)

    readonly select = output<Date>()
    readonly selectedValue = input<Date>()

    readonly title = computed(() => {
        const date = this.date()
        return date && this.dateService.getMonthName(date, 'wide')
    })
}
