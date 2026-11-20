import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import {
  NbCalendarModule,
  NbDatepickerComponent,
  NbDatepickerModule,
  NbLayoutModule,
  NbThemeModule,
} from '@liquid-js/lyr-core';

@Component({
  template: `
    <div [attr.dir]="dir()">
      <nb-calendar
        [(date)]="date"
        [(visibleDate)]="visibleDate"
        [startView]="startView()"
        [min]="min()"
      />
    </div>
    <button class="after">After</button>
  `,
  imports: [NbCalendarModule],
})
class CalendarHostComponent {
  readonly date = signal<Date | undefined>(new Date(2026, 10, 9));
  readonly visibleDate = signal<Date | undefined>(new Date(2026, 10, 9));
  readonly startView = signal<'date' | 'month' | 'year'>('date');
  readonly min = signal<Date | undefined>(undefined);
  readonly dir = signal<'ltr' | 'rtl'>('ltr');
}

@Component({
  template: `
    <nb-layout>
      <nb-layout-column>
        <input class="field" [nbDatepicker]="datepicker" />
        <nb-datepicker #datepicker />
      </nb-layout-column>
    </nb-layout>
  `,
  imports: [NbLayoutModule, RouterModule, NbDatepickerModule],
})
class DatepickerHostComponent {
  readonly datepicker = viewChild.required(NbDatepickerComponent);
}

const press = (element: Element, key: string, init: KeyboardEventInit = {}) =>
  element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init }));

describe('calendar keyboard and ARIA', () => {
  let fixture: ComponentFixture<CalendarHostComponent>;
  let host: CalendarHostComponent;

  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
  };
  const grid = () => fixture.nativeElement.querySelector('nb-calendar-picker') as HTMLElement;
  const focused = () => document.activeElement as HTMLElement;
  const tabStops = () => Array.from(grid().querySelectorAll('[role="gridcell"][tabindex="0"]')) as HTMLElement[];
  const cellNamed = (name: string) => grid().querySelector(`[aria-label="${name}"]`) as HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot(), CalendarHostComponent] });
    fixture = TestBed.createComponent(CalendarHostComponent);
    host = fixture.componentInstance;
    document.body.appendChild(fixture.nativeElement);
    await render();
  });

  afterEach(() => fixture.destroy());

  it('should be a named grid of rows and named cells, with the selected date its one tab stop', () => {
    expect(grid().getAttribute('role')).toBe('grid');
    expect(grid().getAttribute('aria-label')).toBe('November 2026');
    expect(grid().querySelector('nb-calendar-picker-row')?.getAttribute('role')).toBe('row');

    const selected = cellNamed('Monday, November 9, 2026');
    expect(selected.getAttribute('role')).toBe('gridcell');
    expect(selected.getAttribute('aria-selected')).toBe('true');
    expect(tabStops()).toEqual([selected]);
    expect(cellNamed('Tuesday, November 10, 2026').getAttribute('aria-selected')).toBe('false');
    expect(cellNamed('Tuesday, November 10, 2026').tabIndex).toBe(-1);
  });

  it('should move the tab stop to a date set from outside', async () => {
    expect(tabStops()).toEqual([cellNamed('Monday, November 9, 2026')]);

    host.date.set(new Date(2026, 10, 12));
    await render();
    expect(tabStops()).toEqual([cellNamed('Thursday, November 12, 2026')]);
  });

  it('should mark today and dates out of range', async () => {
    const today = new Date();
    host.visibleDate.set(today);
    host.date.set(undefined);
    host.min.set(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
    await render();

    const todayCell = grid().querySelector('.today') as HTMLElement;
    expect(todayCell.getAttribute('aria-current')).toBe('date');
    expect(tabStops()).toEqual([todayCell]);
    const before = grid().querySelectorAll('.disabled:not(.bounding-month)');
    if (before.length) {
      expect(before[0].getAttribute('aria-disabled')).toBe('true');
    }
  });

  it('should move by day and week, to the ends of the week, and by month and year', async () => {
    cellNamed('Monday, November 9, 2026').focus();

    press(focused(), 'ArrowRight');
    await render();
    expect(focused().getAttribute('aria-label')).toBe('Tuesday, November 10, 2026');
    expect(tabStops()).toEqual([focused()]);

    press(focused(), 'ArrowDown');
    await render();
    expect(focused().getAttribute('aria-label')).toBe('Tuesday, November 17, 2026');

    press(focused(), 'ArrowUp');
    press(focused(), 'ArrowLeft');
    await render();
    expect(focused().getAttribute('aria-label')).toBe('Monday, November 9, 2026');

    // US weeks start on Sunday.
    press(focused(), 'End');
    await render();
    expect(focused().getAttribute('aria-label')).toBe('Saturday, November 14, 2026');
    press(focused(), 'Home');
    await render();
    expect(focused().getAttribute('aria-label')).toBe('Sunday, November 8, 2026');

    press(focused(), 'PageDown');
    await render();
    expect(grid().getAttribute('aria-label')).toBe('December 2026');
    expect(focused().getAttribute('aria-label')).toBe('Tuesday, December 8, 2026');

    press(focused(), 'PageUp', { shiftKey: true });
    await render();
    expect(grid().getAttribute('aria-label')).toBe('December 2025');
    expect(focused().getAttribute('aria-label')).toBe('Monday, December 8, 2025');
  });

  it('should show the next month when moving past the last day, and pick a date with Enter', async () => {
    cellNamed('Monday, November 9, 2026').focus();
    press(focused(), 'PageDown');
    await render();
    press(focused(), 'End');
    press(focused(), 'ArrowDown');
    press(focused(), 'ArrowDown');
    press(focused(), 'ArrowDown');
    await render();
    // Saturday, December 12, and three weeks on.
    expect(grid().getAttribute('aria-label')).toBe('January 2027');
    expect(focused().getAttribute('aria-label')).toBe('Saturday, January 2, 2027');

    press(focused(), 'Enter');
    await render();
    await render();
    expect(host.date()?.toDateString()).toBe(new Date(2027, 0, 2).toDateString());
    expect(focused().getAttribute('aria-label')).toBe('Saturday, January 2, 2027');
    expect(focused().getAttribute('aria-selected')).toBe('true');
  });

  it('should move the other way in right-to-left layouts', async () => {
    host.dir.set('rtl');
    await render();
    cellNamed('Monday, November 9, 2026').focus();
    press(focused(), 'ArrowLeft');
    await render();
    expect(focused().getAttribute('aria-label')).toBe('Tuesday, November 10, 2026');
  });

  it('should move among months and give focus to the days after picking one', async () => {
    host.startView.set('month');
    await render();
    expect(grid().getAttribute('aria-label')).toBe('2026');
    cellNamed('November 2026').focus();

    press(focused(), 'ArrowRight');
    await render();
    expect(focused().getAttribute('aria-label')).toBe('December 2026');
    press(focused(), 'ArrowDown');
    await render();
    // Four months a row: December goes to April of the next year.
    expect(grid().getAttribute('aria-label')).toBe('2027');
    expect(focused().getAttribute('aria-label')).toBe('April 2027');

    press(focused(), 'Enter');
    await render();
    await render();
    expect(grid().getAttribute('aria-label')).toBe('April 2027');
    expect(focused().getAttribute('role')).toBe('gridcell');
    expect(grid().contains(focused())).toBe(true);
  });

  it('should not take focus while the keyboard is elsewhere', async () => {
    (fixture.nativeElement.querySelector('.after') as HTMLElement).focus();
    host.visibleDate.set(new Date(2026, 11, 1));
    await render();
    expect(focused().classList).toContain('after');
  });
});

describe('datepicker keyboard', () => {
  let fixture: ComponentFixture<DatepickerHostComponent>;

  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
  };
  const field = () => fixture.nativeElement.querySelector('.field') as HTMLInputElement;
  const dialog = () => document.querySelector('nb-datepicker-container') as HTMLElement | null;
  const focused = () => document.activeElement as HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        NbThemeModule.forRoot(),
        NbLayoutModule,
        NbDatepickerModule.forRoot(),
        DatepickerHostComponent,
      ],
    });
    fixture = TestBed.createComponent(DatepickerHostComponent);
    document.body.appendChild(fixture.nativeElement);
    await render();
  });

  afterEach(() => {
    fixture.destroy();
    document.querySelectorAll('.cdk-overlay-container').forEach((container) => container.remove());
  });

  it('should open a named dialog from the field with Arrow Down, with focus in the calendar', async () => {
    expect(field().getAttribute('aria-haspopup')).toBe('dialog');
    expect(field().getAttribute('aria-expanded')).toBe('false');
    expect(field().hasAttribute('aria-controls')).toBe(false);
    press(field(), 'ArrowDown');
    await render();
    await render();

    expect(dialog()?.getAttribute('role')).toBe('dialog');
    expect(field().getAttribute('aria-expanded')).toBe('true');
    expect(field().getAttribute('aria-controls')).toBe(dialog()?.id);
    expect(dialog()?.id).toBeTruthy();
    expect(dialog()?.getAttribute('aria-label')).toBe('Choose a date');
    expect(focused().getAttribute('role')).toBe('gridcell');
    expect(dialog()?.contains(focused())).toBe(true);
  });

  it('should stay open while Tab moves inside it, and close with Escape, back to the field', async () => {
    press(field(), 'ArrowDown');
    await render();
    await render();

    press(focused(), 'Tab');
    await render();
    expect(fixture.componentInstance.datepicker().isShown).toBe(true);

    const escape = press(focused(), 'Escape');
    await render();
    expect(fixture.componentInstance.datepicker().isShown).toBe(false);
    expect(focused()).toBe(field());
    expect(field().getAttribute('aria-expanded')).toBe('false');
    // Only the picker closes, not a dialog or window it's in: the key is handled.
    expect(escape).toBe(false);
  });
});
