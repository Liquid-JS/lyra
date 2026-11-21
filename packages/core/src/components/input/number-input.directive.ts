import { Directive, effect, ElementRef, forwardRef, inject, input, numberAttribute, untracked } from '@angular/core'
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms'

import { injectNbValidationMessage, ɵnbValidationError as nbValidationError } from '@liquid-js/lyr-core/validation'

// Clears floating point noise, e.g. 0.07 * 100 = 7.000000000000001.
const round = (value: number) => Number(value.toPrecision(12))

// Text the browser couldn't read as a number, e.g. `1e`. The server's DOM has no validity, and nothing is typed there.
const isBadInput = (element: HTMLInputElement) => !!(element.validity as ValidityState | undefined)?.badInput
const optionalNumber = (value: unknown) => (value == null || value === '' ? undefined : numberAttribute(value))

/**
 * A number input whose value is scaled for display, e.g. a fraction shown as a percent, or radians shown in degrees.
 * Use it on an `nbInput`, and show the unit in a form field suffix:
 *
 * ```html
 * <nb-form-field>
 *   <input nbInput nbNumberInput [scale]="100" min="0" max="100" [(ngModel)]="opacity" />
 *   <span nbSuffix>%</span>
 * </nb-form-field>
 * ```
 *
 * With `scale` at 100 the input shows 50 for a value of 0.5. `min`, `max` and `step` are in the units it shows,
 * as on any number input, and so are the `min` and `max` errors it gives forms. While the text isn't a number, e.g.
 * `1e`, the value stays the last one and the field has the `nbNumberInputParse` error. Its errors are
 * `{ kind, message, …data }`, with the messages of `nb-validation-errors`, in reactive, template-driven and signal
 * forms alike.
 *
 * @stacked-example(Number input, input/input-number.component)
 *
 * It sets the input's type; leave the `type` attribute out, as Angular's own `min` and `max` validators apply to
 * inputs with it, and they compare the value without its scale.
 */
@Directive({
    selector: 'input[nbNumberInput]',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NbNumberInputDirective), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => NbNumberInputDirective), multi: true }
    ],
    host: {
        'type': 'number',
        '[attr.min]': 'min() ?? null',
        '[attr.max]': 'max() ?? null',
        '[attr.step]': 'step() ?? null',
        '(input)': 'onInput()',
        '(blur)': 'onTouched()'
    }
})
export class NbNumberInputDirective implements ControlValueAccessor, Validator {
    protected readonly elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef)
    protected readonly message = injectNbValidationMessage()

    /**
     * How many of the units it shows make up one of the value's, e.g. 100 for a fraction shown as a percent.
     */
    readonly scale = input<number, unknown>(1, { transform: (value) => numberAttribute(value, 1) || 1 })

    /**
     * The least number it accepts, in the units it shows.
     */
    readonly min = input<number | undefined, unknown>(undefined, { transform: optionalNumber })

    /**
     * The greatest number it accepts, in the units it shows.
     */
    readonly max = input<number | undefined, unknown>(undefined, { transform: optionalNumber })

    /**
     * How far the arrow keys and the spin buttons move it, in the units it shows; `any` for no steps.
     * 1 by default, as on any number input.
     */
    readonly step = input<number | 'any' | undefined, unknown>(undefined, {
        transform: (value) => (value === 'any' ? value : optionalNumber(value))
    })

    // The value the form has: null for an empty field, as forms hold it.
    protected value: number | null = null
    protected onChange: (value: number | null) => void = () => {}
    protected onTouched: () => void = () => {}
    protected onValidatorChange: () => void = () => {}

    constructor() {
    // Shows the value at a new scale.
        effect(() => {
            this.scale()
            untracked(() => this.render())
        })
        effect(() => {
            this.min()
            this.max()
            this.scale()
            untracked(() => this.onValidatorChange())
        })
    }

    // Untracked, as forms write values from wherever the app sets them, e.g. an effect that mustn't come to depend
    // on the control.
    writeValue(value: unknown) {
        untracked(() => {
            this.value = typeof value === 'number' && !isNaN(value) ? value : null
            this.render()
        })
    }

    registerOnChange(fn: (value: number | null) => void) {
        this.onChange = fn
    }

    registerOnTouched(fn: () => void) {
        this.onTouched = fn
    }

    registerOnValidatorChange(fn: () => void) {
        this.onValidatorChange = fn
    }

    setDisabledState(isDisabled: boolean) {
        this.elementRef.nativeElement.disabled = isDisabled
    }

    validate(control: AbstractControl): ValidationErrors | null {
    // The browser leaves the value empty for text that isn't a number, e.g. `1e`.
        if (isBadInput(this.elementRef.nativeElement)) {
            return { nbNumberInputParse: nbValidationError(this.message, 'nbNumberInputParse', {}) }
        }
        if (typeof control.value !== 'number') {
            return null
        }
        const actual = round(control.value * this.scale())
        const min = this.min()
        const max = this.max()
        if (min !== undefined && actual < min) {
            return { min: nbValidationError(this.message, 'min', { min, actual }) }
        }
        if (max !== undefined && actual > max) {
            return { max: nbValidationError(this.message, 'max', { max, actual }) }
        }
        return null
    }

    protected onInput() {
        const element = this.elementRef.nativeElement
        // While the text isn't a number, the value stays and the field has the parse error.
        if (isBadInput(element)) {
            this.onValidatorChange()
            return
        }
        const shown = element.valueAsNumber
        this.value = isNaN(shown) ? null : round(shown / this.scale())
        this.onChange(this.value)
        // The parse check reads the text, which signal forms don't see change, e.g. from `50e` back to `50`.
        this.onValidatorChange()
    }

    protected render() {
        const element = this.elementRef.nativeElement
        const shown = this.value === null ? null : round(this.value * this.scale())
        // Leaves text that already shows the value, e.g. `0.50` while it's typed, and clears text that isn't a number.
        const current = isBadInput(element) ? NaN : element.value === '' ? null : element.valueAsNumber
        if (current !== shown) {
            element.value = shown === null ? '' : String(shown)
        }
    }
}
