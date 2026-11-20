import { TestBed } from '@angular/core/testing';
import { NbDateService, provideNbTheme } from '@liquid-js/lyr-core';
import { NbMomentDateService, provideNbMomentDate } from '@liquid-js/lyr-moment';

describe('provideNbMomentDate', () => {
  it('should replace the default date service', () => {
    TestBed.configureTestingModule({ providers: [provideNbTheme(), provideNbMomentDate()] });

    expect(TestBed.inject(NbDateService)).toEqual(expect.any(NbMomentDateService));
  });
});
