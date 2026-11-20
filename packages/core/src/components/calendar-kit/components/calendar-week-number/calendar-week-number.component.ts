import { Component, computed, inject, input } from '@angular/core';

import { NbDateService } from '../../services/date.service';
import { NbCalendarSize, NbCalendarSizeValues } from '../../model';
import { injectNbCalendarTexts } from '../../calendar-texts';

/**
 * The column of week numbers beside a day picker's weeks.
 */
@Component({
  selector: 'nb-calendar-week-numbers',
  templateUrl: './calendar-week-number.component.html',
  styleUrls: ['./calendar-week-number.component.scss'],
  host: {
    '[class.size-large]': 'isLarge()',
  },
})
export class NbCalendarWeekNumberComponent<D> {
  protected readonly texts = injectNbCalendarTexts();

  protected readonly dateService = inject<NbDateService<D>>(NbDateService);

  readonly weeks = input.required<(D | undefined)[][]>();

  readonly size = input<NbCalendarSize>();
  static ngAcceptInputType_size: NbCalendarSizeValues;

  /**
   * The header of the column; `#` by default.
   */
  readonly weekNumberSymbol = input<string>();

  readonly isLarge = computed(() => {
    return this.size() === NbCalendarSize.LARGE;
  });

  readonly weekNumbers = computed<number[]>(() =>
    this.weeks().flatMap((week) => {
      // The week's number is its last day's, so a week spanning two years is the first of the new one; the last cells
      // are empty without bounding months.
      const lastDay = [...week].reverse().find((day): day is D => !!day);
      return lastDay ? [this.dateService.getWeekNumber(lastDay)] : [];
    }),
  );
}
