import {
    afterNextRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    forwardRef,
    inject,
    Injector,
    input,
    linkedSignal,
    LOCALE_ID,
    model,
    OnInit,
    resource,
    signal,
    untracked,
    viewChild,
    ViewEncapsulation
} from '@angular/core'
import {
    ControlValueAccessor,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidationErrors,
    Validator
} from '@angular/forms'
import {
    injectNbDefaults,
    NbAutocompleteComponent,
    NbAutocompleteDirective,
    NbButtonComponent,
    NbComponentOrCustomStatus,
    NbComponentShape,
    NbComponentSize,
    NbFormFieldComponent,
    NbIconComponent,
    NbInputDirective,
    NbOptionComponent,
    NbPrefixDirective,
    NbValidationDirective
} from '@liquid-js/lyr-core'
import {
    CountryCode,
    getCountries,
    getCountryCallingCode,
    getExampleNumber,
    PhoneNumber
} from 'libphonenumber-js'
import examples from 'libphonenumber-js/mobile/examples'
import { FlagComponent, FlagDatabase, FlagDatabaseKey } from 'nxt-flags'

import { loadCountryNames, NB_COUNTRY_NAMES } from './country-names'
import {
    checkPhoneNumber,
    localeCountry,
    NB_PHONE_NUMBER_ERROR,
    parsePhoneNumber,
    phoneNumberContext,
    phoneNumberError
} from './phone-number.validator'
import { injectNbPhoneInputTexts } from './texts'

/** A country in the list. */
interface NbPhoneCountry {
    code: CountryCode
    name: string
    callingCode: string
    /** The names, the calling code and the ISO code, as the search compares them. */
    search: string
}

/**
 * Flags of phone regions that aren't ISO countries: Ascension and Tristan da Cunha are part of Saint Helena, Ascension
 * and Tristan da Cunha (SH), whose flag they show.
 */
const flagFallbacks: Partial<Record<CountryCode, FlagDatabaseKey>> = { AC: 'sh', TA: 'sh' }

const allCountries = new Set<string>(getCountries())

/** Text as the search compares it, without case and accents. */
const fold = (text: string) =>
    text
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLocaleLowerCase()

/**
 * A phone number field with the country's flag, which picks the country:
 *
 * ```html
 * <nb-phone-input formControlName="phone" />
 * ```
 *
 * @stacked-example(Showcase, phone-input/phone-input-showcase.component)
 *
 * ### Installation
 *
 * It parses and formats numbers with [`libphonenumber-js`](https://www.npmjs.com/package/libphonenumber-js), names
 * the countries with [`i18n-iso-countries`](https://www.npmjs.com/package/i18n-iso-countries)' language files, and
 * shows flags with [`nxt-flags`](https://www.npmjs.com/package/nxt-flags); install them and import
 * `NbPhoneInputComponent` from `@liquid-js/lyr-extras/phone-input`.
 *
 * ```sh
 * npm install libphonenumber-js i18n-iso-countries nxt-flags
 * ```
 *
 * The flags are images the app serves from `assets/flags`; add them to the assets in `angular.json`:
 *
 * ```json
 * { "glob": "*.svg", "input": "node_modules/nxt-flags/assets/flags", "output": "assets/flags" }
 * ```
 *
 * To serve them from elsewhere, e.g. a CDN, set the path with `provideFlagsPath()` from `nxt-flags`.
 *
 * ### Usage
 *
 * The user types the number in their country's format or with a calling code, e.g. `+44`, which picks the country.
 * The flag button replaces the field with a search of the countries, by name or calling code; Escape goes back.
 * The country is the one of the app's locale (`LOCALE_ID`) until the user or a number picks another, or set it with
 * `country`, which also tells which one is picked. It has the sizes, statuses, shapes and `ghost` look of `nbInput`,
 * and its `placeholder` and `readonly`; the placeholder is an example number of the country by default.
 * @stacked-example(Sizes and statuses, phone-input/phone-input-sizes.component)
 *
 * The value is the number in the `E.164` format, e.g. `+12015550123`, or `null` without one; when the field leaves,
 * it shows the number in its country's format, `(201) 555-0123`. While the text isn't a valid number, the value
 * stays the last valid one, or `null`, and the field has the `nbPhoneNumber` parse error,
 * `{ kind, problem: 'invalid', message }`, as Angular's controls report text they can't parse; so validators never
 * see the text. A number from a country that isn't in `countries`, which the list offers, has the same error with
 * `problem: 'country'`. The errors work in reactive, template-driven and signal forms alike.
 *
 * It works with `formControl`, `formControlName`, `ngModel` and signal forms' `[formField]`.
 * @stacked-example(Validation, phone-input/phone-input-validation.component)
 *
 * ### Validators
 *
 * Phone numbers in other fields, e.g. a text field or data from elsewhere, are checked the same way with validators:
 * `nbPhoneNumberValidator(options)` in reactive forms, the `nbPhoneNumber` attribute in template-driven forms, and
 * `nbPhoneNumber(path, options)` in signal forms. The options are the `country` of numbers without a
 * calling code, the app locale's by default, and the `countries` whose numbers pass, each a value or a function that
 * gives it, and the `message` of the errors, a text or a function of what's wrong, in place of the app's. Their
 * `nbPhoneNumber` error says what's wrong, `invalid` or `country`, with its message.
 *
 * ```ts
 * readonly phone = new FormControl<string | null>(null, nbPhoneNumberValidator({ countries: ['US', 'CA'] }));
 *
 * readonly contactForm = form(this.contact, (path) => {
 *   nbPhoneNumber(path.phone, { countries: ['GB'] });
 * });
 * ```
 *
 * ```html
 * <input nbInput type="tel" name="support" ngModel nbPhoneNumber [nbPhoneNumberCountries]="['US', 'CA']" />
 * ```
 *
 * ### Country names
 *
 * The countries are named in English. For other languages, provide the language file of `i18n-iso-countries`, e.g.
 * per locale's build, or loaded by `LOCALE_ID`:
 *
 * ```ts
 * providers: [provideNbCountryNames(() => import('i18n-iso-countries/langs/de.json'))]
 * ```
 *
 * Countries without a name in the file aren't in the list; their numbers are still accepted.
 */
@Component({
    selector: 'nb-phone-input',
    templateUrl: './phone-input.component.html',
    styleUrl: './phone-input.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NbFormFieldComponent,
        NbPrefixDirective,
        NbButtonComponent,
        NbIconComponent,
        NbInputDirective,
        NbAutocompleteDirective,
        NbAutocompleteComponent,
        NbOptionComponent,
        FlagComponent
    ],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NbPhoneInputComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => NbPhoneInputComponent), multi: true }
    ],
    host: {
        'class': 'nb-phone-input',
        '[class.full-width]': 'fullWidth()'
    }
})
export class NbPhoneInputComponent implements OnInit, ControlValueAccessor, Validator {
    // The app's defaults for fields, which the inputs below start from.
    protected readonly nbDefaults = injectNbDefaults('input')

    protected readonly texts = injectNbPhoneInputTexts()
    /** Where its errors take their messages from. */
    protected readonly errorContext = phoneNumberContext()
    protected readonly locale = inject(LOCALE_ID)
    protected readonly injector = inject(Injector)
    protected readonly validation = inject(NbValidationDirective, { self: true, optional: true })

    /**
     * The country of the number: the app locale's country at first, unless it's set, then the one the user or the number
     * picks.
     */
    readonly country = model<CountryCode>()
    /** The countries in the list, whose numbers pass, all by default. */
    readonly countries = input<ReadonlyArray<CountryCode>>()
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
    readonly fullWidth = input(false, { transform: booleanAttribute })
    /** Shows the field without its background and border, as `nbInput`'s `ghost` does. */
    readonly ghost = input(false, { transform: booleanAttribute })
    readonly disabled = input(false, { transform: booleanAttribute })
    /** Lets the user read and select the number, but not change it or its country, as a read-only field. */
    readonly readonly = input(false, { transform: booleanAttribute })
    /** The number field's placeholder; an example number of the country by default. */
    readonly placeholder = input<string>()
    /** The country list's distance from the search field, as other fields' overlays have it. */
    readonly overlayOffset = input(8)
    /** Names the number field when there's no `aria-labelledby`; "Phone number" by default. */
    readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' })
    /** The id of the element that names the number field, e.g. a `label`. */
    readonly ariaLabelledBy = input<string | undefined>(undefined, { alias: 'aria-labelledby' })

    /** What labels the field: its own `aria-labelledby` and an `nbLabel` of its `nbValidation`. */
    protected readonly fieldLabelledBy = computed(
        () => [this.ariaLabelledBy(), this.validation?.labelledBy()].filter(Boolean).join(' ') || null
    )

    /** The country the number is parsed in, the locale's until `country` has one. */
    readonly selectedCountry = computed(() => this.country() ?? localeCountry(this.locale))

    constructor() {
    // The number field is the control: it gets the validation's ARIA, not the host.
        this.validation?.delegateAria()
        // Another list of countries can change whether the number passes.
        effect(() => {
            this.countries()
            untracked(() => this.onValidatorChange())
        })
    }

    ngOnInit() {
    // `country` tells the country the field uses from the start, also when the binding gives none.
        if (!this.country()) {
            this.pickCountry(localeCountry(this.locale))
        }
    }

    protected readonly isDisabled = linkedSignal(() => this.disabled())
    protected readonly resolvedStatus = computed(() => this.validation?.status() ?? this.status())
    /** The field's buttons are white on colour, with the `control` status, and grey otherwise. */
    protected readonly buttonStatus = computed(() => (this.resolvedStatus() === 'control' ? 'control' : 'basic'))
    /** The number as the field shows it. */
    protected readonly text = signal('')
    /** Whether the text isn't a valid number. */
    protected readonly parseError = signal(false)
    /** Whether the search of the countries replaces the number field. */
    protected readonly picking = signal(false)
    protected readonly query = signal('')
    protected readonly namesSource = inject(NB_COUNTRY_NAMES)
    protected readonly names = resource({ loader: () => loadCountryNames(this.namesSource) })

    /** The countries with a name, in the language's order. */
    protected readonly list = computed(() => {
        const names = this.names.hasValue() ? this.names.value().countries : {}
        const only = this.countries()
        const codes = only ? only.filter((code) => allCountries.has(code)) : (getCountries() as CountryCode[])
        const list = new Array<NbPhoneCountry>()
        for (const code of codes) {
            const name = names[code]
            const all = Array.isArray(name) ? name : name ? [name] : []
            if (all.length) {
                const callingCode = getCountryCallingCode(code)
                list.push({ code, name: all[0], callingCode, search: fold(`${all.join(' ')} +${callingCode} ${code}`) })
            }
        }
        const collator = new Intl.Collator(this.locale)
        return list.sort((a, b) => collator.compare(a.name, b.name))
    })

    /** The countries the search finds. */
    protected readonly shown = computed(() => {
        const words = fold(this.query()).split(/\s+/).filter(Boolean)
        return this.list().filter((country) => words.every((word) => country.search.includes(word)))
    })

    protected readonly countryName = computed(() => {
        const code = this.selectedCountry()
        return code && (this.list().find((country) => country.code === code)?.name ?? code)
    })

    protected readonly countryLabel = computed(() => {
        const name = this.countryName()
        return name ? this.texts().country(name) : this.texts().noCountry
    })

    /** An example number of the country, in its format. */
    protected readonly example = computed(() => {
        const code = this.selectedCountry()
        return code ? (getExampleNumber(code, examples)?.formatNational() ?? '') : ''
    })

    protected readonly numberField = viewChild.required<ElementRef<HTMLInputElement>>('number')
    protected readonly searchField = viewChild.required<ElementRef<HTMLInputElement>>('search')

    /** The value last given to the form, `null` without one. */
    protected value: string | null = null
    protected onChange: (value: string | null) => void = () => {}
    protected onTouched: () => void = () => {}
    protected onValidatorChange: () => void = () => {}

    // Untracked, as forms write values from wherever the app sets them, e.g. an effect that mustn't come to depend
    // on the control.
    writeValue(value?: string | null) {
        untracked(() => {
            const text = value ?? ''
            const number = this.parse(text)
            this.pickCountry(number?.country)
            this.text.set(number ? this.display(number) : text)
            this.value = value ?? null
            this.setParseError(false)
        })
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

    /** The parse error of text that isn't a valid number, or the error of a number from a country not in `countries`. */
    validate(): ValidationErrors | null {
        const problem = this.parseError()
            ? 'invalid'
            : checkPhoneNumber(this.value, this.selectedCountry(), this.countries())
        return problem ? { [NB_PHONE_NUMBER_ERROR]: phoneNumberError(this.errorContext, problem) } : null
    }

    /** Moves focus to the number. */
    focus() {
        this.numberField().nativeElement.focus()
    }

    /** Sets `country`, when it's another. */
    protected pickCountry(code?: CountryCode) {
        if (code && code !== this.country()) {
            this.country.set(code)
        }
    }

    /** The flag of a country, the unknown flag without one. */
    protected flag(code?: CountryCode): FlagDatabaseKey {
        const key = code?.toLowerCase()
        return (code && flagFallbacks[code]) ?? (key && key in FlagDatabase ? (key as FlagDatabaseKey) : 'xx')
    }

    protected typed(event: Event) {
        const text = (event.target as HTMLInputElement).value
        this.text.set(text)
        // A number with a calling code picks its country.
        this.pickCountry(this.parse(text)?.country)
        this.update()
    }

    protected left() {
        const number = this.parse(this.text())
        if (number) {
            this.text.set(this.display(number))
        }
        this.onTouched()
    }

    /** Replaces the number field with the search of the countries, whose list opens. */
    protected pick() {
        if (this.isDisabled() || this.readonly()) {
            return
        }
        const search = this.searchField().nativeElement
        search.value = ''
        this.query.set('')
        this.picking.set(true)
        afterNextRender(() => search.focus(), { injector: this.injector })
    }

    protected searched(event: Event) {
        this.query.set((event.target as HTMLInputElement).value)
    }

    protected chose(country?: NbPhoneCountry | string) {
        if (country && typeof country !== 'string') {
            this.country.set(country.code)
            // The text is a number of the new country.
            this.update()
        }
        this.stopPicking(true)
    }

    /**
     * Escape in the search goes back to the number, the list closing too; it's handled, so nothing else closes, e.g. a
     * dialog around it.
     */
    protected searchEscaped(event: Event) {
        event.preventDefault()
        this.stopPicking(true)
    }

    /** Leaving the search touches the control, as leaving an autocomplete's input does. */
    protected searchLeft() {
        this.stopPicking(false)
        this.onTouched()
    }

    /**
     * Shows the number field again, and moves focus to it after Escape or picking a country, which can come after the
     * search field lost focus to the list.
     */
    protected stopPicking(focus: boolean) {
        this.picking.set(false)
        if (focus) {
            afterNextRender(() => this.focus(), { injector: this.injector })
        }
    }

    /** What the search field shows: the text typed in it, or the name of the country picked. */
    protected readonly displayCountry = (value?: NbPhoneCountry | string) =>
        typeof value === 'string' ? value : (value?.name ?? '')

    /** The valid number in the text, in the picked country unless it has a calling code. */
    protected parse(text: string): PhoneNumber | undefined {
        return parsePhoneNumber(text, this.selectedCountry())
    }

    /** A number as the field shows it: in its country's format, or international without one. */
    protected display(number: PhoneNumber) {
        return number.country ? number.formatNational() : number.formatInternational()
    }

    /**
     * Gives the form the number in the text, when it's another; while the text isn't a valid number, the value stays
     * and the field has the parse error.
     */
    protected update() {
        const text = this.text().trim()
        const number = text ? this.parse(text) : undefined
        this.setParseError(!!text && !number)
        const value = number?.number ?? null
        if ((!text || number) && value !== this.value) {
            this.value = value
            this.onChange(value)
        }
        // Signal forms only check a value accessor's validators again when they're told to, e.g. for a number of a
        // country `countries` leaves out.
        this.onValidatorChange()
    }

    protected setParseError(parseError: boolean) {
        if (parseError !== this.parseError()) {
            this.parseError.set(parseError)
            this.onValidatorChange()
        }
    }
}
