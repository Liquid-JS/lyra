/**
 * How each captured component becomes symbols and styles in the design kit. A component's inputs are of two
 * kinds: those that change its layout make separate symbols (`symbol`, e.g. a size), the others only change colours
 * and so become styles a symbol's overrides choose (`style`, e.g. a status). `starter` is the combination the
 * symbols show when placed; the starter set is made at its symbol inputs.
 */

export interface ComponentSpec {
    /** The component's name in the kits, e.g. `Alert`. */
    name: string
    /** The elements that are this component, where another component holds it, e.g. an input in a form field. */
    selector?: string
    /** A component whose styles this one uses where it looks the same, e.g. a textarea an input's. */
    sharesStyles?: string
    /** Components it holds that it draws in place with styles of its own, e.g. a button group's buttons. */
    inline?: string[]
    /** The viewport its specimen is captured in, if not the usual tall one, e.g. a layout's screen. */
    viewport?: { width: number, height: number }
    /** Query strings of the specimen's pages, each captured in turn, e.g. one per sidebar state. */
    variants?: string[]
    /** The viewport of each of those pages that needs one of its own, e.g. a phone's. */
    viewports?: Record<string, { width: number, height: number }>
    /** The page of the kit it's shown on, and its review board's name there. */
    page: string
    board: string
    /** The inputs that make separate symbols, with how each value reads in a symbol's name. */
    symbol: Record<string, (value: unknown) => string>
    /** The inputs that styles are chosen by, in the order they read in a style's name. */
    style: string[]
    /** How an input's value reads in a name, where it isn't the value itself, e.g. no status as `Plain`. */
    labels?: Record<string, Record<string, string>>
    starter: Record<string, unknown>
    /** Captured as a picture of how it shows, for rich content whose text flows in ways layers can't follow. */
    picture?: boolean
    /**
     * Stretches like the field it holds, e.g. a form field around an input: it takes its container's width, and the
     * part that holds the field the room its other parts leave.
     */
    stretches?: boolean
    /** A container for a design's own content, e.g. a layout's footer or a card's body: it resizes freely. */
    container?: boolean
    /**
     * A screen, whose blocks take the width they're given, as a page's do: its columns stretch their parts across and
     * their texts wrap at that width, e.g. an app's layout at a device's size.
     */
    fluid?: boolean
    /** Gives every element a part, and so a style, of its own, for content that repeats elements, e.g. markdown. */
    uniqueParts?: boolean
    /**
     * Parts whose texts wrap in the room the component gives them, as code wraps a longer text: they take the room their
     * row leaves, and their texts its width, e.g. a toast's content.
     */
    wraps?: string[]
    /**
     * Where another component holds this one, the inputs its classes say, its own or those of the container `from`
     * selects: the first of `classes` it has, else `otherwise`, e.g. a calendar cell's state; or how many elements
     * in it `count` selects, e.g. a tabset's tabs.
     */
    refInputs?: Record<string, { from?: string, classes?: Record<string, string>, otherwise?: string, count?: string }>
    /** Parts as wide as a share of their parent, which scale with it, e.g. a progress bar's value. */
    relative?: string[]
    /** Where another component holds this one, its texts in order are the instance's, e.g. a step's number and label. */
    refTexts?: boolean
    /** The part whose styles have the component's own name, if not the root, e.g. a select's button. */
    main?: string
    /**
     * What a captured element's layer is called, by its tag (or `::before`, `#text`) or a class (`.name`); the root's
     * is `root`.
     */
    parts?: Record<string, string>
    /** How it's written in code, where that isn't its Angular class's inputs of the kit inputs' names. */
    code?: {
        /** Its Angular class, if not `Nb{Name}Component` or `Nb{Name}Directive`. */
        class?: string
        /** How a kit input is set in code, where it isn't the class's input of that name, by the kit input. */
        inputs?: Record<string, string>
        /** What the kit's drawings take for granted that code does otherwise, unless it's set, e.g. a badge's place. */
        notes?: string[]
    }
}

/** A value as it reads in a name, e.g. `medium` → `Medium`. */
const size = (value: unknown) => title(String(value))
const title = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)

export const COMPONENTS: Record<string, ComponentSpec> = {
    'button': {
        name: 'Button',
        code: { inputs: { icon: 'An `<nb-icon>` before the text (`start`) or after it (`end`).' } },
        selector: '[nbButton]',
        refInputs: { fullWidth: { classes: { 'full-width': 'true' }, otherwise: 'false' } },
        page: 'Buttons',
        board: 'Buttons',
        // An icon before or after the text moves it, and a full-width button takes its container's width.
        symbol: { size, shape: size, icon: (value) => (value === 'none' ? '' : `Icon ${title(String(value))}`), fullWidth: (value) => (value === true || value === 'true' ? 'Full Width' : '') },
        style: ['appearance', 'status', 'state'],
        starter: { size: 'medium', shape: 'rectangle', icon: 'none', fullWidth: false, appearance: 'filled', status: 'primary', state: 'default' },
        parts: { '#text': 'Label', 'nb-icon': 'Icon' }
    },
    'icon-button': {
        name: 'Icon Button',
        code: { class: 'NbButtonComponent' },
        selector: '[nbButton]',
        sharesStyles: 'button',
        page: 'Buttons',
        board: 'Icon buttons',
        symbol: { size, shape: size },
        style: ['appearance', 'status', 'state'],
        starter: { size: 'medium', shape: 'rectangle', appearance: 'filled', status: 'primary', state: 'default' },
        parts: { 'nb-icon': 'Icon' }
    },
    'input': {
        name: 'Input',
        code: { class: 'NbInputDirective', inputs: { size: '`fieldSize`.', content: 'The `placeholder` shows until the field has a value.' } },
        selector: 'input[nbInput]',
        page: 'Form controls',
        board: 'Inputs',
        symbol: { size, shape: size },
        style: ['status', 'state', 'content'],
        starter: { size: 'medium', shape: 'rectangle', status: 'basic', state: 'default', content: 'placeholder' }
    },
    'checkbox': {
        name: 'Checkbox',
        code: { inputs: { value: '`checked`, or `indeterminate`.' } },
        selector: 'nb-checkbox',
        page: 'Form controls',
        board: 'Checkboxes',
        // Its mark shows only when checked or indeterminate.
        symbol: { size, value: (value) => (value === 'unchecked' ? '' : title(String(value))) },
        style: ['status', 'state', 'value'],
        starter: { size: 'medium', status: 'basic', state: 'default', value: 'unchecked' },
        main: 'Box',
        parts: { 'root': 'Checkbox', '.label': 'Row', '.custom-checkbox': 'Box', '.custom-checkbox-icon': 'Mark', '.text': 'Label' }
    },
    'radio': {
        name: 'Radio',
        code: { inputs: { value: 'Whether it is `checked`: the group\'s value is its `value`.' } },
        selector: 'nb-radio',
        page: 'Form controls',
        board: 'Radios',
        symbol: { size },
        style: ['status', 'state', 'value'],
        starter: { size: 'medium', status: 'basic', state: 'default', value: 'unchecked' },
        main: 'Circle',
        parts: { 'root': 'Radio', 'label': 'Row', '.outer-circle': 'Circle', '.inner-circle': 'Dot', '.text': 'Label' }
    },
    'toggle': {
        name: 'Toggle',
        code: { inputs: { value: '`checked` (`on`).' } },
        selector: 'nb-toggle',
        page: 'Form controls',
        board: 'Toggles',
        // The knob moves, and the check shows, when it's on.
        symbol: { size, value: (value) => title(String(value)) },
        style: ['status', 'state', 'value'],
        starter: { size: 'medium', status: 'basic', state: 'default', value: 'off' },
        main: 'Track',
        parts: { 'root': 'Toggle', '.toggle-label': 'Row', '.toggle': 'Track', '.toggle-switcher': 'Knob', 'nb-icon': 'Check', '.text': 'Label' }
    },
    // A day of a calendar, in each state, for designs to show the days they need: today, selected, a range.
    'calendar-cell': {
        name: 'Calendar Cell',
        code: {
            class: 'NbCalendarComponent',
            notes: ['A day of an `<nb-calendar>` or `<nb-calendar-range>`, which the calendar draws: its state comes from the calendar\'s value, `min`, `max`, `filter` and today.'],
            inputs: {
                kind: 'A cell of an `<nb-calendar-range>` (`range`) or an `<nb-calendar>`.',
                size: 'The calendar\'s `size`.',
                state: 'The calendar\'s value: its `date` (`selected`) or `range` (`range start`, `in range`, `range end`), with today from `NbDateService.today()`, days outside `min`, `max` or `filter` disabled, and the days of the months around it (`other month`).'
            }
        },
        selector: 'nb-calendar-day-cell, nb-calendar-range-day-cell',
        page: 'Form controls',
        board: 'Calendar cells',
        symbol: { kind: size, size, state: (value) => String(value).split(' ').map(title).join(' ') },
        style: [],
        starter: { kind: 'single', size: 'medium', state: 'default' },
        refInputs: {
            kind: { classes: { 'range-cell': 'range' }, otherwise: 'single' },
            size: { classes: { 'size-large': 'large' }, otherwise: 'medium' },
            state: {
                classes: { 'start': 'range start', 'end': 'range end', 'in-range': 'in range', 'selected': 'selected', 'today': 'today', 'disabled': 'disabled', 'bounding-month': 'other month' },
                otherwise: 'default'
            }
        },
        refTexts: true,
        parts: { 'root': 'Cell', '.cell-content': 'Content' }
    },
    'calendar': {
        name: 'Calendar',
        code: {
            inputs: { kind: '`range` is `<nb-calendar-range>`.', view: '`startView`.' },
            notes: ['A calendar is as wide as `calendar-width`, or narrower where it has less room, whatever room it has more; one drawn wider sets `--calendar-width` on it.', 'A calendar is a form control: `formControl`, `ngModel` or `formField` gives it its selected date or range, as a form sets and restores it.']
        },
        page: 'Form controls',
        board: 'Calendars',
        symbol: { kind: size, size, view: size },
        style: [],
        starter: { kind: 'single', size: 'medium', view: 'date' },
        // The most particular of a cell's states first: its part is the first that matches.
        parts: {
            'root': 'Calendar',
            'nb-card': 'Card',
            '.calendar-navigation': 'Header',
            '.start': 'Range Start Cell',
            '.end': 'Range End Cell',
            '.in-range': 'In Range Cell',
            '.selected': 'Selected Cell',
            '.today': 'Today Cell',
            '.disabled': 'Disabled Cell',
            '.bounding-month': 'Other Month Cell',
            '.day-cell': 'Day Cell',
            '.month-cell': 'Month Cell',
            '.year-cell': 'Year Cell',
            '.cell-content': '{parent} Content'
        }
    },
    'picker': {
        name: 'Picker',
        code: { class: 'NbDatepickerComponent', inputs: { kind: 'An `nbInput` opening `<nb-datepicker>`, `<nb-rangepicker>` or `<nb-date-timepicker>` through `[nbDatepicker]`, or `<nb-timepicker>` through `[nbTimepicker]`. Closed, a picker is its input: the kit\'s Input.' } },
        page: 'Form controls',
        board: 'Pickers',
        symbol: { kind: (value) => String(value).split('-').map(title).join(' ') },
        style: [],
        starter: { kind: 'date' },
        parts: {
            'root': 'Picker',
            'nb-datepicker-container': 'Popover',
            '.nb-timepicker-container': 'Time Panel',
            '.start': 'Range Start Cell',
            '.end': 'Range End Cell',
            '.in-range': 'In Range Cell',
            '.selected': 'Selected Cell',
            '.today': 'Today Cell',
            '.disabled': 'Disabled Cell',
            '.bounding-month': 'Other Month Cell',
            '.day-cell': 'Day Cell',
            '.cell-content': '{parent} Content'
        }
    },
    'color-picker': {
        name: 'Color Picker',
        selector: 'nb-color-picker',
        page: 'Form controls',
        board: 'Color pickers',
        // Open, its dialog shows under it.
        symbol: { size, state: (value) => (value === 'open' ? 'Open' : '') },
        style: ['status', 'state'],
        starter: { size: 'medium', status: 'basic', state: 'default' },
        parts: { 'root': 'Color Picker', '.swatch': 'Swatch', 'nb-color-picker-dialog': 'Dialog' }
    },
    'phone-input': {
        name: 'Phone Input',
        selector: 'nb-phone-input',
        page: 'Form controls',
        board: 'Phone inputs',
        symbol: { size },
        style: ['status', 'state'],
        starter: { size: 'medium', status: 'basic', state: 'default' },
        parts: { 'root': 'Phone Input', '.nb-phone-input-country': 'Country', 'nxt-flag': 'Flag' }
    },
    'swatch': {
        name: 'Swatch',
        code: {
            class: 'NbSwatchComponent',
            inputs: {
                size: 'The `nb-swatch-group`\'s `size`.',
                shape: 'The `nb-swatch-group`\'s `shape`.',
                fill: '`color`, one CSS colour; `split`, `[color]` with two, the first top left; `picture`, `image`, a picture\'s address.',
                state: '`selected` is the swatch the group\'s value chooses; `hover` and `focus` come with interaction; `disabled` is `disabled`, the swatch\'s or the group\'s.'
            },
            notes: [
                'Swatches are an `<nb-swatch-group>`\'s, side by side `swatch-gap` apart; its `multiple` lets any number be chosen, e.g. for a filter, and its value is the chosen swatches\' `value`s, which a form sets and restores.',
                'Each swatch needs a `label`, its name for assistive technologies and its tooltip: write the colour\'s or pattern\'s name.',
                'A group\'s `max` shows that many swatches and a button with how many more, e.g. +3, which shows the others.',
                'Swatches are choices: a colour or picture that\'s only shown, e.g. beside an item\'s name, is an image or a block in code, not a swatch.'
            ]
        },
        selector: 'nb-swatch',
        page: 'Form controls',
        board: 'Swatches',
        // A second colour or a picture adds a layer, as does the strike across an unavailable option.
        symbol: { size, shape: size, fill: (value) => (value === 'split' ? 'Split' : value === 'picture' ? 'Picture' : ''), unavailable: (value) => (value ? 'Unavailable' : '') },
        style: ['state'],
        starter: { size: 'medium', shape: 'round', fill: 'color', unavailable: false, state: 'default' },
        recolour: ['Fill', 'Second'],
        parts: { 'root': 'Swatch', '.swatch': 'Ring', '.swatch-fill': 'Fill', '.kit-second': 'Second', '.kit-edge': 'Edge', '::after': 'Strike' }
    },
    'select': {
        name: 'Select',
        code: {
            inputs: { content: 'The `placeholder` shows until an option is selected.' },
            notes: ['A select is at least as wide as `--select-{size}-width`, an input\'s width: one drawn narrower takes that variable, e.g. `--select-medium-width: 100%` with the width it\'s drawn at.']
        },
        selector: 'nb-select',
        page: 'Form controls',
        board: 'Selects',
        // Open, it shows its option list under it.
        symbol: { size, shape: size, state: (value) => (value === 'open' ? 'Open' : '') },
        style: ['appearance', 'status', 'state', 'content'],
        starter: { size: 'medium', shape: 'rectangle', appearance: 'outline', status: 'basic', state: 'default', content: 'placeholder' },
        main: 'Body',
        parts: {
            'root': 'Select',
            '.select-button': 'Body',
            'nb-icon': 'Chevron',
            'nb-option-list': 'Options',
            '.option-list': 'List',
            '.selected': 'Selected Option',
            '.kit-disabled': 'Disabled Option',
            'nb-option': 'Option'
        }
    },
    'textarea': {
        name: 'Textarea',
        code: { class: 'NbInputDirective', inputs: { size: '`fieldSize`.', content: 'The `placeholder` shows until the field has a value.' } },
        selector: 'textarea[nbInput]',
        sharesStyles: 'input',
        page: 'Form controls',
        board: 'Textareas',
        symbol: { size, shape: size },
        style: ['status', 'state', 'content'],
        starter: { size: 'medium', shape: 'rectangle', status: 'basic', state: 'default', content: 'placeholder' }
    },
    'form-field': {
        name: 'Form Field',
        code: { inputs: { size: 'The `nbInput`\'s `fieldSize`.', status: 'The `nbInput`\'s `status`.', addons: 'Elements with `nbPrefix` before the `nbInput`, `nbSuffix` after it.' } },
        page: 'Form controls',
        board: 'Form fields',
        symbol: { size, addons: (value) => (value === 'both' ? 'Prefix and Suffix' : title(String(value))) },
        style: ['status', 'state'],
        starter: { size: 'medium', addons: 'prefix', status: 'basic', state: 'default' },
        stretches: true,
        parts: { '.nb-form-field-prefix-*': 'Prefix', '.nb-form-field-suffix-*': 'Suffix', '.nb-form-control-container': 'Control' }
    },
    'field': {
        name: 'Field',
        code: { class: 'NbInputDirective', inputs: { size: 'The `nbInput`\'s `fieldSize`.', required: 'A required control: its `label[nbLabel]` shows the marker.', message: '`<nb-validation-errors>` shows its content as the hint, and the errors once the control is touched and invalid.' } },
        page: 'Form controls',
        board: 'Fields',
        symbol: {
            size,
            required: (value) => (value ? 'Required' : 'Optional'),
            message: (value) => (value === 'error' ? 'Error' : 'Hint')
        },
        style: ['state'],
        starter: { size: 'medium', required: false, message: 'hint', state: 'default' },
        parts: {
            '.label': 'Label',
            '.label-required': 'Required',
            'nb-validation-errors': 'Validation',
            '.validation-errors': 'Errors',
            '.validation-error': 'Error',
            '.validation-helper': 'Hint',
            '.validation-text': 'Message'
        }
    },
    'alert': {
        name: 'Alert',
        code: { notes: ['Its `size` gives it a fixed height, e.g. `alert-medium-height`, as the symbols are drawn; an alert drawn as tall as its text is one without a `size`.'] },
        page: 'Feedback',
        board: 'Alerts',
        // Outline alerts have a border the filled ones don't, which moves their content.
        symbol: { size, appearance: size, closable: (value) => (value ? 'Closable' : 'Plain') },
        style: ['appearance', 'status'],
        starter: { size: 'medium', closable: false, appearance: 'filled', status: 'primary' }
    },
    'badge': {
        name: 'Badge',
        code: { notes: ['The kit draws a badge where it is, as `position="inline"` places it; without a `position`, a badge sits at its container\'s top right corner.'] },
        page: 'Feedback',
        board: 'Badges',
        symbol: { dotMode: (value) => (value ? 'Dot' : 'Text') },
        style: ['status'],
        starter: { dotMode: false, status: 'primary' }
    },
    'card': {
        name: 'Card',
        code: { notes: ['A picture at its top or bottom, reaching its edges, is `nbCardMedia` on the `<img>`, or on a wrapper holding the picture and what goes over it, e.g. a tag in its corner, which it clips to the card\'s corners.', 'Its first and last children\'s outer corners take its radius inside its border, e.g. an image filling its top; a child with corners of its own goes in a wrapper. A frame composed with a card\'s style takes the card\'s corners, `card-border-radius`, from the theme.', 'A floating card\'s shadow, `card-floating-shadow`, is the theme\'s `shadow` unless the theme sets it apart.'] },
        page: 'Content',
        board: 'Cards',
        // A status header covers the card's border, which moves the content.
        symbol: { status: (value) => (value ? 'Status' : 'Plain'), accent: (value) => (value ? 'Accent' : 'Plain') },
        style: ['appearance', 'status', 'accent'],
        labels: { status: { '': 'Plain' }, accent: { '': 'None' } },
        starter: { accent: '', appearance: 'outline', status: '' },
        parts: { 'root': 'Container', 'nb-card-header': 'Header', 'nb-card-body': 'Body', 'nb-card-footer': 'Footer', '::before': 'Accent' }
    },
    // A card's parts, stacked in a frame with a card's style, e.g. Card/Outline/Plain, around a design's own content.
    'card-header': {
        name: 'Card Header',
        code: { class: 'NbCardHeaderComponent', inputs: { status: 'The `status` of the `<nb-card>` it\'s in.' } },
        page: 'Content',
        board: 'Card headers',
        // A status header covers the card's border, which moves its content; a plain one has a divider below instead.
        symbol: { status: (value) => (value === 'none' ? 'Divided' : 'Status') },
        style: ['status'],
        labels: { status: { none: 'Plain' } },
        starter: { status: 'none' },
        parts: { root: 'Header' }
    },
    'card-body': {
        name: 'Card Body',
        page: 'Content',
        board: 'Card bodies',
        symbol: {},
        style: [],
        container: true,
        starter: {},
        parts: { root: 'Body' }
    },
    'card-footer': {
        name: 'Card Footer',
        page: 'Content',
        board: 'Card footers',
        symbol: {},
        style: [],
        container: true,
        starter: {},
        parts: { root: 'Footer' }
    },
    'tag': {
        name: 'Tag',
        page: 'Form controls',
        board: 'Tags',
        symbol: { size, removable: (value) => (value ? 'Removable' : 'Plain') },
        style: ['appearance', 'status', 'state'],
        starter: { size: 'medium', removable: false, appearance: 'filled', status: 'primary', state: 'default' },
        parts: { 'span': 'Label', '.nb-tag-remove': 'Remove' }
    },
    'button-group': {
        name: 'Button Group',
        page: 'Buttons',
        board: 'Button groups',
        // Its buttons join up and press, unlike the kit's.
        inline: ['button', 'icon-button'],
        symbol: { size, shape: size },
        style: ['appearance', 'status', 'disabled'],
        labels: { disabled: { true: 'Disabled', false: 'Default' } },
        starter: { size: 'medium', shape: 'rectangle', appearance: 'filled', status: 'primary', disabled: false },
        parts: { '.kit-pressed': 'Pressed Toggle', 'button': 'Toggle' }
    },
    'slider': {
        name: 'Slider',
        page: 'Form controls',
        board: 'Sliders',
        symbol: { size, range: (value) => (value ? 'Range' : 'Single') },
        style: ['status', 'state'],
        starter: { size: 'medium', range: false, status: 'primary', state: 'default' },
        parts: {
            '.slider-track': 'Track',
            '.slider-fill': 'Fill',
            '.slider-tick': 'Tick',
            '.slider-thumb': 'Thumb',
            '.slider-value': 'Value',
            '.slider-labels': 'Labels',
            '.slider-label': 'Label'
        }
    },
    'file-drop': {
        name: 'File Drop',
        page: 'Form controls',
        board: 'File drops',
        // Dragging over shows an overlay in place of the prompt.
        symbol: { size, shape: size, state: (value) => (value === 'drag-over' ? 'Drag Over' : 'Prompt') },
        style: ['status', 'state'],
        starter: { size: 'medium', shape: 'rectangle', status: 'basic', state: 'default' },
        parts: { '.prompt': 'Prompt' }
    },
    'breadcrumbs': {
        name: 'Breadcrumbs',
        page: 'Navigation',
        board: 'Breadcrumbs',
        symbol: {},
        style: [],
        starter: {},
        parts: { 'root': 'Breadcrumbs', 'nb-breadcrumb': 'Crumb', 'a': 'Link' }
    },
    'pagination': {
        name: 'Pagination',
        page: 'Navigation',
        board: 'Paginations',
        symbol: { size },
        style: [],
        starter: { size: 'medium' },
        parts: { root: 'Pagination' }
    },
    'page-indicator': {
        name: 'Page Indicator',
        page: 'Navigation',
        board: 'Page indicators',
        symbol: {},
        style: ['status'],
        starter: { status: 'primary' },
        parts: { 'root': 'Page Indicator', '.active': 'Current Dot', '.page-dot': 'Dot' }
    },
    'tabset': {
        name: 'Tabset',
        code: { notes: ['An `<nb-tab>` pads its content by `tabset-content-padding` (`--tabset-content-padding`), and on screens up to 576 px wide by `tabset-content-small-padding`, which the drawings don\'t show around a design\'s own content; in an `<nb-card>`, by the card\'s `card-padding` instead, to line up with its header.', 'Tabs short of room shrink in code, their titles wrapping onto more lines; drawn narrower, the kit\'s run past the end. Tabs drawn on one line running past the end, e.g. a phone\'s days, are `wrap="false"`, which scrolls them sideways.'] },
        page: 'Navigation',
        board: 'Tabsets',
        symbol: { fullWidth: (value) => (value ? 'Full Width' : '') },
        style: [],
        starter: { fullWidth: false },
        parts: {
            'root': 'Tabset',
            '.tabset': 'Tabs',
            '.active': 'Active Tab',
            '.disabled': 'Disabled Tab',
            '.tab': 'Tab',
            '.tab-link': '{parent} Link',
            '.tab-text': '{parent} Label',
            'nb-tab': 'Content'
        }
    },
    'tab': {
        name: 'Tab',
        code: {
            class: 'NbTabComponent',
            inputs: { content: 'A `tabTitle`, with a `tabIcon` (`icon`) or a `badgeText` (`badge`).', state: '`active` is the tab\'s `active`, `disabled` its `disabled`; `hover` comes with interaction.' },
            notes: ['Tabs that switch content in the page are an `<nb-tabset>`\'s; tabs that link to pages, e.g. a header\'s navigation, are an `<nb-route-tabset [tabs]>` with `outlet="false"`, which looks the same by its own `route-tabset-*` variables.']
        },
        // A tabset's tabs are these, so a design shows which is active by their looks.
        selector: 'nb-tabset li.tab',
        refInputs: {
            content: { has: { 'nb-badge': 'badge', 'nb-icon': 'icon' }, otherwise: 'text' },
            state: { classes: { active: 'active', disabled: 'disabled' }, otherwise: 'default' }
        },
        refTexts: true,
        page: 'Navigation',
        board: 'Tabs',
        symbol: { content: size },
        style: ['state'],
        starter: { content: 'text', state: 'default' },
        parts: { 'root': 'Tab', '.tab-link': 'Link', '.tab-text': 'Title', 'nb-icon': 'Icon', 'nb-badge': 'Badge' }
    },
    'actions': {
        name: 'Actions',
        code: { notes: ['Each action after the first has a divider before it (`actions-divider-*`).'] },
        page: 'Navigation',
        board: 'Actions',
        symbol: { size },
        style: [],
        starter: { size: 'medium' },
        parts: { root: 'Actions' }
    },
    // An action, to compose a design's own actions with.
    'action': {
        name: 'Action',
        code: {
            class: 'NbActionComponent',
            notes: ['In an `<nb-actions>`, each action after the first has a divider before it, as the Actions symbols show; for actions side by side without one, as these parts are drawn, set `--actions-divider-width: 0` on the `<nb-actions>` (or the theme\'s `actions-divider-width`).'],
            inputs: { size: 'The `size` of the `<nb-actions>` it\'s in.', content: 'An `icon`, with `badgeDot` (`dot`) or a `badgeText` (`badge`).', state: '`disabled` is its `disabled`.' } },
        page: 'Navigation',
        board: 'Action items',
        symbol: { size, content: (value) => title(String(value)) },
        style: ['state'],
        starter: { size: 'medium', content: 'icon', state: 'default' },
        parts: { root: 'Action' }
    },
    // A step of a stepper, in each state, for designs to show how far along they are.
    'stepper-step': {
        name: 'Stepper Step',
        code: {
            class: 'NbStepComponent',
            notes: ['A step of an `<nb-stepper>`, which the stepper draws for each `<nb-step>` with its `label`.'],
            inputs: {
                orientation: 'The stepper\'s `orientation`.',
                state: 'The stepper\'s `selectedIndex` is the `current` step; another is `completed` while it\'s marked `completed`, or was visited with its `stepControl` valid, and `upcoming` otherwise.'
            }
        },
        selector: 'nb-stepper .step',
        page: 'Navigation',
        board: 'Stepper steps',
        symbol: { orientation: size, state: size },
        style: [],
        starter: { orientation: 'horizontal', state: 'upcoming' },
        refInputs: {
            orientation: { from: 'nb-stepper', classes: { horizontal: 'horizontal', vertical: 'vertical' } },
            state: { classes: { selected: 'current', completed: 'completed' }, otherwise: 'upcoming' }
        },
        refTexts: true,
        parts: { 'root': 'Step', '.label-index': 'Index', '.label': 'Label' }
    },
    'stepper': {
        name: 'Stepper',
        page: 'Navigation',
        board: 'Steppers',
        symbol: { orientation: size },
        style: [],
        starter: { orientation: 'horizontal' },
        parts: {
            'root': 'Stepper',
            '.completed': 'Completed Step',
            '.selected': 'Current Step',
            '.step': 'Step',
            '.connector-past': 'Past Connector',
            '.connector': 'Connector',
            '.label-index': '{parent} Index',
            '.label': '{parent} Label',
            '.step-content': 'Content'
        }
    },
    'menu': {
        name: 'Menu',
        page: 'Navigation',
        board: 'Menus',
        symbol: { orientation: size },
        style: [],
        starter: { orientation: 'vertical' },
        parts: {
            'root': 'Menu',
            '.active': 'Selected Item',
            '.menu-group': 'Group',
            '.menu-icon': '{parent} Icon',
            '.expand-state': '{parent} Expand Icon',
            '.menu-title': '{parent} Title',
            'nb-badge': '{parent} Badge',
            'a': 'Item',
            '.menu-item': 'Row',
            '.menu-items': 'Items'
        }
    },
    // The parts of the larger components, for designs to compose their own, e.g. a menu of their items.
    'menu-item': {
        name: 'Menu Item',
        code: { class: 'NbMenuComponent', inputs: { kind: 'An `NbMenuItem` in the menu\'s `items`: with an `icon` (`icon`), `children` and `expanded` (`collapsed`, `expanded`), in a parent\'s `children` (`child`), `group: true` (`group`) or a `badge` (`badge`).', state: '`selected` is the item\'s `selected`; `hover` comes with interaction.' } },
        page: 'Navigation',
        board: 'Menu items',
        // A selected item has its indicator bar.
        symbol: { kind: size, state: (value) => (value === 'selected' ? 'Selected' : '') },
        style: ['state'],
        starter: { kind: 'icon', state: 'default' },
        parts: {
            'root': 'Item',
            'a': 'Link',
            '.menu-title': 'Title',
            '.menu-icon': 'Icon',
            '.expand-state': 'Expand Icon',
            'nb-badge': 'Badge'
        }
    },
    'context-menu': {
        name: 'Context Menu',
        code: { class: 'NbContextMenuDirective' },
        page: 'Navigation',
        board: 'Context menus',
        symbol: {},
        style: [],
        starter: {},
        parts: {
            'root': 'Context Menu', 'nb-menu': 'Menu',
            '.active': 'Selected Item',
            '.menu-group': 'Group',
            '.menu-icon': '{parent} Icon',
            '.expand-state': '{parent} Expand Icon',
            '.menu-title': '{parent} Title',
            'nb-badge': '{parent} Badge',
            'a': 'Item',
            '.menu-item': 'Row',
            '.menu-items': 'Items'
        }
    },
    'layout': {
        name: 'Layout',
        code: { inputs: { sidebar: 'The `<nb-sidebar>`\'s `state`.' } },
        page: 'Navigation',
        board: 'Layouts',
        viewport: { width: 1280, height: 800 },
        variants: ['sidebar=expanded', 'sidebar=compacted', 'sidebar=collapsed'],
        symbol: { sidebar: size },
        style: [],
        starter: { sidebar: 'expanded' },
        parts: {
            'root': 'Layout',
            '.kit-brand': 'Brand',
            'nb-layout-header': 'Header',
            'nb-sidebar': 'Sidebar',
            'nb-layout-column': 'Column',
            'nb-layout-footer': 'Footer',
            'nav': '{parent} Bar',
            '.active': 'Selected Item',
            '.menu-icon': '{parent} Icon',
            '.menu-title': '{parent} Title',
            'a': 'Item',
            '.menu-item': 'Row'
        }
    },
    // The layout's parts, empty, for designs to compose their own screens: what they hold is a design's own.
    'layout-header': {
        name: 'Layout Header',
        page: 'Navigation',
        board: 'Layout headers',
        viewport: { width: 1280, height: 800 },
        variants: ['parts=1&sidebar=expanded'],
        symbol: {},
        style: [],
        container: true,
        starter: {},
        parts: { root: 'Header' }
    },
    'sidebar': {
        name: 'Sidebar',
        page: 'Navigation',
        board: 'Sidebars',
        viewport: { width: 1280, height: 800 },
        variants: ['parts=1&sidebar=expanded', 'parts=1&sidebar=compacted'],
        symbol: { state: size },
        style: [],
        container: true,
        starter: { state: 'expanded' },
        parts: { root: 'Sidebar' }
    },
    'layout-footer': {
        name: 'Layout Footer',
        page: 'Navigation',
        board: 'Layout footers',
        viewport: { width: 1280, height: 800 },
        variants: ['parts=1&sidebar=expanded'],
        symbol: {},
        style: [],
        container: true,
        starter: {},
        parts: { root: 'Footer' }
    },
    'route-tabset': {
        name: 'Route Tabset',
        page: 'Navigation',
        board: 'Route tabsets',
        code: {
            notes: [
                'It shows the active route under its tabs in a `router-outlet` of its own; as navigation alone, e.g. in a header, set `outlet="false"`.',
                'Tabs short of room shrink in code, their titles wrapping onto more lines, e.g. a header\'s at a tablet\'s width; drawn narrower, the kit\'s run past the end: shorten their titles, or show fewer, where they don\'t fit, or set `wrap="false"`, which scrolls them sideways.',
                'A line runs along the tabs\' width, `route-tabset-divider-*`, which tabs in a header may not show: `--route-tabset-divider-width: 0`.'
            ],
            inputs: { tabs: 'How many `tabs` it has: a `bar` has 3 to 5, the others 4, to swap for as many as a design needs.' }
        },
        selector: 'nb-route-tabset',
        refInputs: {
            appearance: { classes: { 'appearance-bar': 'bar' }, otherwise: 'tabs' },
            fullWidth: { classes: { 'full-width': 'true' }, otherwise: 'false' },
            tabs: { count: '.route-tab' }
        },
        refTexts: true,
        // A phone's navigation along the bottom, `bar`, with as many tabs as a design needs.
        symbol: {
            appearance: (value) => (value === 'bar' ? 'Bar' : ''),
            fullWidth: (value) => (value ? 'Full Width' : ''),
            tabs: (value) => (value ? `${String(value)} Tabs` : '')
        },
        // A bar's texts have fonts of their own, so its styles are its own too.
        style: ['appearance'],
        labels: { appearance: { tabs: 'Tabs', bar: 'Bar' } },
        starter: { appearance: 'tabs', fullWidth: false, tabs: 4 },
        parts: { 'root': 'Route Tabset', '.active': 'Active Tab', '.disabled': 'Disabled Tab', '.route-tab': 'Tab', '.tab-link': '{parent} Link', '.tab-icon': '{parent} Icon', '.tab-text': '{parent} Label' }
    },
    // A route tabset's tab, in a header or a phone's bar: a route tabset's tabs are these, so a design shows which is
    // active by their looks.
    'route-tab': {
        name: 'Route Tab',
        code: {
            class: 'NbRouteTabsetComponent',
            notes: ['A tab of an `<nb-route-tabset [tabs]>`, which it draws for each of its `tabs`: an `NbRouteTab`.'],
            inputs: {
                appearance: 'The route tabset\'s `appearance`.',
                content: 'The tab\'s `title`, with an `icon` (`icon`) or a `badgeText` (`badge`); a `bar`\'s tabs have an icon over their title.',
                state: 'The tab whose `route` is the page\'s is `active`, one with `disabled` is `disabled`; `hover` comes with interaction.'
            }
        },
        selector: 'nb-route-tabset .route-tab',
        refInputs: {
            appearance: { from: 'nb-route-tabset', classes: { 'appearance-bar': 'bar' }, otherwise: 'tabs' },
            content: { has: { 'nb-badge': 'badge', 'nb-icon': 'icon' }, otherwise: 'text' },
            state: { classes: { active: 'active', disabled: 'disabled' }, otherwise: 'default' }
        },
        refTexts: true,
        page: 'Navigation',
        board: 'Route tabs',
        symbol: { appearance: (value) => (value === 'bar' ? 'Bar' : ''), content: size },
        // A bar's texts have fonts of their own, so its styles are its own too.
        style: ['appearance', 'state'],
        labels: { appearance: { tabs: 'Tabs', bar: 'Bar' } },
        starter: { appearance: 'tabs', content: 'text', state: 'default' },
        parts: { 'root': 'Tab', '.tab-link': 'Link', '.tab-icon': 'Icon Box', '.tab-text': 'Title', 'nb-badge': 'Badge' }
    },
    // An app's screen that adapts to the device: on a laptop or a tablet, a header with its tabs, actions and user; on
    // a phone, a top bar whose actions fold into a menu, a drawer with the user and the account's links, and the tabs
    // along the bottom. One layout's markup at every size.
    'adaptive-layout': {
        name: 'Adaptive Layout',
        code: {
            class: 'NbLayoutComponent',
            inputs: {
                device: 'The window\'s width: a phone\'s is below `md`, where `*nbShownBelow` and `*nbShownAbove` show the phone\'s parts or the others, and the header\'s actions `collapse` into a menu.',
                drawer: 'The phone\'s `fixed` `drawer` sidebar expanded, e.g. by the top bar\'s menu button with `NbSidebarService.toggle()`.'
            },
            notes: ['The playground\'s `/design-kit/adaptive-layout` page is this layout\'s markup, at every size.']
        },
        page: 'Navigation',
        board: 'Adaptive layouts',
        viewport: { width: 1440, height: 900 },
        variants: ['device=laptop', 'device=tablet', 'device=phone', 'device=phone&drawer=open'],
        viewports: { 'device=tablet': { width: 834, height: 1112 }, 'device=phone': { width: 390, height: 844 }, 'device=phone&drawer=open': { width: 390, height: 844 } },
        symbol: { device: size, drawer: (value) => (value === 'open' ? 'Drawer' : '') },
        style: [],
        fluid: true,
        starter: { device: 'laptop', drawer: 'closed' },
        parts: {
            'root': 'Layout',
            '.kit-brand': 'Brand',
            'nb-layout-header': 'Header',
            'nb-sidebar': 'Drawer',
            'nb-sidebar-header': 'Drawer Header',
            'nb-layout-column': 'Column',
            'nb-layout-footer': 'Footer',
            'nb-route-tabset': 'Tabs',
            'nb-actions': 'Actions',
            '.drawer-backdrop': 'Backdrop',
            '.menu-icon': '{parent} Icon',
            '.menu-title': '{parent} Title',
            '.menu-item': 'Row'
        }
    },
    'toc': {
        name: 'Table of Contents',
        page: 'Navigation',
        board: 'Tables of contents',
        symbol: {},
        style: [],
        starter: {},
        parts: { 'root': 'Table of Contents', '.active': 'Current Entry', 'a': 'Entry' }
    },
    'progress-bar': {
        name: 'Progress Bar',
        page: 'Feedback',
        board: 'Progress bars',
        code: { inputs: { value: '`value`, shown by `displayValue`; the kit has bars in steps of 10, and rings at 60%.' } },
        // How full it is changes its layout, so each value is a symbol; swapping one for another keeps the overrides.
        symbol: { shape: size, size, value: (value) => `${String(value)}%` },
        style: ['status'],
        starter: { shape: 'bar', size: 'medium', value: 60, status: 'primary' },
        relative: ['Value'],
        parts: { 'root': 'Progress Bar', '::before': 'Ring', '.progress-container': 'Track', '.progress-value': 'Value', '.progress-ring-content': 'Content' }
    },
    'spinner': {
        name: 'Spinner',
        page: 'Feedback',
        board: 'Spinners',
        symbol: { size },
        style: ['status'],
        starter: { size: 'medium', status: 'primary' },
        parts: { 'root': 'Spinner', 'nb-spinner': 'Overlay', '.spin-circle': 'Circle', '.message': 'Message' }
    },
    'skeleton': {
        name: 'Skeleton',
        page: 'Feedback',
        board: 'Skeletons',
        symbol: {},
        style: [],
        starter: {},
        parts: { 'root': 'Skeleton', '.nb-skeleton-circle': 'Circle', '.nb-skeleton-sized': 'Short Line', '.nb-skeleton': 'Line' }
    },
    'list': {
        name: 'List',
        page: 'Content',
        board: 'Lists',
        symbol: {},
        style: [],
        starter: {},
        parts: { 'root': 'List', 'nb-list-item': 'Item', 'nb-list-item-title': '{parent} Title', 'nb-list-item-description': '{parent} Description' }
    },
    'list-item': {
        name: 'List Item',
        page: 'Content',
        board: 'List items',
        symbol: {},
        style: [],
        starter: {},
        parts: { 'root': 'Item', 'nb-list-item-title': 'Title', 'nb-list-item-description': 'Description' }
    },
    'accordion': {
        name: 'Accordion',
        page: 'Content',
        board: 'Accordions',
        symbol: {},
        style: [],
        starter: {},
        parts: {
            'root': 'Accordion',
            '.disabled': 'Disabled Item',
            '.expanded': 'Open Item',
            'nb-accordion-item': 'Item',
            'nb-accordion-item-header': '{parent} Header',
            'nb-accordion-item-body': '{parent} Body'
        }
    },
    'user': {
        name: 'User',
        code: { inputs: { content: '`onlyPicture` (`picture`).', avatar: 'A `picture` URL (`image`), or the `name`\'s initials.' } },
        selector: 'nb-user',
        page: 'Content',
        board: 'Users',
        // A picture replaces the initials; its image layer takes an image override.
        symbol: { content: (value) => (value === 'picture' ? 'Picture' : 'Full'), size, shape: size, avatar: (value) => (value === 'image' ? 'Image' : '') },
        style: [],
        starter: { content: 'full', size: 'medium', shape: 'round', avatar: 'initials' },
        parts: { 'root': 'User', '.user-picture': 'Picture', '.user-name': 'Name', '.user-title': 'Title' }
    },
    'divider': {
        name: 'Divider',
        code: {
            inputs: { kind: '`vertical`; `label` is text inside `<nb-divider>`.' },
            notes: ['It has a margin around it, `divider-margin` (`divider-vertical-margin` down the page), which the drawings leave out: a divider drawn flush sets `--divider-margin: 0`.']
        },
        page: 'Content',
        board: 'Dividers',
        symbol: { kind: size },
        style: [],
        starter: { kind: 'plain' },
        parts: { 'root': 'Divider', '::before': 'Start Line', '::after': 'End Line', '.divider-content': 'Label' }
    },
    'tooltip': {
        name: 'Tooltip',
        code: { inputs: { status: '`nbTooltipStatus`.' } },
        page: 'Feedback',
        board: 'Tooltips',
        symbol: {},
        style: ['status'],
        labels: { status: { '': 'Plain' } },
        starter: { status: '' },
        parts: { 'root': 'Tooltip', '.arrow': 'Arrow', '.content': 'Content' }
    },
    'popover': {
        name: 'Popover',
        page: 'Feedback',
        board: 'Popovers',
        symbol: {},
        style: [],
        starter: {},
        parts: { 'root': 'Popover', '.arrow': 'Arrow' }
    },
    'toast': {
        name: 'Toast',
        code: { class: 'NbToastrService', inputs: { status: 'The `status` option of `NbToastrService.show()`.' } },
        page: 'Feedback',
        board: 'Toasts',
        symbol: {},
        style: ['status'],
        starter: { status: 'primary' },
        wraps: ['Content Container'],
        parts: { 'root': 'Toast', '.icon-container': 'Icon Box', '.title': 'Title', '.message': 'Message' }
    },
    'dialog': {
        name: 'Dialog',
        code: {
            class: 'NbDialogService',
            notes: [
                'A dialog opens in the middle of the window: place it as drawn with the `position` and `positionOffset` of its config, e.g. `top` and `150px`.',
                'Its container clips what runs past it: draw what\'s around a dialog, e.g. a glow, on the overlay pane, with the config\'s `dialogClass`.'
            ]
        },
        page: 'Feedback',
        board: 'Dialogs',
        symbol: {},
        style: [],
        starter: {},
        wraps: ['Body'],
        parts: {
            'root': 'Dialog',
            'nb-card': 'Card',
            'nb-card-header': 'Header',
            'nb-card-body': 'Body',
            'nb-card-footer': 'Footer',
            '.appearance-outline': 'Cancel Button',
            '.status-danger': 'Confirm Button'
        }
    },
    'window': {
        name: 'Window',
        code: { class: 'NbWindowService' },
        page: 'Feedback',
        board: 'Windows',
        symbol: {},
        style: [],
        starter: {},
        parts: { 'root': 'Window', 'nb-card': 'Card', 'nb-card-header': 'Header', 'nb-card-body': 'Body' }
    },
    'table': {
        name: 'Table',
        code: { notes: ['Cells drawn with lines between the rows alone, not between the columns, are `rules="rows"`; a table placed directly in an `<nb-card>` has those already.', 'A row is at least `table-row-min-height` tall and as tall as its cells\' content with `table-cell-padding`, e.g. taller with a button in a cell; rows drawn other heights set those variables.'] },
        page: 'Content',
        board: 'Tables',
        symbol: {},
        style: [],
        starter: {},
        parts: { 'root': 'Table', 'nb-card': 'Card', 'nb-card-header': 'Header', 'th': 'Header Cell', 'td': 'Cell', 'tr': 'Row', 'thead': 'Head', 'tbody': 'Rows' }
    },
    'table-header-cell': {
        name: 'Table Header Cell',
        code: { class: 'NbTableComponent', inputs: { sort: 'A column\'s header with `nbSortHeader`, in a table with `[nbSort]`: `asc` or `desc` while it sorts by the column.' } },
        page: 'Content',
        board: 'Table header cells',
        symbol: { sort: (value) => ({ none: 'Unsorted', asc: 'Ascending', desc: 'Descending' })[String(value)] ?? String(value) },
        style: [],
        starter: { sort: 'none' },
        parts: { 'root': 'Cell', 'button': 'Sort Button', 'nb-sort-icon': 'Sort Icon' }
    },
    'table-cell': {
        name: 'Table Cell',
        code: { class: 'NbTableComponent' },
        page: 'Content',
        board: 'Table cells',
        symbol: {},
        style: [],
        starter: {},
        parts: { root: 'Cell' }
    },
    'tree-grid': {
        name: 'Tree Grid',
        page: 'Content',
        board: 'Tree grids',
        symbol: {},
        style: [],
        starter: {},
        parts: { 'root': 'Tree Grid', 'nb-card': 'Card', 'th': 'Header Cell', 'td': 'Cell', 'tr': 'Row', 'thead': 'Head', 'tbody': 'Rows' }
    },
    'chat': {
        name: 'Chat',
        page: 'Content',
        board: 'Chats',
        symbol: {},
        style: [],
        starter: {},
        parts: {
            'root': 'Chat',
            '.header': 'Header',
            '.reply': 'Reply',
            '.not-reply': 'Message',
            'nb-chat-avatar': '{parent} Avatar',
            '.message': '{parent} Bubble',
            'nb-chat-message-text': '{parent} Content',
            '.sender': '{parent} Sender',
            '.text': '{parent} Text',
            'nb-chat-form': 'Form'
        }
    },
    'markdown-viewer': {
        name: 'Markdown Viewer',
        code: { class: 'NbMarkdownViewerComponent' },
        page: 'Content',
        board: 'Markdown viewers',
        symbol: {},
        style: [],
        starter: {},
        picture: true,
        parts: { root: 'Markdown Viewer' }
    },
    'markdown-editor': {
        name: 'Markdown Editor',
        page: 'Content',
        board: 'Markdown editors',
        symbol: {},
        style: [],
        starter: {},
        picture: true,
        parts: { root: 'Markdown Editor' }
    },
    'qr-code': {
        name: 'QR Code',
        page: 'Content',
        board: 'QR codes',
        symbol: {},
        style: [],
        starter: {},
        uniqueParts: true,
        parts: { root: 'QR Code' }
    },
    'chart': {
        name: 'Chart',
        page: 'Content',
        board: 'Charts',
        symbol: {},
        style: [],
        starter: {},
        uniqueParts: true,
        parts: { root: 'Chart' }
    },
    'audio': {
        name: 'Audio Player',
        page: 'Content',
        board: 'Audio players',
        symbol: {},
        style: [],
        starter: {},
        uniqueParts: true,
        parts: { root: 'Audio Player' }
    },
    'video': {
        name: 'Video Player',
        page: 'Content',
        board: 'Video players',
        symbol: {},
        style: [],
        starter: {},
        uniqueParts: true,
        parts: { root: 'Video Player' }
    }
}
