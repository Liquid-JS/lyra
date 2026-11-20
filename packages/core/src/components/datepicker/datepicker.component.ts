import {
    afterNextRender,
    Component,
    ComponentRef,
    DestroyRef,
    effect,
    ElementRef,
    EnvironmentInjector,
    inject,
    Injector,
    input,
    model,
    OnChanges,
    OnDestroy,
    OnInit,
    Signal,
    SimpleChanges,
    Type,
    untracked
} from '@angular/core'
import { outputToObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { EMPTY, Observable, ReplaySubject, Subject } from 'rxjs'
import { filter } from 'rxjs/operators'

import { NbComponentPortal, NbOverlayRef, NbAdjustableConnectedPositionStrategy, NbAdjustment, NbAdjustmentValues, NbPosition, NbPositionBuilderService, NbOverlayService, patch, setComponentContext, NbTrigger, NbTriggerStrategy, NbTriggerStrategyBuilderService } from '@liquid-js/lyr-core/cdk'
import { NbCalendarRange, NbCalendarRangeComponent, NbCalendarComponent } from '@liquid-js/lyr-core/calendar'
import { NbCalendarCell, NbCalendarSize, NbCalendarViewMode, NbCalendarSizeValues, NbCalendarViewModeValues, NbCalendarPickerMode, NbDateService } from '@liquid-js/lyr-core/calendar-kit'
import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base'
import { NB_DATE_SERVICE_OPTIONS, NbDatepicker, NbPickerValidatorConfig } from './datepicker.directive'
import { NbDatepickerContainerComponent } from './datepicker-container.component'

/**
 * What the pickers are built on: it opens the calendar in an overlay under the input, passes its options on, and
 * relays the value both ways.
 */
export abstract class NbBasePicker<D, T, P> extends NbDatepicker<T, D> {
    protected readonly destroyRef = inject(DestroyRef)
    /**
     * The format the input shows dates in and reads them back from: `DatePipe`'s patterns and named formats with the
     * native date service, or the adapter's with moment or date-fns.
     */
    abstract override format?: string

    /**
     * Fills the first and last weeks with the days of the months around the one shown; without it those cells are
     * empty.
     */
    abstract readonly boundingMonth: Signal<boolean>

    /**
     * The view the calendar opens on: `date` (default), `month` or `year`.
     */
    abstract readonly startView: Signal<NbCalendarViewMode>

    /**
     * The earliest date that can be picked; earlier dates are disabled in the calendar and fail validation.
     */
    abstract readonly min: Signal<D | undefined>

    /**
     * The latest date that can be picked; later dates are disabled in the calendar and fail validation.
     */
    abstract readonly max: Signal<D | undefined>

    /**
     * Disables the days for which it returns `false`, in the calendar and in validation.
     */
    abstract readonly filter: Signal<((date: D) => boolean) | undefined>

    /**
     * A component to render the days with, implementing `NbCalendarCell`.
     */
    abstract readonly dayCellComponent: Signal<Type<NbCalendarCell<D, T>> | undefined>

    /**
     * A component to render the months with, implementing `NbCalendarCell`.
     */
    abstract readonly monthCellComponent: Signal<Type<NbCalendarCell<D, T>> | undefined>

    /**
     * A component to render the years with, implementing `NbCalendarCell`.
     */
    abstract readonly yearCellComponent: Signal<Type<NbCalendarCell<D, T>> | undefined>

    /**
     * Size of the calendar and its cells: `medium` (default) or `large`.
     */
    abstract readonly size: Signal<NbCalendarSize>

    /**
     * The date whose month the calendar opens on; the value, once there is one.
     */
    abstract readonly visibleDate: Signal<D | undefined>

    /**
     * Closes the picker once a date, or a whole range, is picked (default).
     */
    abstract readonly hideOnSelect: Signal<boolean>

    /**
     * Shows the calendar's header with the view mode button and the previous and next buttons (default).
     */
    abstract readonly showNavigation: Signal<boolean>

    /**
     * The header of the week numbers column; `#` by default.
     */
    abstract readonly weekNumberSymbol: Signal<string | undefined>

    /**
     * Shows a column with the week numbers before the days; off by default.
     */
    abstract readonly showWeekNumber: Signal<boolean>

    /**
     * The first day of the week: 0 for Sunday, 1 for Monday and so on; the locale's by default.
     */
    abstract readonly firstDayOfWeek: Signal<number | undefined>

    readonly formatChanged$: Subject<void> = new Subject()

    /**
     * The calendar component created in the overlay.
     */
    protected abstract pickerClass: Type<P>

    protected ref?: NbOverlayRef

    /**
     * The dialog in the overlay that holds the calendar.
     */
    protected container?: ComponentRef<NbDatepickerContainerComponent>

    protected positionStrategy?: NbAdjustableConnectedPositionStrategy

    protected triggerStrategy?: NbTriggerStrategy

    /**
     * The input the picker opens from.
     */
    protected hostRef?: ElementRef

    protected init$: ReplaySubject<void> = new ReplaySubject<void>()

    /**
     * The value changes, as one stream: the calendar is created anew each time the picker opens.
     */
    protected onChange$: Subject<T> = new Subject()

    /**
     * The calendar, while the picker is open.
     */
    protected pickerRef?: ComponentRef<P>

    protected abstract readonly overlayOffset: Signal<number>

    protected abstract readonly adjustment: Signal<NbAdjustment>

    /**
     * The value set while the picker was closed, which the calendar gets as soon as it opens.
     */
    protected queue?: T

    protected blur$: Subject<void> = new Subject<void>()

    /** The module that declares the picker, so the calendar overlay can use its providers (such as `NbDateService`). */
    protected readonly environmentInjector = inject(EnvironmentInjector)

    protected readonly overlay = inject(NbOverlayService)
    protected readonly positionBuilder = inject(NbPositionBuilderService)
    protected readonly triggerStrategyBuilder = inject(NbTriggerStrategyBuilderService)
    protected readonly dateService = inject<NbDateService<D>>(NbDateService)
    protected readonly dateServiceOptions = inject(NB_DATE_SERVICE_OPTIONS, { optional: true })
    protected readonly injector = inject(Injector)

    /**
     * The calendar, while the picker is open.
     */
    get picker(): P | undefined {
        return this.pickerRef && this.pickerRef.instance
    }

    /**
     * Emits the value as it's picked in the calendar.
     */
    get valueChange(): Observable<T> {
        return this.onChange$.asObservable()
    }

    get isShown(): boolean {
        return this.ref?.hasAttached() ?? false
    }

    get init(): Observable<void> {
        return this.init$.asObservable()
    }

    /**
     * Emits when the picker closes because the focus left the input and the picker.
     */
    get blur(): Observable<void> {
        return this.blur$.asObservable()
    }

    protected abstract get pickerValueChange(): Observable<T>

    /**
     * Called by `NbDatepickerDirective` with the input the picker opens from, on focus or a click.
     */
    attach(hostRef: ElementRef) {
        this.hostRef = hostRef
        this.subscribeOnTriggers(hostRef)
    }

    getValidatorConfig(): NbPickerValidatorConfig<D> {
        return { min: this.min(), max: this.max(), filter: this.filter() }
    }

    show() {
        const hostRef = this.hostRef
        // Not attached to an input yet.
        if (!hostRef) {
            return
        }

        this.openDatepicker(this.ref ?? this.createOverlay(hostRef))
    }

    shouldHide(): boolean {
        return this.hideOnSelect() && !!this.value
    }

    /**
     * Shows the picker if it's hidden, and moves focus into its calendar, to the selected date, today or the first one.
     */
    override focusCalendar() {
        if (!this.isShown) {
            this.show()
        }
        afterNextRender(
            () => this.ref?.overlayElement.querySelector<HTMLElement>('[role="gridcell"][tabindex="0"]')?.focus(),
            { injector: this.injector }
        )
    }

    hide() {
        this.ref?.detach()
        this.expanded.set(false)

        // The value is kept for the next time the calendar opens.
        const pickerRef = this.pickerRef
        if (pickerRef) {
            this.queue = this.value
            pickerRef.destroy()
            this.pickerRef = undefined
            this.container = undefined
        }
    }

    protected abstract writeQueue(): void

    protected createOverlay(hostRef: ElementRef): NbOverlayRef {
        const positionStrategy = this.createPositionStrategy(hostRef)
        this.positionStrategy = positionStrategy
        const ref = this.overlay.create({
            positionStrategy,
            scrollStrategy: this.overlay.scrollStrategies.reposition()
        })
        this.ref = ref
        // Escape in the picker goes back to the input; only the picker closes, not e.g. a dialog around the input.
        ref.overlayElement.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isShown) {
                event.preventDefault()
                event.stopPropagation()
                // Focus first: the input opens the picker on focus, unless it's open.
                hostRef.nativeElement.focus()
                this.hide()
            }
        })
        this.subscribeOnPositionChange(positionStrategy)
        return ref
    }

    protected openDatepicker(ref: NbOverlayRef) {
        const portal = new NbComponentPortal(NbDatepickerContainerComponent, null, this.environmentInjector)
        const container = ref.attach(portal)
        this.container = container
        container.setInput('dialogId', this.dialogId)
        this.expanded.set(true)
        const pickerRef = this.instantiatePicker(container)
        this.subscribeOnValueChange()
        this.writeQueue()
        this.patchWithInputs(pickerRef)
        // The picker rendered while it was attached, before it had its inputs; render it with them now.
        pickerRef.changeDetectorRef.detectChanges()
    }

    protected createPositionStrategy(hostRef: ElementRef): NbAdjustableConnectedPositionStrategy {
        return this.positionBuilder
            .connectedTo(hostRef)
            .position(NbPosition.BOTTOM)
            .offset(this.overlayOffset())
            .adjustment(this.adjustment())
    }

    protected subscribeOnPositionChange(positionStrategy: NbAdjustableConnectedPositionStrategy) {
        positionStrategy.positionChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((position: NbPosition) => {
                if (this.container) {
                    patch(this.container, { position })
                }
            })
    }

    protected createTriggerStrategy(hostRef: ElementRef): NbTriggerStrategy {
        return this.triggerStrategyBuilder
            .trigger(NbTrigger.FOCUS)
            .host(hostRef.nativeElement)
            .container(() => this.container)
            .build()
    }

    protected subscribeOnTriggers(hostRef: ElementRef) {
        const triggerStrategy = this.createTriggerStrategy(hostRef)
        this.triggerStrategy = triggerStrategy
        triggerStrategy.show$.subscribe(() => this.show())
        triggerStrategy.hide$.subscribe(() => {
            this.blur$.next()
            this.hide()
        })
    }

    protected instantiatePicker(container: ComponentRef<NbDatepickerContainerComponent>): ComponentRef<P> {
        const pickerRef = container.instance.attach(new NbComponentPortal(this.pickerClass, null, null))
        this.pickerRef = pickerRef
        return pickerRef
    }

    /**
     * Relays the calendar's value changes to `valueChange`, then to the picker's model.
     */
    protected subscribeOnValueChange() {
        this.pickerValueChange.subscribe((date) => {
            this.onChange$.next(date)
            this.onPickerValueChange(date)
        })
    }

    /**
     * Runs after the value change reached the directive, so the input shows the value first.
     */
    protected onPickerValueChange(_value: T) {}

    /**
     * Passes the picker options to the calendar by their input names, which both calendars share, so custom cells reach
     * `nb-calendar` as well as `nb-calendar-range`.
     */
    protected patchWithInputs(pickerRef: ComponentRef<P>) {
    // The picker class is a type parameter, so its inputs aren't known here.
        setComponentContext<unknown>(pickerRef, {
            boundingMonth: this.boundingMonth(),
            startView: this.startView(),
            min: this.min(),
            max: this.max(),
            filter: this.filter(),
            dayCellComponent: this.dayCellComponent(),
            monthCellComponent: this.monthCellComponent(),
            yearCellComponent: this.yearCellComponent(),
            size: this.size(),
            showNavigation: this.showNavigation(),
            visibleDate: this.visibleDate(),
            showWeekNumber: this.showWeekNumber(),
            weekNumberSymbol: this.weekNumberSymbol(),
            firstDayOfWeek: this.firstDayOfWeek()
        })
    }

    protected checkFormat() {
        const isFormatSet = this.format || (this.dateServiceOptions && this.dateServiceOptions.format)
        if (this.dateService.getId() === 'date-fns' && !isFormatSet) {
            throw new Error('format is required when using NbDateFnsDateModule')
        }
    }
}

@Component({
    template: ''
})
export class NbBasePickerComponent<D, T, P> extends NbBasePicker<D, T, P> implements OnInit, OnChanges, OnDestroy {
    /**
     * The format the input shows dates in and reads them back from: `DatePipe`'s patterns and named formats with the
     * native date service, or the adapter's with moment or date-fns.
     */
    readonly formatInput = input<string>(undefined, { alias: 'format' })

    get format(): string | undefined {
        return this.formatInput()
    }

    /**
     * Fills the first and last weeks with the days of the months around the one shown; without it those cells are
     * empty.
     */
    readonly boundingMonth = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty })

    /**
     * The view the calendar opens on: `date` (default), `month` or `year`.
     */
    readonly startView = input<NbCalendarViewMode, NbCalendarViewModeValues>(NbCalendarViewMode.DATE, {
        transform: (viewMode) => viewMode as NbCalendarViewMode
    })

    /**
     * The earliest date that can be picked; earlier dates are disabled in the calendar and fail validation.
     */
    readonly min = input<D>()

    /**
     * The latest date that can be picked; later dates are disabled in the calendar and fail validation.
     */
    readonly max = input<D>()

    /**
     * Disables the days for which it returns `false`, in the calendar and in validation.
     */
    readonly filter = input<(date: D) => boolean>()

    /**
     * A component to render the days with, implementing `NbCalendarCell`.
     */
    readonly dayCellComponent = input<Type<NbCalendarCell<D, T>>>()

    /**
     * A component to render the months with, implementing `NbCalendarCell`.
     */
    readonly monthCellComponent = input<Type<NbCalendarCell<D, T>>>()

    /**
     * A component to render the years with, implementing `NbCalendarCell`.
     */
    readonly yearCellComponent = input<Type<NbCalendarCell<D, T>>>()

    /**
     * Size of the calendar and its cells: `medium` (default) or `large`.
     */
    readonly size = input<NbCalendarSize, NbCalendarSizeValues>(NbCalendarSize.MEDIUM, {
        transform: (size) => size as NbCalendarSize
    })

    /**
     * The date whose month the calendar opens on; the value, once there is one. Two-way bindable.
     */
    readonly visibleDate = model<D>()

    /**
     * Closes the picker once a date, or a whole range, is picked (default).
     */
    readonly hideOnSelect = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty })

    /**
     * Shows the calendar's header with the view mode button and the previous and next buttons (default).
     */
    readonly showNavigation = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty })

    /**
     * The header of the week numbers column; `#` by default.
     */
    readonly weekNumberSymbol = input<string>()

    /**
     * Shows a column with the week numbers before the days; off by default.
     */
    readonly showWeekNumber = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * The first day of the week: 0 for Sunday, 1 for Monday and so on; the locale's by default.
     */
    readonly firstDayOfWeek = input<number>()

    /**
     * The picker's distance from the input, in pixels.
     */
    readonly overlayOffset = input(8)

    /**
     * Where the picker moves when it doesn't fit below the input: to the next side `counterclockwise` (default) or
     * `clockwise`, to the opposite side `vertical`ly or `horizontal`ly, or nowhere with `noop`.
     */
    readonly adjustment = input<NbAdjustment, NbAdjustmentValues>(NbAdjustment.COUNTERCLOCKWISE, {
        transform: (adjustment) => adjustment as NbAdjustment
    })

    ngOnInit() {
        this.checkFormat()
        this.init$.next()
    }

    ngOnChanges(changes: SimpleChanges) {
        const formatChange = changes['formatInput']
        if (formatChange) {
            if (!formatChange.isFirstChange()) {
                this.checkFormat()
            }
            this.formatChanged$.next()
        }
        if (this.pickerRef) {
            this.patchWithInputs(this.pickerRef)
        }
    }

    ngOnDestroy() {
        this.hide()
        this.init$.complete()

        if (this.ref) {
            this.ref.dispose()
        }

        if (this.triggerStrategy) {
            this.triggerStrategy.destroy()
        }
    }

    protected get pickerClass(): Type<P> {
        throw new Error('NbBasePickerComponent: the picker class comes from the datepicker that extends it.')
    }

    protected get pickerValueChange(): Observable<T> {
        throw new Error('NbBasePickerComponent: the picker value changes come from the datepicker that extends it.')
    }

    get value(): T | undefined {
        return undefined
    }
    set value(value: T | undefined) {}

    protected writeQueue() {}
}

/**
 * The calendar an `input[nbDatepicker]` opens to pick a date, with `nb-calendar`'s options.
 */
@Component({
    selector: 'nb-datepicker',
    template: ''
})
export class NbDatepickerComponent<D> extends NbBasePickerComponent<D, D, NbCalendarComponent<D>> {
    protected override get pickerClass(): Type<NbCalendarComponent<D>> {
        return NbCalendarComponent
    }

    /**
     * The selected date. Two-way bindable: `dateChange` emits as a date is picked.
     */
    readonly date = model<D>()

    /**
     * What the datepicker picks: a day (`date`, default), a month or a year, as the first day of the month or year. Its
     * text is in the date service's month or year format, e.g. `2026-03`, unless `format` is set.
     */
    readonly pickerMode = input<NbCalendarPickerMode>('date')

    override get format(): string | undefined {
        const format = this.formatInput()
        if (format) {
            return format
        }
        switch (this.pickerMode()) {
            case 'month':
                return this.dateService.getMonthFormat()
            case 'year':
                return this.dateService.getYearFormat()
            default:
                return undefined
        }
    }

    protected override patchWithInputs(pickerRef: ComponentRef<NbCalendarComponent<D>>) {
        super.patchWithInputs(pickerRef)
        setComponentContext(pickerRef, { pickerMode: this.pickerMode() })
    }

    constructor() {
        super()
        // A date set from outside is shown in the calendar; a user's selection updates the model (see
        // onPickerValueChange), which emits `dateChange`.
        effect(() => {
            const date = this.date()
            // Without a date the model has nothing to show, and mustn't replace a form's value queued for the calendar.
            if (date !== undefined) {
                untracked(() => (this.value = date))
            }
        })
    }

    protected override onPickerValueChange(date: D) {
        this.date.set(date)
    }

    override get value(): D | undefined {
        return this.picker ? this.picker.date() : undefined
    }

    override set value(date: D | undefined) {
        const pickerRef = this.pickerRef
        if (!pickerRef) {
            this.queue = date
            return
        }

        if (date) {
            this.visibleDate.set(date)
            setComponentContext(pickerRef, { visibleDate: date, date })
        }
    }

    protected override get pickerValueChange(): Observable<D> {
    // It's subscribed to once the picker is created.
        return this.picker ? outputToObservable(this.picker.dateChange) : EMPTY
    }

    protected override writeQueue() {
        if (this.queue) {
            const date = this.queue
            this.queue = undefined
            this.value = date
        }
    }
}

/**
 * The calendar an `input[nbDatepicker]` opens to pick a range of dates, with `nb-calendar-range`'s options. It closes
 * once both ends are picked.
 */
@Component({
    selector: 'nb-rangepicker',
    template: ''
})
export class NbRangepickerComponent<D> extends NbBasePickerComponent<
    D,
    NbCalendarRange<D>,
    NbCalendarRangeComponent<D>
> {
    protected override get pickerClass(): Type<NbCalendarRangeComponent<D>> {
        return NbCalendarRangeComponent
    }

    /**
     * The selected range. Two-way bindable: `rangeChange` emits once with the start alone, and again with the end.
     */
    readonly range = model<NbCalendarRange<D>>()

    constructor() {
        super()
        effect(() => {
            const range = this.range()
            untracked(() => (this.value = range))
        })
    }

    protected override onPickerValueChange(range: NbCalendarRange<D>) {
        this.range.set(range)
    }

    override get value(): NbCalendarRange<D> | undefined {
        return this.picker ? this.picker.range() : undefined
    }

    override set value(range: NbCalendarRange<D> | undefined) {
        const pickerRef = this.pickerRef
        if (!pickerRef) {
            this.queue = range
            return
        }

        if (range) {
            const visibleDate = range && range.start
            this.visibleDate.set(visibleDate)
            setComponentContext(pickerRef, { visibleDate, range })
        }
    }

    protected override get pickerValueChange(): Observable<NbCalendarRange<D>> {
    // The range calendar's `range` model emits each selection; it's subscribed to once the picker is created.
    // It's only set to ranges.
        return this.picker
            ? outputToObservable(this.picker.range).pipe(filter((range): range is NbCalendarRange<D> => !!range))
            : EMPTY
    }

    override shouldHide(): boolean {
        return super.shouldHide() && !!(this.value && this.value.start && this.value.end)
    }

    protected override writeQueue() {
        if (this.queue) {
            const range = this.queue
            this.queue = undefined
            this.value = range
        }
    }
}
