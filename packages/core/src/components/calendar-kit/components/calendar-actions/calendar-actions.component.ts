import { Component, computed, input, output } from '@angular/core';
import { NbButtonComponent } from '@liquid-js/lyr-core/button';
import { injectNbCalendarTexts } from '../../calendar-texts';
import { ɵconvertToOptionalBoolProperty as convertToOptionalBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';

/**
 * The buttons under a calendar with a time: one that sets the current time, shown with `showCurrentTimeButton`, and
 * one that applies the value. Their texts are the app's calendar texts unless given.
 */
@Component({
  selector: 'nb-calendar-actions',
  templateUrl: './calendar-actions.component.html',
  styleUrls: ['./calendar-actions.component.scss'],
  imports: [NbButtonComponent],
})
export class NbCalendarActionsComponent {
  protected readonly texts = injectNbCalendarTexts();

  readonly applyButtonText = input<string>();
  readonly applyText = computed(() => this.applyButtonText() || this.texts().apply);

  readonly currentTimeButtonText = input<string>();
  readonly currentTimeText = computed(() => this.currentTimeButtonText() || this.texts().now);

  readonly showCurrentTimeButton = input<boolean | undefined, NbBooleanInput>(undefined, {
    transform: convertToOptionalBoolProperty,
  });

  readonly setCurrentTime = output<void>();
  readonly saveValue = output<void>();
}
