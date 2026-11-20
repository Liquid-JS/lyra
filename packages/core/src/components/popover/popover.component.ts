import { ChangeDetectionStrategy, Component, input, TemplateRef, Type, viewChild } from '@angular/core';
import { NbComponentPortal, NbTemplatePortal } from '@liquid-js/lyr-core/cdk';
import { NbOverlayContainerComponent, NbPositionedContainerComponent, NbRenderableContainer } from '@liquid-js/lyr-core/cdk';
import { NbOverlayContent } from '@liquid-js/lyr-core/cdk';

/**
 * The container `nbPopover` opens: an arrowed overlay with the directive's content, a template, a component or a
 * string.
 *
 * @styles
 *
 * popover-text-color:
 * popover-text-font-family:
 * popover-text-font-size:
 * popover-text-font-weight:
 * popover-text-line-height:
 * popover-background-color:
 * popover-border-width:
 * popover-border-color:
 * popover-border-radius:
 * popover-shadow:
 * popover-arrow-size:
 * popover-padding:
 * */
@Component({
  selector: 'nb-popover',
  styleUrls: ['./popover.component.scss'],
  templateUrl: './popover.component.html',
  // Hosted content may not use signals, so it's checked on every change detection.
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NbOverlayContainerComponent],
  host: {
    'animate.enter': 'nb-overlay-enter',
    'animate.leave': 'nb-overlay-leave',
  },
})
export class NbPopoverComponent extends NbPositionedContainerComponent implements NbRenderableContainer {
  readonly overlayContainer = viewChild.required(NbOverlayContainerComponent);

  readonly content = input<NbOverlayContent>();
  readonly context = input<object>();

  renderContent() {
    this.detachContent();
    this.attachContent();
  }

  protected detachContent() {
    this.overlayContainer().detach();
  }

  protected attachContent() {
    const content = this.content();
    if (content instanceof TemplateRef) {
      this.attachTemplate(content);
    } else if (content instanceof Type) {
      this.attachComponent(content);
    } else {
      this.attachString(content);
    }
  }

  protected attachTemplate(content: TemplateRef<unknown>) {
    this.overlayContainer().attachTemplatePortal(
      new NbTemplatePortal(content, undefined, { $implicit: this.context() }),
    );
  }

  protected attachComponent(content: Type<unknown>) {
    const portal = new NbComponentPortal(content, null, null);
    const ref = this.overlayContainer().attachComponentPortal(portal, this.context());
    ref.changeDetectorRef.detectChanges();
  }

  protected attachString(content?: string) {
    this.overlayContainer().attachStringContent(content);
  }
}
