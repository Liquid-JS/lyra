import { ChangeDetectionStrategy, Component, input, TemplateRef, viewChild } from '@angular/core';
import {
  NbOverlayContainerComponent,
  NbOverlayContent,
  NbPositionedContainerComponent,
  NbRenderableContainer,
  NbTemplatePortal,
} from '@liquid-js/lyr-core';

/**
 * The colour picker's overlay: the dialog of `nb-color-picker`, framed as the date picker's is. The dialog is
 * nxt-color-picker's, shown inline in it, so it opens, and is positioned and closed, as Lyra's pickers are.
 * @internal
 */
@Component({
  selector: 'nb-color-picker-dialog',
  template: '<nb-overlay-container />',
  // Hosted content may not use signals, so it's checked on every change detection.
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NbOverlayContainerComponent],
})
export class NbColorPickerDialogComponent extends NbPositionedContainerComponent implements NbRenderableContainer {
  readonly overlayContainer = viewChild.required(NbOverlayContainerComponent);

  readonly content = input<NbOverlayContent>();
  readonly context = input<object>();

  renderContent() {
    const container = this.overlayContainer();
    container.detach();
    const content = this.content();
    if (content instanceof TemplateRef) {
      container.attachTemplatePortal(new NbTemplatePortal(content, undefined, this.context()));
    }
  }
}
