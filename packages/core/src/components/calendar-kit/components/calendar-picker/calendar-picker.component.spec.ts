import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  NbCalendarPickerComponent,
  NbCalendarPickerRowComponent,
  NbCalendarDayCellComponent,
  NbDateService,
  NbNativeDateService,
  NbCalendarKitModule,
} from '@liquid-js/lyr-core';

describe('Component: NbCalendarPicker', () => {
  let fixture: ComponentFixture<NbCalendarPickerComponent<Date, Date>>;
  let component: NbCalendarPickerComponent<Date, Date>;
  let componentEl: HTMLElement;

  const queryTestRow = (): NbCalendarPickerRowComponent<Date, Date> => {
    return fixture.debugElement.query(By.directive(NbCalendarPickerRowComponent)).componentInstance;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatePipe, { provide: NbDateService, useClass: NbNativeDateService }],
      imports: [NbCalendarPickerRowComponent, NbCalendarPickerComponent, NbCalendarKitModule],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent<NbCalendarPickerComponent<Date, Date>>(NbCalendarPickerComponent);
    component = fixture.componentInstance;
    componentEl = fixture.debugElement.nativeElement;
    fixture.componentRef.setInput('cellComponent', NbCalendarDayCellComponent);
    fixture.componentRef.setInput('data', [[new Date()]]);
  });

  it('should render grid of data', function () {
    fixture.componentRef.setInput('data', [
      [new Date(), new Date()],
      [new Date(), new Date()],
    ]);
    fixture.detectChanges();
    expect(componentEl.querySelectorAll('nb-calendar-day-cell').length).toBe(4);
  });

  it('should provide year for cell', () => {
    const activeMonth = new Date();
    fixture.componentRef.setInput('visibleDate', activeMonth);
    fixture.detectChanges();
    const row: NbCalendarPickerRowComponent<Date, Date> = queryTestRow();
    expect(row.visibleDate()).toBe(activeMonth);
  });

  it('should provide selectedValue for cell', () => {
    const selectedValue = new Date();
    fixture.componentRef.setInput('selectedValue', selectedValue);
    fixture.detectChanges();
    const row: NbCalendarPickerRowComponent<Date, Date> = queryTestRow();
    expect(row.selectedValue()).toBe(selectedValue);
  });

  it('should provide min for cell', () => {
    const min = new Date();
    fixture.componentRef.setInput('min', min);
    fixture.detectChanges();
    const row: NbCalendarPickerRowComponent<Date, Date> = queryTestRow();
    expect(row.min()).toBe(min);
  });

  it('should provide max for cell', () => {
    const max = new Date();
    fixture.componentRef.setInput('max', max);
    fixture.detectChanges();
    const row: NbCalendarPickerRowComponent<Date, Date> = queryTestRow();
    expect(row.max()).toBe(max);
  });

  it('should provide filter for cell', () => {
    const filter = () => true;
    fixture.componentRef.setInput('filter', filter);
    fixture.detectChanges();
    const row: NbCalendarPickerRowComponent<Date, Date> = queryTestRow();
    expect(row.filter()).toBe(filter);
  });

  it('should fire select when entire cell selected', () => new Promise<void>((done) => {
    const date = new Date();
    fixture.componentRef.setInput('data', [[date]]);
    fixture.detectChanges();
    const row: NbCalendarPickerRowComponent<Date, Date> = queryTestRow();
    component.select.subscribe((e) => {
      expect(e).toBe(date);
      done();
    });
    row.select.emit(date);
  }));
});
