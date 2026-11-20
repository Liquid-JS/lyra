import { ComponentRef, EnvironmentInjector, Injector, TemplateRef, ViewContainerRef, inject, Service } from '@angular/core';
import { fadeBackdrop, NbComponentPortal, NbComponentType, NbOverlayPositionBuilder, NbOverlayRef } from '@liquid-js/lyr-core/cdk';
import { NbEscapeStack, NbOverlayService } from '@liquid-js/lyr-core/cdk';
import { NbBlockScrollStrategyAdapter } from '@liquid-js/lyr-core/cdk';
import {
  NB_WINDOW_CONFIG,
  NB_WINDOW_CONTENT,
  NB_WINDOW_CONTEXT,
  NbWindowOpenConfig,
  NbWindowConfig,
  NbWindowState,
} from './window.options';
import { NbWindowRef } from './window-ref';
import { NbWindowsContainerComponent } from './windows-container.component';
import { NbWindowComponent } from './window.component';
import { NB_DOCUMENT } from '@liquid-js/lyr-core/base';

/**
 * Opens windows: panels with a component or template that are full screen over the page, docked at its bottom or
 * minimized to their header, and can be open side by side.
 *
 * @stacked-example(Showcase, window/window-showcase.component)
 *
 * ### Installation
 *
 * Add `provideNbWindow()` to the application providers:
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [provideNbWindow(config)],
 * });
 * ```
 * In a lazy loaded route, add `provideNbWindow()` to the route's `providers` instead, so the route gets its own
 * instance.
 *
 * With NgModules:
 *
 * Import `NbWindowModule` to your app module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbWindowModule.forRoot(config),
 *   ],
 * })
 * export class AppModule { }
 * ```
 *
 * In a lazy loaded module, import `NbWindowModule.forChild()` instead:
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbWindowModule.forChild(config),
 *   ],
 * })
 * export class LazyLoadedModule { }
 * ```
 *
 * ### Usage
 *
 * `open` takes a component or template, and an optional config, and returns the window's `NbWindowRef`.
 *
 * ```ts
 * const windowRef = this.windowService.open(MyComponent, { ... });
 * ```
 *
 * `NbWindowRef` controls the open window; the component rendered in the window can inject it.
 *
 * ```ts
 * this.windowService.open(MyWindowComponent, { ... });
 *
 * // my.component.ts
 * constructor(protected windowRef: NbWindowRef) {
 * }
 *
 * minimize() {
 *   this.windowRef.minimize();
 * }
 *
 * close() {
 *   this.windowRef.close();
 * }
 * ```
 *
 * A window can show a `TemplateRef` instead of a component. The config's `context` is the template's `$implicit`,
 * and the `NbWindowRef` is its `windowRef`, for `let-` variables.
 *
 * @stacked-example(Window content from TemplateRef, window/template-window.component)
 *
 * The title can be a template too: `titleTemplate`, with `titleTemplateContext` as its context.
 *
 * @stacked-example(Title from TemplateRef, window/window-template-title.component)
 *
 * A result passed to `NbWindowRef.close` is emitted to the `NbWindowRef.onClose` subscribers.
 *
 * @stacked-example(Result, window/window-result.component)
 *
 * ### Configuration
 *
 * `open` takes a window's options; the app's defaults go to `provideNbWindow({ ... })` or
 * `NbWindowModule.forRoot({ ... })`. The [API tab](components/modals-overlays/window/api#nbwindowconfig) lists them.
 *
 * @stacked-example(Configuration, window/windows-backdrop.component)
 *
 * A window is full screen, over the page, docked at the bottom of the page, or minimized to its header there. `states`
 * sets which of them it can be in, and it has a button to each other one: Minimize, Collapse (to docked, Restore from
 * minimized) and Expand (to full screen). It opens in `initialState` when that's one of them, otherwise in the first,
 * in that order; e.g. `states: ['docked', 'minimized']` keeps a window docked, like a chat. `closeButton: false` leaves
 * out the close button.
 * @stacked-example(States, window/window-controls.component)
 *
 * @styles
 *
 * window-background-color:
 * window-border-color:
 * window-border-radius:
 * window-shadow:
 * overlay-backdrop-background-color:
 */
@Service({ autoProvided: false })
export class NbWindowService {
  protected readonly overlayService = inject(NbOverlayService);
  protected readonly overlayPositionBuilder = inject(NbOverlayPositionBuilder);
  protected readonly blockScrollStrategy = inject(NbBlockScrollStrategyAdapter);
  protected readonly escapeStack = inject(NbEscapeStack);
  protected readonly defaultWindowsConfig = inject<NbWindowConfig>(NB_WINDOW_CONFIG);
  protected readonly environmentInjector = inject(EnvironmentInjector, { optional: true });

  protected readonly document: Document = inject(NB_DOCUMENT);
  protected overlayRef?: NbOverlayRef;
  protected windowsContainerViewRef?: ViewContainerRef;
  protected openWindows = new Array<NbWindowRef>();
  /** The layer of the window on top. */
  protected topLayer = 0;
  /** A click on the shared backdrop closes every open window, or none: the app's setting. */
  protected readonly closeOnBackdropClick = new NbWindowConfig(this.defaultWindowsConfig ?? {}).closeOnBackdropClick;

  /**
   * Opens a window with a component or template, on top of the open ones.
   */
  open<T = unknown>(
    windowContent: TemplateRef<unknown> | NbComponentType<T>,
    windowConfig: NbWindowOpenConfig = {},
  ): NbWindowRef<T> {
    if (this.shouldCreateWindowsContainer()) {
      this.createWindowsContainer();
    } else {
      this.bringWindowsContainerToFront();
    }

    const config = new NbWindowConfig(this.defaultWindowsConfig, windowConfig);
    const windowRef = new NbWindowRef<T>(config);
    // A new window opens on top.
    windowRef.layer.set(++this.topLayer);
    windowRef.windowComponentRef = this.appendWindow(windowContent, config, windowRef);

    this.openWindows.push(windowRef);
    this.subscribeToEvents(windowRef);

    return windowRef;
  }

  protected shouldCreateWindowsContainer(): boolean {
    if (this.windowsContainerViewRef) {
      const containerEl = this.windowsContainerViewRef.element.nativeElement;
      return !this.document.body.contains(containerEl);
    }

    return true;
  }

  /**
   * All windows share one overlay, shown with the first window. Overlays shown since then, e.g. a dialog,
   * would cover a new window, so the windows overlay is moved above them.
   * */
  protected bringWindowsContainerToFront() {
    const overlayRef = this.overlayRef;
    if (!overlayRef) {
      return;
    }
    const host = overlayRef.hostElement;

    if (host.matches(':popover-open')) {
      // Popovers stack in the top layer in the order they were shown.
      const openPopovers = this.document.querySelectorAll(':popover-open');
      if (openPopovers.length > 1) {
        host.hidePopover();
        host.showPopover();
      }
      return;
    }

    const overlayContainer = host.parentElement;
    if (!overlayContainer || overlayContainer.lastElementChild === host) {
      return;
    }
    const backdrop = overlayRef.backdropElement;
    if (backdrop?.parentElement === overlayContainer) {
      overlayContainer.appendChild(backdrop);
    }
    overlayContainer.appendChild(host);
  }

  protected createWindowsContainer() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }

    const windowsOverlayRef = this.overlayService.create({
      scrollStrategy: this.overlayService.scrollStrategies.noop(),
      positionStrategy: this.overlayPositionBuilder.global().bottom().end(),
      hasBackdrop: true,
    });
    this.overlayRef = windowsOverlayRef;
    const windowsContainerPortal = new NbComponentPortal(
      NbWindowsContainerComponent,
      null,
      this.environmentInjector ?? null,
    );
    const overlayRef = windowsOverlayRef.attach(windowsContainerPortal);
    this.windowsContainerViewRef = overlayRef.instance.viewContainerRef();

    windowsOverlayRef.backdropClick().subscribe(() => {
      if (this.closeOnBackdropClick) {
        [...this.openWindows].forEach((windowRef) => windowRef.close());
      }
    });
  }

  protected appendWindow(
    content: TemplateRef<unknown> | NbComponentType,
    config: NbWindowConfig,
    windowRef: NbWindowRef,
  ): ComponentRef<NbWindowComponent> {
    const context = content instanceof TemplateRef ? { $implicit: config.context, windowRef } : config.context;

    const providers = [
      { provide: NB_WINDOW_CONTENT, useValue: content },
      { provide: NB_WINDOW_CONTEXT, useValue: context },
      { provide: NbWindowConfig, useValue: config },
      { provide: NbWindowRef, useValue: windowRef },
    ];
    const container = this.windowsContainerViewRef;
    if (!container) {
      throw new Error('NbWindowService: the windows container is not created.');
    }
    const parentInjector = config.viewContainerRef ? config.viewContainerRef.injector : container.injector;
    const injector = Injector.create({ parent: parentInjector, providers });

    const ref = container.createComponent(NbWindowComponent, {
      injector,
      index: container.length,
    });
    ref.changeDetectorRef.detectChanges();
    return ref;
  }

  protected subscribeToEvents(windowRef: NbWindowRef) {
    // Escape closes the window in front, not a minimized one; one that doesn't close on Escape keeps it from the
    // windows behind it.
    const escape = this.escapeStack.add(
      () => {
        if (windowRef.config.closeOnEsc) {
          windowRef.close();
        }
      },
      () => windowRef.state !== NbWindowState.MINIMIZED,
    );

    // The window used, e.g. clicked or focused, comes above the others.
    windowRef.frontRequests.subscribe(() => {
      if (windowRef.layer() !== this.topLayer) {
        windowRef.layer.set(++this.topLayer);
      }
      escape.raise();
    });

    windowRef.stateChange.subscribe(() => this.checkAndUpdateOverlay());

    windowRef.onClose.subscribe(() => {
      escape.remove();
      this.openWindows.splice(this.openWindows.indexOf(windowRef), 1);
      this.checkAndUpdateOverlay();
    });
  }

  protected checkAndUpdateOverlay() {
    const fullScreenWindows = this.openWindows.filter((w) => w.state === NbWindowState.FULL_SCREEN);
    if (fullScreenWindows.length > 0) {
      this.blockScrollStrategy.enable();
    } else {
      this.blockScrollStrategy.disable();
    }

    // The windows overlay is created with a backdrop.
    const backdrop = this.overlayRef?.backdropElement;
    if (!backdrop) {
      return;
    }
    // Shown, with a fade, while a full-screen window wants it; out of the way otherwise.
    fadeBackdrop(backdrop, fullScreenWindows.some((w) => w.config.hasBackdrop));
  }
}
