import {
    afterNextRender,
    AfterViewInit,
    booleanAttribute,
    Component,
    computed,
    DestroyRef,
    effect,
    ElementRef,
    forwardRef,
    inject,
    Injector,
    input,
    linkedSignal,
    OnDestroy,
    signal,
    TemplateRef,
    untracked,
    viewChild,
    ViewEncapsulation
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms'
import {
    injectNbDefaults,
    injectNbValidationMessage,
    NbAdjustment,
    NbButtonComponent,
    NbComponentOrCustomStatus,
    NbComponentShape,
    NbComponentSize,
    nbCreateDynamicOverlayHandler,
    NbDynamicOverlay,
    NbFormFieldModule,
    NbIconComponent,
    NbInputDirective,
    NbPosition,
    NbTrigger,
    NbValidationDirective
} from '@liquid-js/lyr-core'
import {
    AlphaChannel,
    cmykToRgb,
    ColorPickerDirective,
    formatCmyk,
    formatOutput,
    hsvaToRgba,
    NXT_COLOR_PICKER_TEXTS,
    OutputFormat,
    rgbaToCmyk,
    rgbaToHsva,
    stringToCmyk,
    stringToHsva
} from 'nxt-color-picker'
import { skip } from 'rxjs'

import { NbColorPickerDialogComponent } from './color-picker-dialog.component'
import { injectNbColorPickerTexts } from './texts'

let nextDialogId = 0

/** What the dialog's buttons, sliders, presets and inputs match, to move focus into it. */
const DIALOG_FOCUSABLE = '[tabindex="0"], input, button'

/** The error kind of text that isn't a colour. */
export const NB_COLOR_PICKER_ERROR = 'nbColorPicker' as const

/** The `nbColorPicker` error, as Angular gives parse errors: its kind and its message. */
export interface NbColorPickerError {
    kind: typeof NB_COLOR_PICKER_ERROR
    message: string
}

/** The colour of a text as CSS, e.g. for the swatch: from a CSS colour or a `cmyk()` one, if it's one. */
function cssColor(text: string | null): string | undefined {
    if (!text) {
        return undefined
    }
    const cmyk = stringToCmyk(text, true)
    const hsva = stringToHsva(text, true) ?? (cmyk ? rgbaToHsva(cmykToRgb(cmyk)) : undefined)
    return hsva ? formatOutput(hsva, 'rgba', 'enabled') : undefined
}

/**
 * A field for a colour, with a swatch and a picker dialog:
 *
 * ```html
 * <nb-color-picker [formControl]="color" [presets]="['#3366ff', '#00d68f']" clearable />
 * ```
 *
 * @stacked-example(Showcase, color-picker/color-picker-showcase.component)
 *
 * ### Installation
 *
 * Install [`nxt-color-picker`](https://www.npmjs.com/package/nxt-color-picker), which draws the dialog, and import
 * `NbColorPickerComponent` from `@liquid-js/lyr-extras/color-picker`:
 *
 * ```bash
 * npm install nxt-color-picker
 * ```
 *
 * ### Usage
 *
 * It's a form control whose value is the colour as text, e.g. `#3366ff`, or `null` without one. The user picks it in
 * the dialog or types it, and with `clearable` the field has a button that clears it, as does emptying the text. It
 * has the sizes, statuses, shapes and `ghost` look of `nbInput`, and its `readonly`, without the dialog; its swatch
 * shows the colour over a checkerboard, so transparency shows:
 * @stacked-example(Sizes and statuses, color-picker/color-picker-sizes.component)
 *
 * The dialog opens below the field when it has focus, as the date picker's does, and closes when focus or a click
 * goes elsewhere. Arrow Down moves focus into it, where the sliders move with the arrow keys, Page Up and Down, Home
 * and End; Enter and Escape close it, keeping the colour, and return to the field.
 *
 * `outputFormat` picks the text the value has, `hex`, `rgba`, `hsla` or `auto`, `alphaChannel` whether it can be
 * transparent, and `cmyk` adds a CMYK input and makes the value a `cmyk()` colour. The dialog has the theme's
 * colours, with its own `color-picker-*` variables, which follow the date picker's values.
 *
 * ### Validation
 *
 * While the text isn't a colour, e.g. `#12345`, the value stays the last colour, and the field has the
 * `nbColorPicker` parse error, `{ kind, message }`, as Angular's controls report text they can't parse; so does
 * empty text in a field that isn't `clearable`. It works with `formControl`, `formControlName`, `ngModel` and signal
 * forms' `[formField]`, and with `nbValidation`:
 * @stacked-example(Validation, color-picker/color-picker-validation.component)
 *
 * ### Texts
 *
 * Its texts, and the dialog's, are in the `colorPicker` section of Lyra's texts:
 *
 * ```ts
 * provideNbTexts({ colorPicker: { clear: 'Remove the color', ok: 'Apply' } })
 * ```
 * @styles
 *
 * color-picker-background-color:
 * color-picker-border-color:
 * color-picker-border-style:
 * color-picker-border-width:
 * color-picker-border-radius:
 * color-picker-shadow:
 * color-picker-text-color:
 * color-picker-text-font-family:
 * color-picker-text-font-size:
 * color-picker-divider-color:
 * color-picker-format-arrow-color:
 */
@Component({
    selector: 'nb-color-picker',
    templateUrl: './color-picker.component.html',
    // The dialog is in the overlay container, outside the component, so its styles are global.
    encapsulation: ViewEncapsulation.None,
    styles: `
    nb-color-picker {
      display: inline-block;
      /* Lines up with fields and buttons of its size by its middle, as they do. */
      vertical-align: middle;
    }

    nb-color-picker.full-width {
      display: block;
    }

    nb-color-picker .swatch {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }

    nb-color-picker .swatch > span {
      width: 100%;
      aspect-ratio: 1;
      border-radius: 50%;
    }

    /* The colour over a 2×2 checkerboard, as in the dialog, so transparency shows. */
    nb-color-picker .swatch > span[style*='--nb-color-picker-swatch'] {
      background-image:
        linear-gradient(var(--nb-color-picker-swatch), var(--nb-color-picker-swatch)),
        conic-gradient(#fff 0 25%, #ccc 0 50%, #fff 0 75%, #ccc 0);
    }

    nb-color-picker-dialog {
      display: block;
      border: var(--color-picker-border-width) var(--color-picker-border-style) var(--color-picker-border-color);
      border-radius: var(--color-picker-border-radius);
      background: var(--color-picker-background-color);
      box-shadow: var(--color-picker-shadow);
    }

    nb-color-picker-dialog nxt-color-picker {
      display: block;
      --nxt-color-picker-background: transparent;
      --nxt-color-picker-border: none;
      /* The colours reach the frame, inside its rounded corners; the colour's mark can go past them. */
      --nxt-color-picker-border-radius: max(
        0px,
        calc(var(--color-picker-border-radius) - var(--color-picker-border-width))
      );
      --nxt-color-picker-shadow: none;
      --nxt-color-picker-text-color: var(--color-picker-text-color);
      --nxt-color-picker-font-family: var(--color-picker-text-font-family);
      --nxt-color-picker-font-size: var(--color-picker-text-font-size);
      --nxt-color-picker-border-color: var(--color-picker-divider-color);
      --nxt-color-picker-focus-outline: var(--outline-width) solid var(--outline-color);
      --nxt-color-picker-focus-outline-width: var(--outline-width);
      --nxt-color-picker-arrow-color: var(--color-picker-format-arrow-color);
      --nxt-color-picker-input-background: var(--input-basic-background-color);
      --nxt-color-picker-input-border-color: var(--input-basic-border-color);
      --nxt-color-picker-input-border-width: var(--input-border-width);
      --nxt-color-picker-input-text-color: var(--input-basic-text-color);
      --nxt-color-picker-input-placeholder-color: var(--input-basic-placeholder-text-color);
      --nxt-color-picker-input-border-radius: var(--input-rectangle-border-radius);
      --nxt-color-picker-input-hover-background: var(--input-basic-hover-background-color);
      --nxt-color-picker-input-hover-border-color: var(--input-basic-hover-border-color);
      --nxt-color-picker-input-focus-background: var(--input-basic-focus-background-color);
      --nxt-color-picker-input-focus-border-color: var(--input-basic-focus-border-color);
      --nxt-color-picker-input-disabled-background: var(--input-basic-disabled-background-color);
      --nxt-color-picker-input-disabled-border-color: var(--input-basic-disabled-border-color);
      --nxt-color-picker-input-disabled-text-color: var(--input-basic-disabled-text-color);
      --nxt-color-picker-button-color: var(--button-filled-basic-text-color);
      --nxt-color-picker-button-background: var(--button-filled-basic-background-color);
      --nxt-color-picker-button-border: var(--button-filled-border-width) var(--button-filled-border-style)
        var(--button-filled-basic-border-color);
      --nxt-color-picker-button-border-radius: var(--button-rectangle-border-radius);
      --nxt-color-picker-button-font-size: var(--button-small-text-font-size);
      --nxt-color-picker-button-font-weight: var(--button-text-font-weight);
    }
  `,
    imports: [ColorPickerDirective, NbButtonComponent, NbFormFieldModule, NbIconComponent, NbInputDirective],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NbColorPickerComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => NbColorPickerComponent), multi: true },
        // The dialog's texts follow Lyra's.
        { provide: NXT_COLOR_PICKER_TEXTS, useFactory: injectNbColorPickerTexts }
    ],
    host: {
        '[class.full-width]': 'fullWidth()'
    }
})
export class NbColorPickerComponent implements ControlValueAccessor, Validator, AfterViewInit, OnDestroy {
    // The app's defaults for fields, which the inputs below start from.
    protected readonly nbDefaults = injectNbDefaults('input')

    protected readonly texts = injectNbColorPickerTexts()
    protected readonly message = injectNbValidationMessage()
    protected readonly validation = inject(NbValidationDirective, { self: true, optional: true })

    /** Field size: `tiny`, `small`, `medium` (default), `large` or `giant`. */
    readonly sizeInput = input<NbComponentSize | undefined>(undefined, { alias: 'size' })
    /** The size in use: the input's, the app's default, or 'medium'. */
    readonly size = linkedSignal<NbComponentSize>(() => this.sizeInput() ?? this.nbDefaults().size ?? 'medium')
    /** Field status: `basic` (default), `primary`, `info`, `success`, `warning`, `danger` or `control`. */
    readonly status = input<NbComponentOrCustomStatus>('basic')
    /** Field shape: `rectangle` (default), `semi-round` or `round`. */
    readonly shapeInput = input<NbComponentShape | undefined>(undefined, { alias: 'shape' })
    /** The shape in use: the input's, the app's default, or 'rectangle'. */
    readonly shape = linkedSignal<NbComponentShape>(() => this.shapeInput() ?? this.nbDefaults().shape ?? 'rectangle')
    /** Makes the field as wide as its container. */
    readonly fullWidth = input(false, { transform: booleanAttribute })
    /** Shows the field without its background and border, as `nbInput`'s `ghost` does. */
    readonly ghost = input(false, { transform: booleanAttribute })
    readonly placeholder = input('')
    /** Lets the user read and select the colour, but not change it, as a read-only field; its dialog doesn't open. */
    readonly readonly = input(false, { transform: booleanAttribute })
    /** Names the field when there's no `aria-labelledby`; "Color" by default. */
    readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' })
    /** The id of the element that names the field, e.g. a `label`. */
    readonly ariaLabelledBy = input<string | undefined>(undefined, { alias: 'aria-labelledby' })

    /** What labels the field: its own `aria-labelledby` and an `nbLabel` of its `nbValidation`. */
    protected readonly fieldLabelledBy = computed(
        () => [this.ariaLabelledBy(), this.validation?.labelledBy()].filter(Boolean).join(' ') || null
    )

    /** The text of the value: `hex`, `rgba`, `hsla` or `auto`, which keeps the format a colour is typed in. */
    readonly outputFormat = input<OutputFormat>('auto')
    /** Whether the colour can be transparent. */
    readonly alphaChannel = input<AlphaChannel>('enabled')
    /** Adds a CMYK input to the dialog and makes the value a `cmyk()` colour. */
    readonly cmyk = input(false, { transform: booleanAttribute })
    /** Colours to pick from in the dialog. */
    readonly presets = input<string[]>()
    /** The dialog's distance from the field, in pixels. */
    readonly overlayOffset = input(8)
    /** Shows a button that clears the colour, and lets emptying the text clear it. */
    readonly clearable = input(false, { transform: booleanAttribute })
    readonly disabled = input(false, { transform: booleanAttribute })

    /** The colour, as text: the form value, `null` without one. */
    protected readonly value = signal<string | null>(null)
    /** The text the field shows; typing doesn't change it, so it doesn't replace what's typed. */
    protected readonly text = signal('')
    protected readonly swatch = computed(() => cssColor(this.value()))
    protected readonly isDisabled = linkedSignal(() => this.disabled())
    protected readonly resolvedStatus = computed(() => this.validation?.status() ?? this.status())
    /** The field's buttons are white on colour, with the `control` status, and grey otherwise. */
    protected readonly buttonStatus = computed(() => (this.resolvedStatus() === 'control' ? 'control' : 'basic'))
    /** Whether the text isn't a colour. */
    protected readonly parseError = signal(false)
    protected readonly open = signal(false)

    protected readonly field = viewChild<ElementRef<HTMLInputElement>>('field')
    protected readonly dialog = viewChild.required<TemplateRef<unknown>>('dialog')

    // The dialog opens in an overlay by the field, on focus, and closes when focus and clicks go elsewhere, as the date
    // picker's does.
    private readonly overlayHandler = nbCreateDynamicOverlayHandler()
    private overlay?: NbDynamicOverlay
    private readonly injector = inject(Injector)
    private readonly destroyRef = inject(DestroyRef)
    /** The id of the dialog, which the field controls while it's open. */
    protected readonly dialogId = `nb-color-picker-dialog-${nextDialogId++}`
    /** Whether Enter went down in the dialog, so it closes the dialog when it comes up there. */
    private enterInDialog = false

    protected onChange: (value: string | null) => void = () => {}
    protected onTouched: () => void = () => {}
    protected onValidatorChange: () => void = () => {}

    constructor() {
    // The field is the control: it gets the validation's ARIA, not the host.
        this.validation?.delegateAria()

        // Before the overlay is built, rebuilding it does nothing.
        effect(() => {
            this.overlayHandler.offset(this.overlayOffset()).disabled(this.isDisabled() || this.readonly())
            untracked(() => this.overlayHandler.rebuild())
        })
    }

    ngAfterViewInit() {
        const field = this.field()
        if (!field) {
            return
        }
        const overlay = this.overlayHandler
            .host(field)
            .componentType(NbColorPickerDialogComponent)
            .trigger(NbTrigger.FOCUS)
        // Below the field, or where there's room, as the pickers' overlays are.
            .position(NbPosition.BOTTOM)
            .adjustment(NbAdjustment.COUNTERCLOCKWISE)
            .offset(this.overlayOffset())
            .content(this.dialog())
            .disabled(this.isDisabled() || this.readonly())
            .build()
        this.overlay = overlay
        overlay.isShown.pipe(skip(1), takeUntilDestroyed(this.destroyRef)).subscribe((shown) => {
            if (shown) {
                this.open.set(true)
            } else {
                this.onClose()
            }
        })
    }

    ngOnDestroy() {
        this.overlayHandler.destroy()
    }

    writeValue(value?: string | null) {
        this.value.set(value || null)
        this.setParseError(false)
        this.show(value || '')
    }

    registerOnChange(fn: (value: string | null) => void) {
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

    /** The parse error of text that isn't a colour. */
    validate(): ValidationErrors | null {
        if (!this.parseError()) {
            return null
        }
        // The app's message for the kind, or the colour picker's text.
        const error: NbColorPickerError = { kind: NB_COLOR_PICKER_ERROR, message: this.texts().invalid }
        const message = this.message({ kind: NB_COLOR_PICKER_ERROR, params: error })
        return { [NB_COLOR_PICKER_ERROR]: { ...error, message } }
    }

    /**
     * Clears the colour. The button goes away with it, so focus goes from the button to the field when it was there by
     * keyboard.
     */
    clear(event?: Event) {
        this.setParseError(false)
        this.update(null)
        this.show('')
        this.onTouched()
        if ((event?.currentTarget as HTMLElement | undefined)?.matches(':focus-visible')) {
            this.field()?.nativeElement.focus()
        }
    }

    /** @internal */
    onColorChange(color: string) {
        if (!this.cmyk()) {
            this.changed(color)
        }
    }

    /** @internal */
    onCmykChange(color: string) {
        if (this.cmyk()) {
            this.changed(color)
        }
    }

    /** @internal */
    onInput(event: Event) {
        const text = (event.target as HTMLInputElement).value.trim()
        if (!text && this.clearable()) {
            this.setParseError(false)
            this.update(null)
        } else {
            // Text that is a colour is the value, in the value's format; the field keeps the text while it's typed in.
            const color = this.typedColor(text)
            this.setParseError(!color)
            if (color) {
                this.update(color)
            }
        }
        // Signal forms only check a value accessor's validators again when they're told to.
        this.onValidatorChange()
    }

    /**
     * Arrow Down moves into the dialog, opening it if needed, and Escape closes it.
     *
     * @internal
     */
    onFieldKeydown(event: KeyboardEvent) {
        if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) {
            return
        }
        if (event.key === 'ArrowDown' && !this.isDisabled() && !this.readonly()) {
            event.preventDefault()
            this.focusDialog()
        } else if (event.key === 'Escape' && this.open()) {
            // Only the colour picker closes, not a dialog or window the field is in.
            event.preventDefault()
            event.stopPropagation()
            this.overlay?.hide()
        }
    }

    /**
     * Enter and Escape close the dialog, keeping the colour, and return to the field.
     *
     * @internal
     */
    onDialogKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            // Only the colour picker closes, not a dialog or window the field is in.
            event.preventDefault()
            event.stopPropagation()
            this.closeDialog()
        } else if (event.key === 'Enter') {
            this.enterInDialog = true
        }
    }

    /**
     * Enter closes the dialog when it comes up, once the dialog's inputs have taken what was typed in them.
     *
     * @internal
     */
    onDialogKeyup(event: KeyboardEvent) {
        if (event.key === 'Enter' && this.enterInDialog) {
            this.enterInDialog = false
            event.preventDefault()
            this.closeDialog()
        }
    }

    /** @internal */
    onBlur() {
        if (!this.open()) {
            this.leave()
        }
    }

    /** The dialog closed: the field is touched once focus is elsewhere. */
    protected onClose() {
        this.open.set(false)
        this.enterInDialog = false
        if (!this.focused()) {
            this.leave()
        }
    }

    /** Opens the dialog if needed, and moves focus to its first control. */
    protected focusDialog() {
        if (!this.open()) {
            this.overlay?.show()
        }
        afterNextRender(() => this.overlay?.containerElement?.querySelector<HTMLElement>(DIALOG_FOCUSABLE)?.focus(), {
            injector: this.injector
        })
    }

    /** Closes the dialog, with focus back in the field. */
    protected closeDialog() {
    // Focus first: the field opens the dialog on focus, unless it's open.
        this.field()?.nativeElement.focus()
        this.overlay?.hide()
    }

    /**
     * The value for typed text that is a colour, in the value's format, as the dialog gives it for a colour picked in
     * it: without transparency where the format has none, and as `cmyk()` with `cmyk`.
     */
    protected typedColor(text: string): string | undefined {
        const hsva = stringToHsva(text, true)
        const cmyk = stringToCmyk(text, true)
        const format = this.outputFormat()
        const alpha = this.alphaChannel()
        const alphaChannel = format === 'hex' && alpha !== 'always' && alpha !== 'forced' ? 'disabled' : alpha
        if (alphaChannel === 'disabled') {
            if (hsva) {
                hsva.a = 1
            }
            if (cmyk) {
                cmyk.a = 1
            }
        }
        if (this.cmyk()) {
            const value = cmyk ?? (hsva && rgbaToCmyk(hsvaToRgba(hsva)))
            return value ? formatCmyk(value, alphaChannel) : undefined
        }
        const color = hsva ?? (cmyk && rgbaToHsva(cmykToRgb(cmyk)))
        return color ? formatOutput(color, format, alphaChannel) : undefined
    }

    /** The field shows the colour, as the value has it, unless the text isn't one, and the field is touched. */
    protected leave() {
        if (!this.parseError()) {
            this.show(this.value() ?? '')
        }
        this.onTouched()
    }

    /** A colour picked in the dialog, which the field shows, also while it has focus, e.g. as the colours are dragged. */
    protected changed(color: string) {
        this.setParseError(false)
        this.update(color)
        this.show(color)
    }

    protected update(color: string | null) {
        const value = color || null
        if (value !== this.value()) {
            this.value.set(value)
            this.onChange(value)
        }
    }

    /** Whether the field has focus, e.g. while the user types. */
    protected focused() {
        const field = this.field()?.nativeElement
        return !!field && field.ownerDocument.activeElement === field
    }

    /** Shows a text in the field. */
    protected show(text: string) {
        this.text.set(text)
        const field = this.field()?.nativeElement
        if (field && field.value !== text) {
            field.value = text
        }
    }

    protected setParseError(parseError: boolean) {
        if (parseError !== this.parseError()) {
            this.parseError.set(parseError)
            this.onValidatorChange()
        }
    }
}
