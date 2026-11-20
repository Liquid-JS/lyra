import { Component, computed, inject, input, output, Type } from '@angular/core';
import { NbCalendarCell, NbCalendarSize, NbCalendarSizeValues } from '../../model';
import { NbCalendarYearCellComponent } from './calendar-year-cell.component';
import { NbDateService } from '../../services/date.service';
import { NbCalendarYearModelService } from '../../services/calendar-year-model.service';
import { NbCalendarPickerComponent } from '../calendar-picker/calendar-picker.component';

/**
 * A page of twelve years to pick from, in rows of four: the page, aligned to multiples of twelve, with `year`.
 */
@Component({
  selector: 'nb-calendar-year-picker',
  templateUrl: './calendar-year-picker.component.html',
  imports: [NbCalendarPickerComponent],
  host: {
    '[class.size-large]': 'large()',
  },
})
export class NbCalendarYearPickerComponent<D> {
  protected readonly dateService = inject<NbDateService<D>>(NbDateService);
  protected readonly yearModelService = inject<NbCalendarYearModelService<D>>(NbCalendarYearModelService);

  readonly date = input<D>();

  readonly min = input<D>();

  readonly max = input<D>();

  readonly filter = input<(date: D) => boolean>();

  readonly cellComponentInput = input<Type<NbCalendarCell<D, unknown>>>(undefined, { alias: 'cellComponent' });
  readonly cellComponent = computed<Type<NbCalendarCell<D, unknown>>>(
    () => this.cellComponentInput() || NbCalendarYearCellComponent<D>,
  );

  readonly size = input<NbCalendarSize, NbCalendarSizeValues>(NbCalendarSize.MEDIUM, {
    transform: (size) => size as NbCalendarSize,
  });

  /** A date in the page of years shown. */
  readonly year = input.required<D>();

  readonly yearChange = output<D>();

  readonly large = computed(() => {
    return this.size() === NbCalendarSize.LARGE;
  });

  readonly years = computed<D[][]>(() => this.yearModelService.getViewYears(this.year()));

  onSelect(year: D) {
    this.yearChange.emit(year);
  }
}
