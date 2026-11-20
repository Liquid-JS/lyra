import {
  AfterViewInit,
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  OnChanges,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NbDynamicOverlay, NbDynamicOverlayController } from '@liquid-js/lyr-core/cdk';
import { NbDynamicOverlayHandler, nbCreateDynamicOverlayHandler } from '@liquid-js/lyr-core/cdk';
import { NbAdjustment, NbPosition, NbPositionValues, NbAdjustmentValues } from '@liquid-js/lyr-core/cdk';
import { NbOverlayContent } from '@liquid-js/lyr-core/cdk';
import { NbTrigger, NbTriggerValues } from '@liquid-js/lyr-core/cdk';
import { NbOverlayConfig } from '@liquid-js/lyr-core/cdk';
import { NbPopoverComponent } from './popover.component';
import { skip } from 'rxjs/operators';
import { ɵconvertToBoolProperty as convertToBoolProperty, ɵconvertToOptionalBoolProperty as convertToOptionalBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';

let lastPopoverId = 0;

/**
 * Opens a popover with a template, a component or a text beside its host element.
 *
 * @stacked-example(Showcase, popover/popover-showcase.component)
 *
 * A template:
 *
 * ```html
 * <button [nbPopover]="templateRef"></button>
 * <ng-template #templateRef>
 *   <span>Hello, Popover!</span>
 * </ng-template>
 * ```
 * ### Installation
 *
 * Import `NbPopoverDirective` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbPopoverDirective],
 * })
 * export class PageComponent { }
 * ```
 *
 * With NgModules:
 *
 * Import `NbPopoverModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbPopoverModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * A component:
 *
 * ```html
 * <button [nbPopover]="MyPopoverComponent"></button>
 * ```
 *
 * A template gets `nbPopoverContext` as its `$implicit` context, a component as its inputs.
 *
 * A text:
 *
 * ```html
 * <button nbPopover="Hello, Popover!"></button>
 * ```
 *
 * `nbPopoverPlacement` places it on a side of the host: `top` (default), `bottom`, `left`, `right`, `start` or `end`,
 * or at a corner, e.g. `top-start`:
 *
 * @stacked-example(Placements, popover/popover-placements.component)
 *
 * Where the popover doesn't fit the viewport, it moves to another side, `clockwise` by default; `nbPopoverAdjustment`
 * picks another order, or `noop` keeps the placement:
 *
 * ```html
 * <button nbPopover="Hello, Popover!" nbPopoverAdjustment="noop"></button>
 * ```
 *
 * `nbPopoverTrigger` sets what shows and hides it:
 *
 * - `click` (default) shows it on a click on the host and hides it on a click anywhere else, including the popover,
 * except an overlay opened from it (such as a select's options), and on Escape. The host gets `aria-expanded` and
 * `aria-controls`, as a disclosure button.
 * - `hint` shows it while the mouse is over the host or the keyboard focus is in it, and hides it on Escape.
 * - `hover` is `hint` for the mouse only, and keeps the popover open while the mouse moves into it, so its content
 * can be used.
 * - `focus` shows it while the focus is in the host or the popover, and hides it on a click outside both.
 * - `noop` leaves it to `show()`, `hide()` and `toggle()`.
 *
 * @stacked-example(Available Triggers, popover/popover-modes.component.html)
 *
 * `noop` fits a popover the app controls, e.g. shown after a request or a validation check:
 *
 * @stacked-example(Manual Control, popover/popover-noop.component)
 *
 * The settings can change while the popover is in use, through bindings or in code:
 * @stacked-example(Popover Settings, popover/popover-dynamic.component)
 *
 * Settings changed in code take effect once `rebuild()` is called.
 * @stacked-example(Popover Settings Code, popover/popover-dynamic-code.component)
 *
 * @additional-example(Template Ref, popover/popover-template-ref.component)
 * @additional-example(Custom Component, popover/popover-custom-component.component)
 * */
@Directive({
  selector: '[nbPopover]',
  exportAs: 'nbPopover',
  host: {
    // A host the popover opens from on click says whether it's open, and what it opens, as a disclosure does.
    '[attr.aria-expanded]': 'discloses() ? expanded() : null',
    '[attr.aria-controls]': 'discloses() && expanded() ? containerId : null',
  },
})
export class NbPopoverDirective implements NbDynamicOverlayController, OnChanges, AfterViewInit, OnDestroy, OnInit {
  protected readonly hostRef = inject(ElementRef);
  protected readonly destroyRef = inject(DestroyRef);

  protected popoverComponent = NbPopoverComponent;
  protected dynamicOverlay?: NbDynamicOverlay;

  /** The popover's content: a template, a component or a text. */
  readonly content = input<NbOverlayContent>(undefined, { alias: 'nbPopover' });

  /** A template's `$implicit` context, or a component's inputs. */
  readonly context = input<object>({}, { alias: 'nbPopoverContext' });

  /**
   * The side of the host the popover opens on: `top` (default), `bottom`, `left`, `right`, `start` or `end`, or a
   * corner such as `top-start` or `end-bottom`.
   */
  readonly position = input<NbPosition, NbPositionValues>(NbPosition.TOP, {
    alias: 'nbPopoverPlacement',
    transform: (value) => value as NbPosition,
  });

  /**
   * The order in which other sides are tried when the popover doesn't fit the viewport: `clockwise` (default),
   * `counterclockwise`, `vertical`, `horizontal`, or `noop` to keep the placement.
   */
  readonly adjustment = input<NbAdjustment, NbAdjustmentValues>(NbAdjustment.CLOCKWISE, {
    alias: 'nbPopoverAdjustment',
    transform: (value) => value as NbAdjustment,
  });

  /** What shows and hides the popover: `click` (default), `hover`, `hint`, `focus` or `noop`. */
  readonly trigger = input<NbTrigger, NbTriggerValues>(NbTrigger.CLICK, {
    alias: 'nbPopoverTrigger',
    transform: (value) => value as NbTrigger,
  });

  /** The distance from the host, in pixels. */
  readonly offset = input(15, { alias: 'nbPopoverOffset' });

  /** Keeps the popover closed; a disabled popover doesn't open on its trigger. */
  readonly disabled = input<boolean, NbBooleanInput>(false, {
    alias: 'nbPopoverDisabled',
    transform: convertToBoolProperty,
  });

  /**
   * @deprecated Use `nbPopoverDisabled`. The popover used to read the tooltip's input name by mistake.
   * @docs-private
   */
  readonly legacyDisabled = input<boolean | undefined, NbBooleanInput>(undefined, {
    alias: 'nbTooltipDisabled',
    transform: convertToOptionalBoolProperty,
  });

  /** A class for the overlay pane, e.g. to size the popover. */
  readonly popoverClass = input('', { alias: 'nbPopoverClass' });

  /** Whether the popover is disabled, through `nbPopoverDisabled` or the deprecated `nbTooltipDisabled`. */
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- the deprecated nbTooltipDisabled still disables the popover, for backwards compatibility.
  readonly isDisabled = computed(() => this.legacyDisabled() ?? this.disabled());

  /** Emits when the popover opens or closes, after the view initialises. */
  readonly nbPopoverShowStateChange = output<{ isShown: boolean }>();

  protected readonly overlayConfig = computed<NbOverlayConfig>(() => ({ panelClass: this.popoverClass() }));

  protected readonly expanded = signal(false);
  protected readonly containerId = `nb-popover-${lastPopoverId++}`;
  protected readonly discloses = computed(() => this.trigger() === NbTrigger.CLICK);

  get isShown(): boolean {
    return !!(this.dynamicOverlay && this.dynamicOverlay.isAttached);
  }

  protected readonly dynamicOverlayHandler =
    inject(NbDynamicOverlayHandler, { optional: true, self: true }) ?? nbCreateDynamicOverlayHandler();

  ngOnInit() {
    this.dynamicOverlayHandler.host(this.hostRef).componentType(this.popoverComponent);
  }

  ngOnChanges() {
    this.rebuild();
  }

  ngAfterViewInit() {
    this.dynamicOverlay = this.configureDynamicOverlay().build();

    const overlay = this.dynamicOverlay;
    overlay.isShown.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((isShown: boolean) => {
      this.expanded.set(isShown);
      overlay.containerElement?.setAttribute('id', this.containerId);
    });
    overlay.isShown
      .pipe(skip(1), takeUntilDestroyed(this.destroyRef))
      .subscribe((isShown: boolean) => this.nbPopoverShowStateChange.emit({ isShown }));
  }

  /** Applies settings changed in code; bindings apply on their own. */
  rebuild() {
    this.dynamicOverlay = this.configureDynamicOverlay().rebuild();
  }

  show() {
    this.builtOverlay().show();
  }

  hide() {
    this.builtOverlay().hide();
  }

  toggle() {
    this.builtOverlay().toggle();
  }

  ngOnDestroy() {
    this.dynamicOverlayHandler.destroy();
  }

  private builtOverlay(): NbDynamicOverlay {
    if (!this.dynamicOverlay) {
      throw new Error('NbPopoverDirective: the popover is built once the view initialises.');
    }
    return this.dynamicOverlay;
  }

  protected configureDynamicOverlay() {
    return this.dynamicOverlayHandler
      .position(this.position())
      .trigger(this.trigger())
      .disabled(this.isDisabled())
      .offset(this.offset())
      .adjustment(this.adjustment())
      .content(this.content())
      .context(this.context())
      .overlayConfig(this.overlayConfig());
  }
}
