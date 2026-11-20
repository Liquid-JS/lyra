import { inject, LOCALE_ID } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { SchemaPath, validate } from '@angular/forms/signals';
import { injectNbValidationMessage, NbValidationError, nbValidationParam } from '@liquid-js/lyr-core';
import { CountryCode, getCountries, parsePhoneNumberFromString, PhoneNumber } from 'libphonenumber-js';

import { injectNbPhoneInputTexts, NbPhoneInputTexts, nbPhoneInputTexts } from './texts';

/** The error kind of a phone number that isn't valid or isn't from an allowed country. */
export const NB_PHONE_NUMBER_ERROR = 'nbPhoneNumber' as const;

/**
 * What's wrong with a phone number: it isn't valid (`invalid`), or it's from a country that isn't allowed (`country`).
 */
export type NbPhoneNumberProblem = 'invalid' | 'country';

/**
 * The `nbPhoneNumber` error, the same in signal, reactive and template-driven forms, as Angular gives parse errors:
 * its kind, what's wrong, and its message.
 */
export interface NbPhoneNumberError {
  kind: typeof NB_PHONE_NUMBER_ERROR;
  problem: NbPhoneNumberProblem;
  message: string;
}

/** A value, or a function that gives it, e.g. from another control or a signal. */
export type NbPhoneNumberOption<T> = T | (() => T);

/** A message of this validator's errors, or a function that gives it for what's wrong. */
export type NbPhoneNumberMessage = string | ((problem: NbPhoneNumberProblem) => string);

export interface NbPhoneNumberOptions {
  /** The country of numbers without a calling code; the app locale's country by default. */
  country?: NbPhoneNumberOption<CountryCode | undefined>;
  /** The countries whose numbers pass, all by default. */
  countries?: NbPhoneNumberOption<readonly CountryCode[] | undefined>;
  /** The message of its errors, in place of the app's (`provideNbValidation`, `provideNbTexts`). */
  message?: NbPhoneNumberMessage;
}

/** Where the errors take their messages and numbers their country from. @internal */
export interface NbPhoneNumberContext {
  texts: () => NbPhoneInputTexts;
  /** The message of an error, as `nb-validation-errors` shows it. */
  message: (error: NbValidationError) => string;
  country?: CountryCode;
}

const allCountries = new Set<string>(getCountries());

/** The country of a locale, e.g. `GB` for `en-GB`, or `US` for `en`. @internal */
export function localeCountry(locale: string): CountryCode | undefined {
  try {
    const region = new Intl.Locale(locale).maximize().region;
    return region && allCountries.has(region) ? (region as CountryCode) : undefined;
  } catch {
    return undefined;
  }
}

/** The valid number in a text, in the country unless it has a calling code. @internal */
export function parsePhoneNumber(text: string, country?: CountryCode): PhoneNumber | undefined {
  if (!text.trim()) {
    return undefined;
  }
  const number = parsePhoneNumberFromString(text, country);
  return number?.isValid() ? number : undefined;
}

/** What's wrong with a value as a phone number, if anything; an empty value is fine. @internal */
export function checkPhoneNumber(
  value: unknown,
  country?: CountryCode,
  countries?: readonly CountryCode[],
): NbPhoneNumberProblem | undefined {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }
  const number = parsePhoneNumber(String(value), country);
  if (!number) {
    return 'invalid';
  }
  return countries && !(number.country && countries.includes(number.country)) ? 'country' : undefined;
}

/**
 * The error of a problem, with its message: the one given, or the app's, or the phone input's texts'. @internal
 */
export function phoneNumberError(
  context: NbPhoneNumberContext,
  problem: NbPhoneNumberProblem,
  message?: NbPhoneNumberMessage,
): NbPhoneNumberError {
  const own = typeof message === 'function' ? message(problem) : message;
  if (own !== undefined) {
    return { kind: NB_PHONE_NUMBER_ERROR, problem, message: own };
  }
  const texts = context.texts();
  const error = {
    kind: NB_PHONE_NUMBER_ERROR,
    problem,
    message: problem === 'country' ? texts.otherCountry : texts.invalid,
  };
  return { ...error, message: context.message({ kind: NB_PHONE_NUMBER_ERROR, params: error }) };
}

/** Validates a value with the options, as all the forms do. @internal */
export function validatePhoneNumber(
  value: unknown,
  options: NbPhoneNumberOptions,
  context: NbPhoneNumberContext,
): NbPhoneNumberError | undefined {
  const problem = checkPhoneNumber(value, read(options.country) ?? context.country, read(options.countries));
  return problem ? phoneNumberError(context, problem, options.message) : undefined;
}

const read = <T>(option: NbPhoneNumberOption<T>): T =>
  typeof option === 'function' ? (option as () => T)() : option;

/** The texts, the app's messages and the locale's country, from the injection context when there's one. @internal */
export function phoneNumberContext(): NbPhoneNumberContext {
  try {
    const texts = injectNbPhoneInputTexts();
    return {
      texts: () => texts(),
      message: injectNbValidationMessage(),
      country: localeCountry(inject(LOCALE_ID)),
    };
  } catch {
    const texts = nbPhoneInputTexts();
    return {
      texts: () => texts,
      message: (error) => {
        const message = nbValidationParam(error, 'message');
        return typeof message === 'string' ? message : '';
      },
    };
  }
}

/**
 * Validates a phone number in reactive forms: an empty value passes, a number that isn't valid or isn't from one of
 * `countries` gets the `nbPhoneNumber` error, with its message. In templates, use the `nbPhoneNumber` attribute.
 *
 * ```ts
 * readonly phone = new FormControl('', nbPhoneNumberValidator({ countries: ['US', 'CA'] }));
 * ```
 *
 * The error's message is `message`, if given, or the one `nb-validation-errors` shows for `nbPhoneNumber`: the app's
 * (`provideNbValidation`, `provideNbTexts({ validation })`), or the phone input's texts, `invalid` or
 * `otherCountry`. Made in an injection context, e.g. in a field initializer, it reads numbers in the app locale's
 * country and has the app's messages; elsewhere, numbers need a calling code unless `country` is given, and the
 * messages are the default ones.
 */
export function nbPhoneNumberValidator(options: NbPhoneNumberOptions = {}): ValidatorFn {
  const context = phoneNumberContext();
  return (control: AbstractControl): ValidationErrors | null => {
    const error = validatePhoneNumber(control.value, options, context);
    return error ? { [NB_PHONE_NUMBER_ERROR]: error } : null;
  };
}

/**
 * Validates a phone number in signal forms, as `nbPhoneNumberValidator` does:
 *
 * ```ts
 * readonly form = form(this.model, (path) => {
 *   nbPhoneNumber(path.phone, { countries: ['US', 'CA'] });
 * });
 * ```
 */
export function nbPhoneNumber(
  path: SchemaPath<string | null | undefined>,
  options: NbPhoneNumberOptions = {},
): void {
  const context = phoneNumberContext();
  validate(path, ({ value }) => validatePhoneNumber(value(), options, context));
}
