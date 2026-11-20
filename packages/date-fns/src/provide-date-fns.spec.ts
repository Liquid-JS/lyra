import { TestBed } from '@angular/core/testing'
import { NbDateService, provideNbTheme } from '@liquid-js/lyr-core'
import { NbDateFnsDateService, provideNbDateFnsDate } from '@liquid-js/lyr-date-fns'

describe('provideNbDateFnsDate', () => {
    it('should replace the default date service', () => {
        TestBed.configureTestingModule({
            providers: [provideNbTheme(), provideNbDateFnsDate({ format: 'dd.MM.yyyy' })]
        })
        const dateService = TestBed.inject(NbDateService)

        expect(dateService).toEqual(expect.any(NbDateFnsDateService))
        expect(dateService.format(new Date(2026, 1, 3), undefined)).toBe('03.02.2026')
    })
})
