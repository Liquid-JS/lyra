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
    /** Gives every element a part, and so a style, of its own, for content that repeats elements, e.g. markdown. */
    uniqueParts?: boolean
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
        page: 'Buttons',
        board: 'Buttons',
        // An icon before or after the text moves it.
        symbol: { size, shape: size, icon: (value) => (value === 'none' ? '' : `Icon ${title(String(value))}`) },
        style: ['appearance', 'status', 'state'],
        starter: { size: 'medium', shape: 'rectangle', icon: 'none', appearance: 'filled', status: 'primary', state: 'default' },
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
    'calendar': {
        name: 'Calendar',
        code: { inputs: { kind: '`range` is `<nb-calendar-range>`.', view: '`startView`.' } },
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
        code: { class: 'NbTabComponent', inputs: { content: 'A `tabTitle`, with a `tabIcon` (`icon`) or a `badgeText` (`badge`).', state: '`active` is the tab\'s `active`, `disabled` its `disabled`; `hover` comes with interaction.' } },
        page: 'Navigation',
        board: 'Tabs',
        symbol: { content: size },
        style: ['state'],
        starter: { content: 'text', state: 'default' },
        parts: { 'root': 'Tab', '.tab-link': 'Link', '.tab-text': 'Title', 'nb-icon': 'Icon', 'nb-badge': 'Badge' }
    },
    'actions': {
        name: 'Actions',
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
        code: { class: 'NbActionComponent', inputs: { size: 'The `size` of the `<nb-actions>` it\'s in.', content: 'An `icon`, with `badgeDot` (`dot`) or a `badgeText` (`badge`).', state: '`disabled` is its `disabled`.' } },
        page: 'Navigation',
        board: 'Action items',
        symbol: { size, content: (value) => title(String(value)) },
        style: ['state'],
        starter: { size: 'medium', content: 'icon', state: 'default' },
        parts: { root: 'Action' }
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
        symbol: { fullWidth: (value) => (value ? 'Full Width' : '') },
        style: [],
        starter: { fullWidth: false },
        parts: { 'root': 'Route Tabset', '.active': 'Active Tab', '.disabled': 'Disabled Tab', '.route-tab': 'Tab', '.tab-link': '{parent} Link', '.tab-text': '{parent} Label' }
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
        symbol: { shape: size, size },
        style: ['status'],
        starter: { shape: 'bar', size: 'medium', status: 'primary' },
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
        code: { inputs: { content: '`onlyPicture` (`picture`).' } },
        selector: 'nb-user',
        page: 'Content',
        board: 'Users',
        symbol: { content: (value) => (value === 'picture' ? 'Picture' : 'Full'), size, shape: size },
        style: [],
        starter: { content: 'full', size: 'medium', shape: 'round' },
        parts: { 'root': 'User', '.user-picture': 'Picture', '.user-name': 'Name', '.user-title': 'Title' }
    },
    'divider': {
        name: 'Divider',
        code: { inputs: { kind: '`vertical`; `label` is text inside `<nb-divider>`.' } },
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
        parts: {
            'root': 'Dialog',
            'nb-card': 'Card',
            'nb-card-header': 'Header',
            'nb-card-body': 'Body',
            'nb-card-footer': 'Footer',
            '.appearance-ghost': 'Cancel Button',
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
