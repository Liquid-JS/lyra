import {
  Component,
  computed,
  inject,
  input,
} from '@angular/core';

import { NbCalendarDay, NbCalendarSize, NbCalendarSizeValues } from '../../model';
import { NbDateService } from '../../services/date.service';

/**
 * The row of weekday names above a day picker, the locale's weekend marked as holidays.
 */
@Component({
  selector: 'nb-calendar-days-names',
  styleUrls: ['./calendar-days-names.component.scss'],
  templateUrl: './calendar-days-names.component.html',
  host: {
    '[class.size-large]': 'isLarge()',
  },
})
export class NbCalendarDaysNamesComponent<D> {
  protected readonly dateService = inject<NbDateService<D>>(NbDateService);

  readonly size = input<NbCalendarSize>();
  static ngAcceptInputType_size: NbCalendarSizeValues;

  readonly isLarge = computed((): boolean => {
    return this.size() === NbCalendarSize.LARGE;
  });

  /**
   * The first day of the week: 0 for Sunday, 1 for Monday and so on; the locale's by default.
   */
  readonly firstDayOfWeek = input<number>();

  readonly days = computed<NbCalendarDay[]>(() => this.shiftStartOfWeek(this.createDaysNames()));

  private createDaysNames(): NbCalendarDay[] {
    const weekend = this.dateService.getWeekendDays();
    return this.dateService.getDayOfWeekNames()
      .map((name, i) => ({ name, isHoliday: weekend.includes(i) }));
  }

  private shiftStartOfWeek(days: NbCalendarDay[]): NbCalendarDay[] {
    const firstDayOfWeek = this.firstDayOfWeek() ?? this.dateService.getFirstDayOfWeek();
    for (let i = 0; i < firstDayOfWeek; i++) {
      const day = days.shift();
      if (day) {
        days.push(day);
      }
    }

    return days;
  }
}
