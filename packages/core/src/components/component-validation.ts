// A form control's validation errors, shared with the texts service.

/**
 * A validation error of a form control, the same for reactive, template-driven and signal forms.
 */
export interface NbValidationError {
    /**
     * The error key, e.g. `required` or `minlength`.
     */
    kind: string
    /**
     * The message a signal forms rule gave, if any; reactive and template-driven forms' errors have none here. The
     * message to show, from wherever it comes, is `error | nbValidationMessage`, or `injectNbValidationMessage()`.
     */
    message?: string
    /**
     * What the validator returned for the error: the value in `ValidationErrors` for reactive and template-driven forms,
     * or the error object for signal forms.
     */
    params: unknown
}

/**
 * A message for an error kind: the text, or a function that builds it from the error.
 */
export type NbValidationMessage = string | ((error: NbValidationError) => string)
