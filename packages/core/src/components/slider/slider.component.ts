import {
    Component,
    computed,
    effect,
    ElementRef,
    forwardRef,
    inject,
    input,
    linkedSignal,
    LOCALE_ID,
    model,
    signal,
    untracked,
    viewChild,
    viewChildren
} from '@angular/core'
import {
    AbstractControl,
    ControlValueAccessor,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidationErrors,
    Validator
} from '@angular/forms'

import { NbStatusService, injectNbTexts, NbLocalize, NbComponentOrCustomStatus, injectNbDefaults, NbComponentSize, ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput, ɵsameControlValue as sameControlValue } from '@liquid-js/lyr-core/base'
import { NbValidationDirective, injectNbValidationMessage, ɵnbValidationError as nbValidationError } from '@liquid-js/lyr-core/validation'
import { NbSliderScale, NbSliderTransform } from './slider-scale'

/** @internal */
declare const $localize: NbLocalize

/** A range slider's value. */
export interface NbSliderRange {
    start: number | null
    end: number | null
}

/** A slider's value: a number, or a range's start and end. */
export type NbSliderValue = number | NbSliderRange | null

/** @internal */
function injectNbSliderTexts() {
    return injectNbTexts('slider', () => ({
        start: $localize`:@@nb.slider.start:Start`,
        end: $localize`:@@nb.slider.end:End`
    }))
}

/** A number from an input, or `undefined` for none, an empty attribute or something that isn't a number. */
function toLimit(value?: number | string | null): number | undefined {
    if (value === null || value === undefined || value === '') {
        return undefined
    }
    const number = Number(value)
    return Number.isFinite(number) ? number : undefined
}

const isRange = (value: unknown): value is NbSliderRange => !!value && typeof value === 'object'

let lastSliderId = 0

/**
 * A slider picks a number, or a range with `range`, by dragging a thumb along a track, or with the keyboard.
 *
 * ```html
 * <nb-slider [min]="0" [max]="100" [step]="5" formControlName="volume" />
 * <nb-slider range [min]="0" [max]="500" formControlName="price" />
 * ```
 *
 * @stacked-example(Showcase, slider/slider-showcase.component)
 *
 * A range's value is `{ start, end }`; its thumbs can pass each other, and swap. `step` snaps values to steps from
 * `min`, and `ticks` marks them on the track (or every n-th one, `[ticks]="5"`). `min`, `max` and the `center` show
 * as labels under the track, and the value shows above the thumb while it moves or has the keyboard focus;
 * `formatValue` formats both.
 *
 * Leave out `min` or `max` and that end is open: the track reaches a little past the values on it, so moving a thumb
 * towards the open end takes the end along, and any value can be reached while small values get most of the track,
 * e.g. a licence for any number of seats from 1. `center` is where the fill starts and the value without one, e.g. 0
 * for an adjustment either way.
 * @stacked-example(Open ends and center, slider/slider-open.component)
 *
 * It comes in the controls' sizes, `tiny` to `giant`, which scale its thumb and track, and takes the app's size for
 * controls, or its own `slider` default, as the other controls do; its status is `primary` by default, as a checked
 * checkbox shows.
 * @stacked-example(Sizes, slider/slider-sizes.component)
 *
 * `transform` draws the track's positions differently: `sqrt` and `log` give the low end more room, e.g. for prices
 * or file sizes, or give it any increasing function on 0..1. The pointer picks the step it has reached. A value given
 * to the slider outside `min` or `max` opens that end, so it shows where it is, along with its error.
 * @stacked-example(Transforms, slider/slider-transform.component)
 *
 * `vertical` stands the slider up; it's as tall as `slider-vertical-height`, or its own height.
 *
 * Arrow keys move a thumb a step (or a hundredth of the track without one), Page Up and Page Down ten, and Home and
 * End to the limits, or ten steps on an open end. A thumb is a `slider`; a range's thumbs are named "Start" and
 * "End" after the slider's label, e.g. from `nbLabel` or `aria-label`. A value outside `min` and `max` has the `min`
 * or `max` error, and a range whose start is after its end `nbSliderOrder`.
 * @styles
 *
 * slider-cursor:
 * slider-disabled-cursor:
 * slider-track-height:
 * slider-track-border-radius:
 * slider-track-background-color:
 * slider-thumb-size:
 * slider-tiny-thumb-size:
 * slider-tiny-track-height:
 * slider-small-thumb-size:
 * slider-small-track-height:
 * slider-medium-thumb-size:
 * slider-medium-track-height:
 * slider-large-thumb-size:
 * slider-large-track-height:
 * slider-giant-thumb-size:
 * slider-giant-track-height:
 * slider-thumb-border-width:
 * slider-thumb-border-color:
 * slider-thumb-shadow:
 * slider-outline-width:
 * slider-outline-color:
 * slider-basic-color:
 * slider-basic-hover-color:
 * slider-basic-active-color:
 * slider-primary-color:
 * slider-primary-hover-color:
 * slider-primary-active-color:
 * slider-success-color:
 * slider-success-hover-color:
 * slider-success-active-color:
 * slider-info-color:
 * slider-info-hover-color:
 * slider-info-active-color:
 * slider-warning-color:
 * slider-warning-hover-color:
 * slider-warning-active-color:
 * slider-danger-color:
 * slider-danger-hover-color:
 * slider-danger-active-color:
 * slider-control-color:
 * slider-control-hover-color:
 * slider-control-active-color:
 * slider-disabled-color:
 * slider-disabled-track-background-color:
 * slider-tick-size:
 * slider-tick-color:
 * slider-tick-active-color:
 * slider-label-text-color:
 * slider-control-label-text-color:
 * slider-label-text-font-family:
 * slider-label-text-font-size:
 * slider-label-text-font-weight:
 * slider-label-text-line-height:
 * slider-label-margin:
 * slider-value-background-color:
 * slider-value-text-color:
 * slider-value-text-font-family:
 * slider-value-text-font-size:
 * slider-value-text-font-weight:
 * slider-value-text-line-height:
 * slider-value-padding:
 * slider-value-border-radius:
 * slider-value-margin:
 * slider-vertical-height:
 */
@Component({
    selector: 'nb-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NbSliderComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => NbSliderComponent), multi: true }
    ],
    host: {
        '[class]': 'hostClasses()',
        '(pointerdown)': 'onPointerDown($event)',
        '(pointermove)': 'onPointerMove($event)',
        '(pointerup)': 'onPointerUp()',
        '(pointercancel)': 'onPointerUp()'
    }
})
export class NbSliderComponent implements ControlValueAccessor, Validator {
    protected readonly statusService = inject(NbStatusService)
    protected readonly texts = injectNbSliderTexts()
    protected readonly message = injectNbValidationMessage()
    protected readonly numberFormat = new Intl.NumberFormat(inject(LOCALE_ID), { maximumFractionDigits: 2 })
    protected readonly validation = inject(NbValidationDirective, { self: true, optional: true })
    protected readonly id = `nb-slider-${lastSliderId++}`

    /** The smallest value; without it the start is open. */
    readonly min = input<number | undefined, number | string | null | undefined>(undefined, { transform: toLimit })

    /** The largest value; without it the end is open. */
    readonly max = input<number | undefined, number | string | null | undefined>(undefined, { transform: toLimit })

    /** The steps values snap to, from `min`; without it any value. */
    readonly step = input<number | undefined, number | string | null | undefined>(undefined, { transform: toLimit })

    /** Where the fill starts and the value without one; 0 when neither end has a limit. */
    readonly center = input<number | undefined, number | string | null | undefined>(undefined, { transform: toLimit })

    /** Whether it picks a range, `{ start, end }`, with two thumbs. */
    readonly range = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /** Whether the slider stands up, with `min` at the bottom. */
    readonly vertical = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /** Marks each step on a track with both limits, or every n-th one with a number. */
    readonly ticks = input<number, boolean | number | string | null | undefined>(0, {
        transform: (value) => (value === '' || value === true || value === 'true' ? 1 : Math.floor(Number(value)) || 0)
    })

    /** Whether `min`, `max` and the center show as labels under the track. */
    readonly labels = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty })

    /** Whether the value shows above the thumb while it moves or has the keyboard focus. */
    readonly showValue = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty })

    /**
     * How positions along the track are drawn: `linear` (default), or `sqrt` and `log` to give the low end more room, or
     * a function that maps 0..1 to 0..1 and increases.
     */
    readonly transform = input<NbSliderTransform>('linear')

    /** Formats values for the labels, the value above the thumb and assistive technologies. */
    readonly formatValue = input<((value: number) => string) | undefined>(undefined)

    /** Slider status: `basic`, `primary` (default), `success`, `info`, `warning`, `danger` or `control`. */
    readonly status = input<NbComponentOrCustomStatus>('primary')

    // The app's defaults for this type, which the size starts from.
    protected readonly nbDefaults = injectNbDefaults('slider')
    /** Slider size: `tiny`, `small`, `medium` (default), `large` or `giant`, which scales its thumb and track. */
    readonly sizeInput = input<NbComponentSize | undefined>(undefined, { alias: 'size' })
    /** The size in use: the input's, the app's default, or 'medium'. */
    readonly size = linkedSignal<NbComponentSize>(() => this.sizeInput() ?? this.nbDefaults().size ?? 'medium')

    /** Whether the slider is disabled. */
    readonly disabled = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /** Names the slider, without a visible label. */
    readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' })

    /** The ids of what names the slider. */
    readonly ariaLabelledBy = input<string | undefined>(undefined, { alias: 'aria-labelledby' })

    /** The value: a number, or `{ start, end }` with `range`; `null` for none. */
    readonly value = model<NbSliderValue>(null)

    /** Whether it's disabled: the `disabled` input, or the form's disabled state, whichever changed last. */
    readonly isDisabled = linkedSignal(() => this.disabled())

    /** The thumb being dragged. */
    protected readonly dragging = signal<number | undefined>(undefined)

    protected readonly track = viewChild.required<ElementRef<HTMLElement>>('track')
    protected readonly thumbs = viewChildren<ElementRef<HTMLElement>>('thumb')

    /** The slider's limits, which input keeps to. */
    protected readonly limits = computed(
        () => new NbSliderScale(this.min(), this.max(), this.center(), this.step(), this.transform())
    )

    /** The track as drawn: with an end open while a value given to the slider lies past it, so it shows. */
    protected readonly scale = computed(() => {
        const limits = this.limits()
        const value = this.value()
        const given = (isRange(value) ? [value.start, value.end] : [value]).filter(
            (item): item is number => typeof item === 'number'
        )
        const { min, max } = limits
        const below = min !== undefined && given.some((item) => item < min)
        const above = max !== undefined && given.some((item) => item > max)
        if (!below && !above) {
            return limits
        }
        return new NbSliderScale(
            below ? undefined : min,
            above ? undefined : max,
            this.center(),
            this.step(),
            this.transform()
        )
    })

    /** The values the thumbs show: within the limits, in order, with a default for none. */
    protected readonly values = computed(() => {
        const scale = this.scale()
        const value = this.value()
        if (!this.range()) {
            return [scale.clamp(typeof value === 'number' ? value : scale.defaultValue())]
        }
        const given = isRange(value) ? value : { start: null, end: null }
        const start = scale.clamp(given.start ?? scale.min ?? scale.defaultValue())
        const end = scale.clamp(given.end ?? scale.max ?? start + scale.extension * 2)
        return [Math.min(start, end), Math.max(start, end)]
    })

    protected readonly positions = computed(() => {
        const values = this.values()
        return values.map((value) => this.scale().toRelative(value, values))
    })

    /** Where the fill starts and ends: between a range's thumbs, or from the center or the start to the thumb. */
    protected readonly fill = computed(() => {
        const positions = this.positions()
        if (positions.length > 1) {
            return { start: positions[0], end: positions[1] }
        }
        const center = this.scale().center
        const from = center === undefined ? 0 : this.scale().toRelative(center, this.values())
        return { start: Math.min(from, positions[0]), end: Math.max(from, positions[0]) }
    })

    protected readonly tickMarks = computed(() => {
        const scale = this.scale()
        const fill = this.fill()
        return scale.ticks(this.ticks()).map((value) => {
            const position = scale.toRelative(value, this.values())
            return { position, active: position >= fill.start - 1e-9 && position <= fill.end + 1e-9 }
        })
    })

    protected readonly labelMarks = computed(() => {
        if (!this.labels()) {
            return []
        }
        const scale = this.scale()
        const marks = new Array<{ text: string, position: number, align: 'start' | 'center' | 'end' }>()
        if (scale.min !== undefined) {
            marks.push({ text: this.format(scale.min), position: 0, align: 'start' })
        }
        if (scale.max !== undefined) {
            marks.push({ text: this.format(scale.max), position: 1, align: 'end' })
        }
        const center = scale.center
        if (center !== undefined && center !== scale.min && center !== scale.max) {
            const position = scale.toRelative(center, this.values())
            // Not where it would run into the end labels.
            if ((scale.min === undefined || position > 0.1) && (scale.max === undefined || position < 0.9)) {
                marks.push({ text: this.format(center), position, align: 'center' })
            }
        }
        return marks
    })

    /** For each thumb: its ARIA limits and name. */
    protected readonly thumbStates = computed(() => {
        const values = this.values()
        const scale = this.limits()
        const [start, end] = this.scale().ends(values)
        const range = this.range()
        const names = [this.texts().start, this.texts().end]
        const labelledBy = [this.ariaLabelledBy(), this.validation?.labelledBy()].filter(Boolean).join(' ')
        return values.map((value, index) => ({
            value,
            min: scale.min ?? start,
            max: scale.max ?? end,
            text: this.format(value),
            labelledBy: [labelledBy, range ? `${this.id}-thumb-${index}` : ''].filter(Boolean).join(' ') || null,
            label: labelledBy ? null : range ? [this.ariaLabel(), names[index]].filter(Boolean).join(' ') : this.ariaLabel(),
            name: names[index]
        }))
    })

    protected readonly hostClasses = computed(() => [
        this.statusService.getStatusClass(this.validation?.status() ?? this.status()),
        this.vertical() ? 'vertical' : 'horizontal',
        `size-${this.size()}`,
        ...(this.isDisabled() ? ['disabled'] : []),
        ...(this.dragging() !== undefined ? ['dragging'] : []),
        ...(this.labelMarks().length ? ['with-labels'] : [])
    ])

    protected onChange: (value: NbSliderValue) => void = () => {}
    protected onTouched: () => void = () => {}
    protected onValidatorChange: () => void = () => {}

    constructor() {
    // The thumbs are the focusable elements: they get the validation's ARIA, not the host.
        this.validation?.delegateAria()
        // Other limits can make the value valid or not.
        effect(() => {
            this.limits()
            this.range()
            untracked(() => this.onValidatorChange())
        })
    }

    protected format(value: number) {
        return this.formatValue()?.(value) ?? this.numberFormat.format(value)
    }

    // Untracked, as forms write values from wherever the app sets them, e.g. an effect that mustn't come to depend
    // on the control.
    writeValue(value?: NbSliderValue) {
        untracked(() => {
            const next = value ?? null
            if (!sameControlValue(this.value(), next)) {
                this.value.set(next)
            }
        })
    }

    registerOnChange(fn: (value: NbSliderValue) => void) {
        this.onChange = fn
    }

    registerOnTouched(fn: () => void) {
        this.onTouched = fn
    }

    registerOnValidatorChange(fn: () => void) {
        this.onValidatorChange = fn
    }

    setDisabledState(disabled: boolean) {
        this.isDisabled.set(disabled)
    }

    /**
     * A value below `min` (`min`) or above `max` (`max`), and a range whose start is after its end (`nbSliderOrder`).
     */
    validate(control: AbstractControl): ValidationErrors | null {
        const value = control.value as NbSliderValue
        const values = isRange(value) ? [value.start, value.end] : [value]
        const numbers = values.filter((item): item is number => typeof item === 'number')
        const { min, max } = this.limits()
        const below = numbers.find((item) => min !== undefined && item < min)
        if (below !== undefined) {
            return { min: nbValidationError(this.message, 'min', { min, actual: below }) }
        }
        const above = numbers.find((item) => max !== undefined && item > max)
        if (above !== undefined) {
            return { max: nbValidationError(this.message, 'max', { max, actual: above }) }
        }
        if (isRange(value) && value.start !== null && value.end !== null && value.start > value.end) {
            return { nbSliderOrder: nbValidationError(this.message, 'nbSliderOrder', { start: value.start, end: value.end }) }
        }
        return null
    }

    /**
     * Sets the value of the thumb at `index`, snapped, within the limits. A range's thumb can pass the other one: they
     * swap, so the start stays before the end, and the drag and the focus go on with the thumb that moves.
     */
    protected setThumb(index: number, value: number, down = false) {
        const values = [...this.values()]
        const next = this.limits().snap(value, down)
        if (next === values[index] && this.value() !== null) {
            return
        }
        values[index] = next
        if (values.length > 1 && values[0] > values[1]) {
            values.reverse()
            const other = 1 - index
            if (this.dragging() === index) {
                this.dragging.set(other)
            }
            const thumbs = this.thumbs()
            if (thumbs[index]?.nativeElement === document.activeElement) {
                thumbs[other]?.nativeElement.focus({ preventScroll: true })
            }
        }
        const result: NbSliderValue = this.range() ? { start: values[0], end: values[1] } : values[0]
        this.value.set(result)
        this.onChange(result)
    }

    /** Where the pointer is along the track, from 0 at its start to 1 at its end. */
    protected pointerPosition(event: PointerEvent) {
        const track = this.track().nativeElement
        const rect = track.getBoundingClientRect()
        if (this.vertical()) {
            return rect.height ? (rect.bottom - event.clientY) / rect.height : 0
        }
        const position = rect.width ? (event.clientX - rect.left) / rect.width : 0
        return getComputedStyle(track).direction === 'rtl' ? 1 - position : position
    }

    /** @internal */
    onPointerDown(event: PointerEvent) {
        if (this.isDisabled() || event.button !== 0) {
            return
        }
        const values = this.values()
        const position = Math.min(1, Math.max(0, this.pointerPosition(event)))
        // The nearest thumb; from a range's shared value, the one the pointer is past.
        let index = 0
        if (values.length > 1) {
            const positions = this.positions()
            const distances = positions.map((thumb) => Math.abs(thumb - position))
            index = distances[1] < distances[0] || (distances[1] === distances[0] && position > positions[1]) ? 1 : 0
        }
        event.preventDefault()
        try {
            // The moves go on arriving outside the slider.
            (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
        } catch {
            // A pointer the browser doesn't track, e.g. a synthetic one.
        }
        this.dragging.set(index)
        this.thumbs()[index]?.nativeElement.focus({ preventScroll: true })
        this.setThumb(index, this.limits().fromRelative(position, values, index), true)
    }

    /** @internal */
    onPointerMove(event: PointerEvent) {
        const index = this.dragging()
        if (index === undefined) {
            return
        }
        this.setThumb(index, this.limits().fromRelative(this.pointerPosition(event), this.values(), index), true)
    }

    /** @internal */
    onPointerUp() {
        if (this.dragging() !== undefined) {
            this.dragging.set(undefined)
            this.onTouched()
        }
    }

    /** @internal */
    onKeydown(event: KeyboardEvent, index: number) {
        if (this.isDisabled()) {
            return
        }
        const scale = this.limits()
        const value = this.values()[index]
        const [start, end] = this.scale().ends(this.values())
        const step = scale.step || (end - start) / 100
        const rtl = !this.vertical() && getComputedStyle(event.currentTarget as HTMLElement).direction === 'rtl'
        const keys: Record<string, number | undefined> = {
            ArrowUp: value + step,
            ArrowDown: value - step,
            ArrowRight: value + (rtl ? -step : step),
            ArrowLeft: value + (rtl ? step : -step),
            PageUp: value + 10 * step,
            PageDown: value - 10 * step,
            Home: scale.min ?? value - 10 * step,
            End: scale.max ?? value + 10 * step
        }
        const next = keys[event.key]
        if (next === undefined) {
            return
        }
        event.preventDefault()
        this.setThumb(index, next)
    }

    /** @internal */
    onBlur() {
        if (this.dragging() === undefined) {
            this.onTouched()
        }
    }
}
