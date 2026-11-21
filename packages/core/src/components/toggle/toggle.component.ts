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

import { injectNbDefaults, NbStatusService, NbLayoutDirectionService, NbComponentOrCustomStatus, NbComponentSize, ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput, ɵfocusOnClick as focusOnClick, ɵenableTransitionsAfterRender as enableTransitionsAfterRender } from '@liquid-js/lyr-core/base'
import { NbValidationDirective } from '@liquid-js/lyr-core/validation'
import { NbIconComponent } from '@liquid-js/lyr-core/icon'

let lastToggleId = 0

/**
 * A switch between on and off, with a label; a native checkbox with the `switch` role underneath.
 *
 * @stacked-example(Showcase, toggle/toggle-showcase.component)
 *
 * ### Installation
 *
 * Import `NbToggleComponent` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbToggleComponent],
 * })
 * export class PageComponent { }
 * ```
 *
 * With NgModules:
 *
 * Import `NbToggleModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbToggleModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * `status` colours it: `basic` (default), `primary`, `success`, `warning`, `danger`, `info` or `control`.
 * @stacked-example(Toggle status, toggle/toggle-status.component)
 *
 * `disabled` disables it:
 * @stacked-example(Disabled Toggles, toggle/toggle-disabled.component)
 *
 * `size` sizes it: `tiny`, `small`, `medium` (default), `large` or `giant`.
 * @stacked-example(Toggle sizes, toggle/toggle-sizes.component)
 *
 * The content is its label, placed with `labelPosition`: `left`, `right`, `start` or `end` (default).
 * @stacked-example(Toggles With Labels, toggle/toggle-label-position.component.ts)
 *
 * Bind `checked` and `checkedChange` without forms:
 *
 * ```html
 * <nb-toggle [(checked)]="checked"></nb-toggle>
 * ```
 *
 * Or use reactive forms or `ngModel`:
 * @stacked-example(Toggle form binding, toggle/toggle-form.component)
 * @styles
 *
 * toggle-tiny-height:
 * toggle-tiny-width:
 * toggle-small-height:
 * toggle-small-width:
 * toggle-medium-height:
 * toggle-medium-width:
 * toggle-large-height:
 * toggle-large-width:
 * toggle-giant-height:
 * toggle-giant-width:
 * toggle-border-width:
 * toggle-border-radius:
 * toggle-outline-width:
 * toggle-outline-color:
 * toggle-tiny-switcher-size:
 * toggle-tiny-switcher-icon-size:
 * toggle-small-switcher-size:
 * toggle-small-switcher-icon-size:
 * toggle-medium-switcher-size:
 * toggle-medium-switcher-icon-size:
 * toggle-large-switcher-size:
 * toggle-large-switcher-icon-size:
 * toggle-giant-switcher-size:
 * toggle-giant-switcher-icon-size:
 * toggle-text-font-family:
 * toggle-tiny-text-font-size:
 * toggle-tiny-text-font-weight:
 * toggle-tiny-text-line-height:
 * toggle-small-text-font-size:
 * toggle-small-text-font-weight:
 * toggle-small-text-line-height:
 * toggle-medium-text-font-size:
 * toggle-medium-text-font-weight:
 * toggle-medium-text-line-height:
 * toggle-large-text-font-size:
 * toggle-large-text-font-weight:
 * toggle-large-text-line-height:
 * toggle-giant-text-font-size:
 * toggle-giant-text-font-weight:
 * toggle-giant-text-line-height:
 * toggle-cursor:
 * toggle-disabled-cursor:
 * toggle-basic-text-color:
 * toggle-basic-background-color:
 * toggle-basic-border-color:
 * toggle-basic-checked-background-color:
 * toggle-basic-checked-border-color:
 * toggle-basic-checked-switcher-background-color:
 * toggle-basic-switcher-background-color:
 * toggle-basic-checked-switcher-checkmark-color:
 * toggle-basic-focus-background-color:
 * toggle-basic-focus-border-color:
 * toggle-basic-focus-checked-background-color:
 * toggle-basic-focus-checked-border-color:
 * toggle-basic-hover-background-color:
 * toggle-basic-hover-border-color:
 * toggle-basic-hover-checked-background-color:
 * toggle-basic-hover-checked-border-color:
 * toggle-basic-active-background-color:
 * toggle-basic-active-border-color:
 * toggle-basic-active-checked-background-color:
 * toggle-basic-active-checked-border-color:
 * toggle-basic-disabled-background-color:
 * toggle-basic-disabled-border-color:
 * toggle-basic-disabled-switcher-background-color:
 * toggle-basic-disabled-checked-switcher-checkmark-color:
 * toggle-basic-disabled-text-color:
 * toggle-primary-text-color:
 * toggle-primary-background-color:
 * toggle-primary-border-color:
 * toggle-primary-checked-background-color:
 * toggle-primary-checked-border-color:
 * toggle-primary-checked-switcher-background-color:
 * toggle-primary-switcher-background-color:
 * toggle-primary-checked-switcher-checkmark-color:
 * toggle-primary-focus-background-color:
 * toggle-primary-focus-border-color:
 * toggle-primary-focus-checked-background-color:
 * toggle-primary-focus-checked-border-color:
 * toggle-primary-hover-background-color:
 * toggle-primary-hover-border-color:
 * toggle-primary-hover-checked-background-color:
 * toggle-primary-hover-checked-border-color:
 * toggle-primary-active-background-color:
 * toggle-primary-active-border-color:
 * toggle-primary-active-checked-background-color:
 * toggle-primary-active-checked-border-color:
 * toggle-primary-disabled-background-color:
 * toggle-primary-disabled-border-color:
 * toggle-primary-disabled-switcher-background-color:
 * toggle-primary-disabled-checked-switcher-checkmark-color:
 * toggle-primary-disabled-text-color:
 * toggle-success-text-color:
 * toggle-success-background-color:
 * toggle-success-border-color:
 * toggle-success-checked-background-color:
 * toggle-success-checked-border-color:
 * toggle-success-checked-switcher-background-color:
 * toggle-success-switcher-background-color:
 * toggle-success-checked-switcher-checkmark-color:
 * toggle-success-focus-background-color:
 * toggle-success-focus-border-color:
 * toggle-success-focus-checked-background-color:
 * toggle-success-focus-checked-border-color:
 * toggle-success-hover-background-color:
 * toggle-success-hover-border-color:
 * toggle-success-hover-checked-background-color:
 * toggle-success-hover-checked-border-color:
 * toggle-success-active-background-color:
 * toggle-success-active-border-color:
 * toggle-success-active-checked-background-color:
 * toggle-success-active-checked-border-color:
 * toggle-success-disabled-background-color:
 * toggle-success-disabled-border-color:
 * toggle-success-disabled-switcher-background-color:
 * toggle-success-disabled-checked-switcher-checkmark-color:
 * toggle-success-disabled-text-color:
 * toggle-info-text-color:
 * toggle-info-background-color:
 * toggle-info-border-color:
 * toggle-info-checked-background-color:
 * toggle-info-checked-border-color:
 * toggle-info-checked-switcher-background-color:
 * toggle-info-switcher-background-color:
 * toggle-info-checked-switcher-checkmark-color:
 * toggle-info-focus-background-color:
 * toggle-info-focus-border-color:
 * toggle-info-focus-checked-background-color:
 * toggle-info-focus-checked-border-color:
 * toggle-info-hover-background-color:
 * toggle-info-hover-border-color:
 * toggle-info-hover-checked-background-color:
 * toggle-info-hover-checked-border-color:
 * toggle-info-active-background-color:
 * toggle-info-active-border-color:
 * toggle-info-active-checked-background-color:
 * toggle-info-active-checked-border-color:
 * toggle-info-disabled-background-color:
 * toggle-info-disabled-border-color:
 * toggle-info-disabled-switcher-background-color:
 * toggle-info-disabled-checked-switcher-checkmark-color:
 * toggle-info-disabled-text-color:
 * toggle-warning-text-color:
 * toggle-warning-background-color:
 * toggle-warning-border-color:
 * toggle-warning-checked-background-color:
 * toggle-warning-checked-border-color:
 * toggle-warning-checked-switcher-background-color:
 * toggle-warning-switcher-background-color:
 * toggle-warning-checked-switcher-checkmark-color:
 * toggle-warning-focus-background-color:
 * toggle-warning-focus-border-color:
 * toggle-warning-focus-checked-background-color:
 * toggle-warning-focus-checked-border-color:
 * toggle-warning-hover-background-color:
 * toggle-warning-hover-border-color:
 * toggle-warning-hover-checked-background-color:
 * toggle-warning-hover-checked-border-color:
 * toggle-warning-active-background-color:
 * toggle-warning-active-border-color:
 * toggle-warning-active-checked-background-color:
 * toggle-warning-active-checked-border-color:
 * toggle-warning-disabled-background-color:
 * toggle-warning-disabled-border-color:
 * toggle-warning-disabled-switcher-background-color:
 * toggle-warning-disabled-checked-switcher-checkmark-color:
 * toggle-warning-disabled-text-color:
 * toggle-danger-text-color:
 * toggle-danger-background-color:
 * toggle-danger-border-color:
 * toggle-danger-checked-background-color:
 * toggle-danger-checked-border-color:
 * toggle-danger-checked-switcher-background-color:
 * toggle-danger-switcher-background-color:
 * toggle-danger-checked-switcher-checkmark-color:
 * toggle-danger-focus-background-color:
 * toggle-danger-focus-border-color:
 * toggle-danger-focus-checked-background-color:
 * toggle-danger-focus-checked-border-color:
 * toggle-danger-hover-background-color:
 * toggle-danger-hover-border-color:
 * toggle-danger-hover-checked-background-color:
 * toggle-danger-hover-checked-border-color:
 * toggle-danger-active-background-color:
 * toggle-danger-active-border-color:
 * toggle-danger-active-checked-background-color:
 * toggle-danger-active-checked-border-color:
 * toggle-danger-disabled-background-color:
 * toggle-danger-disabled-border-color:
 * toggle-danger-disabled-switcher-background-color:
 * toggle-danger-disabled-checked-switcher-checkmark-color:
 * toggle-danger-disabled-text-color:
 * toggle-control-text-color:
 * toggle-control-background-color:
 * toggle-control-border-color:
 * toggle-control-checked-background-color:
 * toggle-control-checked-border-color:
 * toggle-control-checked-switcher-background-color:
 * toggle-control-switcher-background-color:
 * toggle-control-checked-switcher-checkmark-color:
 * toggle-control-focus-background-color:
 * toggle-control-focus-border-color:
 * toggle-control-focus-checked-background-color:
 * toggle-control-focus-checked-border-color:
 * toggle-control-hover-background-color:
 * toggle-control-hover-border-color:
 * toggle-control-hover-checked-background-color:
 * toggle-control-hover-checked-border-color:
 * toggle-control-active-background-color:
 * toggle-control-active-border-color:
 * toggle-control-active-checked-background-color:
 * toggle-control-active-checked-border-color:
 * toggle-control-disabled-background-color:
 * toggle-control-disabled-border-color:
 * toggle-control-disabled-switcher-background-color:
 * toggle-control-disabled-checked-switcher-checkmark-color:
 * toggle-control-disabled-text-color:
 */
@Component({
    selector: 'nb-toggle',
    templateUrl: './toggle.component.html',
    styleUrls: ['./toggle.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NbToggleComponent),
        multi: true
    }],
    imports: [NbIconComponent],
    host: {
        '[class]': 'hostClasses()'
    }
})
export class NbToggleComponent implements ControlValueAccessor {
    // The app's defaults for this type, which the inputs below start from.
    protected readonly nbDefaults = injectNbDefaults('toggle')

    protected readonly focusOnClick = focusOnClick
    private readonly layoutDirection = inject(NbLayoutDirectionService)
    private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef)
    protected readonly statusService = inject(NbStatusService)

    onChange: (value: boolean) => void = () => {}
    onTouched: () => void = () => {}

    /** Whether the toggle is on; a user or a form changes it from there, see `isChecked`. */
    readonly checked = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /** Disables the toggle; a form changes it from there, see `isDisabled`. */
    readonly disabled = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    protected readonly validation = inject(NbValidationDirective, { self: true, optional: true })

    // The label's text, which names the toggle after an `nbLabel` of its `nbValidation`, as a select's value follows it.
    protected readonly textId = `nb-toggle-text-${lastToggleId++}`
    protected readonly labelledBy = computed(() => {
        const labels = this.validation?.labelledBy()
        return labels ? `${labels} ${this.textId}` : null
    })

    /**
     * `basic` (default), `primary`, `success`, `warning`, `danger`, `info` or `control`. With `nbValidation`, the
     * validation status takes over while the control shows errors or success.
     */
    readonly status = input<NbComponentOrCustomStatus>('basic')

    // With `nbValidation`, the status it gives while the control shows errors or success.
    protected readonly resolvedStatus = computed(() => this.validation?.status() ?? this.status())

    /** `tiny`, `small`, `medium` (default), `large` or `giant`. */
    readonly sizeInput = input<NbComponentSize | undefined>(undefined, { alias: 'size' })
    /** The size in use: the input's, the app's default, or 'medium'. */
    readonly size = linkedSignal<NbComponentSize>(() => this.sizeInput() ?? this.nbDefaults().size ?? 'medium')

    /** Where the label goes: `left`, `right`, `start` or `end` (default). */
    readonly labelPosition = input<'left' | 'right' | 'start' | 'end'>('end')

    /** Emits when the user switches the toggle; not for `checked` or a form's writes. */
    readonly checkedChange = output<boolean>()

    /** Whether the toggle is checked: the `checked` input, until a user or a form changes it. */
    readonly isChecked = linkedSignal(() => this.checked())

    /** Whether the toggle is disabled: the `disabled` input, until a form changes it. */
    readonly isDisabled = linkedSignal(() => this.disabled())

    protected readonly hostClasses = computed(() => [
        this.statusService.getStatusClass(this.resolvedStatus()),
        `size-${this.size()}`,
        `toggle-label-${this.labelPosition()}`
    ])

    // The side the knob is on: the end side when checked, so `right` in LTR and `left` in RTL.
    readonly checkState = computed(() => {
        const atEnd = this.isChecked()
        return atEnd === this.layoutDirection.isLtr() ? 'right' : 'left'
    })

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

    updateValue(event: Event) {
        const nativeInput = event.target as HTMLInputElement
        this.isChecked.set(nativeInput.checked)
        this.checkedChange.emit(nativeInput.checked)
        this.onChange(nativeInput.checked)
    }

    onInputClick(event: Event) {
        event.stopPropagation()
    }
}
