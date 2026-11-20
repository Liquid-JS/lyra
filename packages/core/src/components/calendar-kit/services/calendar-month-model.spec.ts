import { assert } from 'vitest'
import { inject, TestBed } from '@angular/core/testing'
import { DatePipe } from '@angular/common'

import { NbCalendarMonthModelService, NbDateService, NbNativeDateService } from '@liquid-js/lyr-core'

describe('month-model-service', () => {
    let monthModel: NbCalendarMonthModelService<Date>

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DatePipe, { provide: NbDateService, useClass: NbNativeDateService }, NbCalendarMonthModelService]
        })
    })

    beforeEach(
        inject([NbCalendarMonthModelService], (_monthModel: NbCalendarMonthModelService<Date>) => {
            monthModel = _monthModel
        })
    )

    it('should create days grid with active month', () => {
        const date = new Date(2018, 7, 1)
        const grid = monthModel.createDaysGrid(date)
        expect(grid.length).toBe(5)
        grid.forEach((row) => {
            expect(row.length).toBe(7)
        })
    })

    it('should create days grid without boundingMonth', () => {
        const date = new Date(2018, 7, 1)
        const grid = monthModel.createDaysGrid(date, false)
        const firstRow = grid.shift()
        const lastRow = grid.pop()
        assert(firstRow && lastRow)
        const firstTwoEmpty = firstRow.slice(0, 3)
        const lastTwoEmpty = lastRow.slice(6)
        firstTwoEmpty.forEach((cell) => {
            expect(cell).toBeUndefined()
        })
        lastTwoEmpty.forEach((cell) => {
            expect(cell).toBeUndefined()
        })
    })
})
