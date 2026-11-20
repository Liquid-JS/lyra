import {
  Component,
  TemplateRef,
  ViewContainerRef,
  inject,
  viewChild,
} from '@angular/core';
import {
  NbOverlayService,
  NbPositionBuilderService,
  NbTemplatePortal,
  NbCardComponent,
  NbCardHeaderComponent,
  NbCardBodyComponent,
  NbButtonComponent,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-overlay-showcase',
  templateUrl: './overlay-showcase.component.html',
  imports: [NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent, NbButtonComponent],
})
export class OverlayShowcaseComponent {
  protected readonly overlay = inject(NbOverlayService);
  protected readonly positionBuilder = inject(NbPositionBuilderService);
  protected readonly vcr = inject(ViewContainerRef);

  readonly overlayTemplate = viewChild.required<TemplateRef<any>>('overlay');
  protected readonly ref = this.overlay.create({
    positionStrategy: this.positionBuilder.global().centerHorizontally().centerVertically(),
    hasBackdrop: true,
  });

  createOverlay() {
    if (this.ref.hasAttached()) {
      return;
    }

    this.ref.attach(new NbTemplatePortal(this.overlayTemplate(), this.vcr));
  }

  dismissOverlay() {
    this.ref.detach();
  }
}
