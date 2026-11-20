import { injectNbTexts, NbLocalize, NbTexts } from '@liquid-js/lyr-core/base';

/** @internal */
declare const $localize: NbLocalize;

/** The calendar's default texts, in the app's language. @internal */
export function nbCalendarTexts(): NbTexts['calendar'] {
  return {
    previous: $localize`:@@nb.calendar.previous:Previous`,
    next: $localize`:@@nb.calendar.next:Next`,
    weekNumber: $localize`:@@nb.calendar.weekNumber:#`,
    apply: $localize`:@@nb.calendar.apply:ok`,
    now: $localize`:@@nb.calendar.now:now`,
    dialog: $localize`:@@nb.calendar.dialog:Choose a date`,
  };
}

/** @internal */
export function injectNbCalendarTexts() {
  return injectNbTexts('calendar', nbCalendarTexts);
}
