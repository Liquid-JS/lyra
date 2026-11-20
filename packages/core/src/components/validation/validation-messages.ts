import { inject, Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

import { NB_VALIDATION_OPTIONS, nbValidationParam } from './validation-options';
import type { NbValidationError } from '@liquid-js/lyr-core/base';
import { injectNbValidationTexts } from './validation-texts';

/** An error of signal forms, as `field().errors()` lists them. */
interface NbSignalError {
  readonly kind: string;
  readonly message?: string;
}

/**
 * What a control's own validator returned, e.g. for text it can't parse, which signal forms wrap, in a copy of a
 * `CompatValidationError`, with it as the context: the error's value, as in reactive forms.
 */
function compatContext(error: object): { message?: unknown } | undefined {
  if ('context' in error && 'control' in error && typeof error.context === 'object' && error.context) {
    return error.context;
  }
  return undefined;
}

/**
 * A control's errors as one list, the same for all forms: reactive and template-driven forms' `control.errors`,
 * or signal forms' `field().errors()`, whose errors from a control's own validators are unwrapped. Each error has
 * its kind, the message a signal forms rule gave, if any, and its value as `params`. One error of each kind, as
 * reactive forms have, the first.
 *
 * ```html
 * @for (error of control.errors | nbValidationErrors; track error.kind) {
 *   <p>{{ error | nbValidationMessage }}</p>
 * }
 * ```
 */
export function toNbValidationErrors(
  errors?: ValidationErrors | readonly NbSignalError[] | null,
): NbValidationError[] {
  if (!errors) {
    return [];
  }
  const list: NbValidationError[] = Array.isArray(errors)
    ? (errors as readonly NbSignalError[]).map((error) => ({
      kind: error.kind,
      message: error.message,
      params: compatContext(error) ?? error,
    }))
    : Object.entries(errors as ValidationErrors).map(([kind, params]) => ({ kind, params }));
  const kinds = new Set<string>();
  return list.filter(({ kind }) => {
    if (kinds.has(kind)) {
      return false;
    }
    kinds.add(kind);
    return true;
  });
}

/**
 * Gives the message of an error, as `nb-validation-errors` shows it, from, in order: the message a signal forms rule
 * gave, the messages set with `provideNbValidation`, the texts set with `provideNbTexts({ validation })`, which have
 * Lyra's default messages for Angular's validators and Lyra's controls, and the message the error's value carries.
 * Use it in the injection context, e.g. in a field initializer:
 *
 * ```ts
 * protected readonly message = injectNbValidationMessage();
 * ```
 */
export function injectNbValidationMessage(): (error: NbValidationError) => string {
  const options = inject(NB_VALIDATION_OPTIONS);
  const texts = injectNbValidationTexts();
  return (error) => {
    if (error.message) {
      return error.message;
    }
    const param = nbValidationParam(error, 'message');
    const message =
      options.messages[error.kind] ?? texts()[error.kind] ?? (typeof param === 'string' ? param : undefined);
    if (message === undefined) {
      return '';
    }
    return typeof message === 'function' ? message(error) : message;
  };
}

/**
 * Lists a control's errors, the same for all forms: `control.errors | nbValidationErrors` or
 * `field().errors() | nbValidationErrors`; see `toNbValidationErrors`.
 */
@Pipe({ name: 'nbValidationErrors' })
export class NbValidationErrorsPipe implements PipeTransform {
  transform(errors?: ValidationErrors | readonly NbSignalError[] | null): NbValidationError[] {
    return toNbValidationErrors(errors);
  }
}

/**
 * Gives an error's message, as `nb-validation-errors` shows it: `error | nbValidationMessage`, for an error from
 * `nbValidationErrors` or `nbValidation`'s `errors()`; see `injectNbValidationMessage`. It follows the texts when the
 * app changes them.
 */
@Pipe({ name: 'nbValidationMessage', pure: false })
export class NbValidationMessagePipe implements PipeTransform {
  protected readonly message = injectNbValidationMessage();

  transform(error?: NbValidationError | null): string {
    return error ? this.message(error) : '';
  }
}
