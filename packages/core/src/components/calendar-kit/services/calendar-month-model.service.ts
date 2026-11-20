import { inject, Service } from '@angular/core'

import { batch, range } from '../helpers'
import { NbDateService } from './date.service'

@Service()
export class NbCalendarMonthModelService<D> {
    protected readonly dateService = inject<NbDateService<D>>(NbDateService)

    createDaysGrid(activeMonth: D, boundingMonth: boolean = true, firstDayOfWeek?: number): Array<Array<D | undefined>> {
        const weeks = this.createDates(activeMonth, firstDayOfWeek)
        return this.withBoundingMonths(weeks, activeMonth, boundingMonth)
    }

    private createDates(activeMonth: D, firstDayOfWeek?: number): D[][] {
        const days = this.createDateRangeForMonth(activeMonth)
        const startOfWeekDayDiff = this.getStartOfWeekDayDiff(activeMonth, firstDayOfWeek)
        return batch(days, this.dateService.DAYS_IN_WEEK, startOfWeekDayDiff)
    }

    private withBoundingMonths(weeks: D[][], activeMonth: D, boundingMonth: boolean): Array<Array<D | undefined>> {
        let withBoundingMonths: Array<Array<D | undefined>> = weeks

        if (this.isShouldAddPrevBoundingMonth(withBoundingMonths)) {
            withBoundingMonths = this.addPrevBoundingMonth(withBoundingMonths, activeMonth, boundingMonth)
        }

        if (this.isShouldAddNextBoundingMonth(withBoundingMonths)) {
            withBoundingMonths = this.addNextBoundingMonth(withBoundingMonths, activeMonth, boundingMonth)
        }

        return withBoundingMonths
    }

    private addPrevBoundingMonth(
        weeks: Array<Array<D | undefined>>,
        activeMonth: D,
        boundingMonth: boolean
    ): Array<Array<D | undefined>> {
        const [firstWeek, ...nextWeeks] = weeks
        const requiredItems: number = this.dateService.DAYS_IN_WEEK - firstWeek.length
        firstWeek.unshift(...this.createPrevBoundingDays(activeMonth, boundingMonth, requiredItems))
        return [firstWeek, ...nextWeeks]
    }

    private addNextBoundingMonth(
        weeks: Array<Array<D | undefined>>,
        activeMonth: D,
        boundingMonth: boolean
    ): Array<Array<D | undefined>> {
        const lastWeek = weeks.at(-1)
        if (!lastWeek) {
            return weeks
        }
        const requiredItems: number = this.dateService.DAYS_IN_WEEK - lastWeek.length
        lastWeek.push(...this.createNextBoundingDays(activeMonth, boundingMonth, requiredItems))
        return [...weeks.slice(0, -1), lastWeek]
    }

    private createPrevBoundingDays(activeMonth: D, boundingMonth: boolean, requiredItems: number): Array<D | undefined> {
        const month = this.dateService.addMonth(activeMonth, -1)
        const daysInMonth = this.dateService.getNumberOfDaysInMonth(month)
        return this.createDateRangeForMonth(month)
            .slice(daysInMonth - requiredItems)
            .map((date) => boundingMonth ? date : undefined)
    }

    private createNextBoundingDays(activeMonth: D, boundingMonth: boolean, requiredItems: number): Array<D | undefined> {
        const month = this.dateService.addMonth(activeMonth, 1)
        return this.createDateRangeForMonth(month)
            .slice(0, requiredItems)
            .map((date) => boundingMonth ? date : undefined)
    }

    private getStartOfWeekDayDiff(date: D, firstDayOfWeek?: number): number {
        const startOfMonth = this.dateService.getMonthStart(date)
        return this.getWeekStartDiff(startOfMonth, firstDayOfWeek)
    }

    private getWeekStartDiff(date: D, firstDayOfWeek?: number): number {
        const weekOfset = firstDayOfWeek ?? this.dateService.getFirstDayOfWeek()
        return (7 - weekOfset + this.dateService.getDayOfWeek(date)) % 7
    }

    private isShouldAddPrevBoundingMonth(weeks: Array<Array<D | undefined>>): boolean {
        return weeks[0].length < this.dateService.DAYS_IN_WEEK
    }

    private isShouldAddNextBoundingMonth(weeks: Array<Array<D | undefined>>): boolean {
        return weeks[weeks.length - 1].length < this.dateService.DAYS_IN_WEEK
    }

    private createDateRangeForMonth(date: D): D[] {
        const daysInMonth: number = this.dateService.getNumberOfDaysInMonth(date)
        return range(daysInMonth, (i) => {
            const year = this.dateService.getYear(date)
            const month = this.dateService.getMonth(date)
            return this.dateService.createDate(year, month, i + 1)
        })
    }
}
