import { computed, Signal } from '@angular/core';
import { NbCalendarRange } from './calendar-range.component';

export abstract class NbBaseCalendarRangeCell<D> {
  abstract readonly selectedValue: Signal<NbCalendarRange<D> | undefined>;

  /**
   * The selected range when both of its ends are set.
   */
  protected readonly completeRange = computed((): Required<NbCalendarRange<D>> | undefined => {
    const range = this.selectedValue();
    return range && range.start && range.end ? { start: range.start, end: range.end } : undefined;
  });

  readonly hasRange = computed(() => !!this.completeRange());
}
