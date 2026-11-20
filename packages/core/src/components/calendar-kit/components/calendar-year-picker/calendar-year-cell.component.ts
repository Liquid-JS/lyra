import { Component, computed, DestroyRef, inject, input, output } from '@angular/core';
import { NbDateService } from '../../services/date.service';
import { NbCalendarCell, NbCalendarSize, NbCalendarSizeValues } from '../../model';

@Component({
  selector: 'nb-calendar-year-cell',
  templateUrl: './calendar-year-cell.component.html',
  host: {
    '[class.selected]': 'selected()',
    '[class.today]': 'today()',
    '[class.disabled]': 'disabled()',
    '[class.size-large]': 'isLarge()',
    class: 'year-cell',
    '(click)': 'onClick()',
  },
})
export class NbCalendarYearCellComponent<D> implements NbCalendarCell<D, D> {
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly dateService = inject<NbDateService<D>>(NbDateService);

  readonly date = input.required<D>();

  readonly min = input<D>();

  readonly max = input<D>();

  readonly selectedValue = input<D>();

  readonly size = input<NbCalendarSize, NbCalendarSizeValues>(NbCalendarSize.MEDIUM, {
    transform: (size) => size as NbCalendarSize,
  });

  readonly select = output<D>();

  readonly selected = computed((): boolean => {
    return this.dateService.isSameYearSafe(this.date(), this.selectedValue());
  });

  readonly today = computed((): boolean => {
    return this.dateService.isSameYearSafe(this.date(), this.dateService.today());
  });

  readonly disabled = computed((): boolean => {
    return this.smallerThanMin() || this.greaterThanMax();
  });

  readonly isLarge = computed((): boolean => {
    return this.size() === NbCalendarSize.LARGE;
  });

  get year(): number {
    return this.dateService.getYear(this.date());
  }

  onClick() {
    if (this.disabled()) {
      return;
    }

    // Emitted once the click is handled, as the calendar's cells always did.
    const date = this.date();
    queueMicrotask(() => !this.destroyRef.destroyed && this.select.emit(date));
  }

  private smallerThanMin(): boolean {
    const min = this.min();
    return !!this.date() && !!min && this.dateService.compareDates(this.yearEnd(), min) < 0;
  }

  private greaterThanMax(): boolean {
    const max = this.max();
    return !!this.date() && !!max && this.dateService.compareDates(this.yearStart(), max) > 0;
  }

  private yearStart(): D {
    return this.dateService.getYearStart(this.date());
  }

  private yearEnd(): D {
    return this.dateService.getYearEnd(this.date());
  }
}
