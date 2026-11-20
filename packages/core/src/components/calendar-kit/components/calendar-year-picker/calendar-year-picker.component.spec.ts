import { assert } from 'vitest';
import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  NbCalendarYearPickerComponent,
  NbCalendarKitModule,
  NbDateService,
  NbNativeDateService,
} from '@liquid-js/lyr-core';

describe('Component: NbCalendarYearPicker', () => {
  let fixture: ComponentFixture<NbCalendarYearPickerComponent<Date>>;
  let component: NbCalendarYearPickerComponent<Date>;
  let componentEl: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NbCalendarKitModule],
      providers: [DatePipe, { provide: NbDateService, useClass: NbNativeDateService }],
    });
    fixture = TestBed.createComponent<NbCalendarYearPickerComponent<Date>>(NbCalendarYearPickerComponent);
    component = fixture.componentInstance;
    componentEl = fixture.debugElement.nativeElement;
  });

  beforeEach(() => {
    fixture.componentRef.setInput('date', new Date(2018, 6, 23));
    fixture.componentRef.setInput('year', new Date(2018, 6, 23));
    fixture.detectChanges();
  });

  it('should contain calendar picker', () => {
    expect(componentEl.querySelector('nb-calendar-picker')).toBeDefined();
  });

  it('should fire yearChange when click on a year', () => {
    const yearChangeSpy = vi.fn();

    component.yearChange.subscribe(yearChangeSpy);
    const picker = componentEl.querySelector('nb-calendar-picker');
    assert(picker);
    picker.dispatchEvent(new CustomEvent('select'));

    expect(yearChangeSpy).toHaveBeenCalled();
  });
});
