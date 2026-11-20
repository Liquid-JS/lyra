import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  computed,
  DestroyableInjector,
  EmbeddedViewRef,
  inject,
  Injector,
  input,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';

import { NbPosition } from './overlay-position';
import { NbComponentPortal, NbPortalOutletDirective, NbTemplatePortal } from './mapping';
import { NbComponentContext, setComponentContext } from './overlay-service';

export interface NbRenderableContainer {
  /**
   * Renders the content with the context. The overlay sets both on the instance rather than through template
   * bindings, so `ngOnChanges` doesn't run; the overlay calls this instead after each change.
   */
  renderContent(): void;
}

/**
 * A container rendered by the dynamic overlay, which writes the overlay content, its context and the position to it.
 */
export interface NbDynamicOverlayContainer extends NbRenderableContainer {
  content?: unknown;
  context?: unknown;
  position?: NbPosition;
}

const positionClasses: Partial<Record<NbPosition, string>> = {
  [NbPosition.TOP]: 'nb-overlay-top',
  [NbPosition.TOP_START]: 'nb-overlay-top-start',
  [NbPosition.TOP_END]: 'nb-overlay-top-end',
  [NbPosition.RIGHT]: 'nb-overlay-right',
  [NbPosition.END]: 'nb-overlay-right',
  [NbPosition.END_TOP]: 'nb-overlay-end-top',
  [NbPosition.END_BOTTOM]: 'nb-overlay-end-bottom',
  [NbPosition.BOTTOM]: 'nb-overlay-bottom',
  [NbPosition.BOTTOM_START]: 'nb-overlay-bottom-start',
  [NbPosition.BOTTOM_END]: 'nb-overlay-bottom-end',
  [NbPosition.LEFT]: 'nb-overlay-left',
  [NbPosition.START]: 'nb-overlay-left',
  [NbPosition.START_TOP]: 'nb-overlay-start-top',
  [NbPosition.START_BOTTOM]: 'nb-overlay-start-bottom',
};

@Component({
  template: '',
  host: {
    '[class]': 'positionClass()',
  },
})
export class NbPositionedContainerComponent {
  readonly position = input<NbPosition>();

  protected readonly positionClass = computed(() => {
    const position = this.position();
    return (position && positionClasses[position]) ?? '';
  });
}

@Component({
  selector: 'nb-overlay-container',
  templateUrl: './overlay-container.html',
  // Hosted content may not use signals, so it's checked on every change detection.
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NbPortalOutletDirective],
})
export class NbOverlayContainerComponent {
  protected readonly vcr = inject(ViewContainerRef);
  protected readonly injector = inject(Injector);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  readonly portalOutlet = viewChild.required(NbPortalOutletDirective);

  protected readonly attached = signal(false);
  readonly isAttached = this.attached.asReadonly();

  readonly content = signal<string | undefined>(undefined);

  readonly isStringContent = computed(() => !!this.content());

  attachComponentPortal<T>(portal: NbComponentPortal<T>, context?: NbComponentContext<T>): ComponentRef<T> {
    portal.injector = this.createChildInjector();
    const componentRef = this.portalOutlet().attachComponentPortal(portal);
    if (context) {
      setComponentContext(componentRef, context);
    }
    componentRef.changeDetectorRef.markForCheck();
    componentRef.changeDetectorRef.detectChanges();
    this.attached.set(true);
    return componentRef;
  }

  attachTemplatePortal<C>(portal: NbTemplatePortal<C>): EmbeddedViewRef<C> {
    const templateRef = this.portalOutlet().attachTemplatePortal(portal);
    templateRef.detectChanges();
    this.attached.set(true);
    return templateRef;
  }

  attachStringContent(content?: string) {
    this.content.set(content);
    // Render now, so the overlay is measured with its content.
    this.changeDetectorRef.detectChanges();
    this.attached.set(true);
  }

  detach() {
    if (this.portalOutlet().hasAttached()) {
      this.portalOutlet().detach();
    }
    this.attachStringContent();
    this.attached.set(false);
  }

  protected createChildInjector(): DestroyableInjector {
    return Injector.create({
      parent: this.injector,
      providers: [],
    });
  }
}
