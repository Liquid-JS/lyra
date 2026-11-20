import { inject, InjectionToken, Provider } from '@angular/core'
import type { NbValidationError, NbValidationMessage } from '@liquid-js/lyr-core/base'

/**
 * A value in the params of an error, e.g. `nbValidationParam(error, 'requiredLength')` of `minlength`; `undefined`
 * when the params aren't an object or don't have it.
 */
export function nbValidationParam(error: NbValidationError, name: string): unknown {
    const { params } = error
    if (typeof params !== 'object' || params === null) {
        return undefined
    }
    const entries: Array<[string, unknown]> = Object.entries(params)
    return entries.find(([key]) => key === name)?.[1]
}

/**
 * When a control shows its errors:
 * - `dirty`: as soon as the value changes, when the control is blurred, or when its form is submitted;
 * - `touched`: when the control is blurred or its form is submitted;
 * - `submitted`: when its form is submitted.
 *
 * Signal forms mark fields touched on submit and don't track submission, so `submitted` behaves as `touched` there.
 */
export type NbValidationTrigger = 'dirty' | 'touched' | 'submitted'

export interface NbValidationOptions {
    /**
     * When controls show their errors. `touched` by default.
     */
    trigger: NbValidationTrigger
    /**
     * Whether valid controls the user has changed get the `success` status. `false` by default.
     */
    success: boolean
    /**
     * Messages by error kind.
     */
    messages: Record<string, NbValidationMessage>
}

const defaultOptions = (): NbValidationOptions => ({
    trigger: 'touched',
    success: false,
    messages: {}
})

export const NB_VALIDATION_OPTIONS = new InjectionToken<NbValidationOptions>('Lyra Validation Options', {
    providedIn: 'root',
    factory: () => defaultOptions()
})

/**
 * Sets when controls show their errors, whether they show success, and the messages for error kinds, over the
 * `validation` texts of `NbTextsService`.
 * Works in the application providers and in a component's, where it overrides the options from above it;
 * `messages` are added to the ones from above.
 *
 * ```ts
 * provideNbValidation({
 *   trigger: 'dirty',
 *   messages: { required: $localize`Required`, iban: 'Enter a valid IBAN' },
 * })
 * ```
 */
export function provideNbValidation(options: Partial<NbValidationOptions>): Provider {
    return {
        provide: NB_VALIDATION_OPTIONS,
        useFactory: () => {
            // In the application injector there is no parent, so the defaults stand in for it.
            const parent = inject(NB_VALIDATION_OPTIONS, { skipSelf: true, optional: true }) ?? defaultOptions()
            return { ...parent, ...options, messages: { ...parent.messages, ...options.messages } }
        }
    }
}
