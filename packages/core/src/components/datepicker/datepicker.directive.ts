import {
    ChangeDetectorRef,
    DestroyRef,
    Directive,
    effect,
    ElementRef,
    forwardRef,
    inject,
    InjectionToken,
    input,
    OnChanges,
    signal,
    SimpleChanges,
    Type,
    untracked
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import {
    ControlValueAccessor,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidationErrors,
    Validator
} from '@angular/forms'
import { fromEvent, merge, Observable, Subscription } from 'rxjs'
import { distinctUntilChanged, filter, map, pairwise, startWith, take, tap } from 'rxjs/operators'

import { NB_DOCUMENT } from '@liquid-js/lyr-core/base'
import { NbDateService } from '@liquid-js/lyr-core/calendar-kit'
import { injectNbValidationMessage, ɵnbValidationError as nbValidationError } from '@liquid-js/lyr-core/validation'

function throwNoDatepickerAdapter(): never {
    throw new Error('No datepickerAdapter provided for picker')
}

/**
 * Reads, writes and checks the input's text for one kind of picker, e.g. dates or ranges. The directive picks the
 * adapter whose `picker` the input's picker is an instance of.
 */
export abstract class NbDatepickerAdapter<D> {
    /**
     * The picker component the adapter is for.
     */
    abstract picker: Type<unknown>

    /**
     * Whether `min` and `max` are compared with the time of day. Date-only pickers compare whole days, so a `min`
     * of today at 10:00 still allows today.
     */
    readonly comparesTime: boolean = false

    /**
     * Reads a value from the input's text, in the format given.
     */
    abstract parse(value: string, format?: string): D

    /**
     * Writes a value as the input's text, in the format given.
     */
    abstract format(value?: D, format?: string): string

    /**
     * Whether the text is a value `parse` reads, in the format given.
     */
    abstract isValid(value: string, format?: string): boolean
}

/**
 * The limits the directive validates the input against.
 */
export interface NbPickerValidatorConfig<D> {
    /**
     * The earliest date allowed.
     */
    min?: D

    /**
     * The latest date allowed.
     */
    max?: D

    /**
     * Whether a date is allowed.
     */
    filter?: (date: D) => boolean
}

let nextDialogId = 0

/**
 * What `input[nbDatepicker]` binds to: a picker of values of `T` made of dates `D`, such as a date, a range or a date
 * with a time.
 */
export abstract class NbDatepicker<T, D = T> {
    /**
     * The format of the input's text.
     */
    abstract format?: string

    /** Whether the picker is open, for the input's `aria-expanded`. */
    readonly expanded = signal(false)

    /** The id of the picker's dialog, which the input controls while it's open. */
    readonly dialogId = `nb-datepicker-dialog-${nextDialogId++}`

    abstract get value(): T | undefined

    abstract set value(value: T | undefined)

    abstract get valueChange(): Observable<T>

    abstract get init(): Observable<void>

    /**
     * Attaches the picker to the input it opens from.
     */
    abstract attach(hostRef: ElementRef): void

    /**
     * The picker's `min`, `max` and `filter`, which the directive validates the input against.
     */
    abstract getValidatorConfig(): NbPickerValidatorConfig<D>

    abstract show(): void

    abstract hide(): void

    abstract shouldHide(): boolean

    abstract get isShown(): boolean

    /** Shows the picker and moves focus into it, for the keyboard. */
    focusCalendar(): void {}

    abstract get blur(): Observable<void>

    abstract get formatChanged$(): Observable<void>
}

export const NB_DATE_ADAPTER = new InjectionToken<Array<NbDatepickerAdapter<unknown>>>('Datepicker Adapter')

/**
 * Options of the date service. The datepicker reads `format`; date service packages add their own options.
 */
export interface NbDateServiceOptions {
    format?: string
}

export const NB_DATE_SERVICE_OPTIONS = new InjectionToken<NbDateServiceOptions>('Date service options')

/**
 * A form control that picks a date, a range or a date with a time in a calendar, which opens under the input when the
 * user focuses or clicks it; a focus from a script, such as a dialog's autofocus, doesn't open it. The input's text is
 * the value in the picker's `format`, and dates typed into it are read back.
 *
 * ```html
 * <input [nbDatepicker]="datepicker">
 * <nb-datepicker #datepicker></nb-datepicker>
 * ```
 *
 * @stacked-example(Showcase, datepicker/datepicker-showcase.component)
 *
 * The picker is a dialog the input controls. Arrow Down moves the focus into its calendar, which works by keyboard,
 * and Escape closes it and returns to the input.
 *
 * ### Installation
 *
 * Import `NbDatepickerDirective`, `NbDatepickerComponent` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbDatepickerDirective, NbDatepickerComponent],
 * })
 * export class PageComponent { }
 * ```
 *
 * and add `provideNbDatepicker()` to the application providers:
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [provideNbDatepicker()],
 * });
 * ```
 *
 * With NgModules:
 *
 * Import `NbDatepickerModule.forRoot()` to your root module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbDatepickerModule.forRoot(),
 *   ],
 * })
 * export class AppModule { }
 * ```
 * And `NbDatepickerModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbDatepickerModule,
 *   ],
 * })
 *
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * `NbRangepickerComponent` picks a range, typed as `start - end`:
 *
 * ```html
 * <input [nbDatepicker]="rangepicker">
 * <nb-rangepicker #rangepicker></nb-rangepicker>
 * ```
 *
 * Both pickers have the calendar's inputs; see `NbCalendarComponent`.
 * @stacked-example(Range showcase, datepicker/rangepicker-showcase.component)
 *
 * The input binds to a form control or `ngModel`. The value has the type of the configured `NbDateService`: `Date`
 * with the native and date-fns services, `Moment` with the moment service. Rangepickers use `NbCalendarRange` with
 * that type.
 * @stacked-example(Forms, datepicker/datepicker-forms.component)
 *
 * The datepicker's `min`, `max` and `filter` limit the dates the calendar offers, and the date typed in the input:
 * outside them the field has the `nbDatepickerMin`, `nbDatepickerMax` or `nbDatepickerFilter` error. While the text
 * isn't a date, the value stays the last date and the field has the `nbDatepickerParse` error. The errors are
 * `{ kind, message, …data }`, with the messages of `nb-validation-errors`, in reactive, template-driven and signal
 * forms alike.
 * @stacked-example(Validation, datepicker/datepicker-validation.component)
 *
 * `filter` is a predicate that receives a date and returns whether it can be picked.
 * @stacked-example(Filter, datepicker/datepicker-filter.component)
 *
 * `pickerMode="month"` or `"year"` picks a month or a year, e.g. a card's expiry or a graduation year: the calendar
 * starts on the months or the years, and the value is the first day of the one picked. Its text is in the date
 * service's month or year format (`2026-03`, `2026`), or the datepicker's `format`, e.g. `MMM yyyy` with date-fns.
 * @stacked-example(Month and year pickers, datepicker/datepicker-picker-mode.component)
 *
 * `nb-date-timepicker` picks a time along with the date; the value is applied with its OK button:
 *
 * ```html
 * <input nbInput placeholder="Pick Date" [nbDatepicker]="dateTimePicker">
 * <nb-date-timepicker withSeconds #dateTimePicker></nb-date-timepicker>
 * ```
 * @stacked-example(Date timepicker, datepicker/date-timepicker-showcase.component)
 *
 * With `singleColumn` the times are one list, `step` minutes apart, instead of hour and minute columns:
 * @stacked-example(Date timepicker single column, datepicker/date-timepicker-single-column.component)
 *
 * The `NbDatepickerComponent` supports date formatting:
 *
 * ```html
 * <input [nbDatepicker]="datepicker">
 * <nb-datepicker #datepicker format="MM\dd\yyyy"></nb-datepicker>
 * ```
 * <span id="formatting-issue"></span>
 * ## Formats
 *
 * By default, datepicker uses Angular's `LOCALE_ID` for localization, and native dates: it shows dates with
 * `DatePipe`, in its patterns (e.g. `MMM d, y`) or named formats (e.g. `mediumDate`), and reads typed dates back in
 * the same format, with the locale's month and day names. Text that isn't in the format, e.g. `2027-03-19`, is read as
 * `Date.parse` reads it. Formats with other parts, e.g. week numbers or quarters, and other date libraries need an
 * adapter, from one of the following packages:
 *
 * - `@liquid-js/lyr-moment` - provides moment date adapter that uses moment for date objects. This means datepicker than
 * will operate only moment date objects. If you want to use it you have to install it: `npm i @liquid-js/lyr-moment`, and
 * import `NbMomentDateModule` from this package. moment is only published as CommonJS, so add it to the
 * `allowedCommonJsDependencies` build option to silence the Angular CLI warning.
 *
 * - `@liquid-js/lyr-date-fns` - adapter for popular date-fns library. This way is preferred if you need only date formatting.
 * Because date-fns is treeshakable, tiny and operates native date objects. If you want to use it you have to
 * install it: `npm i @liquid-js/lyr-date-fns date-fns`, and import `NbDateFnsDateModule` from this package.
 *
 * ### NbDateFnsDateModule
 *
 * Format is required when using `NbDateFnsDateModule`. You can set it via `format` input on datepicker component:
 * ```html
 * <nb-datepicker format="dd.MM.yyyy"></nb-datepicker>
 * ```
 * Also format can be set globally with `NbDateFnsDateModule.forRoot({ format: 'dd.MM.yyyy' })` and
 * `NbDateFnsDateModule.forChild({ format: 'dd.MM.yyyy' })` methods.
 *
 * Please note to use some of the formatting tokens you also need to pass
 * `{ useAdditionalWeekYearTokens: true, useAdditionalDayOfYearTokens: true }` to date-fns parse and format functions.
 * You can configure options passed this functions by setting `formatOptions` and
 * `parseOptions` of options object passed to `NbDateFnsDateModule.forRoot` and `NbDateFnsDateModule.forChild` methods.
 * ```ts
 * NbDateFnsDateModule.forRoot({
 *   parseOptions: { useAdditionalWeekYearTokens: true, useAdditionalDayOfYearTokens: true },
 *   formatOptions: { useAdditionalWeekYearTokens: true, useAdditionalDayOfYearTokens: true },
 * })
 * ```
 * Further info on `date-fns` formatting tokens could be found at
 * [date-fns docs](https://date-fns.org/docs/Unicode-Tokens).
 *
 * You can also use `parseOptions` and `formatOptions` to provide locale.
 * ```ts
 * import { eo } from 'date-fns/locale';
 *
 * @NgModule({
 *   imports: [
 *     NbDateFnsDateModule.forRoot({
 *       parseOptions: { locale: eo },
 *       formatOptions: { locale: eo },
 *     }),
 *   ],
 * })
 * ```
 * @styles
 *
 * datepicker-background-color:
 * datepicker-border-color:
 * datepicker-border-style:
 * datepicker-border-width:
 * datepicker-border-radius:
 * datepicker-shadow:
 */
@Directive({
    selector: 'input[nbDatepicker]',
    host: {
        'aria-haspopup': 'dialog',
        '[attr.aria-expanded]': 'datepicker().expanded()',
        '[attr.aria-controls]': 'datepicker().expanded() ? datepicker().dialogId : null',
        '(keydown)': 'onKeydown($event)'
    },
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NbDatepickerDirective),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => NbDatepickerDirective),
            multi: true
        }
    ]
})
export class NbDatepickerDirective<D> implements OnChanges, ControlValueAccessor, Validator {
    protected readonly destroyRef = inject(DestroyRef)
    protected readonly document = inject(NB_DOCUMENT)
    protected readonly datepickerAdapters = inject(NB_DATE_ADAPTER)
    protected readonly hostRef = inject(ElementRef)
    protected readonly dateService = inject<NbDateService<D>>(NbDateService)
    protected readonly changeDetector = inject(ChangeDetectorRef)
    protected readonly message = injectNbValidationMessage()

    /**
     * The picker to open: an `nb-datepicker`, `nb-rangepicker` or `nb-date-timepicker`.
     */
    readonly datepicker = input.required<NbDatepicker<D>>({ alias: 'nbDatepicker' })

    // Applied in ngOnChanges, as the picker was set up when the input was set, before forms write a value.
    ngOnChanges({ datepicker }: SimpleChanges) {
        if (datepicker) {
            this.setupPicker()
        }
    }

    protected pickerInputsChangedSubscription?: Subscription

    /**
     * The adapter for the picker's kind of value; throws without one.
     */
    protected get datepickerAdapter(): NbDatepickerAdapter<D> {
        const datepickerAdapter = this.datepickerAdapters.find(({ picker }) => this.picker instanceof picker)
        if (!datepickerAdapter || !(datepickerAdapter instanceof NbDatepickerAdapter)) {
            throwNoDatepickerAdapter()
        }
        // The adapters are for different pickers; the one for this picker's class handles its values.
        return datepickerAdapter as NbDatepickerAdapter<D>
    }

    protected get picker(): NbDatepicker<D> {
        return this.datepicker()
    }
    protected isDatepickerReady = false
    protected queue?: D
    protected onChange: (value: D | null) => void = () => {}
    protected onTouched: () => void = () => {}
    protected onValidatorChange: () => void = () => {}

    /**
     * An arrow function, as forms call validators without `this`.
     */
    protected validator = (): ValidationErrors | null => {
    // Merges the errors as `Validators.compose` does.
        const errors: ValidationErrors = {

            ...this.parseValidator(),
            ...this.minValidator(),
            ...this.maxValidator(),
            ...this.filterValidator()
        }
        return Object.keys(errors).length ? errors : null
    }

    constructor() {
        this.subscribeOnInputChange()
        // New limits, e.g. a later `min`, can change whether the date passes.
        effect(() => {
            this.datepicker().getValidatorConfig()
            untracked(() => this.onValidatorChange())
        })
    }

    get input(): HTMLInputElement {
        return this.hostRef.nativeElement
    }

    get inputValue(): string {
        return this.input.value
    }

    /**
     * Writes the form's value to the picker and the input, or queues it until the picker is ready. `null` and an
     * Invalid Date clear them.
     */
    // Untracked, as forms write values from wherever the app sets them, e.g. an effect that mustn't come to depend
    // on the control.
    writeValue(value?: D | null) {
        untracked(() => {
            // Forms write null for an empty value. An Invalid Date is truthy, so the date services and the calendar
            // would take it for a real value.
            const date = value === null || (value instanceof Date && isNaN(value.getTime())) ? undefined : value

            if (this.isDatepickerReady) {
                this.writePicker(date)
                this.writeInput(date)
            } else {
                this.queue = date
            }
        })
    }

    registerOnChange(fn: (value: D | null) => void) {
        this.onChange = fn
    }

    registerOnTouched(fn: () => void) {
        this.onTouched = fn
    }

    registerOnValidatorChange(fn: () => void) {
        this.onValidatorChange = fn
    }

    setDisabledState(isDisabled: boolean) {
        this.input.disabled = isDisabled
    }

    /**
     * The parse, `min`, `max` and `filter` errors of the input's text, or `null`.
     */
    validate(): ValidationErrors | null {
    // The validators read the input and the picker, not the control.
        return this.validator()
    }

    /**
     * Arrow Down moves into the picker's calendar, opening it if needed, and Escape closes it.
     *
     * @internal
     */
    onKeydown(event: KeyboardEvent) {
        const picker = this.picker
        if (!picker || event.ctrlKey || event.metaKey || event.shiftKey) {
            return
        }
        if (event.key === 'ArrowDown') {
            event.preventDefault()
            picker.focusCalendar()
        } else if (event.key === 'Escape' && picker.isShown) {
            // Only the picker closes, not e.g. a dialog around the input.
            event.preventDefault()
            event.stopPropagation()
            picker.hide()
        }
    }

    /**
     * Returns the focus to the input and hides the picker.
     */
    protected hidePicker() {
        this.input.focus()
        this.picker.hide()
    }

    /**
     * The `nbDatepickerParse` error while the text isn't a date.
     */
    protected parseValidator(): ValidationErrors | null {
    // An empty input is valid, though the date services can't parse it; `required` is the form's business.
        if (this.inputValue === '') {
            return null
        }

        const isValid = this.datepickerAdapter.isValid(this.inputValue, this.picker.format)
        return isValid
            ? null
            : { nbDatepickerParse: nbValidationError(this.message, 'nbDatepickerParse', { value: this.inputValue }) }
    }

    /**
     * Dates to validate: the parsed date, or the start or end of a parsed range (rangepickers parse to
     * `{ start, end }`, which the date services can't compare).
     * */
    protected validatorDates(edge: 'start' | 'end' | 'both'): D[] {
    // Text that isn't a date only has the parse error.
        if (!this.datepickerAdapter.isValid(this.inputValue, this.picker.format)) {
            return []
        }
        const parsed = this.datepickerAdapter.parse(this.inputValue, this.picker.format) as unknown
        if (!parsed) {
            return []
        }
        if (typeof parsed === 'object' && ('start' in parsed || 'end' in parsed)) {
            const range = parsed as { start?: D, end?: D }
            const edges = edge === 'both' ? [range.start, range.end] : [range[edge]]
            return edges.filter((date): date is D => !!date)
        }
        return [parsed as D]
    }

    /**
     * The `nbDatepickerMin` error when the date, or a range's start, is before `min`; the same day passes unless the
     * adapter compares times.
     */
    protected minValidator(): ValidationErrors | null {
        const config = this.picker.getValidatorConfig()
        const [date] = this.validatorDates('start')
        if (!config.min || !date) {
            return null
        }
        return this.dateService.compareDates(config.min, date) <= 0 || this.isSameDay(config.min, date)
            ? null
            : {
                nbDatepickerMin: nbValidationError(this.message, 'nbDatepickerMin', {
                    min: config.min,
                    actual: date,
                    minText: this.dateService.format(config.min, this.picker.format)
                })
            }
    }

    /**
     * The `nbDatepickerMax` error when the date, or a range's end, is after `max`; the same day passes unless the
     * adapter compares times.
     */
    protected maxValidator(): ValidationErrors | null {
        const config = this.picker.getValidatorConfig()
        const [date] = this.validatorDates('end')
        if (!config.max || !date) {
            return null
        }
        return this.dateService.compareDates(config.max, date) >= 0 || this.isSameDay(config.max, date)
            ? null
            : {
                nbDatepickerMax: nbValidationError(this.message, 'nbDatepickerMax', {
                    max: config.max,
                    actual: date,
                    maxText: this.dateService.format(config.max, this.picker.format)
                })
            }
    }

    protected isSameDay(boundary: D, date: D): boolean {
        return !this.datepickerAdapter.comparesTime && this.dateService.isSameDaySafe(boundary, date)
    }

    /**
     * The `nbDatepickerFilter` error when the date, or either end of a range, fails `filter`.
     */
    protected filterValidator(): ValidationErrors | null {
        const config = this.picker.getValidatorConfig()
        const dates = this.validatorDates('both')
        const dateFilter = config.filter
        return !dateFilter || dates.every((date) => dateFilter(date))
            ? null
            : { nbDatepickerFilter: nbValidationError(this.message, 'nbDatepickerFilter', {}) }
    }

    /**
     * Checks there's a datepicker adapter for the picker, and throws otherwise.
     */
    protected chooseDatepickerAdapter(): NbDatepickerAdapter<D> {
        return this.datepickerAdapter
    }

    /**
     * Attaches the picker to the input, writes the text already in it, and follows the picker's value and format.
     */
    protected setupPicker() {
        this.chooseDatepickerAdapter()
        this.picker.attach(this.hostRef)

        if (this.inputValue) {
            this.picker.value = this.datepickerAdapter.parse(this.inputValue, this.picker.format)
        }

        this.pickerInputsChangedSubscription?.unsubscribe()
        this.pickerInputsChangedSubscription = this.picker.formatChanged$
            .pipe(
                map(() => this.picker.format),
                startWith(this.picker.format),
                distinctUntilChanged(),
                pairwise(),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(([prevFormat]) => {
                if (this.inputValue) {
                    const date = this.datepickerAdapter.parse(this.inputValue, prevFormat)
                    this.writeInput(date)
                }
            })

        // A picker placed after the input hasn't got its `format` on the first change detection, so a value written
        // before then waits for the picker to initialise.
        if (!this.isDatepickerReady) {
            this.picker.init
                .pipe(
                    take(1),
                    tap(() => (this.isDatepickerReady = true)),
                    filter(() => !!this.queue),
                    takeUntilDestroyed(this.destroyRef)
                )
                .subscribe(() => {
                    this.writeValue(this.queue)
                    this.changeDetector.detectChanges()
                    this.queue = undefined
                })
        }

        this.picker.valueChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value: D) => {
            this.writePicker(value)
            this.writeInput(value)
            this.onChange(value)
            this.onValidatorChange()

            if (this.picker.shouldHide()) {
                this.hidePicker()
            }
        })

        merge(
            this.picker.blur,
            fromEvent(this.input, 'blur').pipe(
                filter(() => !this.picker.isShown && this.document.activeElement !== this.input)
            )
        )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.onTouched())
    }

    protected writePicker(value?: D) {
        this.picker.value = value
    }

    protected writeInput(value?: D) {
    // An Invalid Date parsed from partial input can't be formatted (date-fns throws); keep the text as typed.
        if (this.hasInvalidDate(value)) {
            return
        }
        this.hostRef.nativeElement.value = this.datepickerAdapter.format(value, this.picker.format)
    }

    /**
     * Whether the value, or either end of a range value, is an Invalid Date.
     */
    protected hasInvalidDate(value: unknown): boolean {
        const isInvalid = (date: unknown) => date instanceof Date && isNaN(date.getTime())
        if (isInvalid(value)) {
            return true
        }
        const range = value as { start?: unknown, end?: unknown } | undefined
        return !!range && typeof range === 'object' && (isInvalid(range.start) || isInvalid(range.end))
    }

    protected subscribeOnInputChange() {
        fromEvent(this.input, 'input')
            .pipe(
                map(() => this.inputValue),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((value: string) => this.handleInputChange(value))
    }

    /**
     * Gives the form the date in the input, or `null` when it's empty; while the text isn't a date, the value stays and
     * the field has the parse error.
     */
    protected handleInputChange(value: string) {
        if (value !== '' && !this.datepickerAdapter.isValid(value, this.picker.format)) {
            this.onValidatorChange()
            return
        }
        const date = this.parseInputValue(value)

        // Forms hold null for an empty field.
        this.onChange(date ?? null)
        this.writePicker(date)
        // The checks read the text, which signal forms don't see change.
        this.onValidatorChange()
    }

    protected parseInputValue(value: string): D | undefined {
        if (this.datepickerAdapter.isValid(value, this.picker.format)) {
            return this.datepickerAdapter.parse(value, this.picker.format)
        }

        return undefined
    }
}
