import { Component, computed, DestroyRef, inject, input, output } from '@angular/core';

import { NbCalendarCell, NbCalendarSize, NbCalendarSizeValues } from '../../model';
import { NbDateService } from '../../services/date.service';

@Component({
  selector: 'nb-calendar-day-cell',
  templateUrl: './calendar-day-cell.component.html',
  host: {
    '[class.today]': 'today()',
    '[class.bounding-month]': 'boundingMonth()',
    '[class.selected]': 'selected()',
    '[class.empty]': 'empty()',
    '[class.disabled]': 'disabled()',
    '[class.size-large]': 'isLarge()',
    class: 'day-cell',
    '(click)': 'onClick()',
  },
})
export class NbCalendarDayCellComponent<D> implements NbCalendarCell<D, D> {
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly dateService = inject<NbDateService<D>>(NbDateService);

  readonly date = input<D>();

  readonly selectedValue = input<D>();

  readonly visibleDate = input<D>();

  readonly min = input<D>();

  readonly max = input<D>();

  readonly filter = input<(date: D) => boolean>();

  readonly size = input<NbCalendarSize, NbCalendarSizeValues>(NbCalendarSize.MEDIUM, {
    transform: (size) => size as NbCalendarSize,
  });

  readonly select = output<D>();

  readonly today = computed((): boolean => {
    return this.dateService.isSameDaySafe(this.date(), this.dateService.today());
  });

  readonly boundingMonth = computed((): boolean => {
    return !this.dateService.isSameMonthSafe(this.date(), this.visibleDate());
  });

  readonly selected = computed((): boolean => {
    return this.dateService.isSameDaySafe(this.date(), this.selectedValue());
  });

  readonly empty = computed((): boolean => {
    return !this.date();
  });

  readonly disabled = computed((): boolean => {
    return this.smallerThanMin() || this.greaterThanMax() || this.dontFitFilter();
  });

  readonly isLarge = computed((): boolean => {
    return this.size() === NbCalendarSize.LARGE;
  });

  get day(): number | undefined {
    const date = this.date();
    return date ? this.dateService.getDate(date) : undefined;
  }

  onClick() {
    const date = this.date();
    if (this.disabled() || !date) {
      return;
    }

    // Emitted once the click is handled, as the calendar's cells always did.
    queueMicrotask(() => !this.destroyRef.destroyed && this.select.emit(date));
  }

  private smallerThanMin(): boolean {
    // Cells are midnight; a min with a time of day still allows its own day.
    const date = this.date();
    const min = this.min();
    return (
      !!date &&
      !!min &&
      !this.dateService.isSameDaySafe(date, min) &&
      this.dateService.compareDates(date, min) < 0
    );
  }

  private greaterThanMax(): boolean {
    const date = this.date();
    const max = this.max();
    return (
      !!date &&
      !!max &&
      !this.dateService.isSameDaySafe(date, max) &&
      this.dateService.compareDates(date, max) > 0
    );
  }

  private dontFitFilter(): boolean {
    const date = this.date();
    const filter = this.filter();
    return !!date && !!filter && !filter(date);
  }
}
