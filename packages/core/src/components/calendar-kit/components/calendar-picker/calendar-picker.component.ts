import {
  afterRenderEffect,
  Component,
  computed,
  ElementRef,
  inject,
  InjectionToken,
  input,
  LOCALE_ID,
  output,
  signal,
  Type,
  untracked,
  WritableSignal,
} from '@angular/core';

import { NbCalendarCell, NbCalendarSize, NbCalendarSizeValues } from '../../model';
import { NbDateService } from '../../services/date.service';
import { NbCalendarPickerRowComponent } from './calendar-picker-row.component';

/** What a cell of a calendar grid is: a day, a month or a year. */
export type NbCalendarPickerUnit = 'day' | 'month' | 'year';

/**
 * What a calendar does for the keyboard in its grids: shows the period of a date the grid doesn't have, and keeps
 * whether a grid has focus, so the next grid takes it over, e.g. the days after picking a month.
 * @internal
 */
export interface NbCalendarKeyboard<D> {
  showDate(date: D): void;
  readonly keyboardFocus: WritableSignal<boolean>;
}

/** @internal */
export const NB_CALENDAR_KEYBOARD = new InjectionToken<NbCalendarKeyboard<unknown>>('Lyra calendar keyboard');

/** The cell classes that mean the cell is chosen: selected, or in a selected range. */
const SELECTED_CLASSES = ['selected', 'start', 'end', 'in-range'];

/**
 * A grid of calendar cells: days, months or years. It's a `grid` for assistive technologies, and works by keyboard:
 * the arrow keys move between cells, Home and End to the start and end of the row, Page Up and Page Down by a month
 * (with Shift, a year) among days, or by a page among months and years, and Enter or Space picks the cell. Moving
 * past the cells shown shows the period with the date.
 */
@Component({
  selector: 'nb-calendar-picker',
  templateUrl: './calendar-picker.component.html',
  imports: [NbCalendarPickerRowComponent],
  host: {
    role: 'grid',
    '[attr.aria-label]': 'label()',
    '[class.size-large]': 'isLarge()',
    '(keydown)': 'onKeydown($event)',
    '(focusin)': 'focused.set(true)',
    '(focusout)': 'onFocusOut($event)',
  },
})
export class NbCalendarPickerComponent<D, T> {
  protected readonly dateService = inject<NbDateService<D>>(NbDateService);
  protected readonly locale = inject(LOCALE_ID);
  protected readonly element: HTMLElement = inject(ElementRef).nativeElement;
  protected readonly keyboard = inject<NbCalendarKeyboard<D>>(NB_CALENDAR_KEYBOARD, { optional: true });

  readonly data = input<(D | undefined)[][]>();
  readonly visibleDate = input<D>();
  readonly selectedValue = input<T>();
  readonly cellComponent = input.required<Type<NbCalendarCell<D, T>>>();
  readonly min = input<D>();
  readonly max = input<D>();
  readonly filter = input<(date: D) => boolean>();
  readonly size = input<NbCalendarSize, NbCalendarSizeValues>(NbCalendarSize.MEDIUM, {
    transform: (size) => size as NbCalendarSize,
  });
  /** What the cells are, which sets how the keyboard moves and how cells are named. */
  readonly unit = input<NbCalendarPickerUnit>('day');
  readonly select = output<D>();

  readonly isLarge = computed((): boolean => {
    return this.size() === NbCalendarSize.LARGE;
  });

  /** Names the grid with the period it shows, e.g. "November 2026". */
  protected readonly label = computed(() => {
    const dates = (this.data() ?? []).flat().filter((date): date is D => date !== undefined);
    const visible = this.visibleDate() ?? dates[0];
    if (!visible) {
      return null;
    }
    switch (this.unit()) {
      case 'day':
        return this.format(visible, { month: 'long', year: 'numeric' });
      case 'month':
        return this.format(visible, { year: 'numeric' });
      case 'year':
        return dates.length
          ? `${this.dateService.getYear(dates[0])} – ${this.dateService.getYear(dates[dates.length - 1])}`
          : null;
    }
  });

  /** Whether a cell of the grid has focus; shared with the calendar's other grids. */
  protected readonly focused = this.keyboard?.keyboardFocus ?? signal(false);
  /** The date the keyboard is on: its cell is the grid's one tab stop. */
  protected active?: D;
  /** The keyboard moved, so the active cell takes focus once it's shown. */
  protected moved = false;
  /** The selection the active cell was last checked against. */
  private lastSelected?: unknown;
  /** The selection changed since the active cell was picked. */
  private selectionChanged = false;

  constructor() {
    // The rows create the cells as these change; the cells are described, and focus kept, once they're in.
    afterRenderEffect(() => {
      this.data();
      const selected = this.selectedValue();
      if (selected !== this.lastSelected) {
        this.lastSelected = selected;
        this.selectionChanged = true;
      }
      this.visibleDate();
      this.min();
      this.max();
      this.filter();
      this.cellComponent();
      untracked(() => this.refresh());
    });
  }

  /** @internal */
  onSelect(date: D) {
    this.active = date;
    this.select.emit(date);
  }

  /**
   * Focus left the grid, unless the cell with it was re-created, or the grid made way for the next view's: browsers
   * report those as focus leaving too, but the cell is gone from the page then.
   * @internal
   */
  onFocusOut(event: FocusEvent) {
    if (this.element.contains(event.relatedTarget as Node | null)) {
      return;
    }
    const cell = event.target as Node;
    queueMicrotask(() => {
      if (cell.isConnected) {
        this.focused.set(this.element.contains(this.element.ownerDocument.activeElement));
      }
    });
  }

  /** @internal */
  onKeydown(event: KeyboardEvent) {
    const active = this.active;
    if (!active || event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }
    const rtl = getComputedStyle(this.element).direction === 'rtl';
    const rowLength = this.data()?.[0]?.length ?? 7;
    let target: D | undefined;
    switch (event.key) {
      case 'ArrowLeft':
        target = this.add(active, rtl ? 1 : -1);
        break;
      case 'ArrowRight':
        target = this.add(active, rtl ? -1 : 1);
        break;
      case 'ArrowUp':
        target = this.add(active, -rowLength);
        break;
      case 'ArrowDown':
        target = this.add(active, rowLength);
        break;
      case 'Home':
        target = this.rowEdge(active, 'start');
        break;
      case 'End':
        target = this.rowEdge(active, 'end');
        break;
      case 'PageUp':
        target = this.page(active, -1, event.shiftKey);
        break;
      case 'PageDown':
        target = this.page(active, 1, event.shiftKey);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        // The cell picks the date, unless it's disabled.
        this.cellFor(active)?.click();
        return;
      default:
        return;
    }
    event.preventDefault();
    if (target === undefined) {
      return;
    }
    this.active = target;
    this.moved = true;
    if (this.indexOf(target) >= 0) {
      this.refresh();
    } else {
      // The calendar shows the period with the date, and the grid focuses it once it's rendered.
      this.keyboard?.showDate(target);
    }
  }

  /** Describes the cells, picks the active one, and focuses it when the keyboard moved or the grid had focus. */
  protected refresh() {
    const cells = this.cells();
    const dates = (this.data() ?? []).flat();
    const isSelected = (cell: HTMLElement) => SELECTED_CLASSES.some((name) => cell.classList.contains(name));
    let index = this.active === undefined ? -1 : this.indexOf(this.active);
    // A new selection (or none) takes the tab stop, unless the active cell is part of it, as after picking it.
    if (index >= 0 && this.selectionChanged && !(cells[index] && isSelected(cells[index]))) {
      index = -1;
    }
    this.selectionChanged = false;
    if (index < 0) {
      index = this.firstIndex(cells, dates, isSelected);
    }
    if (index < 0) {
      index = this.firstIndex(cells, dates, (cell) => cell.classList.contains('today'));
    }
    if (index < 0) {
      index = this.firstIndex(cells, dates, () => true);
    }
    this.active = index >= 0 ? dates[index] : undefined;

    cells.forEach((cell, cellIndex) => this.describe(cell, dates[cellIndex], cellIndex === index));

    const cell = cells[index];
    const lostFocus = this.focused() && !this.element.contains(this.element.ownerDocument.activeElement);
    if (cell && (this.moved || lostFocus)) {
      cell.focus();
    }
    this.moved = false;
  }

  protected describe(cell: HTMLElement, date: D | undefined, active: boolean) {
    cell.setAttribute('role', 'gridcell');
    if (date === undefined) {
      cell.removeAttribute('tabindex');
      cell.removeAttribute('aria-label');
      cell.removeAttribute('aria-selected');
      return;
    }
    cell.tabIndex = active ? 0 : -1;
    cell.setAttribute('aria-label', this.name(date));
    cell.setAttribute('aria-selected', String(SELECTED_CLASSES.some((name) => cell.classList.contains(name))));
    this.toggleAttribute(cell, 'aria-current', cell.classList.contains('today') ? 'date' : undefined);
    this.toggleAttribute(cell, 'aria-disabled', cell.classList.contains('disabled') ? 'true' : undefined);
  }

  protected toggleAttribute(element: HTMLElement, name: string, value?: string) {
    if (value === undefined) {
      element.removeAttribute(name);
    } else {
      element.setAttribute(name, value);
    }
  }

  /** The grid's cells, in the order of the dates. */
  protected cells(): HTMLElement[] {
    return Array.from(this.element.querySelectorAll<HTMLElement>(':scope > nb-calendar-picker-row > *'));
  }

  protected cellFor(date: D): HTMLElement | undefined {
    return this.cells()[this.indexOf(date)];
  }

  /**
   * Where a date's cell is, or -1; days of the months around the one shown don't count, as moving there shows their
   * month.
   */
  protected indexOf(date: D): number {
    const cells = this.cells();
    return (this.data() ?? [])
      .flat()
      .findIndex(
        (candidate, index) =>
          candidate !== undefined && this.same(candidate, date) && !cells[index]?.classList.contains('bounding-month'),
      );
  }

  protected firstIndex(cells: HTMLElement[], dates: (D | undefined)[], match: (cell: HTMLElement) => boolean): number {
    return dates.findIndex(
      (date, index) =>
        date !== undefined &&
        !!cells[index] &&
        !cells[index].classList.contains('bounding-month') &&
        match(cells[index]),
    );
  }

  protected same(a: D, b: D): boolean {
    switch (this.unit()) {
      case 'day':
        return this.dateService.isSameDaySafe(a, b);
      case 'month':
        return this.dateService.isSameMonthSafe(a, b);
      case 'year':
        return this.dateService.isSameYearSafe(a, b);
    }
  }

  protected add(date: D, count: number): D {
    switch (this.unit()) {
      case 'day':
        return this.dateService.addDay(date, count);
      case 'month':
        return this.dateService.addMonth(date, count);
      case 'year':
        return this.dateService.addYear(date, count);
    }
  }

  /** A month or, with Shift, a year away among days; a page of months or years away otherwise. */
  protected page(date: D, direction: number, shift: boolean): D {
    switch (this.unit()) {
      case 'day':
        return shift ? this.dateService.addYear(date, direction) : this.dateService.addMonth(date, direction);
      case 'month':
        return this.dateService.addYear(date, direction);
      case 'year':
        return this.dateService.addYear(date, direction * (this.data() ?? []).flat().length);
    }
  }

  /** The first or last date in the row of a date. */
  protected rowEdge(date: D, edge: 'start' | 'end'): D | undefined {
    const contains = (dates: (D | undefined)[]) =>
      dates.some((candidate) => candidate !== undefined && this.same(candidate, date));
    const row = (this.data() ?? []).find(contains);
    const dates = (row ?? []).filter((candidate): candidate is D => candidate !== undefined);
    return edge === 'start' ? dates[0] : dates[dates.length - 1];
  }

  /** A cell's name: the full date, the month and year, or the year, in the app's language. */
  protected name(date: D): string {
    switch (this.unit()) {
      case 'day':
        return this.format(date, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      case 'month':
        return this.format(date, { year: 'numeric', month: 'long' });
      case 'year':
        return String(this.dateService.getYear(date));
    }
  }

  protected format(date: D, options: Intl.DateTimeFormatOptions): string {
    const native = new Date(2000, 0, 1);
    native.setFullYear(this.dateService.getYear(date), this.dateService.getMonth(date), this.dateService.getDate(date));
    try {
      return new Intl.DateTimeFormat(this.locale, options).format(native);
    } catch {
      return native.toDateString();
    }
  }
}
