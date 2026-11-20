import { injectNbTexts, NbLocalize } from '@liquid-js/lyr-core/base';
import { nbValidationParam } from './validation-options';
import type { NbValidationError, NbValidationMessage } from '@liquid-js/lyr-core/base';

/** @internal */
declare const $localize: NbLocalize;

/**
 * The default messages of error kinds: Angular's built-in validators', in reactive and template-driven forms
 * (`minlength`) and in signal forms (`minLength`), and Lyra's controls'.
 * @internal
 */
export function nbValidationTexts(): Record<string, NbValidationMessage> {
  return {
    required: $localize`:@@nb.validation.required:This field is required`,
    email: $localize`:@@nb.validation.email:Enter a valid email address`,
    pattern: $localize`:@@nb.validation.pattern:Enter a value in the expected format`,
    min: (error) => $localize`:@@nb.validation.min:Enter a value of at least ${nbValidationParam(error, 'min')}:min:`,
    max: (error) => $localize`:@@nb.validation.max:Enter a value of at most ${nbValidationParam(error, 'max')}:max:`,
    minlength: (error) =>
      $localize`:@@nb.validation.minlength:Enter at least ${nbValidationParam(error, 'requiredLength')}:length: characters`,
    maxlength: (error) =>
      $localize`:@@nb.validation.maxlength:Enter no more than ${nbValidationParam(error, 'requiredLength')}:length: characters`,
    minLength: (error) =>
      $localize`:@@nb.validation.minlength:Enter at least ${nbValidationParam(error, 'minLength')}:length: characters`,
    maxLength: (error) =>
      $localize`:@@nb.validation.maxlength:Enter no more than ${nbValidationParam(error, 'maxLength')}:length: characters`,
    nbNumberInputParse: $localize`:@@nb.validation.numberInputParse:Enter a number`,
    nbDatepickerParse: $localize`:@@nb.validation.datepickerParse:Enter a valid date`,
    nbDatepickerMin: (error) =>
      $localize`:@@nb.validation.datepickerMin:Pick a date on or after ${nbValidationParam(error, 'minText')}:min:`,
    nbDatepickerMax: (error) =>
      $localize`:@@nb.validation.datepickerMax:Pick a date on or before ${nbValidationParam(error, 'maxText')}:max:`,
    nbDatepickerFilter: $localize`:@@nb.validation.datepickerFilter:Pick one of the dates offered`,
    nbTimepickerParse: $localize`:@@nb.validation.timepickerParse:Enter a valid time`,
    nbTimepickerMin: (error) =>
      $localize`:@@nb.validation.timepickerMin:Pick a time at or after ${nbValidationParam(error, 'minText')}:min:`,
    nbTimepickerMax: (error) =>
      $localize`:@@nb.validation.timepickerMax:Pick a time at or before ${nbValidationParam(error, 'maxText')}:max:`,
    nbSliderOrder: $localize`:@@nb.validation.sliderOrder:The start can't be after the end`,
  };
}

/** The validation messages, under the ones `provideNbTexts({ validation })` changes. @internal */
export function injectNbValidationTexts() {
  return injectNbTexts('validation', nbValidationTexts);
}

/**
 * An error of a Lyra control, as Angular gives parse errors: its kind, the data, and its message, as
 * `nb-validation-errors` shows it (`injectNbValidationMessage`).
 * @internal
 */
export function nbValidationError<T extends object>(
  message: (error: NbValidationError) => string,
  kind: string,
  data: T,
): T & { kind: string; message: string } {
  return { ...data, kind, message: message({ kind, params: data }) };
}
