import { afterNextRender, Component, computed, contentChildren, ElementRef, forwardRef, inject, Injector, input, linkedSignal, output, signal, untracked } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

import { injectNbDefaults, ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput, NbComponentShape, NbComponentSize, ɵsameControlValue as sameControlValue } from '@liquid-js/lyr-core/base'

import { NB_SWATCH_GROUP, NbSwatchGroup, NbSwatchOption } from './swatch-group-token'
import { injectNbSwatchTexts, NbSwatchComponent } from './swatch.component'

/**
 * Whether a group's `multiple` isn't given. Angular's template type checker doesn't apply a type parameter's default:
 * without a `multiple` binding it infers `M` as its whole constraint (or `any`), which no binding gives.
 */
type NbSwatchGroupMultipleUnset<M> = 0 extends 1 & M ? true : [NbBooleanInput] extends [M] ? true : false

/**
 * A swatch group's value, for swatches of value `T` and a `multiple` of `M`: the chosen swatch's value, or `null` when
 * none is chosen; with `multiple` (`true`, `''` or `'true'`), the values of all chosen swatches.
 */
export type NbSwatchGroupValue<T, M extends NbBooleanInput = NbBooleanInput> =
    NbSwatchGroupMultipleUnset<M> extends true ? T | null : M extends true | '' | 'true' ? T[] : T | null

const valuesOf = <T>(value: T | T[] | null | undefined): T[] => (Array.isArray(value) ? value : value == null ? [] : [value])

/**
 * Options shown as swatches: colours, colours side by side, e.g. a product's black and white, or pictures, e.g. a
 * fabric's, each named for assistive technologies and its tooltip. One is chosen at a time, e.g. a product's colour, or
 * any number with `multiple`, e.g. a filter's:
 *
 * ```html
 * <nb-swatch-group [(value)]="colour" aria-label="Colour">
 *   <nb-swatch value="navy" label="Navy" color="#1f2a44" />
 *   <nb-swatch value="black-white" label="Black/White" [color]="['#111111', '#ffffff']" />
 *   <nb-swatch value="tartan" label="Tartan" image="/swatches/tartan.jpg" unavailable />
 * </nb-swatch-group>
 * ```
 *
 * @stacked-example(Showcase, swatch/swatch-showcase.component)
 *
 * A swatch's `color` is any CSS colour, or several: two split corner to corner, more in equal slices around its
 * middle. Its `image` fills it with a picture, over its colours; for anything else, its content fills it. The chosen
 * swatch has a ring around it; a swatch whose option is `unavailable`, e.g. out of stock, is faded and struck through,
 * and can still be chosen, e.g. to show its pictures or to ask to be told when it's back.
 *
 * The group's value is the chosen swatch's `value`, or `null`; with `multiple`, the chosen swatches' values, in the
 * order they were chosen. Bind it both ways with `[(value)]`, or use the group in a form with `formControl`, `ngModel`
 * or `formField`: the form's value chooses the swatches, e.g. one restored from storage, and validators such as
 * `required` apply. Swatches match the value by strict equality (`===`); `compareWith` changes how, e.g. for values
 * that are objects. Show the chosen option's name beside the group, e.g. "Colour: Navy", as swatches alone can be hard
 * to tell apart.
 * @stacked-example(Form, swatch/swatch-form.component)
 * @stacked-example(Filter, swatch/swatch-filter.component)
 *
 * Tab reaches the group at its chosen swatch, or its first; arrow keys, Home and End move between the swatches, and
 * choose as they move when one is chosen at a time; Space and Enter choose. The group is a radio group, or a group of
 * toggle buttons with `multiple`, named by `aria-label`.
 *
 * Swatches are choices. A colour or picture that's only shown, e.g. beside an item's name in a list, is an image or a
 * block of your own, not a swatch, which would be announced and chosen as an option.
 *
 * `max` shows that many swatches, and the chosen ones, with a button that shows the others.
 * @stacked-example(Sizes and shapes, swatch/swatch-sizes.component)
 * @styles
 *
 * swatch-gap:
 * swatch-tiny-size:
 * swatch-small-size:
 * swatch-medium-size:
 * swatch-large-size:
 * swatch-giant-size:
 * swatch-rectangle-border-radius:
 * swatch-semi-round-border-radius:
 * swatch-round-border-radius:
 * swatch-border-width:
 * swatch-border-color:
 * swatch-ring-width:
 * swatch-ring-gap:
 * swatch-hover-ring-color:
 * swatch-selected-ring-color:
 * swatch-unavailable-opacity:
 * swatch-unavailable-line-width:
 * swatch-unavailable-line-color:
 * swatch-unavailable-halo-color:
 * swatch-disabled-opacity:
 * swatch-outline-width:
 * swatch-outline-color:
 * swatch-more-background-color:
 * swatch-more-text-color:
 * swatch-more-text-font-family:
 * swatch-more-text-font-weight:
 * swatch-tiny-more-text-font-size:
 * swatch-small-more-text-font-size:
 * swatch-medium-more-text-font-size:
 * swatch-large-more-text-font-size:
 * swatch-giant-more-text-font-size:
 */
@Component({
    selector: 'nb-swatch-group',
    template: `
    <ng-content />
    @if (hiddenCount()) {
      <button
        type="button"
        class="swatch swatch-more"
        [class]="'size-' + size() + ' shape-' + shape()"
        [attr.aria-label]="texts().more(hiddenCount())"
        [disabled]="isDisabled()"
        (click)="showAll()"
      >+{{ hiddenCount() }}</button>
    }
  `,
    styleUrls: ['./swatch-group.component.scss'],
    providers: [
        { provide: NB_SWATCH_GROUP, useExisting: NbSwatchGroupComponent },
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NbSwatchGroupComponent), multi: true }
    ],
    host: {
        '[attr.role]': "multiple() ? 'group' : 'radiogroup'",
        '[attr.aria-label]': 'ariaLabel()',
        '[attr.aria-disabled]': 'isDisabled() || null',
        '(focusout)': 'onFocusOut($event)'
    }
})
export class NbSwatchGroupComponent<T = unknown, M extends NbBooleanInput = NbBooleanInput> implements NbSwatchGroup, ControlValueAccessor {
    protected readonly nbDefaults = injectNbDefaults('swatch')
    protected readonly texts = injectNbSwatchTexts()
    protected readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef)
    protected readonly injector = inject(Injector)
    protected readonly allSwatches = contentChildren<NbSwatchComponent<T>>(NbSwatchComponent)
    // The swatches whose inputs are set, whose values it can read.
    protected readonly swatches = computed(() => this.allSwatches().filter((swatch) => swatch.ready()))

    /** The swatches' size: `tiny`, `small`, `medium`, `large` or `giant`. Unset, the app's default, or `medium`. */
    readonly sizeInput = input<NbComponentSize | undefined>(undefined, { alias: 'size' })
    /** The size in use: the input's, the app's default, or `medium`. */
    readonly size = linkedSignal<NbComponentSize>(() => this.sizeInput() ?? this.nbDefaults().size ?? 'medium')

    /** The swatches' shape: `round`, `semi-round` or `rectangle`. Unset, the app's default, or `round`. */
    readonly shapeInput = input<NbComponentShape | undefined>(undefined, { alias: 'shape' })
    /** The shape in use: the input's, the app's default, or `round`. */
    readonly shape = linkedSignal<NbComponentShape>(() => this.shapeInput() ?? this.nbDefaults().shape ?? 'round')

    /** Lets any number of swatches be chosen, and makes the value an array, e.g. for a filter. Off by default. */
    readonly multiple = input<boolean, M>(false, { transform: convertToBoolProperty })

    /** Disables every swatch; a form control's disabled state does too. */
    readonly disabled = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /** Whether the swatches are disabled: the `disabled` input, or the form's disabled state, whichever changed last. */
    readonly isDisabled = linkedSignal(() => this.disabled())

    /** How many swatches to show, besides the chosen ones, with a button that shows the others; all of them unset. */
    readonly max = input<number | undefined, number | string | undefined>(undefined, {
        transform: (value) => (value === undefined || value === '' ? undefined : Math.max(0, Math.floor(Number(value)) || 0))
    })

    /** Names the group, e.g. "Colour". */
    readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' })

    /**
     * Compares a swatch's value with a chosen one; strict equality (`===`) by default. For values that are objects, e.g.
     * restored from storage, compare them by what identifies them, e.g. `(a, b) => a.id === b.id`.
     */
    readonly compareWith = input<(swatchValue: T, chosenValue: T) => boolean>()

    /** The chosen swatch's value, or `null`; with `multiple`, the chosen swatches' values. */
    readonly value = input<T | T[] | null>()
    /** Emits the value as the user chooses. */
    readonly valueChange = output<NbSwatchGroupValue<T, M>>()

    // The chosen values: the `value` input's or the form's, whichever changed last, or the user's.
    protected readonly chosen = linkedSignal<T[]>(() => valuesOf(this.value()))
    // Whether the chosen values hold a value, by `compareWith`.
    protected readonly holds = (values: T[], value: T) => {
        const compare = this.compareWith()
        return compare ? values.some((chosen) => compare(value, chosen)) : values.includes(value)
    }

    // Whether the button that shows the others was used.
    protected readonly expanded = signal(false)

    // The swatches past `max` that aren't chosen.
    protected readonly hidden = computed(() => {
        const max = this.max()
        if (max === undefined || this.expanded()) {
            return new Set<NbSwatchComponent<T>>()
        }
        const chosen = this.chosen()
        return new Set(this.swatches().filter((swatch, index) => index >= max && !this.holds(chosen, swatch.value())))
    })
    protected readonly hiddenCount = computed(() => this.hidden().size)

    // The swatches the keyboard moves between.
    protected readonly reachable = computed(() => this.swatches().filter((swatch) => !swatch.isDisabled() && !this.hidden().has(swatch)))
    protected readonly tabStop = computed(() => {
        const reachable = this.reachable()
        return reachable.find((swatch) => this.holds(this.chosen(), swatch.value())) ?? reachable[0]
    })

    protected onChange: (value: NbSwatchGroupValue<T, M>) => void = () => {}
    protected onTouched: () => void = () => {}

    isSelected(swatch: NbSwatchOption): boolean {
        return swatch.ready() && this.holds(this.chosen(), swatch.value() as T)
    }

    isShown(swatch: NbSwatchOption): boolean {
        return !this.hidden().has(swatch as NbSwatchComponent<T>)
    }

    isTabStop(swatch: NbSwatchOption): boolean {
        return this.tabStop() === swatch
    }

    /** Chooses a swatch, or, with `multiple`, chooses or unchooses it. */
    choose(swatch: NbSwatchOption) {
        const value = swatch.value() as T
        if (swatch.isDisabled()) {
            return
        }
        const chosen = this.chosen()
        const compare = this.compareWith() ?? ((a: T, b: T) => a === b)
        const next = this.multiple() ? (this.holds(chosen, value) ? chosen.filter((item) => !compare(value, item)) : [...chosen, value]) : [value]
        if (sameControlValue(next, chosen)) {
            return
        }
        this.chosen.set(next)
        const result = (this.multiple() ? next : (next[0] ?? null)) as NbSwatchGroupValue<T, M>
        this.valueChange.emit(result)
        this.onChange(result)
    }

    /** @internal */
    onKeydown(event: KeyboardEvent, swatch: NbSwatchOption) {
        const reachable = this.reachable()
        const index = reachable.indexOf(swatch as NbSwatchComponent<T>)
        const rtl = getComputedStyle(this.hostElement.nativeElement).direction === 'rtl'
        const next = {
            ArrowRight: index + (rtl ? -1 : 1),
            ArrowLeft: index + (rtl ? 1 : -1),
            ArrowDown: index + 1,
            ArrowUp: index - 1,
            Home: 0,
            End: reachable.length - 1
        }[event.key]
        if (next === undefined || !reachable.length) {
            return
        }
        event.preventDefault()
        const target = reachable[(next + reachable.length) % reachable.length]
        target.focus()
        // One at a time, as a radio group, moving chooses.
        if (!this.multiple()) {
            this.choose(target)
        }
    }

    /** Shows the swatches past `max`, and moves the focus to the first of them. */
    showAll() {
        const first = [...this.hidden()][0]
        this.expanded.set(true)
        // Once it shows.
        afterNextRender(() => first?.focus(), { injector: this.injector })
    }

    /** @internal */
    onFocusOut(event: FocusEvent) {
        if (!this.hostElement.nativeElement.contains(event.relatedTarget as Node | null)) {
            this.onTouched()
        }
    }

    registerOnChange(fn: (value: NbSwatchGroupValue<T, M>) => void) {
        this.onChange = fn
    }

    registerOnTouched(fn: () => void) {
        this.onTouched = fn
    }

    // Untracked, as forms write values from wherever the app sets them.
    writeValue(value: NbSwatchGroupValue<T, M> | undefined) {
        untracked(() => {
            const next = valuesOf(value as T | T[] | null | undefined)
            if (!sameControlValue(this.chosen(), next)) {
                this.chosen.set(next)
            }
        })
    }

    setDisabledState(isDisabled: boolean) {
        this.isDisabled.set(isDisabled)
    }
}
