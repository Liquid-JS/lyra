import { ComponentRef, EnvironmentInjector, inject, Injectable, Type, afterNextRender, Injector } from '@angular/core';
import { filter, takeUntil, distinctUntilChanged, take } from 'rxjs/operators';
import { Subject, BehaviorSubject, Observable, merge } from 'rxjs';

import { NbAdjustableConnectedPositionStrategy, NbPosition } from '../overlay-position';

import { NbDynamicOverlayContainer } from '../overlay-container';
import {
  createContainer,
  NbComponentContext,
  NbOverlayContent,
  NbOverlayService,
  patch,
  setComponentContext,
} from '../overlay-service';
import { NbOverlayRef, NbOverlayContainer, NbOverlayConfig } from '../mapping';
import { observeMove } from './observe-move';

export interface NbDynamicOverlayController {
  show(): void;
  hide(): void;
  toggle(): void;
  rebuild(): void;
}

/**
 * An overlay whose container component, content, context and position can change while it's shown: popovers,
 * tooltips and context menus are built on it through `NbDynamicOverlayHandler`.
 *
 * The container is positioned again after its first render, whenever its size changes, and when the host moves.
 */
// Provided with constructor injection, which @Service doesn't support.
@Injectable()
export class NbDynamicOverlay {
  protected ref?: NbOverlayRef;
  /** Repositions the shown container when its size changes, e.g. as content loads or a list grows. */
  protected resizeObserver?: ResizeObserver;
  /** Stops following the element the container is placed against, which it does while it's shown. */
  protected stopObservingHost?: () => void;
  protected container?: ComponentRef<NbDynamicOverlayContainer>;
  protected componentType?: Type<NbDynamicOverlayContainer>;
  protected context: object = {};
  protected content?: NbOverlayContent;
  protected positionStrategy?: NbAdjustableConnectedPositionStrategy;
  protected overlayConfig: NbOverlayConfig = {};
  protected lastAppliedPosition?: NbPosition;
  protected disabled = false;

  protected positionStrategyChange$ = new Subject<void>();
  protected isShown$ = new BehaviorSubject<boolean>(false);
  protected destroy$ = new Subject<void>();
  protected overlayDestroy$ = new Subject<NbOverlayRef>();
  /** The module that provides the directive, so overlay content can use its providers. */
  protected readonly environmentInjector = inject(EnvironmentInjector);

  get isAttached(): boolean {
    return !!this.ref && this.ref.hasAttached();
  }

  get isShown(): Observable<boolean> {
    return this.isShown$.pipe(distinctUntilChanged());
  }

  /** The shown container's element, e.g. to move focus into it. */
  get containerElement(): HTMLElement | undefined {
    return this.container?.location.nativeElement;
  }

  /* eslint-disable @angular-eslint/prefer-inject -- constructor injection on purpose, see the note on the class */
  constructor(
    protected overlay: NbOverlayService,
    protected overlayContainer: NbOverlayContainer,
    protected injector: Injector,
  ) {}
  /* eslint-enable @angular-eslint/prefer-inject */

  create(
    componentType: Type<NbDynamicOverlayContainer>,
    content: NbOverlayContent | undefined,
    context: object,
    positionStrategy: NbAdjustableConnectedPositionStrategy,
    overlayConfig: NbOverlayConfig = {},
    disabled = false,
  ) {
    this.setContentAndContext(content, context);
    this.setComponent(componentType);
    this.setPositionStrategy(positionStrategy);
    this.setOverlayConfig(overlayConfig);
    this.setDisabled(disabled);

    return this;
  }

  setContent(content?: NbOverlayContent) {
    this.content = content;

    if (this.container) {
      this.updateContext(this.container);
    }
    this.updatePosition();
  }

  setContext(context: object) {
    this.context = context;

    if (this.container) {
      this.updateContext(this.container);
    }
    this.updatePosition();
  }

  setContentAndContext(content: NbOverlayContent | undefined, context: object) {
    this.content = content;
    this.context = context;
    if (this.container) {
      this.updateContext(this.container);
    }
    this.updatePosition();
  }

  setComponent(componentType: Type<NbDynamicOverlayContainer>) {
    this.componentType = componentType;

    // A shown container is created again with the new component.
    const wasAttached = this.isAttached;
    this.disposeOverlayRef();
    if (wasAttached) {
      this.show();
    }
  }

  setPositionStrategy(positionStrategy: NbAdjustableConnectedPositionStrategy) {
    this.positionStrategyChange$.next();

    this.positionStrategy = positionStrategy;

    positionStrategy.positionChange
      .pipe(takeUntil(merge(this.positionStrategyChange$, this.destroy$)))
      .subscribe((position: NbPosition) => {
        const container = this.container;
        if (container) {
          this.lastAppliedPosition = position;
          patch(container, { position });
        }
      });

    if (this.ref) {
      this.ref.updatePositionStrategy(positionStrategy);
    }
  }

  setOverlayConfig(overlayConfig: NbOverlayConfig) {
    this.overlayConfig = overlayConfig;

    const wasAttached = this.isAttached;
    this.disposeOverlayRef();
    if (wasAttached) {
      this.show();
    }
  }

  setDisabled(disabled: boolean) {
    if (disabled && this.isShown$.value) {
      this.hide();
    }
    this.disabled = disabled;
  }

  show(): void {
    if (this.disabled) {
      return;
    }

    const ref = this.ref ?? this.createOverlay();

    this.renderContainer(ref);

    if (!this.hasOverlayInContainer(ref)) {
      // Dispose overlay ref as it refers to the old overlay container and create new by calling `show`
      this.disposeOverlayRef();
      return this.show();
    }

    this.observeSize();
    this.observeHost();
    this.isShown$.next(true);
  }

  hide() {
    if (!this.ref) {
      return;
    }

    this.ref.detach();
    this.container = undefined;
    this.resizeObserver?.disconnect();
    this.stopObservingHost?.();

    this.isShown$.next(false);
  }

  toggle() {
    if (this.isAttached) {
      this.hide();
    } else {
      this.show();
    }
  }

  dispose() {
    this.destroy$.next();
    this.destroy$.complete();
    this.hide();
    this.disposeOverlayRef();
    this.isShown$.complete();
    this.positionStrategyChange$.complete();
    this.overlayDestroy$.complete();
  }

  getContainer() {
    return this.container;
  }

  protected createOverlay(): NbOverlayRef {
    const ref = this.overlay.create({
      positionStrategy: this.positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      ...this.overlayConfig,
    });
    this.ref = ref;
    this.updatePositionWhenStable(ref);
    return ref;
  }

  protected renderContainer(ref: NbOverlayRef) {
    const containerContext = this.createContainerContext();
    if (!this.container) {
      if (!this.componentType) {
        throw new Error('NbDynamicOverlay: the overlay has no component yet, call create() before show()');
      }
      this.container = createContainer(ref, this.componentType, containerContext, this.environmentInjector);
    }
    this.container.instance.renderContent();
  }

  protected updateContext(container: ComponentRef<NbDynamicOverlayContainer>) {
    const containerContext = this.createContainerContext();
    setComponentContext(container, containerContext);
    container.instance.renderContent();
    container.changeDetectorRef.detectChanges();
  }

  protected createContainerContext(): NbComponentContext<NbDynamicOverlayContainer> {
    return {
      content: this.content,
      context: this.context,
      position: this.lastAppliedPosition,
    };
  }

  /**
   * Dimensions of the container may change once its content renders, so the container is positioned again after the
   * next render. That works with and without zone.js.
   */
  protected updatePositionWhenStable(overlay: NbOverlayRef) {
    const overlayDestroy$ = this.overlayDestroy$.pipe(
      filter((destroyedOverlay: NbOverlayRef) => destroyedOverlay === overlay),
    );

    const render = afterNextRender(() => this.updatePosition(), { injector: this.injector });
    merge(this.destroy$, overlayDestroy$)
      .pipe(take(1))
      .subscribe(() => render.destroy());
  }

  /** Positions the container again whenever its size changes while it's shown. */
  protected observeSize() {
    this.resizeObserver?.disconnect();
    const element: Element | undefined = this.container?.location?.nativeElement;
    if (!element || typeof ResizeObserver === 'undefined') {
      return;
    }
    this.resizeObserver ??= new ResizeObserver(() => this.updatePosition());
    this.resizeObserver.observe(element);
  }

  /**
   * Positions the container again when the element it's placed against moves without scrolling, e.g. as a sidebar
   * opens beside it; the scroll strategy follows scrolling, and the container's own size is observed above.
   */
  protected observeHost() {
    this.stopObservingHost?.();
    const host = this.positionStrategy?.originElement;
    this.stopObservingHost = host ? observeMove(host, () => this.updatePosition()) : undefined;
  }

  protected updatePosition() {
    // A detached overlay's position strategy may never have been attached (a new one is only attached on show),
    // so applying it would fail; the position is computed again when the overlay is shown.
    if (this.ref?.hasAttached()) {
      this.ref.updatePosition();
    }
  }

  protected hasOverlayInContainer(ref: NbOverlayRef): boolean {
    return this.overlayContainer.getContainerElement().contains(ref.hostElement);
  }

  protected disposeOverlayRef() {
    this.resizeObserver?.disconnect();
    this.stopObservingHost?.();
    if (this.ref) {
      this.ref.dispose();
      this.overlayDestroy$.next(this.ref);
      this.ref = undefined;
      this.container = undefined;
    }
  }
}
