import {
  computed,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  PLATFORM_ID,
  signal,
  untracked,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { injectNbValidationMessage } from '@liquid-js/lyr-core';
import { Mask, MaskaDetail, MaskInput, MaskInputOptions, MaskType } from 'maska';

import { injectNbMaskTexts } from './texts';

/** The form value of a masked field: the characters typed (`unmasked`, default), or the text as shown (`masked`). */
export type NbMaskValue = 'unmasked' | 'masked';

/** The error kind of a value that doesn't fill the mask. */
export const NB_MASK_ERROR = 'nbMask' as const;

/** The `nbMask` error, as Angular gives parse errors: its kind and its message. */
export interface NbMaskError {
  kind: typeof NB_MASK_ERROR;
  message: string;
}

/** maska's options besides the mask: `tokens`, `eager`, `reversed`, `number`, `preProcess` and `postProcess`. */
export type NbMaskOptions = Omit<MaskInputOptions, 'mask' | 'onMaska'>;

/**
 * Formats what the user types in a field with a mask, e.g. a phone number or a card number:
 *
 * ```html
 * <input nbInput type="tel" [nbMask]="'(###) ###-####'" formControlName="phone" />
 * ```
 *
 * @stacked-example(Showcase, mask/mask-showcase.component)
 *
 * ### Installation
 *
 * It formats with [`maska`](https://www.npmjs.com/package/maska); install it and import `NbMaskDirective` from
 * `@liquid-js/lyr-extras/mask`.
 *
 * ```sh
 * npm install maska
 * ```
 *
 * ### Usage
 *
 * In the mask, `#` is a digit, `@` a letter and `*` either; other characters are shown as they are. A list of masks
 * picks the one that fits the length of what's typed, e.g. `['#### ####', '#### #### ####']`, and a function gives
 * the mask for what's typed. `nbMaskOptions` takes maska's other options, e.g. `eager` to show the mask's next
 * characters before they're typed, `tokens` of your own, or `number` for numbers in the app's format.
 *
 * The form value is what the user typed, without the mask's characters, e.g. `2015550123`, or with
 * `nbMaskValue="masked"`, the text as shown, `(201) 555-0123`. While the text doesn't fill the mask, the value stays
 * the last complete one, or empty, and the field has the `nbMask` parse error, `{ kind, message }`, as Angular's
 * controls report text they can't parse; an empty field passes. It works with `formControl`, `formControlName`,
 * `ngModel` and signal forms' `[formField]`.
 *
 * @stacked-example(Validation, mask/mask-validation.component)
 *
 * It works on text, search, URL, phone and password inputs.
 */
@Directive({
  selector: 'input[nbMask]',
  exportAs: 'nbMask',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NbMaskDirective), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => NbMaskDirective), multi: true },
  ],
  host: {
    '(blur)': 'onTouched()',
  },
})
export class NbMaskDirective implements ControlValueAccessor, Validator {
  protected readonly texts = injectNbMaskTexts();
  /** The message of an error, as `nb-validation-errors` shows it. */
  protected readonly message = injectNbValidationMessage();
  protected readonly element = inject<ElementRef<HTMLInputElement>>(ElementRef).nativeElement;

  /** The mask, e.g. `(###) ###-####`, a list of masks, or a function that gives the mask for what's typed. */
  readonly mask = input.required<MaskType>({ alias: 'nbMask' });
  /** maska's other options, e.g. `{ eager: true }`. */
  readonly options = input<NbMaskOptions>({}, { alias: 'nbMaskOptions' });
  /** The form value: `unmasked` (default), what was typed, or `masked`, the text as shown. */
  readonly valueType = input<NbMaskValue>('unmasked', { alias: 'nbMaskValue' });

  /** Whether the text fills the mask. */
  readonly completed = signal(false);
  /** Whether the text doesn't fill the mask, which the form gets as a parse error. */
  protected readonly parseError = signal(false);

  /** Formats values the way the field does. */
  protected readonly formatter = computed(() => {
    const { preProcess, postProcess, ...options } = this.options();
    const mask = new Mask({ ...options, mask: this.mask() });
    return {
      mask,
      masked: (value: string) => {
        const text = mask.masked(preProcess ? preProcess(value) : value);
        return postProcess ? postProcess(text) : text;
      },
      unmasked: (value: string) => mask.unmasked(preProcess ? preProcess(value) : value),
      // A number, or no mask, has no length to fill.
      completed: (value: string) =>
        options.number || this.mask() === null ? true : mask.completed(preProcess ? preProcess(value) : value),
    };
  });

  protected maskInput?: MaskInput;
  /** The value last given to the form. */
  protected value = '';

  protected onChange: (value: string) => void = () => {};
  /** @internal */
  onTouched: () => void = () => {};
  protected onValidatorChange: () => void = () => {};

  constructor() {
    const browser = isPlatformBrowser(inject(PLATFORM_ID));
    let started = false;
    effect(() => {
      const options: MaskInputOptions = {
        ...this.options(),
        mask: this.mask(),
        onMaska: (detail) => this.changed(detail),
      };
      // Read for the mask's options, which change what the value is.
      this.valueType();
      untracked(() => {
        if (browser) {
          if (this.maskInput) {
            this.maskInput.update(options);
          } else {
            this.maskInput = new MaskInput(this.element, options);
          }
        }
        this.show(this.value);
        // A new mask or kind of value changes the value, which the first run only shows.
        if (started) {
          this.take(this.element.value);
        }
        started = true;
      });
    });
    inject(DestroyRef).onDestroy(() => this.maskInput?.destroy());
  }

  writeValue(value?: string | number | null) {
    const text = String(value ?? '');
    this.value = text;
    this.show(text);
    this.setParseError(false);
  }

  registerOnChange(fn: (value: string) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  registerOnValidatorChange(fn: () => void) {
    this.onValidatorChange = fn;
  }

  setDisabledState(disabled: boolean) {
    this.element.disabled = disabled;
  }

  /** The parse error of text that doesn't fill the mask. */
  validate(): ValidationErrors | null {
    if (!this.parseError()) {
      return null;
    }
    // The app's message for the kind, or the mask's text.
    const error: NbMaskError = { kind: NB_MASK_ERROR, message: this.texts().incomplete };
    return { [NB_MASK_ERROR]: { ...error, message: this.message({ kind: NB_MASK_ERROR, params: error }) } };
  }

  /** Shows a form value in the field, formatted. */
  protected show(value: string) {
    const formatter = this.formatter();
    const masked = value ? formatter.masked(value) : '';
    this.element.value = masked;
    this.completed.set(!!masked && formatter.completed(masked));
  }

  protected changed(detail: MaskaDetail) {
    this.take(detail.masked);
  }

  /**
   * Gives the form the value of the text in the field, when it's another; while the text doesn't fill the mask, the
   * value stays and the field has the parse error.
   */
  protected take(masked: string) {
    const formatter = this.formatter();
    const unmasked = formatter.unmasked(masked);
    const completed = !!unmasked && formatter.completed(masked);
    this.completed.set(completed);
    this.setParseError(!!unmasked && !completed);
    if (unmasked && !completed) {
      return;
    }
    const value = !unmasked ? '' : this.valueType() === 'masked' ? masked : unmasked;
    if (value !== this.value) {
      this.value = value;
      this.onChange(value);
    }
  }

  protected setParseError(parseError: boolean) {
    if (parseError !== this.parseError()) {
      this.parseError.set(parseError);
      this.onValidatorChange();
    }
  }
}
