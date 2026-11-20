import {
  Component,
  computed,
  contentChildren,
  DestroyRef,
  ElementRef,
  forwardRef,
  inject,
  input,
  linkedSignal,
  output,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, merge } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { injectNbDefaults } from '@liquid-js/lyr-core/base';
import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';
import { NbValidationDirective } from '@liquid-js/lyr-core/validation';
import { NB_DOCUMENT } from '@liquid-js/lyr-core/base';
import { NbComponentOrCustomStatus } from '@liquid-js/lyr-core/base';
import { NbComponentSize } from '@liquid-js/lyr-core/base';
import { NB_RADIO_GROUP } from './radio-group-token';
import { NbRadioComponent } from './radio.component';

let lastRadioGroupId = 0;

/**
 * A group of `nb-radio`s, which holds the value of the checked one and binds to forms:
 *
 * ```html
 * <nb-radio-group [(ngModel)]="selectedOption">
 *   <nb-radio value="1">Option 1</nb-radio>
 *   <nb-radio value="2">Option 2</nb-radio>
 *   <nb-radio value="3">Option 3</nb-radio>
 * </nb-radio-group>
 * ```
 *
 * Without forms, bind `value` and `valueChange`:
 *
 * ```html
 * <nb-radio-group [(value)]="selectedOption">
 *   <nb-radio value="1">Option 1</nb-radio>
 *   <nb-radio value="2">Option 2</nb-radio>
 *   <nb-radio value="3">Option 3</nb-radio>
 * </nb-radio-group>
 * ```
 *
 * The radios share a native name, so the browser moves between them with the arrow keys: the group's own, or the
 * `name` input's. Two groups with the same `name` are one group to the browser, so leave it unset unless a form
 * needs it, e.g. for a group shown in two places.
 *
 * ```html
 * <nb-radio-group name="my-radio-group">
 *   ...
 * </nb-radio-group>
 * ```
 *
 * `status` colours the radios:
 * @stacked-example(Statuses, radio/radio-statuses.component)
 *
 * `size` sizes them: `tiny`, `small`, `medium` (default), `large` or `giant`.
 * @stacked-example(Sizes, radio/radio-sizes.component)
 *
 * `disabled` disables the whole group:
 * @stacked-example(Disabled group, radio/radio-disabled-group.component)
 *
 * With `ngModel` and reactive forms:
 * @stacked-example(Radio Group with forms, radio/radio-form.component)
 */
@Component({
  selector: 'nb-radio-group',
  // All of its content, so radios also come in nested control flow, e.g. a @for in an @if.
  template: `<ng-content />`,
  host: {
    role: 'radiogroup',
  },
  providers: [
    { provide: NB_RADIO_GROUP, useExisting: forwardRef(() => NbRadioGroupComponent) },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NbRadioGroupComponent),
      multi: true,
    },
  ],
})
export class NbRadioGroupComponent<T = unknown> implements ControlValueAccessor {
  // The app's defaults for this type, which the inputs below start from.
  protected readonly nbDefaults = injectNbDefaults('radio');

  protected readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly platformId = inject(PLATFORM_ID);
  protected readonly document = inject(NB_DOCUMENT);

  protected onChange: (value: T) => void = () => {};
  protected onTouched: () => void = () => {};

  /** The value of the checked radio; a form's value takes over once it's written. */
  readonly value = input<T>();

  /** The radios' native name; the group gives them one of its own without it. */
  readonly name = input<string>();

  private readonly ownName = `nb-radio-group-${lastRadioGroupId++}`;

  /** The radios' native name: `name`, or the group's own. */
  readonly resolvedName = computed(() => this.name() || this.ownName);

  /** Disables the radios. Unset by default, which leaves each radio's own `disabled`. */
  readonly disabled = input<boolean | undefined, NbBooleanInput>(undefined, { transform: convertToBoolProperty });

  protected readonly validation = inject(NbValidationDirective, { self: true, optional: true });

  /**
   * The radios' status: `basic` (default), `primary`, `success`, `warning`, `danger`, `info` or `control`. With
   * `nbValidation`, the validation status takes over while the control shows errors or success.
   */
  readonly status = input<NbComponentOrCustomStatus>('basic');

  /** The radios' size: `tiny`, `small`, `medium` (default), `large` or `giant`. */
  readonly sizeInput = input<NbComponentSize | undefined>(undefined, { alias: 'size' });
  /** The size in use: the input's, the app's default, or 'medium'. */
  readonly size = linkedSignal<NbComponentSize>(() => this.sizeInput() ?? this.nbDefaults().size ?? 'medium');

  // With `nbValidation`, the status it gives while the control shows errors or success.
  readonly resolvedStatus = computed(() => this.validation?.status() ?? this.status());

  /** Emits the value of the radio the user checks. */
  readonly valueChange = output<T>();

  // The radios in a group carry values of the group's type.
  readonly radios = contentChildren<NbRadioComponent<T>>(NbRadioComponent, { descendants: true });

  protected readonly valueState = linkedSignal<T | null | undefined>(() => this.value());

  /** Whether the radios are disabled: the `disabled` input, until a form changes it. */
  readonly isDisabled = linkedSignal(() => this.disabled());

  /**
   * The value of the checked radio: the `value` input or the form's value, or else the value of a radio marked
   * `checked`.
   */
  readonly selectedValue = computed(() => {
    const value = this.valueState();
    if (value != null) {
      return value;
    }
    const checkedRadio = this.radios().find((radio) => radio.checked());
    return checkedRadio ? checkedRadio.value() : value;
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.subscribeOnRadiosBlur();
    }
  }

  registerOnChange(fn: (value: T) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  writeValue(value: T | null) {
    this.valueState.set(value);
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled.set(isDisabled);
  }

  /** Selects the radio with the given value, as a user checking it does: `valueChange` and the form are told. */
  select(value: T) {
    this.valueState.set(value);
    this.valueChange.emit(value);
    this.onChange(value);
  }

  // Marks the group touched when focus leaves it.
  protected subscribeOnRadiosBlur() {
    const hostElement = this.hostElement.nativeElement;
    fromEvent<Event>(hostElement, 'focusin')
      .pipe(
        filter((event) => hostElement.contains(event.target as Node)),
        switchMap(() => merge(
          fromEvent<Event>(this.document, 'focusin'),
          fromEvent<Event>(this.document, 'click'),
        )),
        filter((event) => !hostElement.contains(event.target as Node)),
        takeUntilDestroyed(inject(DestroyRef)),
      )
      .subscribe(() => this.onTouched());
  }
}
