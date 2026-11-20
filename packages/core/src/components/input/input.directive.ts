import {
  computed,
  DestroyRef,
  Directive,
  DoCheck,
  ElementRef,
  inject,
  input,
  linkedSignal,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

import { injectNbDefaults } from '@liquid-js/lyr-core/base';
import { NbStatusService } from '@liquid-js/lyr-core/base';
import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';
import { NbComponentSize } from '@liquid-js/lyr-core/base';
import { NbComponentShape } from '@liquid-js/lyr-core/base';
import { NbComponentOrCustomStatus } from '@liquid-js/lyr-core/base';
import { NbFormFieldControl } from '@liquid-js/lyr-core/form-field';
import { NbValidationDirective } from '@liquid-js/lyr-core/validation';
import { NbFocusMonitor } from '@liquid-js/lyr-core/cdk';
import { ɵenableTransitionsAfterRender as enableTransitionsAfterRender } from '@liquid-js/lyr-core/base';

/**
 * Styles an `<input>` or `<textarea>` as a field of the design system.
 *
 * ```html
 * <input nbInput />
 * ```
 *
 * ### Installation
 *
 * Import `NbInputDirective` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbInputDirective],
 * })
 * export class PageComponent { }
 * ```
 *
 * With NgModules:
 *
 * Import `NbInputModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbInputModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * @stacked-example(Showcase, input/input-showcase.component)
 *
 * `status` colours the field:
 * @stacked-example(Input Colors, input/input-colors.component)
 *
 * Inputs come in five sizes, `tiny`, `small`, `medium` (default), `large` and `giant`, set with `fieldSize`: on an
 * `<input>`, `size` is already the HTML attribute for its width in characters. Components that aren't a native field,
 * such as `nb-select`, the phone input and the colour picker, take `size`.
 *
 * @stacked-example(Input Sizes, input/input-sizes.component)
 *
 * `shape` rounds the corners:
 * @stacked-example(Input Shapes, input/input-shapes.component)
 *
 * It applies to `input` and `textarea` elements:
 * @stacked-example(Input Elements, input/input-types.component)
 *
 * `fullWidth` makes the field fill its container:
 * @stacked-example(Full width inputs, input/input-full-width.component)
 *
 * A `ghost` input shows no background or border until it's hovered or focused, for fields edited in place:
 * @stacked-example(Ghost inputs, input/input-ghost.component)
 *
 * It works with reactive forms and `ngModel` as any input does:
 * @stacked-example(Input form binding, input/input-form.component)
 *
 * Add `nbValidation` to show the control's validation errors and status, see [Validation](components/forms/validation).
 *
 * `<nb-form-field>` adds content before (`nbPrefix`) or after (`nbSuffix`) the field, such as an icon or a button.
 *
 * @stacked-example(Prefix and suffix, form-field/form-field-showcase.component)
 * @stacked-example(Input with icon, form-field/form-field-input.component)
 * @stacked-example(Input with button, form-field/form-field-password.component)
 *
 * Addons grow to fit text, e.g. a unit or a URL scheme, and the input's padding follows their width:
 * @stacked-example(Input with text, form-field/form-field-text.component)
 *
 * @styles
 *
 * input-ghost-background-color:
 * input-ghost-border-color:
 * input-tiny-width:
 * input-small-width:
 * input-medium-width:
 * input-large-width:
 * input-giant-width:
 * input-border-style:
 * input-border-width:
 * input-placeholder-text-font-family:
 * input-text-font-family:
 * input-basic-text-color:
 * input-basic-placeholder-text-color:
 * input-basic-background-color:
 * input-basic-border-color:
 * input-basic-focus-background-color:
 * input-basic-focus-and-hover-background-color:
 * input-basic-focus-and-hover-border-color:
 * input-basic-focus-border-color:
 * input-basic-hover-background-color:
 * input-basic-hover-border-color:
 * input-basic-disabled-background-color:
 * input-basic-disabled-border-color:
 * input-basic-disabled-text-color:
 * input-basic-disabled-placeholder-text-color:
 * input-primary-text-color:
 * input-primary-placeholder-text-color:
 * input-primary-background-color:
 * input-primary-border-color:
 * input-primary-focus-background-color:
 * input-primary-focus-and-hover-background-color:
 * input-primary-focus-and-hover-border-color:
 * input-primary-focus-border-color:
 * input-primary-hover-background-color:
 * input-primary-hover-border-color:
 * input-primary-disabled-background-color:
 * input-primary-disabled-border-color:
 * input-primary-disabled-text-color:
 * input-primary-disabled-placeholder-text-color:
 * input-success-text-color:
 * input-success-placeholder-text-color:
 * input-success-background-color:
 * input-success-border-color:
 * input-success-focus-background-color:
 * input-success-focus-and-hover-background-color:
 * input-success-focus-and-hover-border-color:
 * input-success-focus-border-color:
 * input-success-hover-background-color:
 * input-success-hover-border-color:
 * input-success-disabled-background-color:
 * input-success-disabled-border-color:
 * input-success-disabled-text-color:
 * input-success-disabled-placeholder-text-color:
 * input-info-text-color:
 * input-info-placeholder-text-color:
 * input-info-background-color:
 * input-info-border-color:
 * input-info-focus-background-color:
 * input-info-focus-and-hover-background-color:
 * input-info-focus-and-hover-border-color:
 * input-info-focus-border-color:
 * input-info-hover-background-color:
 * input-info-hover-border-color:
 * input-info-disabled-background-color:
 * input-info-disabled-border-color:
 * input-info-disabled-text-color:
 * input-info-disabled-placeholder-text-color:
 * input-warning-text-color:
 * input-warning-placeholder-text-color:
 * input-warning-background-color:
 * input-warning-border-color:
 * input-warning-focus-background-color:
 * input-warning-focus-and-hover-background-color:
 * input-warning-focus-and-hover-border-color:
 * input-warning-focus-border-color:
 * input-warning-hover-background-color:
 * input-warning-hover-border-color:
 * input-warning-disabled-background-color:
 * input-warning-disabled-border-color:
 * input-warning-disabled-text-color:
 * input-warning-disabled-placeholder-text-color:
 * input-danger-text-color:
 * input-danger-placeholder-text-color:
 * input-danger-background-color:
 * input-danger-border-color:
 * input-danger-focus-background-color:
 * input-danger-focus-and-hover-background-color:
 * input-danger-focus-and-hover-border-color:
 * input-danger-focus-border-color:
 * input-danger-hover-background-color:
 * input-danger-hover-border-color:
 * input-danger-disabled-background-color:
 * input-danger-disabled-border-color:
 * input-danger-disabled-text-color:
 * input-danger-disabled-placeholder-text-color:
 * input-control-text-color:
 * input-control-placeholder-text-color:
 * input-control-background-color:
 * input-control-border-color:
 * input-control-focus-background-color:
 * input-control-focus-and-hover-background-color:
 * input-control-focus-and-hover-border-color:
 * input-control-focus-border-color:
 * input-control-hover-background-color:
 * input-control-hover-border-color:
 * input-control-disabled-background-color:
 * input-control-disabled-border-color:
 * input-control-disabled-text-color:
 * input-control-disabled-placeholder-text-color:
 * input-rectangle-border-radius:
 * input-semi-round-border-radius:
 * input-round-border-radius:
 * input-textarea-max-border-radius:
 * input-tiny-text-font-size:
 * input-tiny-text-font-weight:
 * input-tiny-text-line-height:
 * input-tiny-placeholder-text-font-size:
 * input-tiny-placeholder-text-font-weight:
 * input-tiny-placeholder-text-line-height:
 * input-tiny-padding:
 * input-tiny-max-width:
 * input-small-text-font-size:
 * input-small-text-font-weight:
 * input-small-text-line-height:
 * input-small-placeholder-text-font-size:
 * input-small-placeholder-text-font-weight:
 * input-small-placeholder-text-line-height:
 * input-small-padding:
 * input-small-max-width:
 * input-medium-text-font-size:
 * input-medium-text-font-weight:
 * input-medium-text-line-height:
 * input-medium-placeholder-text-font-size:
 * input-medium-placeholder-text-font-weight:
 * input-medium-placeholder-text-line-height:
 * input-medium-padding:
 * input-medium-max-width:
 * input-large-text-font-size:
 * input-large-text-font-weight:
 * input-large-text-line-height:
 * input-large-placeholder-text-font-size:
 * input-large-placeholder-text-font-weight:
 * input-large-placeholder-text-line-height:
 * input-large-padding:
 * input-large-max-width:
 * input-giant-text-font-size:
 * input-giant-text-font-weight:
 * input-giant-text-line-height:
 * input-giant-placeholder-text-font-size:
 * input-giant-placeholder-text-font-weight:
 * input-giant-placeholder-text-line-height:
 * input-giant-padding:
 * input-giant-max-width:
 */
@Directive({
  selector: 'input[nbInput],textarea[nbInput]',
  providers: [
    { provide: NbFormFieldControl, useExisting: NbInputDirective },
  ],
  host: {
    '[class]': 'hostClasses()',
    '[class.input-full-width]': 'fullWidth()',
    '[class.input-ghost]': 'ghost()',
  },
})
export class NbInputDirective implements DoCheck, NbFormFieldControl {
  // The app's defaults for this type, which the inputs below start from.
  protected readonly nbDefaults = injectNbDefaults('input');

  protected readonly elementRef = inject<ElementRef<HTMLInputElement | HTMLTextAreaElement>>(ElementRef);
  protected readonly focusMonitor = inject(NbFocusMonitor);
  protected readonly statusService = inject(NbStatusService);
  protected readonly validation = inject(NbValidationDirective, { self: true, optional: true });

  /**
   * Field size: `tiny`, `small`, `medium` (default), `large` or `giant`. Not `size`, which on an `<input>` is the
   * HTML attribute for its width in characters.
   */
  readonly fieldSizeInput = input<NbComponentSize | undefined>(undefined, { alias: 'fieldSize' });
  /** The fieldSize in use: the input's, the app's default, or 'medium'. */
  readonly fieldSize = linkedSignal<NbComponentSize>(() => this.fieldSizeInput() ?? this.nbDefaults().size ?? 'medium');

  /**
   * Colours the field: `basic` (default), `primary`, `info`, `success`, `warning`, `danger` or `control`. With
   * `nbValidation`, the validation status takes over while the control shows errors or success.
   */
  readonly status = input<NbComponentOrCustomStatus>('basic');

  // With `nbValidation`, the status it gives while the control shows errors or success.
  protected readonly resolvedStatus = computed(() => this.validation?.status() ?? this.status());

  /** `rectangle` (default), `semi-round` or `round`. */
  readonly shapeInput = input<NbComponentShape | undefined>(undefined, { alias: 'shape' });
  /** The shape in use: the input's, the app's default, or 'rectangle'. */
  readonly shape = linkedSignal<NbComponentShape>(() => this.shapeInput() ?? this.nbDefaults().shape ?? 'rectangle');

  /** Fills the container's width. */
  readonly fullWidth = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /**
   * Shows no background or border at rest; under the pointer and with focus the input looks as usual.
   * Fits fields edited in place, e.g. a title.
   */
  readonly ghost = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /** Whether the field has focus, for the form field around it. */
  readonly focused = signal(false);

  // The element's disabled property, which forms and bindings set directly, read on every check.
  protected readonly disabled = signal(false);

  readonly controlState = computed(() => ({
    status: this.resolvedStatus(),
    size: this.fieldSize(),
    fullWidth: this.fullWidth(),
    focused: this.focused(),
    disabled: this.disabled(),
  }));

  protected readonly hostClasses = computed(() => [
    `size-${this.fieldSize()}`,
    this.statusService.getStatusClass(this.resolvedStatus()),
    `shape-${this.shape()}`,
  ]);

  constructor() {
    enableTransitionsAfterRender(this.elementRef.nativeElement);

    this.focusMonitor
      .monitor(this.elementRef)
      .pipe(map((origin) => !!origin), takeUntilDestroyed())
      // Focus can change while a view renders, e.g. when hiding a focused element makes the browser blur it.
      .subscribe((focused) => untracked(() => this.focused.set(focused)));
    inject(DestroyRef).onDestroy(() => this.focusMonitor.stopMonitoring(this.elementRef));
  }

  ngDoCheck() {
    this.disabled.set(this.elementRef.nativeElement.disabled);
  }

}
