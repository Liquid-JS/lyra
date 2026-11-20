import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { NbDateService, NbNativeDateService, NbCalendarYearCellComponent } from '@liquid-js/lyr-core';

describe('Component: NbCalendarYearCell', () => {
  let component: NbCalendarYearCellComponent<Date>;
  let fixture: ComponentFixture<NbCalendarYearCellComponent<Date>>;
  let componentEl: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NbCalendarYearCellComponent],
      providers: [{ provide: NbDateService, useClass: NbNativeDateService }, DatePipe],
    });
    fixture = TestBed.createComponent<NbCalendarYearCellComponent<Date>>(NbCalendarYearCellComponent);
    component = fixture.componentInstance;
    componentEl = fixture.debugElement.nativeElement;
  });

  it('should render year', () => {
    fixture.componentRef.setInput('date', new Date(2018, 6, 12));
    fixture.componentRef.setInput('selectedValue', new Date());
    fixture.detectChanges();
    expect(componentEl.textContent).toContain('2018');
  });

  it('should contain selected class if selected', () => {
    fixture.componentRef.setInput('date', new Date());
    fixture.componentRef.setInput('selectedValue', new Date());
    fixture.detectChanges();
    expect(componentEl.classList).toContain('selected');
  });

  it('should contain cell class', () => {
    fixture.componentRef.setInput('date', new Date());
    fixture.detectChanges();
    expect(componentEl.classList).toContain('year-cell');
  });

  it('should fire select on click', () => {
    const date = new Date();
    fixture.componentRef.setInput('date', date);
    fixture.componentRef.setInput('selectedValue', new Date());
    fixture.detectChanges();
    component.select.subscribe((e) => expect(e).toBe(date));
    componentEl.dispatchEvent(new Event('click'));
    expect(componentEl.classList).toContain('selected');
  });

  it('should contain disabled class if fully out of min-max range', () => {
    fixture.componentRef.setInput('date', new Date(2017, 7, 1));
    fixture.componentRef.setInput('selectedValue', new Date());
    fixture.componentRef.setInput('min', new Date(2018, 5, 1));
    fixture.componentRef.setInput('max', new Date(2018, 10, 1));
    fixture.detectChanges();
    expect(componentEl.classList).toContain('disabled');
  });

  it('should not contain disabled class if partially out of min-max range', () => {
    fixture.componentRef.setInput('date', new Date(2018, 1, 1));
    fixture.componentRef.setInput('selectedValue', new Date());
    fixture.componentRef.setInput('min', new Date(2018, 1, 15));
    fixture.componentRef.setInput('max', new Date(2018, 10, 1));
    fixture.detectChanges();
    expect(componentEl.classList).not.toContain('disabled');
  });

  it('should not contain disabled class if fully in min-max range', () => {
    fixture.componentRef.setInput('date', new Date(2018, 5, 1));
    fixture.componentRef.setInput('selectedValue', new Date());
    fixture.componentRef.setInput('min', new Date(2018, 1, 15));
    fixture.componentRef.setInput('max', new Date(2018, 10, 1));
    fixture.detectChanges();
    expect(componentEl.classList).not.toContain('disabled');
  });
});
