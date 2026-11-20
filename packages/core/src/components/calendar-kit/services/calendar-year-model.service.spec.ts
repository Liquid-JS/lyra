import { TestBed } from '@angular/core/testing'
import { NbNativeDateService, NbCalendarYearModelService, NbDateService } from '@liquid-js/lyr-core'

describe('NbCalendarYearModelService', () => {
    let yearModelService: NbCalendarYearModelService<Date>

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: NbDateService, useClass: NbNativeDateService }, NbCalendarYearModelService]
        })
        TestBed.inject(NbDateService).setLocale('en-US')
        yearModelService = TestBed.inject(NbCalendarYearModelService)
    })

    it('should return correct years range', () => {
        const date = new Date(2017, 0, 1)
        const viewYears: Date[][] = yearModelService.getViewYears(date)

        const firstYear = viewYears[0][0]
        const lastRow = viewYears[viewYears.length - 1]
        const lastYear = lastRow[lastRow.length - 1]

        expect(firstYear.getFullYear()).toBe(2016)
        expect(lastYear.getFullYear()).toBe(2027)
    })

    it('should return correct year range for 0 year', () => {
        const date = new Date()
        date.setFullYear(0)
        const viewYears: Date[][] = yearModelService.getViewYears(date)

        const firstYear = viewYears[0][0]
        const lastRow = viewYears[viewYears.length - 1]
        const lastYear = lastRow[lastRow.length - 1]

        expect(firstYear.getFullYear()).toBe(0)
        expect(lastYear.getFullYear()).toBe(11)
    })

    it('should return correct year range for negative year', () => {
        const date = new Date()
        date.setFullYear(-1)
        const viewYears: Date[][] = yearModelService.getViewYears(date)

        const firstYear = viewYears[0][0]
        const lastRow = viewYears[viewYears.length - 1]
        const lastYear = lastRow[lastRow.length - 1]

        expect(firstYear.getFullYear()).toBe(-12)
        expect(lastYear.getFullYear()).toBe(-1)
    })
})
