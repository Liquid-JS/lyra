import {
  AfterViewInit,
  ComponentRef,
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  linkedSignal,
  OnDestroy,
  Renderer2,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { merge } from 'rxjs';
import { filter, skip, switchMap } from 'rxjs/operators';

import { NbOverlayRef, NbScrollStrategy } from '@liquid-js/lyr-core/cdk';
import { NbTrigger, NbTriggerStrategy, NbTriggerStrategyBuilderService } from '@liquid-js/lyr-core/cdk';
import { NbOverlayService } from '@liquid-js/lyr-core/cdk';
import { ɵisComposing as isComposing } from '@liquid-js/lyr-core/base';
import { NbAdjustableConnectedPositionStrategy, NbAdjustment, NbPosition, NbPositionBuilderService } from '@liquid-js/lyr-core/cdk';
import { ɵNbActiveDescendantKeyManager as NbActiveDescendantKeyManager, ɵNbActiveDescendantKeyManagerFactoryService as NbActiveDescendantKeyManagerFactoryService, ɵNbKeyManagerActiveItemMode as NbKeyManagerActiveItemMode } from '@liquid-js/lyr-core/cdk';
import { NbScrollStrategies } from '@liquid-js/lyr-core/cdk';
import { NbOptionComponent } from '../option/option.component';
import { NbOptionGroupComponent } from '../option/option-group.component';
import { NbAutocompleteComponent } from './autocomplete.component';
import { NbAutocompleteRef } from './autocomplete-ref';
import { NbFormFieldControl } from '@liquid-js/lyr-core/form-field';

/**
 * Attaches an `nb-autocomplete` to an input: its options open below the input on focus, click or typing, and the
 * chosen one fills the input.
 *
 * The input is a combobox. Up and Down open the options and move the active one, Enter selects it, Escape closes
 * the options and keeps the text, and they close when the focus leaves them. A form control bound to the input gets
 * the typed text as well as the value of a chosen option.
 *
 * @stacked-example(Showcase, autocomplete/autocomplete-showcase.component)
 *
 * ### Installation
 *
 * Import `NbAutocompleteDirective`, `NbAutocompleteComponent`, `NbOptionComponent` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbAutocompleteDirective, NbAutocompleteComponent, NbOptionComponent],
 * })
 * export class PageComponent { }
 * ```
 *
 * With NgModules:
 *
 * Import `NbAutocompleteModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbAutocompleteModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * The input binds to a form control or `ngModel`:
 *
 * @stacked-example(Autocomplete form binding, autocomplete/autocomplete-form.component)
 *
 * Options are grouped with `nb-option-group`:
 *
 * @stacked-example(Grouping, autocomplete/autocomplete-group.component)
 *
 * `handleDisplayFn` turns a value into the text shown in the input, e.g. for options with object values:
 *
 * @stacked-example(Custom display, autocomplete/autocomplete-custom-display.component)
 *
 * With `activeFirst` the first option is active as soon as the options open, so Enter selects it:
 *
 * @stacked-example(Active first, autocomplete/autocomplete-active-first.component)
 *
 * The input is disabled with `disabled`, or through its form control:
 * @stacked-example(Disabled, autocomplete/autocomplete-disabled.component)
 */
@Directive({
  selector: 'input[nbAutocomplete]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NbAutocompleteDirective),
      multi: true,
    },
    { provide: NbAutocompleteRef, useExisting: forwardRef(() => NbAutocompleteDirective) },
  ],
  host: {
    role: 'combobox',
    'aria-autocomplete': 'list',
    'aria-haspopup': 'listbox',
    '[class.nb-autocomplete-position-top]': "isOpen() && !!autocomplete().options().length && autocomplete().overlayPosition() === 'top'",
    '[class.nb-autocomplete-position-bottom]': "isOpen() && !!autocomplete().options().length && autocomplete().overlayPosition() === 'bottom'",
    '[attr.aria-expanded]': 'isOpen()',
    '[attr.aria-controls]': 'isOpen() ? autocomplete().id : null',
    '[attr.aria-activedescendant]': 'isOpen() ? activeOption()?.id ?? null : null',
    '(input)': 'handleInput()',
    '(keydown.arrowDown)': 'handleKeydown()',
    '(keydown.arrowUp)': 'handleKeydown()',
    '(blur)': 'handleBlur()',
  },
})
export class NbAutocompleteDirective<T> implements NbAutocompleteRef, OnDestroy, AfterViewInit, ControlValueAccessor {
  protected readonly hostRef = inject(ElementRef);
  protected readonly overlay = inject(NbOverlayService);
  protected readonly triggerStrategyBuilder = inject(NbTriggerStrategyBuilderService);
  protected readonly positionBuilder = inject(NbPositionBuilderService);
  protected readonly activeDescendantKeyManagerFactory = inject(
    NbActiveDescendantKeyManagerFactoryService,
  ) as NbActiveDescendantKeyManagerFactoryService<NbOptionComponent<T>>;
  protected readonly renderer = inject(Renderer2);
  protected readonly injector = inject(Injector);
  protected readonly destroyRef = inject(DestroyRef);

  /** @docs-private */
  protected triggerStrategy?: NbTriggerStrategy;

  protected positionStrategy?: NbAdjustableConnectedPositionStrategy;

  protected overlayRef?: NbOverlayRef;

  protected keyManager?: NbActiveDescendantKeyManager<NbOptionComponent<T>>;

  // The form gets the text typed in the input too.
  protected _onChange: (value?: T | string) => void = () => {};

  protected writtenValue?: T;
  protected hasWrittenValue = false;

  protected _onTouched: () => void = () => {};

  protected readonly opened = signal(false);

  /**
   * Whether the options are open.
   */
  readonly isOpen = this.opened.asReadonly();

  /**
   * Whether the options are closed.
   */
  readonly isClosed = computed(() => !this.isOpen());

  // The option the key manager made active, which the input announces as its active descendant.
  protected readonly activeOption = signal<NbOptionComponent<T> | undefined>(undefined);

  /**
   * Whether the open options have an active option, which Enter selects.
   */
  get hasActiveOption(): boolean {
    return !!(this.isOpen() && this.keyManager?.activeItem);
  }

  /**
   * The `nb-autocomplete` with the options.
   */
  readonly autocomplete = input.required<NbAutocompleteComponent<T>>({ alias: 'nbAutocomplete' });

  /**
   * The options' distance from the input, in pixels.
   */
  readonly overlayOffset = input<number>(8);

  /**
   * What scrolling the page does while the options are open: `block` (default) prevents it, `close` closes them,
   * `reposition` moves them along, and `noop` leaves them where they are.
   */
  readonly scrollStrategy = input<NbScrollStrategies>('block');

  /**
   * An element to position the options at instead of the input.
   */
  readonly customOverlayHost = input<ElementRef>();

  /**
   * The element the options overlay is positioned at: `customOverlayHost` until a component such as `nb-tag-list`
   * sets another, or else the input.
   */
  readonly overlayHost = linkedSignal(() => this.customOverlayHost());

  ngAfterViewInit() {
    this.triggerStrategy = this.createTriggerStrategy();
    this.subscribeOnTriggers(this.triggerStrategy);
    // A form control writes its initial value before the autocomplete panel has its `handleDisplayFn`,
    // so the value is displayed again once the panel inputs are set.
    if (this.hasWrittenValue) {
      this.setHostInputValue(this.writtenValue ?? '');
    }
  }

  ngOnDestroy() {
    if (this.triggerStrategy) {
      this.triggerStrategy.destroy();
    }

    if (this.positionStrategy) {
      this.positionStrategy.dispose();
    }

    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }

  handleInput() {
    const currentValue = this.hostRef.nativeElement.value;
    this._onChange(currentValue);
    this.setHostInputValue(this.getDisplayValue(currentValue));
    this.show();
  }

  handleKeydown() {
    this.show();
  }

  handleBlur() {
    this._onTouched();
  }

  show() {
    if (this.shouldShow()) {
      this.attachToOverlay();
      this.setActiveItem();
    }
  }

  hide() {
    if (this.isOpen()) {
      this.overlayRef?.detach();
      this.opened.set(false);
    }
  }

  writeValue(value: T) {
    this.writtenValue = value;
    this.hasWrittenValue = true;
    this.handleInputValueUpdate(value);
  }

  registerOnChange(fn: (value?: T | string) => void) {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this._onTouched = fn;
  }

  setDisabledState(disabled: boolean) {
    this.renderer.setProperty(this.hostRef.nativeElement, 'disabled', disabled);
  }

  protected subscribeOnOptions() {
    const options$ = toObservable(this.autocomplete().options, { injector: this.injector });

    // Options can change at runtime, so listen to the clicks of the current ones.
    options$
      .pipe(
        switchMap((options) => merge(...options.map((option) => option.click))),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((clickedOption: NbOptionComponent<T>) => this.handleInputValueUpdate(clickedOption.value(), true));

    options$.pipe(skip(1), takeUntilDestroyed(this.destroyRef)).subscribe((options) => {
      this.setActiveItem();
      if (!options.length) {
        this.hide();
      }
    });
  }

  protected subscribeOnPositionChange(positionStrategy: NbAdjustableConnectedPositionStrategy) {
    positionStrategy.positionChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((position: NbPosition) => this.autocomplete().overlayPosition.set(position));
  }

  protected getActiveItem(): NbOptionComponent<T> | undefined {
    return this.keyManager?.activeItem ?? undefined;
  }

  protected setupAutocomplete() {
    // The field the input is, e.g. `nbInput`, whose size the options match; looked up once the autocomplete opens, as
    // a field like `nbTagInput` needs this directive itself.
    const control = this.injector.get(NbFormFieldControl, null, { self: true, optional: true });
    this.autocomplete().setHost(
      this.overlayHost() || this.hostRef,
      control ? computed(() => control.controlState().size) : undefined,
    );
  }

  protected getDisplayValue(value: T | string) {
    const displayFn = this.autocomplete().handleDisplayFn();
    return displayFn ? displayFn(value) : value;
  }

  protected getContainer(): ComponentRef<unknown> | undefined {
    return this.overlayRef && this.isOpen()
      ? <ComponentRef<unknown>>{
        location: {
          nativeElement: this.overlayRef.overlayElement,
        },
      }
      : undefined;
  }

  protected handleInputValueUpdate(value?: T, focusInput: boolean = false) {
    this.setHostInputValue(value ?? '');
    this._onChange(value);
    if (focusInput) {
      this.hostRef.nativeElement.focus();
    }
    this.autocomplete().emitSelected(value);
    this.hide();
  }

  protected subscribeOnTriggers(triggerStrategy: NbTriggerStrategy) {
    triggerStrategy.show$.pipe(filter(() => this.isClosed())).subscribe(() => this.show());

    triggerStrategy.hide$.pipe(filter(() => this.isOpen())).subscribe(() => this.hide());
  }

  protected createTriggerStrategy(): NbTriggerStrategy {
    return this.triggerStrategyBuilder
      .trigger(NbTrigger.FOCUS)
      .host(this.hostRef.nativeElement)
      .container(() => this.getContainer())
      .build();
  }

  protected createKeyManager(): NbActiveDescendantKeyManager<NbOptionComponent<T>> {
    const keyManager = this.activeDescendantKeyManagerFactory.create(this.autocomplete().options, this.injector);
    this.keyManager = keyManager;
    keyManager.change
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.activeOption.set(keyManager.activeItem ?? undefined));
    return keyManager;
  }

  protected setHostInputValue(value: T | string) {
    this.hostRef.nativeElement.value = this.getDisplayValue(value);
  }

  protected createPositionStrategy(): NbAdjustableConnectedPositionStrategy {
    return this.positionBuilder
      .connectedTo(this.overlayHost() || this.hostRef)
      .position(NbPosition.BOTTOM)
      .offset(this.overlayOffset())
      .adjustment(NbAdjustment.VERTICAL)
      // As for nb-select: without room for the whole list, it gets the space there is and scrolls.
      .withFlexibleDimensions(true)
      .withViewportMargin(8 + this.overlayOffset());
  }

  protected subscribeOnOverlayKeys(
    overlayRef: NbOverlayRef,
    keyManager: NbActiveDescendantKeyManager<NbOptionComponent<T>>,
  ) {
    overlayRef
      .keydownEvents()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event: KeyboardEvent) => {
        if (event.key === 'Escape' && !isComposing(event) && this.isOpen()) {
          // Only the options close, not a dialog or window the input is in.
          event.preventDefault();
          event.stopPropagation();
          this.hostRef.nativeElement.focus();
          this.hide();
        } else if (event.key === 'Enter' && !isComposing(event)) {
          event.preventDefault();
          const activeItem = this.getActiveItem();
          if (!activeItem) {
            return;
          }
          this.handleInputValueUpdate(activeItem.value(), true);
        } else {
          keyManager.onKeydown(event);
          this.scrollToOption(keyManager.activeItemIndex || 0);
        }
      });
  }

  protected setActiveItem() {
    // With `activeFirst` the first option is active, otherwise none.
    const mode = this.autocomplete().activeFirst()
      ? NbKeyManagerActiveItemMode.FIRST_ACTIVE
      : NbKeyManagerActiveItemMode.RESET_ACTIVE;
    this.keyManager?.setActiveItem(mode);
    this.activeOption.set(this.keyManager?.activeItem ?? undefined);
  }

  protected attachToOverlay() {
    let overlayRef = this.overlayRef;
    if (!overlayRef) {
      this.setupAutocomplete();
      overlayRef = this.initOverlay();
    }
    overlayRef.attach(this.autocomplete().portal());
    this.opened.set(true);
  }

  protected createOverlay(positionStrategy: NbAdjustableConnectedPositionStrategy): NbOverlayRef {
    const scrollStrategy = this.createScrollStrategy();
    const overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy,
      panelClass: this.autocomplete().optionsPanelClass(),
    });
    this.overlayRef = overlayRef;
    // The overlay can also detach itself, e.g. through its scroll strategy.
    overlayRef.detachments().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.opened.set(false));
    return overlayRef;
  }

  protected initOverlay(): NbOverlayRef {
    const positionStrategy = this.createPositionStrategy();
    this.positionStrategy = positionStrategy;

    const keyManager = this.createKeyManager();
    this.subscribeOnPositionChange(positionStrategy);
    this.subscribeOnOptions();
    const overlayRef = this.createOverlay(positionStrategy);
    this.subscribeOnOverlayKeys(overlayRef, keyManager);
    return overlayRef;
  }

  protected createScrollStrategy(): NbScrollStrategy {
    return this.overlay.scrollStrategies[this.scrollStrategy()]();
  }

  protected shouldShow(): boolean {
    return this.isClosed();
  }

  private scrollToOption(index: number) {
    const autocomplete = this.autocomplete();
    const list = autocomplete.list();
    const listElement = list?.list();
    const options = autocomplete.options();
    const labelCount = this.countGroupLabelsBeforeOption(index, options, autocomplete.optionGroups());

    if (index === 0 && labelCount === 1) {
      // At the first option of the first group the list scrolls to the top, so that the group's label shows too.
      list?.setScrollTop(0);
    } else if (list && listElement) {
      const option = options[index];
      if (option) {
        const element = option.getHostElement();
        const newScrollPosition = this.getOptionScrollPosition(
          element.offsetTop,
          element.offsetHeight,
          list.getScrollTop(),
          listElement.nativeElement.offsetHeight,
        );

        list.setScrollTop(newScrollPosition);
      }
    }
  }

  /**
   * The position of the option's group among the groups, counting from 1, or 0 for an option outside groups.
   */
  countGroupLabelsBeforeOption(
    optionIndex: number,
    options: readonly NbOptionComponent<T>[],
    optionGroups: readonly NbOptionGroupComponent[],
  ): number {
    const group = options[optionIndex]?.group;
    return group ? optionGroups.indexOf(group) + 1 : 0;
  }

  getOptionScrollPosition(
    optionOffset: number,
    optionHeight: number,
    currentScrollPosition: number,
    portalHeight: number,
  ): number {
    if (optionOffset < currentScrollPosition) {
      return optionOffset;
    }

    if (optionOffset + optionHeight > currentScrollPosition + portalHeight) {
      return Math.max(0, optionOffset - portalHeight + optionHeight);
    }

    return currentScrollPosition;
  }
}
