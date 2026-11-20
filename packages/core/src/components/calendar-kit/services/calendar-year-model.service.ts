import { inject, Service } from '@angular/core'

import { range, batch } from '../helpers'
import { NbDateService } from './date.service'

@Service()
export class NbCalendarYearModelService<D> {
    protected readonly dateService = inject<NbDateService<D>>(NbDateService)

    protected yearsInView = 12
    protected yearsInRow = 4

    getYearsInView(): number {
        return this.yearsInView
    }

    getYearsInRow(): number {
        return this.yearsInRow
    }

    getViewYears(viewYear: D): D[][] {
        const year = this.dateService.getYear(viewYear)
        let viewStartYear: number
        if (year >= 0) {
            viewStartYear = year - (year % this.yearsInView)
        } else {
            viewStartYear = year - (year % this.yearsInView + this.yearsInView)
        }
        const years = range(this.yearsInView).map((i) => this.copyWithYear(viewStartYear + i, viewYear))

        return batch(years, this.yearsInRow)
    }

    protected copyWithYear(year: number, date: D): D {
        return this.dateService.createDate(year, this.dateService.getMonth(date), this.dateService.getDate(date))
    }
}
