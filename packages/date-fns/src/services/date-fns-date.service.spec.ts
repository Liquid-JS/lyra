import { TestBed } from '@angular/core/testing';

import { NbDateService, NB_DATE_SERVICE_OPTIONS } from '@liquid-js/lyr-core';
import { NbDateFnsDateService } from '@liquid-js/lyr-date-fns';

describe('date-fns-date-service', () => {
  let dateService: NbDateService<Date>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    dateService = TestBed.runInInjectionContext(() => new NbDateFnsDateService());
  });

  it('should parse date according to the MM.dd.yyyy format', () => {
    const date = '06.15.2018';
    expect(dateService.parse(date, 'MM.dd.yyyy')).toEqual(new Date(2018, 5, 15));
  });

  it('should parse to an invalid date without a format', () => {
    // A datepicker without a format and no configured default reports the input as invalid instead of throwing.
    const parsed = dateService.parse('15.01.2026', '');
    expect(dateService.isValidDateString('15.01.2026', '')).toBe(false);
    expect(Number.isNaN(parsed.getTime())).toBe(true);
  });

  it('should format with its own default date format', () => {
    expect(() => dateService.format(new Date(2026, 0, 15), dateService.getDateFormat())).not.toThrow();
    expect(dateService.format(new Date(2026, 0, 15), dateService.getDateFormat())).toBe('2026-01-15');
  });

  it("should not format if date isn't passed", () => {
    const missingDate = undefined as unknown as Date;
    expect(() => dateService.format(missingDate, 'DD.MM.YYYY')).not.toThrow();
    expect(dateService.format(missingDate, 'DD.MM.YYYY')).toEqual('');
  });

  describe('service global config', () => {
    const SEPARATOR = '_';
    const FORMAT = `MM${SEPARATOR}dd${SEPARATOR}yyyy`;
    const year = 2010;
    const monthIndex = 10;
    const month = monthIndex + 1;
    const day = 20;
    const date = new Date(year, monthIndex, day);
    const formattedDate = `${month}${SEPARATOR}${day}${SEPARATOR}${year}`;

    beforeEach(() => {
      const options = {
        format: FORMAT,
        parseOptions: {
          useAdditionalWeekYearTokens: true,
          useAdditionalDayOfYearTokens: true,
        },
        formatOptions: {
          useAdditionalWeekYearTokens: true,
          useAdditionalDayOfYearTokens: true,
        },
      };
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ providers: [{ provide: NB_DATE_SERVICE_OPTIONS, useValue: options }] });
      dateService = TestBed.runInInjectionContext(() => new NbDateFnsDateService());
    });

    it("should use format from global config if isn't passed as parameter", () => {
      expect(dateService.format(date, undefined)).toEqual(formattedDate);

      const parsedDate = dateService.parse(formattedDate, FORMAT);
      expect(parsedDate.valueOf()).toEqual(date.valueOf());
    });

    it('should use parameter over global config format if presented', () => {
      expect(dateService.format(date, undefined)).toEqual(formattedDate);

      const parsedDate = dateService.parse(formattedDate, FORMAT);
      expect(parsedDate.valueOf()).toEqual(date.valueOf());
    });

    it('should pass parseOptions to parse function', () => {
      // date-fns require { useAdditionalWeekYearTokens: true, useAdditionalDayOfYearTokens: true } options
      // to be passed to parse function
      // when format contains 'DD' or 'YYYY' tokens, otherwise it throws. This option is
      // passed as global config to service constructor so it shouldn't throw.
      expect(() => dateService.parse(formattedDate, 'DD/MM/YYYY')).not.toThrow();
    });

    it('should pass formatOptions to format function', () => {
      // date-fns require { useAdditionalWeekYearTokens: true, useAdditionalDayOfYearTokens: true } options
      // to be passed to format function
      // when format contains 'DD' or 'YYYY' tokens, otherwise it throws. This option is
      // passed as global config to service constructor so it shouldn't throw.
      expect(() => dateService.format(date, 'DD/MM/YYYY')).not.toThrow();
    });
  });
});
