import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  NbTimepickerModule,
  NbTimePickerComponent,
  NbThemeModule,
  NB_TIME_PICKER_CONFIG,
} from '@liquid-js/lyr-core';

@Component({
  template: `
    <input [formControl]="control" [nbTimepicker]="timepicker" />
    <nb-timepicker #timepicker />
  `,
  imports: [ReactiveFormsModule, NbTimepickerModule],
})
class NbTimepickerInputTestComponent {
  control = new FormControl<Date | null>(null);
}

@Component({
  template: `
    <input [placeholder]="placeholder" [nbTimepicker]="timepicker" />
    <nb-timepicker #timepicker />
  `,
  imports: [ReactiveFormsModule, NbTimepickerModule],
})
class NbTimepickerPlaceholderTestComponent {
  placeholder = 'Pick a time';
}

describe('NbTimePickerComponent', () => {
  let timePicker: NbTimePickerComponent<Date>;
  let fixture: ComponentFixture<NbTimePickerComponent<Date>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NbTimepickerModule, NbThemeModule.forRoot()],
      providers: [NbTimePickerComponent, { provide: NB_TIME_PICKER_CONFIG, useValue: {} }],
    });

    fixture = TestBed.createComponent<NbTimePickerComponent<Date>>(NbTimePickerComponent);
    timePicker = fixture.componentInstance;
  });

  it('should set correct time format', () => {
    fixture.componentRef.setInput('twelveHoursFormat', false);
    expect(timePicker.buildTimeFormat()).toEqual('HH:mm');
  });

  it('should set twelve hours format', () => {
    fixture.componentRef.setInput('twelveHoursFormat', true);
    fixture.componentRef.setInput('withSeconds', true);
    expect(timePicker.buildTimeFormat()).toEqual('hh:mm:ss a');
  });
});

describe('nbTimepicker with the native date service', () => {
  afterEach(() => vi.useRealTimers());

  it('should accept a typed time in January', () => {
    // A zero-based month turned today into an invalid date string such as 2026-00-15.
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 0, 15, 8, 0));
    TestBed.configureTestingModule({
      imports: [
        NbThemeModule.forRoot(),
        NbTimepickerModule.forRoot(),
        ReactiveFormsModule,
        NbTimepickerInputTestComponent,
      ],
    });
    const fixture = TestBed.createComponent(NbTimepickerInputTestComponent);
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = '10:30';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const value = fixture.componentInstance.control.value;
    expect(value instanceof Date && !isNaN(value.getTime())).toBe(true);
    expect(value?.getHours()).toBe(10);
    expect(value?.getMinutes()).toBe(30);
  });
});

describe('nbTimepicker localization and placeholder', () => {
  it('should use the configured time header text', () => {
    TestBed.configureTestingModule({
      imports: [NbTimepickerModule, NbThemeModule.forRoot()],
      providers: [{ provide: NB_TIME_PICKER_CONFIG, useValue: { localization: { timeText: 'Zeit' } } }],
    });
    const fixture = TestBed.createComponent<NbTimePickerComponent<Date>>(NbTimePickerComponent);
    fixture.componentRef.setInput('singleColumn', true);
    fixture.detectChanges();

    // The header is in the picker's overlay.
    expect((fixture.componentInstance as unknown as { timeLabel: () => string }).timeLabel()).toBe('Zeit');
  });

  it('should keep a bound placeholder', () => {
    TestBed.configureTestingModule({
      imports: [
        NbThemeModule.forRoot(),
        NbTimepickerModule.forRoot(),
        ReactiveFormsModule,
        NbTimepickerPlaceholderTestComponent,
      ],
    });
    const fixture = TestBed.createComponent(NbTimepickerPlaceholderTestComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input').placeholder).toBe('Pick a time');
  });
});
