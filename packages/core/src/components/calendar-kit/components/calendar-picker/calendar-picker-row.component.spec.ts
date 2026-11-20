import { assert } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';

import {
  NbCalendarPickerRowComponent,
  NbCalendarDayCellComponent,
  NbDateService,
  NbNativeDateService,
  NbCalendarKitModule,
} from '@liquid-js/lyr-core';

describe('Component: NbCalendarPickerRow', () => {
  let fixture: ComponentFixture<NbCalendarPickerRowComponent<Date, Date>>;
  let component: NbCalendarPickerRowComponent<Date, Date>;
  let componentEl: HTMLElement;

  const queryTestCell = (): NbCalendarDayCellComponent<Date> => {
    return fixture.debugElement.query(By.directive(NbCalendarDayCellComponent)).componentInstance;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NbCalendarKitModule],
      providers: [DatePipe, { provide: NbDateService, useClass: NbNativeDateService }],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent<NbCalendarPickerRowComponent<Date, Date>>(NbCalendarPickerRowComponent);
    component = fixture.componentInstance;
    componentEl = fixture.debugElement.nativeElement;
    fixture.componentRef.setInput('component', NbCalendarDayCellComponent);
    fixture.componentRef.setInput('row', [new Date()]);
  });

  it('should render row of data', function () {
    fixture.componentRef.setInput('row', [new Date(), new Date()]);
    component.ngOnChanges();
    fixture.detectChanges();
    expect(componentEl.querySelectorAll('nb-calendar-day-cell').length).toBe(2);
  });

  it('should provide date for cell', () => {
    const date = new Date();
    fixture.componentRef.setInput('row', [date]);
    component.ngOnChanges();
    fixture.detectChanges();
    const cell: NbCalendarDayCellComponent<Date> = queryTestCell();
    expect(cell.date()).toBe(date);
  });

  it('should provide year for cell', () => {
    const activeMonth = new Date();
    fixture.componentRef.setInput('visibleDate', activeMonth);
    component.ngOnChanges();
    fixture.detectChanges();
    const cell: NbCalendarDayCellComponent<Date> = queryTestCell();
    expect(cell.visibleDate()).toBe(activeMonth);
  });

  it('should provide selectedValue for cell', () => {
    const selectedValue = new Date();
    fixture.componentRef.setInput('selectedValue', selectedValue);
    component.ngOnChanges();
    fixture.detectChanges();
    const cell: NbCalendarDayCellComponent<Date> = queryTestCell();
    expect(cell.selectedValue()).toBe(selectedValue);
  });

  it('should provide min for cell', () => {
    const min = new Date();
    fixture.componentRef.setInput('min', min);
    component.ngOnChanges();
    fixture.detectChanges();
    const cell: NbCalendarDayCellComponent<Date> = queryTestCell();
    expect(cell.min()).toBe(min);
  });

  it('should provide max for cell', () => {
    const max = new Date();
    fixture.componentRef.setInput('max', max);
    component.ngOnChanges();
    fixture.detectChanges();
    const cell: NbCalendarDayCellComponent<Date> = queryTestCell();
    expect(cell.max()).toBe(max);
  });

  it('should provide filter for cell', () => {
    const filter = () => true;
    fixture.componentRef.setInput('filter', filter);
    component.ngOnChanges();
    fixture.detectChanges();
    const cell: NbCalendarDayCellComponent<Date> = queryTestCell();
    expect(cell.filter()).toBe(filter);
  });

  it('should fire select when entire cell selected', () => new Promise<void>((done) => {
    const date = new Date();
    fixture.componentRef.setInput('row', [date]);
    component.ngOnChanges();
    fixture.detectChanges();
    const cell: NbCalendarDayCellComponent<Date> = queryTestCell();
    component.select.subscribe((e) => {
      expect(e).toBe(date);
      done();
    });
    const cellDate = cell.date();
    assert(cellDate);
    cell.select.emit(cellDate);
  }));
});
