import {
    Component,
    computed,
    ElementRef,
    forwardRef,
    inject,
    input,
    linkedSignal,
    output,
    untracked
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

import { injectNbDefaults, NbStatusService, NbComponentOrCustomStatus, NbComponentSize, ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput, ɵfocusOnClick as focusOnClick, ɵenableTransitionsAfterRender as enableTransitionsAfterRender } from '@liquid-js/lyr-core/base'
import { NbValidationDirective } from '@liquid-js/lyr-core/validation'
import { NbIconComponent } from '@liquid-js/lyr-core/icon'

let lastCheckboxId = 0

/**
 * A checkbox with a label, coloured by its status.
 *
 * @stacked-example(Showcase, checkbox/checkbox-showcase.component)
 *
 * ### Installation
 *
 * Import `NbCheckboxComponent` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbCheckboxComponent],
 * })
 * export class PageComponent { }
 * ```
 *
 * With NgModules:
 *
 * Import `NbCheckboxModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbCheckboxModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * `status` colours the checkbox:
 * @stacked-example(Colored Checkboxes, checkbox/checkbox-status.component)
 *
 * An `indeterminate` checkbox is neither checked nor unchecked, e.g. for a list with some items checked:
 * @stacked-example(Indeterminate Checkbox, checkbox/checkbox-indeterminate.component)
 *
 * Checkboxes come in five sizes: `tiny`, `small`, `medium` (default), `large` and `giant`.
 * @stacked-example(Checkbox sizes, checkbox/checkbox-sizes.component)
 *
 * `disabled` disables the checkbox, as does its form control:
 * @stacked-example(Disabled Checkbox, checkbox/checkbox-disabled.component)
 * @styles
 *
 * checkbox-tiny-height:
 * checkbox-tiny-width:
 * checkbox-small-height:
 * checkbox-small-width:
 * checkbox-medium-height:
 * checkbox-medium-width:
 * checkbox-large-height:
 * checkbox-large-width:
 * checkbox-giant-height:
 * checkbox-giant-width:
 * checkbox-border-style:
 * checkbox-border-width:
 * checkbox-border-radius:
 * checkbox-outline-width:
 * checkbox-outline-color:
 * checkbox-text-font-family:
 * checkbox-tiny-text-font-size:
 * checkbox-tiny-text-font-weight:
 * checkbox-tiny-text-line-height:
 * checkbox-small-text-font-size:
 * checkbox-small-text-font-weight:
 * checkbox-small-text-line-height:
 * checkbox-medium-text-font-size:
 * checkbox-medium-text-font-weight:
 * checkbox-medium-text-line-height:
 * checkbox-large-text-font-size:
 * checkbox-large-text-font-weight:
 * checkbox-large-text-line-height:
 * checkbox-giant-text-font-size:
 * checkbox-giant-text-font-weight:
 * checkbox-giant-text-line-height:
 * checkbox-text-space:
 * checkbox-padding:
 * checkbox-focus-inset-shadow-length:
 * checkbox-basic-text-color:
 * checkbox-basic-background-color:
 * checkbox-basic-border-color:
 * checkbox-basic-checked-background-color:
 * checkbox-basic-checked-border-color:
 * checkbox-basic-checked-checkmark-color:
 * checkbox-basic-indeterminate-background-color:
 * checkbox-basic-indeterminate-border-color:
 * checkbox-basic-indeterminate-checkmark-color:
 * checkbox-basic-focus-background-color:
 * checkbox-basic-focus-border-color:
 * checkbox-basic-focus-checked-background-color:
 * checkbox-basic-focus-checked-border-color:
 * checkbox-basic-hover-background-color:
 * checkbox-basic-hover-border-color:
 * checkbox-basic-hover-checked-background-color:
 * checkbox-basic-hover-checked-border-color:
 * checkbox-basic-active-background-color:
 * checkbox-basic-active-border-color:
 * checkbox-basic-active-checked-background-color:
 * checkbox-basic-active-checked-border-color:
 * checkbox-basic-disabled-background-color:
 * checkbox-basic-disabled-border-color:
 * checkbox-basic-disabled-checkmark-color:
 * checkbox-basic-disabled-text-color:
 * checkbox-basic-disabled-checked-background-color:
 * checkbox-basic-disabled-checked-border-color:
 * checkbox-primary-text-color:
 * checkbox-primary-background-color:
 * checkbox-primary-border-color:
 * checkbox-primary-checked-background-color:
 * checkbox-primary-checked-border-color:
 * checkbox-primary-checked-checkmark-color:
 * checkbox-primary-indeterminate-background-color:
 * checkbox-primary-indeterminate-border-color:
 * checkbox-primary-indeterminate-checkmark-color:
 * checkbox-primary-focus-background-color:
 * checkbox-primary-focus-border-color:
 * checkbox-primary-focus-checked-background-color:
 * checkbox-primary-focus-checked-border-color:
 * checkbox-primary-hover-background-color:
 * checkbox-primary-hover-border-color:
 * checkbox-primary-hover-checked-background-color:
 * checkbox-primary-hover-checked-border-color:
 * checkbox-primary-active-background-color:
 * checkbox-primary-active-border-color:
 * checkbox-primary-active-checked-background-color:
 * checkbox-primary-active-checked-border-color:
 * checkbox-primary-disabled-background-color:
 * checkbox-primary-disabled-border-color:
 * checkbox-primary-disabled-checkmark-color:
 * checkbox-primary-disabled-text-color:
 * checkbox-primary-disabled-checked-background-color:
 * checkbox-primary-disabled-checked-border-color:
 * checkbox-success-text-color:
 * checkbox-success-background-color:
 * checkbox-success-border-color:
 * checkbox-success-checked-background-color:
 * checkbox-success-checked-border-color:
 * checkbox-success-checked-checkmark-color:
 * checkbox-success-indeterminate-background-color:
 * checkbox-success-indeterminate-border-color:
 * checkbox-success-indeterminate-checkmark-color:
 * checkbox-success-focus-background-color:
 * checkbox-success-focus-border-color:
 * checkbox-success-focus-checked-background-color:
 * checkbox-success-focus-checked-border-color:
 * checkbox-success-hover-background-color:
 * checkbox-success-hover-border-color:
 * checkbox-success-hover-checked-background-color:
 * checkbox-success-hover-checked-border-color:
 * checkbox-success-active-background-color:
 * checkbox-success-active-border-color:
 * checkbox-success-active-checked-background-color:
 * checkbox-success-active-checked-border-color:
 * checkbox-success-disabled-background-color:
 * checkbox-success-disabled-border-color:
 * checkbox-success-disabled-checkmark-color:
 * checkbox-success-disabled-text-color:
 * checkbox-success-disabled-checked-background-color:
 * checkbox-success-disabled-checked-border-color:
 * checkbox-info-text-color:
 * checkbox-info-background-color:
 * checkbox-info-border-color:
 * checkbox-info-checked-background-color:
 * checkbox-info-checked-border-color:
 * checkbox-info-checked-checkmark-color:
 * checkbox-info-indeterminate-background-color:
 * checkbox-info-indeterminate-border-color:
 * checkbox-info-indeterminate-checkmark-color:
 * checkbox-info-focus-background-color:
 * checkbox-info-focus-border-color:
 * checkbox-info-focus-checked-background-color:
 * checkbox-info-focus-checked-border-color:
 * checkbox-info-hover-background-color:
 * checkbox-info-hover-border-color:
 * checkbox-info-hover-checked-background-color:
 * checkbox-info-hover-checked-border-color:
 * checkbox-info-active-background-color:
 * checkbox-info-active-border-color:
 * checkbox-info-active-checked-background-color:
 * checkbox-info-active-checked-border-color:
 * checkbox-info-disabled-background-color:
 * checkbox-info-disabled-border-color:
 * checkbox-info-disabled-checkmark-color:
 * checkbox-info-disabled-text-color:
 * checkbox-info-disabled-checked-background-color:
 * checkbox-info-disabled-checked-border-color:
 * checkbox-warning-text-color:
 * checkbox-warning-background-color:
 * checkbox-warning-border-color:
 * checkbox-warning-checked-background-color:
 * checkbox-warning-checked-border-color:
 * checkbox-warning-checked-checkmark-color:
 * checkbox-warning-indeterminate-background-color:
 * checkbox-warning-indeterminate-border-color:
 * checkbox-warning-indeterminate-checkmark-color:
 * checkbox-warning-focus-background-color:
 * checkbox-warning-focus-border-color:
 * checkbox-warning-focus-checked-background-color:
 * checkbox-warning-focus-checked-border-color:
 * checkbox-warning-hover-background-color:
 * checkbox-warning-hover-border-color:
 * checkbox-warning-hover-checked-background-color:
 * checkbox-warning-hover-checked-border-color:
 * checkbox-warning-active-background-color:
 * checkbox-warning-active-border-color:
 * checkbox-warning-active-checked-background-color:
 * checkbox-warning-active-checked-border-color:
 * checkbox-warning-disabled-background-color:
 * checkbox-warning-disabled-border-color:
 * checkbox-warning-disabled-checkmark-color:
 * checkbox-warning-disabled-text-color:
 * checkbox-warning-disabled-checked-background-color:
 * checkbox-warning-disabled-checked-border-color:
 * checkbox-danger-text-color:
 * checkbox-danger-background-color:
 * checkbox-danger-border-color:
 * checkbox-danger-checked-background-color:
 * checkbox-danger-checked-border-color:
 * checkbox-danger-checked-checkmark-color:
 * checkbox-danger-indeterminate-background-color:
 * checkbox-danger-indeterminate-border-color:
 * checkbox-danger-indeterminate-checkmark-color:
 * checkbox-danger-focus-background-color:
 * checkbox-danger-focus-border-color:
 * checkbox-danger-focus-checked-background-color:
 * checkbox-danger-focus-checked-border-color:
 * checkbox-danger-hover-background-color:
 * checkbox-danger-hover-border-color:
 * checkbox-danger-hover-checked-background-color:
 * checkbox-danger-hover-checked-border-color:
 * checkbox-danger-active-background-color:
 * checkbox-danger-active-border-color:
 * checkbox-danger-active-checked-background-color:
 * checkbox-danger-active-checked-border-color:
 * checkbox-danger-disabled-background-color:
 * checkbox-danger-disabled-border-color:
 * checkbox-danger-disabled-checkmark-color:
 * checkbox-danger-disabled-text-color:
 * checkbox-danger-disabled-checked-background-color:
 * checkbox-danger-disabled-checked-border-color:
 * checkbox-control-text-color:
 * checkbox-control-background-color:
 * checkbox-control-border-color:
 * checkbox-control-checked-background-color:
 * checkbox-control-checked-border-color:
 * checkbox-control-checked-checkmark-color:
 * checkbox-control-indeterminate-background-color:
 * checkbox-control-indeterminate-border-color:
 * checkbox-control-indeterminate-checkmark-color:
 * checkbox-control-focus-background-color:
 * checkbox-control-focus-border-color:
 * checkbox-control-focus-checked-background-color:
 * checkbox-control-focus-checked-border-color:
 * checkbox-control-hover-background-color:
 * checkbox-control-hover-border-color:
 * checkbox-control-hover-checked-background-color:
 * checkbox-control-hover-checked-border-color:
 * checkbox-control-active-background-color:
 * checkbox-control-active-border-color:
 * checkbox-control-active-checked-background-color:
 * checkbox-control-active-checked-border-color:
 * checkbox-control-disabled-background-color:
 * checkbox-control-disabled-border-color:
 * checkbox-control-disabled-checkmark-color:
 * checkbox-control-disabled-text-color:
 * checkbox-control-disabled-checked-background-color:
 * checkbox-control-disabled-checked-border-color:
 */
@Component({
    selector: 'nb-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NbCheckboxComponent),
        multi: true
    }],
    imports: [NbIconComponent],
    host: {
        '[class]': 'hostClasses()'
    }
})
export class NbCheckboxComponent implements ControlValueAccessor {
    // The app's defaults for this type, which the inputs below start from.
    protected readonly nbDefaults = injectNbDefaults('checkbox')

    protected readonly focusOnClick = focusOnClick
    private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef)
    private readonly statusService = inject(NbStatusService)

    onChange: (value: boolean) => void = () => {}
    onTouched: () => void = () => {}

    /**
     * Whether the checkbox is checked; a user or a form control changes it from there.
     */
    readonly checked = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * Disables the checkbox; a form control's disabled state does too.
     */
    readonly disabled = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    protected readonly validation = inject(NbValidationDirective, { self: true, optional: true })

    // The label's text, which names the checkbox after an `nbLabel` of its `nbValidation`, as a select's value follows it.
    protected readonly textId = `nb-checkbox-text-${lastCheckboxId++}`
    protected readonly labelledBy = computed(() => {
        const labels = this.validation?.labelledBy()
        return labels ? `${labels} ${this.textId}` : null
    })

    /**
     * Checkbox status: `basic` (default), `primary`, `success`, `warning`, `danger`, `info`, `control` or a custom one.
     * With `nbValidation`, its error or success status takes over.
     */
    readonly status = input<NbComponentOrCustomStatus>('basic')

    // With `nbValidation`, the status it gives while the control shows errors or success.
    protected readonly resolvedStatus = computed(() => this.validation?.status() ?? this.status())

    /**
     * Checkbox size: `tiny`, `small`, `medium` (default), `large` or `giant`.
     */
    readonly sizeInput = input<NbComponentSize | undefined>(undefined, { alias: 'size' })
    /** The size in use: the input's, the app's default, or 'medium'. */
    readonly size = linkedSignal<NbComponentSize>(() => this.sizeInput() ?? this.nbDefaults().size ?? 'medium')

    /**
     * Shows the checkbox as indeterminate, neither checked nor unchecked, until a user clicks it.
     */
    readonly indeterminate = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * Emits when a user checks or unchecks the checkbox, not when a form control sets it.
     */
    readonly checkedChange = output<boolean>()

    /**
     * Whether the checkbox is checked: the `checked` input, until a user or a form changes it.
     */
    readonly isChecked = linkedSignal(() => this.checked())

    /**
     * Whether the checkbox is disabled: the `disabled` input, until a form changes it.
     */
    readonly isDisabled = linkedSignal(() => this.disabled())

    /**
     * Whether the checkbox is indeterminate: the `indeterminate` input, until a user checks the checkbox.
     */
    readonly isIndeterminate = linkedSignal(() => this.indeterminate())

    protected readonly hostClasses = computed(() => [
        this.statusService.getStatusClass(this.resolvedStatus()),
        `size-${this.size()}`
    ])

    constructor() {
    // The focusable element is inside: the button or the native input gets aria-invalid and aria-describedby.
        this.validation?.delegateAria()
        enableTransitionsAfterRender(this.hostElement.nativeElement)
    }

    registerOnChange(fn: (value: boolean) => void) {
        this.onChange = fn
    }

    registerOnTouched(fn: () => void) {
        this.onTouched = fn
    }

    // Untracked, as forms write values from wherever the app sets them, e.g. an effect that mustn't come to depend
    // on the control.
    writeValue(value: boolean | null) {
        untracked(() => this.isChecked.set(!!value))
    }

    setDisabledState(val: boolean) {
        this.isDisabled.set(convertToBoolProperty(val))
    }

    setTouched() {
        this.onTouched()
    }

    updateValueAndIndeterminate(event: Event) {
        const nativeInput = event.target as HTMLInputElement
        this.isChecked.set(nativeInput.checked)
        this.checkedChange.emit(nativeInput.checked)
        this.onChange(nativeInput.checked)
        this.isIndeterminate.set(nativeInput.indeterminate)
    }
}
