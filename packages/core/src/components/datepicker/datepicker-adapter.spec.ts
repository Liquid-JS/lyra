import { TestBed } from '@angular/core/testing'
import {
    NbCalendarRange,
    NbDateService,
    NbDateTimeAdapterService,
    NbDateAdapterService,
    NbNativeDateService,
    NbRangeAdapterService
} from '@liquid-js/lyr-core'

describe('Date Adapters', () => {
    beforeEach(() => {
        const mockDateService = {
            parse: () => {},
            format: () => {},
            isValidDateString: () => {}
        }

        TestBed.configureTestingModule({
            providers: [
                { provide: NbDateService, useValue: mockDateService },
                NbDateAdapterService,
                NbRangeAdapterService,
                NbDateTimeAdapterService
            ]
        })
    })

    describe('NbDateAdapterService', () => {
        let dateService: NbDateService<Date>
        let adapterService: NbDateAdapterService<Date>
        beforeEach(() => {
            adapterService = TestBed.inject(NbDateAdapterService)
            dateService = TestBed.inject(NbDateService)
        })

        it('should be created', () => {
            expect(adapterService).toBeTruthy()
        })

        it('should use date service to parse date', () => {
            const date = '11/11/11'
            const format = 'mm/dd/yy'
            const parsed = new Date()
            const spy = vi.spyOn(dateService, 'parse').mockReturnValue(parsed)

            expect(adapterService.parse(date, format)).toEqual(parsed)
            expect(spy).toHaveBeenCalledTimes(1)
            expect(spy).toHaveBeenCalledWith(date, format)
        })

        it('should use date service to format date', () => {
            const date = new Date()
            const format = 'mm/dd/yyyy'
            const formatted = 'formatted'
            const spy = vi.spyOn(dateService, 'format').mockReturnValue(formatted)

            expect(adapterService.format(date, format)).toEqual(formatted)
            expect(spy).toHaveBeenCalledTimes(1)
            expect(spy).toHaveBeenCalledWith(date, format)
        })

        it('should use date service to validate date string', () => {
            const date = '11/11/11'
            const format = 'mm/dd/yy'
            const results = [true, false]
            const spy = vi.spyOn(dateService, 'isValidDateString')
            results.forEach((result) => spy.mockReturnValueOnce(result))

            for (let i = 0, callsCount = 0; i < results.length; i++) {
                expect(adapterService.isValid(date, format)).toEqual(results[i])
                callsCount++
                expect(spy).toHaveBeenCalledTimes(callsCount)
                expect(spy).toHaveBeenCalledWith(date, format)
            }
        })
    })

    describe('NbRangeAdapterService', () => {
        let dateService: NbDateService<Date>
        let adapterService: NbRangeAdapterService<Date>
        beforeEach(() => {
            dateService = TestBed.inject(NbDateService)
            adapterService = TestBed.inject(NbRangeAdapterService)
        })

        it('should be created', () => {
            expect(adapterService).toBeTruthy()
        })

        it('should use date service to parse date', () => {
            const startDate = '11/11/11'
            const endDate = '12/11/11'
            const date = `${startDate}-${endDate}`
            const format = 'mm/dd/yy'
            const expectedStart = new Date()
            const expectedEnd = new Date()
            const spy = vi.spyOn(dateService, 'parse').mockReturnValueOnce(expectedStart).mockReturnValueOnce(expectedEnd)

            const { start: actualStart, end: actualEnd }: NbCalendarRange<Date> = adapterService.parse(date, format)
            expect(actualStart).toEqual(expectedStart)
            expect(actualEnd).toEqual(expectedEnd)
            expect(spy).toHaveBeenCalledTimes(2)
            expect(spy.mock.calls[0]).toEqual([startDate, format])
            expect(spy.mock.calls[1]).toEqual([endDate, format])
        })

        it('should split ranges in formats that contain dashes', () => {
            const spy = vi.spyOn(dateService, 'parse').mockImplementation((value: string) => value as any)
            const range = adapterService.parse('2026-01-01 - 2026-01-05', 'yyyy-MM-dd')
            expect(range).toEqual({ start: '2026-01-01' as any, end: '2026-01-05' as any })
            expect(spy).toHaveBeenCalledTimes(2)
        })

        it('should treat a dashed date without a range separator as the start only', () => {
            vi.spyOn(dateService, 'parse').mockImplementation((value: string) => value as any)
            expect(adapterService.parse('2026-01-01', 'yyyy-MM-dd')).toEqual({ start: '2026-01-01' as any, end: undefined })
        })

        it('should validate ranges in formats that contain dashes', () => {
            vi.spyOn(dateService, 'isValidDateString').mockImplementation((value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value))
            expect(adapterService.isValid('2026-01-01 - 2026-01-05', 'yyyy-MM-dd')).toBe(true)
            expect(adapterService.isValid('2026-01-01', 'yyyy-MM-dd')).toBe(false)
        })

        it('should leave end undefined when parsing a single date', () => {
            const startDate = '11/11/11'
            const format = 'mm/dd/yy'
            const expectedStart = new Date()
            const spy = vi.spyOn(dateService, 'parse').mockReturnValue(expectedStart)

            const { start: actualStart, end: actualEnd }: NbCalendarRange<Date> = adapterService.parse(startDate, format)
            expect(actualStart).toEqual(expectedStart)
            expect(actualEnd).toBeUndefined()
            expect(spy).toHaveBeenCalledTimes(1)
            expect(spy).toHaveBeenCalledWith(startDate, format)
        })

        it('should format valid date range', () => {
            const range: NbCalendarRange<Date> = { start: new Date(), end: new Date() }
            const format = 'mm/dd/yyyy'
            const spy = vi.spyOn(dateService, 'isValidDateString').mockReturnValueOnce(true).mockReturnValueOnce(true)

            expect(adapterService.format(range, format)).toEqual('undefined – undefined')
            expect(spy).toHaveBeenCalledTimes(2)
        })

        it("should not format if range isn't passed", () => {
            const spy = vi.spyOn(dateService, 'isValidDateString').mockReturnValueOnce(false).mockReturnValueOnce(false)

            expect(adapterService.format(undefined, '')).toEqual('')
            expect(spy).not.toHaveBeenCalled()
        })

        it('should not format if start date is invalid', () => {
            const range: NbCalendarRange<Date> = { start: new Date(), end: new Date() }
            const spy = vi.spyOn(dateService, 'isValidDateString').mockReturnValue(false)

            expect(adapterService.format(range, '')).toEqual('')
            expect(spy).toHaveBeenCalledTimes(1)
        })

        it('should return only start date if end is invalid', () => {
            const range: NbCalendarRange<Date> = { start: new Date(), end: new Date() }
            const spy = vi.spyOn(dateService, 'isValidDateString').mockReturnValueOnce(true).mockReturnValueOnce(false)

            expect(adapterService.format(range, '')).toEqual(undefined)
            expect(spy).toHaveBeenCalledTimes(2)
        })

        it('should use date service to validate date string', () => {
            const startDate = '11/11/11'
            const endDate = '12/11/11'
            const date = `${startDate}-${endDate}`
            const format = 'mm/dd/yy'
            const results = [true, false, true, true]
            const spy = vi.spyOn(dateService, 'isValidDateString')
            results.forEach((result) => spy.mockReturnValueOnce(result))

            for (let i = 0, callsCount = 0; i < results.length - 1; i += 2) {
                expect(adapterService.isValid(date, format)).toEqual(results[i] && results[i + 1])
                callsCount += 2

                expect(spy).toHaveBeenCalledTimes(callsCount)
                expect(spy.mock.calls[i]).toEqual([startDate, format])
                expect(spy.mock.calls[i + 1]).toEqual([endDate, format])
            }
        })
        it('should not validate a single date as a range', () => {
            const spy = vi.spyOn(dateService, 'isValidDateString').mockReturnValue(true)

            expect(adapterService.isValid('11/11/11', 'mm/dd/yy')).toBe(false)
            expect(adapterService.isValid('11/11/11 - ', 'mm/dd/yy')).toBe(false)
            expect(spy).not.toHaveBeenCalled()
        })
    })

    describe('NbDateTimeAdapterService', () => {
        let dateService: NbDateService<Date>
        let adapterService: NbDateTimeAdapterService<Date>
        beforeEach(() => {
            dateService = TestBed.inject(NbDateService)
            adapterService = TestBed.inject(NbDateTimeAdapterService)
        })

        it('should be created', () => {
            expect(adapterService).toBeTruthy()
        })

        it('should use date service to parse date', () => {
            const date = '24/03/93 20:30:24'
            const format = 'mm/dd/yy HH:mm:ss'
            const parsed = new Date()
            const spy = vi.spyOn(dateService, 'parse').mockReturnValue(parsed)

            expect(adapterService.parse(date, format)).toEqual(parsed)
            expect(spy).toHaveBeenCalledTimes(1)
            expect(spy).toHaveBeenCalledWith(date, format)
        })

        it('should use date service to format date', () => {
            const date = new Date()
            const format = 'mm/dd/yyyy HH:mm:ss'
            const formatted = 'formatted'
            const spy = vi.spyOn(dateService, 'format').mockReturnValue(formatted)

            expect(adapterService.format(date, format)).toEqual(formatted)
            expect(spy).toHaveBeenCalledTimes(1)
            expect(spy).toHaveBeenCalledWith(date, format)
        })
    })

    describe('NbRangeAdapterService with dates', () => {
        let adapterService: NbRangeAdapterService<Date>
        beforeEach(() => {
            TestBed.overrideProvider(NbDateService, { useFactory: () => new NbNativeDateService() })
            adapterService = TestBed.inject(NbRangeAdapterService)
        })

        it('should write a range with an en dash, its start in startFormat in the end\'s year, and read it back', () => {
            const range = { start: new Date(2026, 10, 1), end: new Date(2026, 10, 24) }
            expect(adapterService.format(range, 'MMM d, y', 'MMM d')).toBe('Nov 1 – Nov 24, 2026')
            expect(adapterService.format({ start: new Date(2025, 11, 30), end: new Date(2026, 0, 2) }, 'MMM d, y', 'MMM d')).toBe('Dec 30, 2025 – Jan 2, 2026')
            expect(adapterService.isValid('Nov 1 – Nov 24, 2026', 'MMM d, y', 'MMM d')).toBe(true)
            expect(adapterService.parse('Nov 1 – Nov 24, 2026', 'MMM d, y', 'MMM d')).toEqual(range)
            expect(adapterService.parse('Nov 1, 2026 - Nov 24, 2026', 'MMM d, y', 'MMM d')).toEqual(range)
            expect(adapterService.parse('Nov 1, 2026 - Nov 24, 2026', 'MMM d, y')).toEqual(range)
        })
    })
})
