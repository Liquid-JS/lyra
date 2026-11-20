import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePipe } from '@angular/common';

import { NbCalendarDayCellComponent, NbDateService, NbNativeDateService, NbCalendarKitModule } from '@liquid-js/lyr-core';

describe('Component: NbCalendarDayCell', () => {
  let component: NbCalendarDayCellComponent<Date>;
  let fixture: ComponentFixture<NbCalendarDayCellComponent<Date>>;
  let componentEl: HTMLElement;
  let dateService: NbDateService<Date>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NbCalendarKitModule],
      providers: [DatePipe, NbNativeDateService, { provide: NbDateService, useExisting: NbNativeDateService }],
    });
    fixture = TestBed.createComponent<NbCalendarDayCellComponent<Date>>(NbCalendarDayCellComponent);
    component = fixture.componentInstance;
    componentEl = fixture.nativeElement;
    dateService = TestBed.inject(NbNativeDateService);
  });

  it('should contain cell class', () => {
    fixture.detectChanges();
    expect(componentEl.classList).toContain('day-cell');
  });

  it('should render date', () => {
    fixture.componentRef.setInput('date', new Date(2018, 6, 12));
    fixture.componentRef.setInput('selectedValue', new Date());
    fixture.componentRef.setInput('visibleDate', new Date());
    fixture.detectChanges();
    expect(componentEl.textContent).toContain('12');
  });

  it('should keep the min day enabled when min has a time of day', () => {
    fixture.componentRef.setInput('visibleDate', new Date(2026, 0, 15));
    fixture.componentRef.setInput('min', new Date(2026, 0, 15, 10, 0));
    fixture.componentRef.setInput('date', new Date(2026, 0, 15));
    fixture.detectChanges();
    expect(componentEl.classList).not.toContain('disabled');

    fixture.componentRef.setInput('date', new Date(2026, 0, 14));
    fixture.detectChanges();
    expect(componentEl.classList).toContain('disabled');
  });

  it('should fire select after click', () => new Promise<void>((done) => {
    const date = new Date();
    fixture.componentRef.setInput('date', date);
    fixture.componentRef.setInput('selectedValue', new Date());
    fixture.componentRef.setInput('visibleDate', new Date());
    fixture.detectChanges();
    component.select.subscribe((e) => {
      expect(e).toBe(date);
      done();
    });
    componentEl.dispatchEvent(new Event('click'));
  }));

  it('should contain today class if today', () => {
    fixture.componentRef.setInput('date', new Date());
    fixture.componentRef.setInput('selectedValue', new Date());
    fixture.componentRef.setInput('visibleDate', new Date());
    fixture.detectChanges();
    expect(componentEl.classList).toContain('today');
  });

  it('should contain selected class if selected', () => {
    fixture.componentRef.setInput('date', new Date());
    fixture.componentRef.setInput('selectedValue', new Date());
    fixture.componentRef.setInput('visibleDate', new Date());
    fixture.detectChanges();
    expect(componentEl.classList).toContain('selected');
  });

  it('should contain bounding-month class if it adjoin to the year', () => {
    fixture.componentRef.setInput('date', new Date(2018, 7, 1));
    fixture.componentRef.setInput('visibleDate', new Date(2018, 6, 30));
    fixture.componentRef.setInput('selectedValue', new Date());
    fixture.detectChanges();
    expect(componentEl.classList).toContain('bounding-month');
  });

  it('should contain empty if no date provided', () => {
    fixture.componentRef.setInput('date', null);
    fixture.componentRef.setInput('selectedValue', new Date());
    fixture.componentRef.setInput('visibleDate', new Date());
    fixture.detectChanges();
    expect(componentEl.classList).toContain('empty');
  });

  it('should not contain disabled if greater than min', () => {
    fixture.componentRef.setInput('date', new Date());
    fixture.componentRef.setInput('min', dateService.addDay(new Date(), -1));
    fixture.detectChanges();
    expect(componentEl.classList).not.toContain('disabled');
  });

  it('should not contain disabled if smaller than max', () => {
    fixture.componentRef.setInput('date', new Date());
    fixture.componentRef.setInput('max', dateService.addDay(new Date(), 1));
    fixture.detectChanges();
    expect(componentEl.classList).not.toContain('disabled');
  });

  it('should not contain disabled if in min-max range', () => {
    fixture.componentRef.setInput('date', new Date());
    fixture.componentRef.setInput('min', dateService.addDay(new Date(), -1));
    fixture.componentRef.setInput('max', dateService.addDay(new Date(), 1));
    fixture.detectChanges();
    expect(componentEl.classList).not.toContain('disabled');
  });

  it('should contain disabled if out of min-max range', () => {
    fixture.componentRef.setInput('date', new Date());
    fixture.componentRef.setInput('min', dateService.addDay(new Date(), 1));
    fixture.componentRef.setInput('max', dateService.addDay(new Date(), 10));
    fixture.detectChanges();
    expect(componentEl.classList).toContain('disabled');
  });

  it('should contain disabled if smaller than min', () => {
    fixture.componentRef.setInput('date', new Date());
    fixture.componentRef.setInput('min', dateService.addDay(new Date(), 1));
    fixture.detectChanges();
    expect(componentEl.classList).toContain('disabled');
  });

  it('should contain disabled if greater than max', () => {
    fixture.componentRef.setInput('date', new Date());
    fixture.componentRef.setInput('max', dateService.addDay(new Date(), -1));
    fixture.detectChanges();
    expect(componentEl.classList).toContain('disabled');
  });

  it('should contain disable if fit the filter', () => {
    fixture.componentRef.setInput('date', new Date(2018, 7, 2));
    fixture.componentRef.setInput('filter', (date: Date) => date.getDate() % 2 !== 0);
    fixture.detectChanges();
    expect(componentEl.classList).toContain('disabled');
  });

  it("should not contain disable if doesn't fit the filter", () => {
    fixture.componentRef.setInput('date', new Date(2018, 7, 2));
    fixture.componentRef.setInput('filter', (date: Date) => date.getDate() % 2 !== 0);
    fixture.detectChanges();
    expect(componentEl.classList).toContain('disabled');
  });
});
