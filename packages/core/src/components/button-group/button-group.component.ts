import {
    Component,
    computed,
    contentChildren,
    DestroyRef,
    effect,
    ElementRef,
    forwardRef,
    inject,
    input,
    linkedSignal,
    output,
    PLATFORM_ID,
    untracked
} from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { fromEvent, merge } from 'rxjs'
import { filter, switchMap } from 'rxjs/operators'
import { NB_DOCUMENT, injectNbDefaults, NbStatusService, ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput, NbComponentSize, NbComponentShape, NbComponentOrCustomStatus, type NbButtonToggleAppearance, ɵsameControlValue as sameControlValue } from '@liquid-js/lyr-core/base'
import { NbButtonProperties } from '../button/base-button'
import { NbButtonToggleDirective } from './button-toggle.directive'

import { NB_BUTTON_GROUP } from './button-group-injection-tokens'

// The value a group starts with, until it or the app sets one.
const NO_VALUE = Symbol('no value')

/**
 * Whether a group's `multiple` isn't given. Angular's template type checker doesn't apply a type parameter's default:
 * without a `multiple` binding it infers `M` as its whole constraint (or `any`), which no binding gives.
 */
type NbButtonGroupMultipleUnset<M> = 0 extends 1 & M ? true : [NbBooleanInput] extends [M] ? true : false

/**
 * A button group's value, for toggles of value `T` and a `multiple` of `M`, as a select's: the pressed toggle's value,
 * or `null` when none is pressed; with `multiple` (`true`, `''` or `'true'`), the values of all pressed toggles.
 */
export type NbButtonGroupValue<T, M extends NbBooleanInput = NbBooleanInput> =
    NbButtonGroupMultipleUnset<M> extends true ? T | null : M extends true | '' | 'true' ? T[] : T | null

// The values a group's value holds.
function valuesOf<T>(value: T | T[] | null | undefined): T[] {
    return Array.isArray(value) ? value : value == null ? [] : [value]
}

/**
 * Groups buttons into one strip, and sets their appearance, size, shape, status and disabled state as a group.
 *
 * @stacked-example(Button Group Showcase, button-group/button-group-showcase.component)
 *
 * ### Installation
 *
 * Import `NbButtonGroupComponent`, `NbButtonToggleDirective` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbButtonGroupComponent, NbButtonToggleDirective],
 * })
 * export class PageComponent { }
 * ```
 *
 * With NgModules:
 *
 * Import `NbButtonGroupModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbButtonGroupModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 *
 * ### Usage
 *
 * A group holds `[nbButton]`s or `[nbButtonToggle]`s.
 * @stacked-example(Button and Button Toggle Groups, button-group/button-and-button-toggle-groups.component)
 *
 * By default only one toggle in a group is pressed at a time, as in a radio group, and clicking it again keeps it
 * pressed. With `multiple` on the group any number of toggles stays pressed.
 * @stacked-example(Button Group Multiple, button-group/button-group-multiple.component)
 *
 * The group's value is the value of the pressed toggle, given to a toggle with its `value` input, or `null` when none
 * is pressed; with `multiple`, it's the values of all pressed toggles, as a select's. Listen to `(valueChange)`, bind
 * `value` both ways, e.g. `<nb-button-group [(value)]="track">`, to press toggles from the app too, or use the group
 * in a form, as a radio group, with `formControl`, `ngModel` or `formField`; the values have the type of what it's
 * bound to.
 * @stacked-example(Button Group Value Change, button-group/button-group-value-change.component)
 *
 * `disabled` on the group, or its form control, disables all its buttons.
 * @stacked-example(Button Group Disabled, button-group/button-group-disabled.component)
 *
 * The group's `appearance`, `status`, `size` and `shape` replace those of its buttons.
 *
 * Button group appearances:
 * @stacked-example(Button Group Appearances, button-group/button-group-appearances.component)
 *
 * Button group statuses:
 * @stacked-example(Button Group Statuses, button-group/button-group-statuses.component)
 *
 * Button group sizes:
 * @stacked-example(Button Group Sizes, button-group/button-group-sizes.component)
 *
 * Buttons group shapes:
 * @additional-example(Button Group Shapes, button-group/button-group-shapes.component)
 * @styles
 *
 * button-group-filled-button-basic-text-color:
 * button-group-filled-button-primary-text-color:
 * button-group-filled-button-success-text-color:
 * button-group-filled-button-info-text-color:
 * button-group-filled-button-warning-text-color:
 * button-group-filled-button-danger-text-color:
 * button-group-filled-button-control-text-color:
 * button-group-filled-basic-divider-color:
 * button-group-filled-primary-divider-color:
 * button-group-filled-success-divider-color:
 * button-group-filled-info-divider-color:
 * button-group-filled-warning-divider-color:
 * button-group-filled-danger-divider-color:
 * button-group-filled-control-divider-color:
 * button-group-ghost-divider-color:
 * button-group-separate-gap:
 **/
@Component({
    selector: 'nb-button-group',
    template: ' <ng-content /> ',
    providers: [
        { provide: NB_BUTTON_GROUP, useExisting: NbButtonGroupComponent },
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NbButtonGroupComponent), multi: true }
    ],
    host: {
        'role': 'group',
        '[class]': 'customStatusClass()',
        '[class.separate]': 'separate()'
    }
})
export class NbButtonGroupComponent<T = unknown, M extends NbBooleanInput = NbBooleanInput>
implements ControlValueAccessor {
    // The app's defaults for this type, which the inputs below start from.
    protected readonly nbDefaults = injectNbDefaults('buttonGroup')

    protected readonly statusService = inject(NbStatusService)

    // The toggles in a group carry values of the group's type.
    protected readonly toggles = contentChildren<NbButtonToggleDirective<T>>(NbButtonToggleDirective)

    /**
     * Size of the buttons: `tiny`, `small`, `medium`, `large` or `giant`. Unset, it follows the app's default, or
     * `medium`.
     */
    readonly sizeInput = input<NbComponentSize | undefined>(undefined, { alias: 'size' })
    /** The size in use: the input's, the app's default, or 'medium'. */
    readonly size = linkedSignal<NbComponentSize>(() => this.sizeInput() ?? this.nbDefaults().size ?? 'medium')

    /**
     * Status of the buttons: `basic` (default), `primary`, `info`, `success`, `warning`, `danger`, `control` or a
     * custom one.
     */
    readonly status = input<NbComponentOrCustomStatus>('basic')

    /**
     * Shape of the buttons: `rectangle`, `semi-round` or `round`. Unset, it follows the app's default, or `rectangle`.
     */
    readonly shapeInput = input<NbComponentShape | undefined>(undefined, { alias: 'shape' })
    /** The shape in use: the input's, the app's default, or 'rectangle'. */
    readonly shape = linkedSignal<NbComponentShape>(() => this.shapeInput() ?? this.nbDefaults().shape ?? 'rectangle')

    /**
     * Appearance of the buttons: `filled`, `outline` or `ghost`. Unset, it follows the app's default, or `filled`.
     */
    readonly appearanceInput = input<NbButtonToggleAppearance | undefined>(undefined, { alias: 'appearance' })
    /** The appearance in use: the input's, the app's default, or 'filled'. */
    readonly appearance = linkedSignal<NbButtonToggleAppearance>(() => this.appearanceInput() ?? this.nbDefaults().appearance ?? 'filled')

    /**
     * Disables the buttons in the group; a form control's disabled state does too.
     */
    readonly disabled = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /** Whether the buttons are disabled: the `disabled` input, or the form's disabled state, whichever changed last. */
    readonly isDisabled = linkedSignal(() => this.disabled())

    /**
     * Keeps the buttons apart, each with its own corners and border, wrapping onto more rows as they need, e.g. for
     * times to pick from; by default they're joined in one strip.
     */
    readonly separate = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * Lets any number of toggles stay pressed, and makes the value an array. Off by default: the toggle pressed last
     * stays pressed, and clicking it again doesn't unpress it.
     */
    readonly multiple = input<boolean, M>(false, { transform: convertToBoolProperty })

    /**
     * Sets the `filled` appearance, over `appearance`.
     */
    readonly filled = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * Sets the `outline` appearance, over `appearance` and `filled`.
     */
    readonly outline = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * Sets the `ghost` appearance, over `appearance`, `filled` and `outline`.
     */
    readonly ghost = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * The value of the pressed toggle, or `null`; with `multiple`, the values of the pressed toggles. `valueChange`
     * emits as they're pressed; set it, or bind it both ways with `[(value)]`, to press the toggles with those values.
     */
    readonly value = input<T | T[] | null>()
    /** Emits the value after the change detection that pressed or unpressed a toggle, and only when it differs. */
    readonly valueChange = output<NbButtonGroupValue<T, M>>()

    // The value: the `value` input or the form's, whichever changed last, or the pressed toggles'.
    protected readonly valueState = linkedSignal<T | T[] | null | undefined | typeof NO_VALUE>(() => {
        const value = this.value()
        return value === undefined ? NO_VALUE : value
    })

    /**
     * The properties the buttons in the group render with.
     */
    readonly buttonProperties = computed<NbButtonProperties>(() => ({
        appearance: (this.ghost() && 'ghost') || (this.outline() && 'outline') || (this.filled() && 'filled') ||
            this.appearance(),
        size: this.size(),
        shape: this.shape(),
        status: this.status(),
        disabled: this.isDisabled()
    }))

    protected readonly customStatusClass = computed(() =>
        this.statusService.isCustomStatus(this.status()) ? [this.statusService.getStatusClass(this.status())] : []
    )

    // The value the group set itself, or the default it starts with; a value other than this came from the app.
    protected ownValue: T | T[] | null | typeof NO_VALUE = NO_VALUE

    protected readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef)
    protected readonly document = inject(NB_DOCUMENT)
    protected onChange: (value: NbButtonGroupValue<T, M>) => void = () => {}
    protected onTouched: () => void = () => {}

    constructor() {
        if (isPlatformBrowser(inject(PLATFORM_ID))) {
            this.subscribeOnBlur()
        }

        // The app's value presses the toggles with its values, and only those.
        effect(() => {
            const state = this.valueState()
            if (state === this.ownValue || state === NO_VALUE) {
                return
            }
            const value = valuesOf<T>(state)
            const toggles = this.toggles()
            untracked(() =>
                toggles.forEach((toggle) => {
                    const toggleValue = toggle.value()
                    toggle.setPressed(toggleValue !== undefined && value.includes(toggleValue))
                })
            )
        })

        let pressedBefore = new Set<NbButtonToggleDirective<T>>()
        effect(() => {
            let pressed = this.toggles().filter((toggle) => toggle.isPressed())
            // Without `multiple`, the toggle pressed last stays pressed.
            if (!this.multiple() && pressed.length > 1) {
                const kept = pressed.filter((toggle) => !pressedBefore.has(toggle)).pop() ?? pressed[0]
                untracked(() => pressed.filter((toggle) => toggle !== kept).forEach((toggle) => toggle.setPressed(false)))
                pressed = [kept]
            }
            pressedBefore = new Set(pressed)

            const value = pressed.map((toggle) => toggle.value()).filter((item): item is T => typeof item !== 'undefined')
            // Emit after change detection, as the group did before, so handlers can update what's already rendered.
            queueMicrotask(() => this.emitValue(value))
        })
    }

    registerOnChange(fn: (value: NbButtonGroupValue<T, M>) => void) {
        this.onChange = fn
    }

    registerOnTouched(fn: () => void) {
        this.onTouched = fn
    }

    // Untracked, as forms write values from wherever the app sets them, e.g. an effect that mustn't come to depend
    // on the control.
    writeValue(value: NbButtonGroupValue<T, M> | undefined) {
        untracked(() => {
            const next = value ?? null
            if (!sameControlValue(this.valueState(), next)) {
                this.valueState.set(next)
            }
        })
    }

    setDisabledState(isDisabled: boolean) {
        this.isDisabled.set(isDisabled)
    }

    protected emitValue(values: T[]) {
        const state = this.valueState()
        const last = state === NO_VALUE ? [] : valuesOf<T>(state)
        if (values.length === last.length && values.every((item, index) => item === last[index])) {
            return
        }
        const value = (this.multiple() ? values : (values[0] ?? null)) as NbButtonGroupValue<T, M>
        this.ownValue = value
        this.valueState.set(value)
        this.valueChange.emit(value)
        this.onChange(value)
    }

    // Leaving the group, by focus or a click elsewhere, touches its control, as leaving a radio group does.
    protected subscribeOnBlur() {
        const hostElement = this.hostElement.nativeElement
        fromEvent<Event>(hostElement, 'focusin')
            .pipe(
                filter((event) => hostElement.contains(event.target as Node)),
                switchMap(() => merge(fromEvent<Event>(this.document, 'focusin'), fromEvent<Event>(this.document, 'click'))),
                filter((event) => !hostElement.contains(event.target as Node)),
                takeUntilDestroyed(inject(DestroyRef))
            )
            .subscribe(() => this.onTouched())
    }
}
