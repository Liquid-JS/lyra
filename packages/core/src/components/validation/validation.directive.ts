import {
  AfterContentInit,
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  HostAttributeToken,
  inject,
  Injector,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { FormField } from '@angular/forms/signals';
import { EMPTY, merge, Observable } from 'rxjs';

import { ɵconvertToOptionalBoolProperty as convertToOptionalBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';
import { NbComponentStatus } from '@liquid-js/lyr-core/base';
import { toNbValidationErrors } from './validation-messages';
import { NB_VALIDATION_OPTIONS, NbValidationTrigger } from './validation-options';
import type { NbValidationError } from '@liquid-js/lyr-core/base';

/** What a control's label focuses inside it. */
const FOCUSABLE = 'input:not([type="hidden"]), select, textarea, button, [tabindex]:not([tabindex="-1"])';

interface NbControlState {
  errors: NbValidationError[];
  touched: boolean;
  dirty: boolean;
  valid: boolean;
  submitted: boolean;
}

/**
 * Shows the validation state of a form control: sets the control's status, `aria-invalid`, and `aria-describedby`
 * pointing at its `nb-validation-errors`.
 *
 * Add `nbValidation` next to `formControlName`, `formControl`, `ngModel` or a signal forms `formField`:
 *
 * ```html
 * <input nbInput formControlName="email" nbValidation #email="nbValidation" />
 * <nb-validation-errors [for]="email" />
 * ```
 *
 * While the control shows errors its status is `danger`, and with `nbValidationSuccess` a valid control the user
 * changed is `success`; otherwise the control keeps its own `status`. Lyra's controls use it: `nbInput`, `nb-select`,
 * `nb-checkbox`, `nb-toggle`, `nb-radio-group`, `nb-slider`, `nb-file-drop`, `nb-tag-list`, the pickers' inputs and
 * the extras' fields. Custom controls can inject `NbValidationDirective` from their host element and read
 * `status()`.
 *
 * Errors show once the control is touched or its form submitted; set `nbValidationTrigger` or the app-wide
 * `provideNbValidation({ trigger })` to show them sooner (`dirty`) or later (`submitted`).
 */
@Directive({
  selector: '[nbValidation]',
  exportAs: 'nbValidation',
  host: {
    '[attr.aria-invalid]': 'ariaOnHost() ? ariaInvalid() : null',
    '[attr.aria-describedby]': 'ariaOnHost() ? describedBy() : ownDescribedBy',
    '[attr.aria-labelledby]': 'ariaOnHost() ? labelledBy() : ownLabelledBy',
    '[attr.aria-required]': 'ariaOnHost() ? ariaRequired() : null',
  },
})
export class NbValidationDirective implements AfterContentInit {
  protected readonly options = inject(NB_VALIDATION_OPTIONS);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly injector = inject(Injector);
  protected readonly form = inject(FormGroupDirective, { optional: true }) ?? inject(NgForm, { optional: true });
  protected readonly ownDescribedBy = inject(new HostAttributeToken('aria-describedby'), { optional: true });
  protected readonly ownLabelledBy = inject(new HostAttributeToken('aria-labelledby'), { optional: true });
  /** The control's element, which `nbLabel` labels. */
  readonly element: HTMLElement = inject(ElementRef).nativeElement;

  /**
   * When the control shows its errors: `dirty`, `touched` or `submitted`. Defaults to the `provideNbValidation`
   * option, `touched` unless set, also when bound to `undefined`.
   */
  readonly trigger = input<NbValidationTrigger>(undefined, { alias: 'nbValidationTrigger' });

  /**
   * Whether a valid control the user changed gets the `success` status. Defaults to the `provideNbValidation` option,
   * `false` unless set.
   */
  readonly success = input<boolean | undefined, NbBooleanInput>(undefined, {
    alias: 'nbValidationSuccess',
    transform: convertToOptionalBoolProperty,
  });

  /**
   * Error kinds of the parent form group that belong to this control, e.g. a password confirmation mismatch.
   * The control shows them as its own errors.
   */
  readonly groupErrors = input(new Array<string>(), { alias: 'nbValidationGroupErrors' });

  // Reactive and template-driven controls report changes through events; this counts them so state is re-read.
  protected readonly changes = signal(0);
  protected readonly descriptions = signal(new Array<string>());
  protected readonly labels = signal(new Array<string>());
  protected readonly ariaOnHost = signal(true);
  // Looked up once the control is set up: the Lyra controls inject this directive, and NgControl and FormField inject
  // the controls as value accessors, so injecting them here would be circular.
  protected readonly ngControl = signal<NgControl | undefined>(undefined);
  protected readonly formField = signal<FormField<unknown> | undefined>(undefined);

  protected readonly state = computed(() => this.readFormFieldState() ?? this.readControlState());

  /**
   * The control's current errors, shown or not.
   */
  readonly errors = computed(() => this.state().errors);

  /**
   * Whether the control has errors and its trigger has happened.
   */
  readonly showErrors = computed(() => {
    const state = this.state();
    if (!state.errors.length) {
      return false;
    }
    switch (this.trigger() ?? this.options.trigger) {
      case 'dirty':
        return state.dirty || state.touched || state.submitted;
      case 'touched':
        return state.touched || state.submitted;
      case 'submitted':
        // Signal forms don't track submission; their submit() marks every field touched.
        return this.formField() ? state.touched : state.submitted;
    }
  });

  /**
   * The status the control shows: `danger` with errors shown, `success` when enabled and the control is valid and
   * changed, otherwise `undefined` so the control keeps its own.
   */
  readonly status = computed<NbComponentStatus | undefined>(() => {
    if (this.showErrors()) {
      return 'danger';
    }
    const state = this.state();
    return (this.success() ?? this.options.success) && state.valid && state.dirty ? 'success' : undefined;
  });

  readonly ariaInvalid = computed(() => (this.showErrors() ? 'true' : null));

  /**
   * The control's own `aria-describedby` and the ids of its `nb-validation-errors`.
   */
  readonly describedBy = computed(() => [this.ownDescribedBy, ...this.descriptions()].filter(Boolean).join(' ') || null);

  /**
   * The control's own `aria-labelledby` and the ids of the `nbLabel`s of a control that a `<label for>` can't label.
   */
  readonly labelledBy = computed(() => [this.ownLabelledBy, ...this.labels()].filter(Boolean).join(' ') || null);

  /**
   * Whether the control is required: a signal forms field's `required`, or a control whose validators find an empty
   * value missing, e.g. with `Validators.required` or the `required` attribute.
   */
  readonly required = computed(() => {
    const formField = this.formField();
    if (formField) {
      return formField.state().required();
    }
    this.changes();
    const validator = this.ngControl()?.control?.validator;
    return !!validator?.(new FormControl(null))?.['required'] || this.element.hasAttribute('required');
  });

  readonly ariaRequired = computed(() => (this.required() ? 'true' : null));

  ngAfterContentInit() {
    const formField = this.injector.get(FormField, undefined, { self: true, optional: true }) ?? undefined;
    if (formField) {
      // Signal forms state is already signals; the NgControl a formField provides for value accessors has no events.
      this.formField.set(formField);
      return;
    }
    const ngControl = this.injector.get(NgControl, undefined, { self: true, optional: true }) ?? undefined;
    this.ngControl.set(ngControl);
    // `formControlName` sets up its control in its own ngOnChanges, so the control is only there by now.
    const control = ngControl?.control;
    if (control) {
      const sources: Observable<unknown>[] = [
        control.events,
        control.parent?.events ?? EMPTY,
        this.form?.ngSubmit ?? EMPTY,
      ];
      merge(...sources)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.changes.update((count) => count + 1));
    }
  }

  /**
   * Adds an element describing the control, such as its `nb-validation-errors`, to `aria-describedby`.
   */
  addDescription(id: string) {
    this.descriptions.update((ids) => [...ids, id]);
  }

  removeDescription(id: string) {
    this.descriptions.update((ids) => ids.filter((existing) => existing !== id));
  }

  /** Adds a label of the control, such as an `nbLabel`, to `aria-labelledby`. */
  addLabel(id: string) {
    this.labels.update((ids) => [...ids, id]);
  }

  removeLabel(id: string) {
    this.labels.update((ids) => ids.filter((existing) => existing !== id));
  }

  /** Focuses the control, or the field inside it, e.g. when its label is clicked. */
  focus() {
    if (this.focusField) {
      this.focusField();
      return;
    }
    const element = this.element;
    (element.matches(FOCUSABLE) ? element : element.querySelector<HTMLElement>(FOCUSABLE))?.focus();
  }

  protected focusField?: () => void;

  /**
   * For controls whose focusable element is inside them: they bind `ariaInvalid()`, `describedBy()`, `labelledBy()`
   * and `ariaRequired()` to that element, and the host element no longer gets them. `focus` focuses that element, for
   * one that isn't the first focusable element in the control, e.g. an editor's text after its toolbar.
   */
  delegateAria(focus?: () => void) {
    this.ariaOnHost.set(false);
    this.focusField = focus;
  }

  protected readFormFieldState(): NbControlState | undefined {
    const formField = this.formField();
    if (!formField) {
      return undefined;
    }
    const state = formField.state();
    return {
      errors: withoutRequiredForText(toNbValidationErrors(formField.errors())),
      touched: state.touched(),
      dirty: state.dirty(),
      valid: state.valid(),
      submitted: false,
    };
  }

  protected readControlState(): NbControlState {
    this.changes();
    const control = this.ngControl()?.control;
    if (!control) {
      return { errors: [], touched: false, dirty: false, valid: true, submitted: false };
    }
    const errors = [...withoutRequiredForText(this.toErrors(control.errors)), ...this.readGroupErrors(control.parent)];
    return {
      errors,
      touched: control.touched,
      dirty: control.dirty,
      valid: control.valid && !errors.length,
      submitted: !!this.form?.submitted,
    };
  }

  protected readGroupErrors(parent: AbstractControl | null): NbValidationError[] {
    const kinds = this.groupErrors();
    return this.toErrors(parent?.errors ?? null).filter((error) => kinds.includes(error.kind));
  }

  protected toErrors(errors: AbstractControl['errors']): NbValidationError[] {
    return toNbValidationErrors(errors);
  }
}

/**
 * A control whose text isn't a value yet, e.g. a date it can't parse, has no value, so `required` fails as well as the
 * error about its text; but the field isn't empty, so only that error is shown. The other validators pass an empty
 * value, so an error beside `required` is about the text.
 */
function withoutRequiredForText(errors: NbValidationError[]): NbValidationError[] {
  return errors.length > 1 && errors.some(({ kind }) => kind === 'required')
    ? errors.filter(({ kind }) => kind !== 'required')
    : errors;
}
