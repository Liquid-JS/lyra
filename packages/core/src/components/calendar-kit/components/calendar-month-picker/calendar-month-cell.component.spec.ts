import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { NbCalendarMonthCellComponent, NbDateService, NbNativeDateService } from '@liquid-js/lyr-core';

describe('Component: NbCalendarMonthCell', () => {
  let component: NbCalendarMonthCellComponent<Date>;
  let fixture: ComponentFixture<NbCalendarMonthCellComponent<Date>>;
  let componentEl: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NbCalendarMonthCellComponent],
      providers: [{ provide: NbDateService, useClass: NbNativeDateService }, DatePipe],
    });
    fixture = TestBed.createComponent<NbCalendarMonthCellComponent<Date>>(NbCalendarMonthCellComponent);
    component = fixture.componentInstance;
    componentEl = fixture.debugElement.nativeElement;
  });

  it('should render month', () => {
    fixture.componentRef.setInput('date', new Date(2018, 6, 12));
    fixture.componentRef.setInput('selectedValue', new Date());
    fixture.detectChanges();
    expect(componentEl.textContent).toContain('Jul');
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
    expect(componentEl.classList).toContain('month-cell');
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
    fixture.componentRef.setInput('date', new Date(2018, 1, 1));
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
