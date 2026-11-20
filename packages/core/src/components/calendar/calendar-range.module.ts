import { NgModule } from '@angular/core'

import { NbCalendarRangeComponent } from './calendar-range.component'
import { NbCalendarRangeDayCellComponent } from './calendar-range-day-cell.component'
import { NbCalendarRangeYearCellComponent } from './calendar-range-year-cell.component'
import { NbCalendarRangeMonthCellComponent } from './calendar-range-month-cell.component'
import { NbBaseCalendarModule } from './base-calendar.module'

@NgModule({
    imports: [
        NbBaseCalendarModule,
        NbCalendarRangeComponent,
        NbCalendarRangeDayCellComponent,
        NbCalendarRangeYearCellComponent,
        NbCalendarRangeMonthCellComponent
    ],
    exports: [NbCalendarRangeComponent]
})
export class NbCalendarRangeModule {
}
