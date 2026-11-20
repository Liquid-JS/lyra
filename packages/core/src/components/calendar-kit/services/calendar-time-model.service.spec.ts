import { inject, TestBed } from '@angular/core/testing'
import { NbDateService, NbNativeDateService, NbCalendarTimeModelService } from '@liquid-js/lyr-core'

describe('time-model-service', () => {
    let timeModel: NbCalendarTimeModelService<Date>

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: NbDateService, useClass: NbNativeDateService }, NbCalendarTimeModelService]
        })
    })

    beforeEach(
        inject([NbCalendarTimeModelService], (_monthModel: NbCalendarTimeModelService<Date>) => {
            timeModel = _monthModel
        })
    )

    it('should format number', () => {
        const token = timeModel.paddToTwoSymbols(5)
        expect(token).toEqual('05')
    })
})
