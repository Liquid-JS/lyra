import { Component, computed, DestroyRef, inject, input, output } from '@angular/core';
import { NbCalendarCell, NbCalendarSize, NbCalendarSizeValues } from '../../model';
import { NbDateService } from '../../services/date.service';

@Component({
  selector: 'nb-calendar-month-cell',
  templateUrl: './calendar-month-cell.component.html',
  host: {
    '[class.selected]': 'selected()',
    '[class.today]': 'today()',
    '[class.disabled]': 'disabled()',
    '[class.size-large]': 'isLarge()',
    class: 'month-cell',
    '(click)': 'onClick()',
  },
})
export class NbCalendarMonthCellComponent<D> implements NbCalendarCell<D, D> {
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly dateService = inject<NbDateService<D>>(NbDateService);

  readonly date = input.required<D>();

  readonly selectedValue = input<D>();

  readonly min = input<D>();

  readonly max = input<D>();

  readonly size = input<NbCalendarSize, NbCalendarSizeValues>(NbCalendarSize.MEDIUM, {
    transform: (size) => size as NbCalendarSize,
  });

  readonly select = output<D>();

  readonly selected = computed((): boolean => {
    return this.dateService.isSameMonthSafe(this.date(), this.selectedValue());
  });

  readonly today = computed((): boolean => {
    return this.dateService.isSameMonthSafe(this.date(), this.dateService.today());
  });

  readonly disabled = computed((): boolean => {
    return this.smallerThanMin() || this.greaterThanMax();
  });

  readonly isLarge = computed((): boolean => {
    return this.size() === NbCalendarSize.LARGE;
  });

  get month(): string {
    return this.dateService.getMonthName(this.date());
  }

  onClick() {
    if (this.disabled()) {
      return;
    }

    // Emitted once the click is handled, as the calendar's cells always did.
    const date = this.date();
    queueMicrotask(() => !this.destroyRef.destroyed && this.select.emit(date));
  }

  protected smallerThanMin(): boolean {
    const min = this.min();
    return !!this.date() && !!min && this.dateService.compareDates(this.monthEnd(), min) < 0;
  }

  protected greaterThanMax(): boolean {
    const max = this.max();
    return !!this.date() && !!max && this.dateService.compareDates(this.monthStart(), max) > 0;
  }

  protected monthStart(): D {
    return this.dateService.getMonthStart(this.date());
  }

  protected monthEnd(): D {
    return this.dateService.getMonthEnd(this.date());
  }
}
