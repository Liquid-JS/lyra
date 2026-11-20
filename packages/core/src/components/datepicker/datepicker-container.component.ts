import { Component, ComponentRef, viewChild, ChangeDetectionStrategy, input } from '@angular/core';

import { NbComponentPortal } from '@liquid-js/lyr-core/cdk';
import { NbOverlayContainerComponent, NbPositionedContainerComponent } from '@liquid-js/lyr-core/cdk';
import { ɵinjectNbCalendarTexts as injectNbCalendarTexts } from '@liquid-js/lyr-core/calendar-kit';

@Component({
  selector: 'nb-datepicker-container',
  template: ` <nb-overlay-container /> `,
  // Hosted content may not use signals, so it's checked on every change detection.
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NbOverlayContainerComponent],
  host: {
    role: 'dialog',
    '[id]': 'dialogId()',
    '[attr.aria-label]': 'texts().dialog',
    'animate.enter': 'nb-overlay-enter',
    'animate.leave': 'nb-overlay-leave',
  },
})
export class NbDatepickerContainerComponent extends NbPositionedContainerComponent {
  protected readonly texts = injectNbCalendarTexts();

  /** The id the picker's input refers to, as the dialog it controls. */
  readonly dialogId = input<string>();

  readonly overlayContainer = viewChild.required(NbOverlayContainerComponent);

  attach<T>(portal: NbComponentPortal<T>): ComponentRef<T> {
    return this.overlayContainer().attachComponentPortal(portal);
  }
}
