import { Component, computed, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import {
    NbButtonComponent,
    NbCheckboxComponent,
    NbComponentDefaultsType,
    NbIconComponent,
    NbInputDirective,
    NbOptionComponent,
    NbSelectComponent,
    NbSliderComponent
} from '@liquid-js/lyr-core'
import { NbColorPickerComponent } from '@liquid-js/lyr-extras/color-picker'

import { AA_CONTRAST, BASIC_SHADES, MINIMUM_CONTRAST, shades } from './palette'
import { NgdThemeDrafts, themeLabel } from './theme-drafts.service'
import { BASE_THEMES, NgdThemeStatus, THEME_STATUSES } from './theme-editor-state'
import { hintTextContrast, readableStatusText, statusTextContrast, themeValue } from './theme-export'

/** A default a component type can have of its own, over the one for all of them. */
interface NgdOverride {
    type: NbComponentDefaultsType
    label: string
    /** The type's values, where it has only some of the default's. */
    values?: string[]
    /** The type's value without a default. */
    builtIn: string
    /** Whether the default for all of them reaches the type; avatars and pagination aren't controls. */
    inherits?: boolean
}

/** A default for all the components that have it: its field sets it, and its panel the types' own. */
interface NgdDefaultField {
    name: 'shape' | 'size' | 'appearance'
    label: string
    values: string[]
    /** The value that's the same as none, listed with the others. */
    builtIn?: string
    /** None, where it isn't one of the values. */
    unset?: string
    overrides: NgdOverride[]
}

const SHAPES = ['rectangle', 'semi-round', 'round']
const SIZES = ['tiny', 'small', 'medium', 'large', 'giant']

const DEFAULT_FIELDS: NgdDefaultField[] = [
    {
        name: 'shape',
        label: 'Shape',
        values: SHAPES,
        builtIn: 'rectangle',
        overrides: [
            { type: 'button', label: 'Buttons', builtIn: 'rectangle' },
            { type: 'buttonGroup', label: 'Button groups', builtIn: 'rectangle' },
            { type: 'input', label: 'Inputs', builtIn: 'rectangle' },
            { type: 'select', label: 'Selects', builtIn: 'rectangle' },
            { type: 'fileDrop', label: 'File drops', builtIn: 'rectangle' },
            { type: 'user', label: 'Avatars', builtIn: 'round', inherits: false }
        ]
    },
    {
        name: 'size',
        label: 'Size',
        values: SIZES,
        builtIn: 'medium',
        overrides: [
            { type: 'button', label: 'Buttons', builtIn: 'medium' },
            { type: 'buttonGroup', label: 'Button groups', builtIn: 'medium' },
            { type: 'input', label: 'Inputs', builtIn: 'medium' },
            { type: 'select', label: 'Selects', builtIn: 'medium' },
            { type: 'tag', label: 'Tags', builtIn: 'medium' },
            { type: 'checkbox', label: 'Checkboxes', builtIn: 'medium' },
            { type: 'radio', label: 'Radios', builtIn: 'medium' },
            { type: 'toggle', label: 'Toggles', builtIn: 'medium' },
            { type: 'slider', label: 'Sliders', builtIn: 'medium' },
            { type: 'fileDrop', label: 'File drops', builtIn: 'medium' },
            { type: 'user', label: 'Avatars', builtIn: 'medium', inherits: false },
            { type: 'pagination', label: 'Pagination', builtIn: 'small', inherits: false }
        ]
    },
    {
        name: 'appearance',
        label: 'Appearance',
        values: ['filled', 'outline', 'ghost', 'hero', 'floating'],
        unset: 'Each component\'s own',
        overrides: [
            { type: 'button', label: 'Buttons', values: ['filled', 'outline', 'ghost', 'hero'], builtIn: 'filled' },
            { type: 'buttonGroup', label: 'Button groups', values: ['filled', 'outline', 'ghost'], builtIn: 'filled' },
            { type: 'select', label: 'Selects', values: ['outline', 'filled', 'hero', 'ghost'], builtIn: 'outline' },
            { type: 'tag', label: 'Tags', values: ['filled', 'outline', 'hero'], builtIn: 'filled' },
            { type: 'alert', label: 'Alerts', values: ['filled', 'outline', 'accent'], builtIn: 'filled' },
            { type: 'card', label: 'Cards', values: ['outline', 'filled', 'floating'], builtIn: 'outline' },
            { type: 'chat', label: 'Chats', values: ['outline', 'floating'], builtIn: 'outline' },
            { type: 'accordion', label: 'Accordions', values: ['outline', 'floating'], builtIn: 'outline' },
            { type: 'table', label: 'Tables', values: ['outline', 'floating'], builtIn: 'outline' },
            { type: 'treeGrid', label: 'Tree grids', values: ['outline', 'floating'], builtIn: 'outline' }
        ]
    }
]

/** The backgrounds and text the controls set, by theme variable. */
const SURFACE_FIELDS = [
    { key: 'layout-background-color', label: 'Page background' },
    { key: 'background-basic-color-1', label: 'Cards and menus' },
    { key: 'header-background-color', label: 'Header' },
    { key: 'sidebar-background-color', label: 'Sidebar' },
    { key: 'text-basic-color', label: 'Text' },
    { key: 'text-heading-color', label: 'Headings' },
    { key: 'text-hint-color', label: 'Hint text' }
]

/** The text case of buttons' and tabs' labels, by the theme variables that set it. */
const TEXT_CASE_KEYS = [
    'button-filled-text-transform',
    'button-outline-text-transform',
    'button-ghost-text-transform',
    'button-hero-text-transform',
    'tabset-tab-text-transform',
    'route-tabset-tab-text-transform'
]
const SURFACE_KEYS = new Set(SURFACE_FIELDS.map(({ key }) => key))

let nextId = 0

/**
 * The theme editor's controls: base theme, status and basic colours with their shades, backgrounds and text, fonts,
 * corner radius, text size, and the components' defaults, each for all of them with the types' own in a panel. They
 * edit the theme `NgdThemeDrafts` has open, on the editor page and in its pop-up.
 */
@Component({
    selector: 'ngd-theme-controls',
    templateUrl: './theme-controls.component.html',
    styleUrls: ['./theme-controls.component.scss'],
    imports: [
        FormsModule,
        NbButtonComponent,
        NbCheckboxComponent,
        NbColorPickerComponent,
        NbIconComponent,
        NbInputDirective,
        NbOptionComponent,
        NbSelectComponent,
        NbSliderComponent
    ]
})
export class NgdThemeControlsComponent {
    protected readonly themes = inject(NgdThemeDrafts)
    protected readonly draft = this.themes.draft
    /** The theme's variables it has no controls for, e.g. a showcase's. */
    protected readonly otherVariables = computed(() =>
        Object.entries(this.draft().variables ?? {}).filter(([key]) => !SURFACE_KEYS.has(key) && !TEXT_CASE_KEYS.includes(key))
    )
    protected readonly id = `ngd-theme-${nextId++}`

    protected readonly bases = BASE_THEMES
    protected readonly statuses = THEME_STATUSES
    protected readonly defaultFields = DEFAULT_FIELDS
    protected readonly surfaceFields = SURFACE_FIELDS
    protected readonly label = themeLabel
    protected readonly palettes = computed(() => {
        const { colors } = this.draft()
        return Object.fromEntries(this.statuses.map((status) => [status, shades(colors[status])]))
    })

    /** A variable's value as the theme has it: set, or following its base theme's, e.g. a background the greys'. */
    protected readonly valueOf = computed(() => {
        const variables = this.themes.variables()
        const base = this.themes.baseValues()
        return (key: string) => themeValue(variables, base, key)
    })
    protected readonly basic = computed(() => this.draft().basic ?? this.valueOf()('color-basic-600'))
    /** Buttons' and tabs' text case: in capitals, as most base themes have it, or as written. */
    protected readonly textCase = computed(() => this.valueOf()(TEXT_CASE_KEYS[0]))
    protected readonly textCaseOptions = [
        { value: 'uppercase', label: 'In capitals' },
        { value: 'none', label: 'As written' }
    ]

    protected setTextCase(value: string | null) {
        if (!value) {
            return
        }
        const base = this.themes.baseValues()
        for (const key of TEXT_CASE_KEYS) {
            this.themes.setVariable(key, value === String(base[key]?.value ?? '') ? null : value)
        }
    }
    protected readonly greys = computed(() => BASIC_SHADES.map((shade) => this.valueOf()(`color-basic-${shade}`)))

    /** Whether the theme holds text to the stricter 4.5:1 of WCAG AA for small text, over the 3:1 it's held to by default. */
    protected readonly aa = signal(false)
    protected readonly target = computed(() => (this.aa() ? AA_CONTRAST : MINIMUM_CONTRAST))
    /** How each status's text reads on the backgrounds, and the shades that would read: the helper by each colour. */
    protected readonly contrastOf = computed(() => {
        const variables = this.themes.variables()
        const base = this.themes.baseValues()
        const target = this.target()
        return Object.fromEntries(
            this.statuses.map((status) => [status, statusTextContrast(variables, base, status, target)])
        )
    })
    protected readonly hintContrast = computed(() =>
        hintTextContrast(this.themes.variables(), this.themes.baseValues(), this.target())
    )

    protected ratioText(ratio: number): string {
        return `${ratio.toFixed(1)}:1`
    }

    /** How some text reads: its ratio, and whether that is under the target. */
    protected readingText(what: string, ratio: number): string {
        const under = ratio < this.target() ? `, under ${this.target()}:1` : ''
        return `${what} reads at ${this.ratioText(ratio)}${under}.`
    }

    /** The note when the text on a status colour, as a filled button's, reads under the target. */
    protected controlText(ratio?: number): string {
        if (ratio === undefined || ratio >= this.target()) {
            return ''
        }
        return `The text on it, as a filled button's, reads at only ${this.ratioText(ratio)}.`
    }

    /** Whether the basic text would read on a status colour where its own text doesn't, e.g. on a light lime. */
    protected darkReads(reading: { control?: number, darkControl?: number }): boolean {
        return (reading.control ?? Infinity) < this.target() && (reading.darkControl ?? 0) >= this.target()
    }

    /** Gives a status's fills the basic text, e.g. ink on a light lime, as the status's own variable. */
    protected makeControlDark(status: NgdThemeStatus) {
        this.themes.setVariable(`text-control-${status}-color`, 'var(--text-basic-color)')
    }

    /** Gives a status the text shades that read on the backgrounds, as the theme's own variables. */
    protected makeReadable(status: NgdThemeStatus) {
        const text = readableStatusText(this.themes.variables(), this.themes.baseValues(), status, this.target())
        for (const [key, value] of Object.entries(text)) {
            this.themes.setVariable(key, value)
        }
    }

    protected makeHintReadable(grey: string) {
        this.themes.setVariable('text-hint-color', grey)
    }

    /** The defaults whose panel of the types' own is open. */
    protected readonly open = signal<ReadonlySet<string>>(new Set())

    protected formatRadius = (value: number) => `${value}rem`
    protected formatScale = (value: number) => `${Math.round(value * 100)}%`

    protected numberOf(value: unknown, fallback: number): number {
        return typeof value === 'number' ? value : fallback
    }

    protected isSet(key: string): boolean {
        return this.draft().variables?.[key] !== undefined
    }

    protected toggle(name: string) {
        this.open.update((open) => {
            const next = new Set(open)
            if (!next.delete(name)) {
                next.add(name)
            }
            return next
        })
    }

    /** A default's options: its values, the built-in one as unset (the empty value). */
    protected optionsOf({ values, builtIn }: NgdDefaultField): Array<{ value: string, label: string }> {
        return values.map((value) => ({ value: value === builtIn ? '' : value, label: themeLabel(value) }))
    }

    /** A default, for all the components (no type) or a type's own; empty where it's unset. */
    protected defaultOf(name: string, type?: string): string {
        const defaults = (this.draft().defaults ?? {}) as Record<string, unknown>
        const scope = type ? defaults[type] : defaults
        const value = typeof scope === 'object' && scope !== null ? (scope as Record<string, unknown>)[name] : undefined
        return typeof value === 'string' ? value : ''
    }

    /** A default for all the components as its field shows it: the built-in value is the same as none. */
    protected globalOf({ name, builtIn }: NgdDefaultField): string {
        const value = this.defaultOf(name)
        return value === builtIn ? '' : value
    }

    /** What a type has without one of its own: the default for all of them, where it reaches it, or its built-in one. */
    protected inheritedLabel(field: NgdDefaultField, override: NgdOverride): string {
        const all = this.defaultOf(field.name)
        const reaches = override.inherits !== false && !!all && (override.values ?? field.values).includes(all)
        return reaches ? `As all (${themeLabel(all)})` : `Its own (${themeLabel(override.builtIn)})`
    }

    /** How many types have a default of their own. */
    protected overridesOf(field: NgdDefaultField): number {
        return field.overrides.filter(({ type }) => this.defaultOf(field.name, type)).length
    }
}
