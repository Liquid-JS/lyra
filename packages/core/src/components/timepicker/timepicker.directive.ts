import {
    afterNextRender,
    AfterViewInit,
    ChangeDetectorRef,
    ComponentRef,
    DestroyRef,
    Directive,
    effect,
    ElementRef,
    forwardRef,
    HostAttributeToken,
    inject,
    Injector,
    input,
    isDevMode,
    Renderer2,
    signal,
    untracked
} from '@angular/core'
import { filter, map } from 'rxjs/operators'
import { outputToObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { fromEvent, merge } from 'rxjs'
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms'
import { NbOverlayRef, NbScrollStrategy, NbAdjustableConnectedPositionStrategy, NbAdjustment, NbPosition, NbPositionBuilderService, NbOverlayService, NbTrigger, NbTriggerStrategy, NbTriggerStrategyBuilderService } from '@liquid-js/lyr-core/cdk'
import { NbDateService, NbCalendarTimeModelService } from '@liquid-js/lyr-core/calendar-kit'
import { NB_DOCUMENT, ɵisComposing as isComposing } from '@liquid-js/lyr-core/base'
import { injectNbValidationMessage, ɵnbValidationError as nbValidationError } from '@liquid-js/lyr-core/validation'
import { NbSelectedTimePayload } from './model'
import { NbTimePickerComponent } from './timepicker.component'

let nextDialogId = 0

/**
 * A form control on an input that picks a time: the time picker opens when the user focuses or clicks the input (a
 * focus from a script, such as a dialog's autofocus, doesn't open it), and the input's text is parsed as the user
 * types.
 *
 * Arrow Down in the input moves into the timepicker, a named dialog, to its selected time. Its columns are listboxes:
 * the arrow keys, Home, End, Page Up and Page Down move in a column, Enter or Space picks, and Tab goes to the next
 * column. Escape closes it, keeping the time, back in the input.
 * ```html
 * <input [nbTimepicker]="timepicker">
 * <nb-timepicker #timepicker></nb-timepicker>
 * ```
 *
 * @stacked-example(Showcase, timepicker/timepicker-showcase.component)
 *
 * ### Installation
 *
 * Import `NbTimePickerDirective`, `NbTimePickerComponent` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbTimePickerDirective, NbTimePickerComponent],
 * })
 * export class PageComponent { }
 * ```
 *
 * and add `provideNbTimepicker()` to the application providers:
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [provideNbTimepicker()],
 * });
 * ```
 * In a lazy loaded route, add `provideNbTimepicker()` to the route's `providers` instead, so the route gets its own
 * instance.
 *
 * With NgModules:
 *
 * Import `NbTimepickerModule.forRoot()` to your root module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbTimepickerModule.forRoot(),
 *   ],
 * })
 * export class AppModule { }
 * ```
 * And `NbTimepickerModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbTimepickerModule,
 *   ],
 * })
 * export class PageModule { }
 *
 * ```
 * <div id="native-parse-issue" class="note note-warning">
 * <div class="note-title">Note</div>
 * <div class="note-body">
 * By default the time picker uses the native `Date`, which can't parse a custom format: per the ECMAScript
 * specification it parses ISO 8601 only, which needs a date part, so a time alone typed in the input doesn't parse.
 * Use `provideNbDateFnsDate()` or `provideNbMomentDate()` (or `NbDateFnsDateModule` / `NbMomentDateModule`), which
 * parse a time on its own with date-fns or moment.
 * See "Formatting Issue" at
 * <a href="https://liquid-js.github.io/lyra/components/forms/datepicker/overview#formatting-issue">Date picker docs</a>
 * for installation instructions.
 * </div>
 * </div>
 *
 * ---
 *
 * ### Usage
 *
 * `withSeconds` adds a seconds column to the hours and minutes:
 *
 * ```html
 * <input [nbTimepicker]="timepicker">
 * <nb-timepicker #timepicker withSeconds></nb-timepicker>
 * ```
 * @stacked-example(Time picker with seconds, timepicker/timepicker-with-seconds.component)
 *
 * `twelveHoursFormat` on the time picker forces 12-hour times; by default it follows the `provideNbTimepicker()`
 * config, or else the application's locale.
 *
 * ```html
 * <input [nbTimepicker]="timepicker">
 * <nb-timepicker #timepicker twelveHoursFormat></nb-timepicker>
 * ```
 * @stacked-example(Twelve hours format showcase, timepicker/timepicker-twelve-hours-format.component)
 *
 * `singleColumn` lists whole times instead of hours and minutes to pick separately; `step` sets the minutes between
 * them, e.g. 11:00, 11:20, 11:40…
 * @stacked-example(Single column, timepicker/timepicker-single-column.component)
 *
 * The input is a form control, so `formControl` and `ngModel` go on it:
 * @stacked-example(Form control, timepicker/timepicker-form-control.component)
 *
 * ```html
 * <input [nbTimepicker]="timepicker" [formControl]="formControl">
 * <nb-timepicker #timepicker></nb-timepicker>
 * ```
 * @stacked-example(NgModel, timepicker/timepicker-ng-model.component)
 *
 * ```html
 * <input [nbTimepicker]="timepicker" [ngModel]="date">
 * <nb-timepicker #timepicker></nb-timepicker>
 * ```
 *
 * ### Validation
 *
 * `min` and `max` on the timepicker limit the times to pick, by time of day: the list disables the others. Text in
 * the input that isn't a time has the `nbTimepickerParse` error, and the value stays the last time, as Angular's
 * controls report text they can't parse; a time out of range has `nbTimepickerMin` or `nbTimepickerMax`, with
 * `minText` or `maxText`. Emptying the input clears the value. Errors are `{ kind, message, …data }`, and
 * `nb-validation-errors` shows them:
 * @stacked-example(Validation, timepicker/timepicker-validation.component)
 *
 * ```html
 * <input nbInput [nbTimepicker]="picker" formControlName="start" nbValidation #start="nbValidation" />
 * <nb-timepicker #picker [min]="opens" [max]="closes" />
 * <nb-validation-errors [for]="start" />
 * ```
 *
 * The texts come from `NbTextsService`'s `timepicker` texts. The config's `localization`, passed to
 * `provideNbTimepicker()` or `NbTimepickerModule.forRoot()`, overrides them:
 * ```ts
 * provideNbTimepicker({
 *   localization: {
 *     hoursText: 'Hr',
 *     minutesText: 'Min',
 *     secondsText: 'Sec',
 *     ampmText: 'Am/Pm',
 *   },
 * })
 * ```
 * @styles
 *
 * timepicker-cell-text-color:
 * timepicker-cell-hover-background-color:
 * timepicker-cell-hover-text-color:
 * timepicker-cell-focus-background-color:
 * timepicker-cell-focus-text-color:
 * timepicker-cell-active-background-color:
 * timepicker-cell-active-text-color:
 * timepicker-cell-disabled-text-color:
 * timepicker-cell-text-font-size:
 * timepicker-cell-text-font-family:
 * timepicker-cell-text-line-height:
 * timepicker-cell-text-font-weight:
 * timepicker-cell-height:
 * timepicker-header-cell-text-color:
 * timepicker-header-cell-text-font-size:
 * timepicker-header-cell-text-font-family:
 * timepicker-header-cell-height:
 * timepicker-header-cell-text-line-height:
 * timepicker-header-cell-text-font-weight:
 * timepicker-border-color:
 * timepicker-border-style:
 * timepicker-border-width:
 * timepicker-border-radius:
 * timepicker-background-color:
 * timepicker-shadow:
 * timepicker-scrollbar-color:
 * timepicker-scrollbar-background-color:
 * timepicker-scrollbar-width:
 * timepicker-single-column-width:
 * timepicker-multiple-column-width:
 * timepicker-title-height:
 * timepicker-title-padding:
 * timepicker-container-width:
 * timepicker-container-height:
 * */
@Directive({
    selector: 'input[nbTimepicker]',
    host: {
        'aria-haspopup': 'dialog',
        '[attr.aria-expanded]': 'expanded()',
        '[attr.aria-controls]': 'expanded() ? dialogId : null',
        '(keydown)': 'onKeydown($event)'
    },
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NbTimePickerDirective),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => NbTimePickerDirective),
            multi: true
        }
    ]
})
export class NbTimePickerDirective<D> implements AfterViewInit, ControlValueAccessor, Validator {
    protected readonly destroyRef = inject(DestroyRef)
    protected readonly document = inject(NB_DOCUMENT)
    protected readonly positionBuilder = inject(NbPositionBuilderService)
    protected readonly hostRef = inject(ElementRef)
    protected readonly triggerStrategyBuilder = inject(NbTriggerStrategyBuilderService)
    protected readonly overlay = inject(NbOverlayService)
    protected readonly cd = inject(ChangeDetectorRef)
    protected readonly calendarTimeModelService = inject<NbCalendarTimeModelService<D>>(NbCalendarTimeModelService)
    protected readonly dateService = inject<NbDateService<D>>(NbDateService)
    protected readonly renderer = inject(Renderer2)
    protected readonly placeholder = inject(new HostAttributeToken('placeholder'), { optional: true })
    protected readonly message = injectNbValidationMessage()
    protected readonly injector = inject(Injector)

    /** Whether the time picker is open, for the input's `aria-expanded`. */
    protected readonly expanded = signal(false)
    /** The id of the time picker's popup, which the input controls while it's open. */
    protected readonly dialogId = `nb-timepicker-dialog-${nextDialogId++}`

    /**
     * The timepicker that opens for this input.
     */
    readonly timepicker = input.required<NbTimePickerComponent<D>>({ alias: 'nbTimepicker' })

    /**
     * The gap between the input and the time picker, in px.
     */
    readonly overlayOffset = input(8)

    /**
     * The text of the last time that parsed, whether written, picked or typed.
     *
     * @docs-private
     */
    protected lastInputValue = ''
    /** @docs-private */
    protected positionStrategy?: NbAdjustableConnectedPositionStrategy
    protected overlayRef?: NbOverlayRef
    protected onChange: (value: D | null) => void = () => {}
    protected onTouched: () => void = () => {}
    protected onValidatorChange = () => {}
    /** The time the form has, the last that parsed. */
    protected value?: D
    /** Whether the input's text isn't a time. */
    protected parseError = false
    /** @docs-private */
    protected triggerStrategy?: NbTriggerStrategy

    /**
     * The host input element.
     *
     * @docs-private
     */
    get input(): HTMLInputElement {
        return this.hostRef.nativeElement
    }

    /**
     * Whether the time picker is open.
     *
     * @docs-private
     */
    get isOpen(): boolean {
        return this.overlayRef?.hasAttached() ?? false
    }

    constructor() {
    // A typed time is parsed again with the format it was typed in when the timepicker's format changes.
        let previous: { picker: NbTimePickerComponent<D>, format: string } | undefined
        effect(() => {
            const picker = this.timepicker()
            const format = picker.computedTimeFormat()
            untracked(() => {
                if (previous?.picker === picker && previous.format !== format && this.inputValue) {
                    this.writeValue(this.dateService.parse(this.inputValue, previous.format))
                }
                previous = { picker, format }
            })
        })
        // New limits, e.g. a later `min`, can change whether the time passes.
        effect(() => {
            const picker = this.timepicker()
            picker.min()
            picker.max()
            untracked(() => this.onValidatorChange())
        })
    }

    /**
     * Whether the time picker is closed.
     *
     * @docs-private
     */
    get isClosed(): boolean {
        return !this.isOpen
    }

    /**
     * The input's text.
     *
     * @docs-private
     */
    get inputValue(): string {
        return this.input.value
    }

    set inputValue(value: string) {
        this.input.value = value
    }

    ngAfterViewInit() {
        this.subscribeOnInputChange()

        // `@Attribute` only sees a static placeholder; a bound [placeholder] is already on the element by now.
        if (!this.placeholder && !this.input.placeholder) {
            this.renderer.setProperty(this.input, 'placeholder', this.timepicker().computedTimeFormat())
        }
        this.triggerStrategy = this.createTriggerStrategy()
        this.subscribeOnTriggers(this.triggerStrategy)
        this.subscribeToBlur()
    }

    show() {
        if (this.isClosed) {
            this.attachToOverlay()
            this.expanded.set(true)
        }
    }

    hide() {
        if (this.isOpen) {
            this.overlayRef?.detach()
            this.expanded.set(false)
            this.cd.markForCheck()
        }
    }

    /**
     * Arrow Down moves into the time picker, opening it if needed, to its selected times; Escape closes it.
     *
     * @internal
     */
    onKeydown(event: KeyboardEvent) {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || isComposing(event)) {
            return
        }
        if (event.key === 'ArrowDown') {
            event.preventDefault()
            this.show()
            afterNextRender(() => this.firstTabbableCell()?.focus(), { injector: this.injector })
        } else if (event.key === 'Escape' && this.isOpen) {
            // Only the time picker closes, not a dialog or window the input is in.
            event.preventDefault()
            event.stopPropagation()
            this.hide()
        }
    }

    /** The cell Tab reaches first in the time picker: its first column's selected time, or else its first. */
    protected firstTabbableCell(): HTMLElement | null | undefined {
        return this.overlayRef?.overlayElement.querySelector<HTMLElement>('[role="option"][tabindex="0"]')
    }

    /**
     * Opens the overlay with the time picker's portal.
     *
     * @docs-private
     */
    protected attachToOverlay() {
        let overlayRef = this.overlayRef
        if (!overlayRef) {
            this.setupTimepicker()
            overlayRef = this.initOverlay()
        }
        overlayRef.attach(this.timepicker().portal())
        // The popup is a dialog, named; the input says it controls it.
        const pane = overlayRef.overlayElement
        this.renderer.setAttribute(pane, 'role', 'dialog')
        this.renderer.setAttribute(pane, 'aria-label', this.timepicker().dialogLabel())
        this.renderer.setAttribute(pane, 'id', this.dialogId)
    }

    setupTimepicker() {
        if (this.dateService.getId() === 'native' && isDevMode()) {
            console.warn(
                'Date.parse does not support parsing time with custom format.' +
                    ' See details here https://liquid-js.github.io/lyra/components/forms/datepicker/overview#native-parse-issue'
            )
        }
        this.timepicker().setHost(this.hostRef)
        if (this.inputValue) {
            const val = this.dateService.getId() === 'native' ? this.parseNativeDateString(this.inputValue) : this.inputValue
            this.timepicker().date.set(this.dateService.parse(val, this.timepicker().computedTimeFormat()))
        } else {
            this.timepicker().date.set(this.calendarTimeModelService.getResetTime())
        }
    }

    protected initOverlay(): NbOverlayRef {
        const positionStrategy = this.createPositionStrategy()
        this.positionStrategy = positionStrategy
        this.subscribeOnApplyClick()
        return this.createOverlay(positionStrategy)
    }

    protected subscribeOnApplyClick() {
        outputToObservable(this.timepicker().onSelectTime)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((value: NbSelectedTimePayload<D>) => {
                const time = this.dateService.format(value.time, this.timepicker().computedTimeFormat()).toUpperCase()
                // A time picked in the list is the value, and the text the input keeps.
                this.inputValue = time
                this.lastInputValue = time
                this.timepicker().date.set(value.time)
                this.setValue(value.time)
                if (value.save) {
                    this.hide()
                }
            })
    }

    protected createOverlay(positionStrategy: NbAdjustableConnectedPositionStrategy): NbOverlayRef {
        const scrollStrategy = this.createScrollStrategy()
        const overlayRef = this.overlay.create({ positionStrategy, scrollStrategy })
        this.overlayRef = overlayRef
        // Escape in the time picker goes back to the input; only the time picker closes, not e.g. a dialog around it.
        overlayRef.overlayElement.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !isComposing(event) && this.isOpen) {
                event.preventDefault()
                event.stopPropagation()
                this.input.focus()
                this.hide()
            }
        })
        return overlayRef
    }

    protected subscribeOnTriggers(triggerStrategy: NbTriggerStrategy) {
        triggerStrategy.show$.pipe(filter(() => this.isClosed)).subscribe(() => this.show())

        // Text the user typed stays, also when it isn't a time, which then shows its error. Focus left the input and the
        // picker, so the control is touched.
        triggerStrategy.hide$.pipe(filter(() => this.isOpen)).subscribe(() => {
            this.hide()
            this.onTouched()
        })
    }

    protected createTriggerStrategy(): NbTriggerStrategy {
        return this.triggerStrategyBuilder
            .trigger(NbTrigger.FOCUS)
            .host(this.hostRef.nativeElement)
            .container(() => this.getContainer())
            .build()
    }

    protected createPositionStrategy(): NbAdjustableConnectedPositionStrategy {
        return this.positionBuilder
            .connectedTo(this.hostRef)
            .position(NbPosition.BOTTOM)
            .offset(this.overlayOffset())
            .adjustment(NbAdjustment.COUNTERCLOCKWISE)
    }

    protected getContainer(): ComponentRef<unknown> | undefined {
        return this.overlayRef && this.isOpen
            ? <ComponentRef<unknown>>{
                location: {
                    nativeElement: this.overlayRef.overlayElement
                }
            }
            : undefined
    }

    protected createScrollStrategy(): NbScrollStrategy {
        return this.overlay.scrollStrategies.block()
    }

    protected subscribeOnInputChange() {
        fromEvent(this.input, 'input')
            .pipe(
                map(() => this.inputValue),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((value: string) => this.handleInputChange(value))
    }

    protected subscribeToBlur() {
        merge(
            this.timepicker().blur,
            fromEvent(this.input, 'blur').pipe(filter(() => !this.isOpen && this.document.activeElement !== this.input))
        )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.onTouched())
    }

    /**
     * Parses what's typed: an empty input clears the time, a time becomes the value, and anything else keeps the last
     * time with the parse error.
     *
     * @docs-private
     */
    protected handleInputChange(value: string) {
        const typed = value
        if (!typed.trim()) {
            // An empty input clears the time.
            this.lastInputValue = ''
            this.parseError = false
            this.setValue(undefined)
            return
        }
        if (this.dateService.getId() === 'native') {
            // The native date service doesn't parse a time on its own, so today's date is put in front of it.
            value = this.parseNativeDateString(value)
        }

        const isValidDate: boolean = this.dateService.isValidDateString(value, this.timepicker().computedTimeFormat())
        // Text that isn't a time keeps the last time, with the parse error.
        this.parseError = !isValidDate
        if (isValidDate) {
            this.lastInputValue = typed
            const date = this.dateService.parse(value, this.timepicker().computedTimeFormat())
            this.timepicker().date.set(date)
            this.setValue(date)
        } else {
            // Signal forms only check a value accessor's validators again when they're told to.
            this.onValidatorChange()
        }
    }

    /** Gives the form a time, or none. */
    protected setValue(value?: D) {
        this.value = value
        // Forms hold null for an empty field.
        this.onChange(value ?? null)
        this.onValidatorChange()
    }

    protected updateValue(value?: D | null) {
        this.value = value || undefined
        this.parseError = false
        if (value) {
            this.timepicker().date.set(value)
            const timeString = this.dateService.format(value, this.timepicker().computedTimeFormat()).toUpperCase()
            this.inputValue = timeString
            this.lastInputValue = timeString
        } else {
            this.inputValue = ''
            this.lastInputValue = ''
        }
    }

    // Untracked, as forms write values from wherever the app sets them, e.g. an effect that mustn't come to depend
    // on the control.
    writeValue(value?: D | null) {
        untracked(() => this.updateValue(value))
    }

    registerOnValidatorChange(fn: () => void) {
        this.onValidatorChange = fn
    }

    /**
     * The input's text that isn't a time (`nbTimepickerParse`), or a time before the timepicker's `min`
     * (`nbTimepickerMin`) or after its `max` (`nbTimepickerMax`), by time of day.
     */
    validate(): ValidationErrors | null {
        if (this.parseError) {
            return { nbTimepickerParse: nbValidationError(this.message, 'nbTimepickerParse', { value: this.inputValue }) }
        }
        const value = this.value
        if (!value) {
            return null
        }
        const picker = this.timepicker()
        const format = picker.computedTimeFormat()
        const position = picker.compareToLimits(value)
        const min = picker.min()
        const max = picker.max()
        if (position < 0 && min) {
            return {
                nbTimepickerMin: nbValidationError(this.message, 'nbTimepickerMin', {
                    min,
                    actual: value,
                    minText: this.dateService.format(min, format).toUpperCase()
                })
            }
        }
        if (position > 0 && max) {
            return {
                nbTimepickerMax: nbValidationError(this.message, 'nbTimepickerMax', {
                    max,
                    actual: value,
                    maxText: this.dateService.format(max, format).toUpperCase()
                })
            }
        }
        return null
    }

    registerOnChange(fn: (value: D | null) => void) {
        this.onChange = fn
    }

    registerOnTouched(fn: () => void) {
        this.onTouched = fn
    }

    setDisabledState(isDisabled: boolean) {
        this.input.disabled = isDisabled
    }

    protected parseNativeDateString(value: string): string {
        const date = this.dateService.today()
        const year = this.dateService.getYear(date)
        const month = this.calendarTimeModelService.paddToTwoSymbols(this.dateService.getMonth(date) + 1)
        const day = this.calendarTimeModelService.paddToTwoSymbols(this.dateService.getDate(date))

        return `${year}-${month}-${day} ${value}`
    }
}
