import { isPlatformBrowser } from '@angular/common'
import {
    afterRenderEffect,
    booleanAttribute,
    Component,
    computed,
    DestroyRef,
    ElementRef,
    forwardRef,
    inject,
    input,
    linkedSignal,
    model,
    PLATFORM_ID,
    signal,
    untracked,
    viewChild,
    ViewEncapsulation
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import {
    injectNbDefaults,
    NbComponentOrCustomStatus,
    NbComponentShape,
    NbIconConfig,
    NbIconLibraries,
    NbValidationDirective
} from '@liquid-js/lyr-core'
import type {
    Editor,
    EditorOptions,
    EditorPlugin,
    EditorType,
    IconName,
    PreviewStyle,
    ToolbarItemOptions
} from '@liquid-js/underflow'
import type { HLJSApi } from 'highlight.js'
import { HighlightLoader, NXT_HIGHLIGHT_OPTIONS } from 'nxt-highlightjs'
import { nbFormatMarkdown } from './format'
import { injectNbMarkdownEditorTexts, nbMarkdownEditorLanguage, NbMarkdownEditorTexts } from './texts'

/** Options of `@liquid-js/underflow`'s editor that the component's inputs don't set. */
export type NbMarkdownEditorOptions = Omit<
    EditorOptions,
    | 'el'
    | 'initialValue'
    | 'initialEditType'
    | 'height'
    | 'minHeight'
    | 'previewStyle'
    | 'placeholder'
    | 'toolbarItems'
    | 'hideModeSwitch'
    | 'toolbarStyle'
    | 'language'
    | 'theme'
    | 'autofocus'
    | 'viewer'
    | 'readonly'
    | 'disabled'
    | 'autoDirection'
>

/** Groups of toolbar items: the names of the editor's items, e.g. `bold`, `format`, or items of your own. */
export type NbMarkdownEditorToolbar = Array<Array<string | ToolbarItemOptions>>

/** What the editor is made with. */
interface Setup {
    texts: NbMarkdownEditorTexts
    toolbarItems?: NbMarkdownEditorToolbar
    hideModeSwitch: boolean
    autoDirection: boolean
    options: NbMarkdownEditorOptions
    /** Highlights code, once it's loaded. */
    highlighter?: HLJSApi
}

/**
 * The editor's icons, by UnderFlow's names: Lyra's, from the `essentials` pack, written out whole so the pack has them.
 * Every name is here, so a name UnderFlow adds doesn't compile until it has one of Lyra's.
 */
const ICONS: Record<IconName, NbIconConfig> = {
    'heading': { icon: 'heading-outline', pack: 'essentials' },
    'bold': { icon: 'bold-outline', pack: 'essentials' },
    'italic': { icon: 'italic-outline', pack: 'essentials' },
    'strike': { icon: 'strikethrough-outline', pack: 'essentials' },
    'hrline': { icon: 'minus-outline', pack: 'essentials' },
    'quote': { icon: 'quote-outline', pack: 'essentials' },
    'bullet-list': { icon: 'list-outline', pack: 'essentials' },
    'ordered-list': { icon: 'list-numbered-outline', pack: 'essentials' },
    'task-list': { icon: 'list-checked-outline', pack: 'essentials' },
    'indent': { icon: 'indent-outline', pack: 'essentials' },
    'outdent': { icon: 'outdent-outline', pack: 'essentials' },
    'table': { icon: 'table-outline', pack: 'essentials' },
    'image': { icon: 'image-outline', pack: 'essentials' },
    'link': { icon: 'link-outline', pack: 'essentials' },
    'code': { icon: 'code-outline', pack: 'essentials' },
    'codeblock': { icon: 'code-block-outline', pack: 'essentials' },
    'more': { icon: 'more-horizontal-outline', pack: 'essentials' },
    'add-row-up': { icon: 'table-row-add-above-outline', pack: 'essentials' },
    'add-row-down': { icon: 'table-row-add-below-outline', pack: 'essentials' },
    'add-column-left': { icon: 'table-column-add-left-outline', pack: 'essentials' },
    'add-column-right': { icon: 'table-column-add-right-outline', pack: 'essentials' },
    'remove-row': { icon: 'table-row-remove-outline', pack: 'essentials' },
    'remove-column': { icon: 'table-column-remove-outline', pack: 'essentials' },
    'align-column-left': { icon: 'align-left-outline', pack: 'essentials' },
    'align-column-center': { icon: 'align-center-outline', pack: 'essentials' },
    'align-column-right': { icon: 'align-right-outline', pack: 'essentials' },
    'remove-table': { icon: 'table-remove-outline', pack: 'essentials' },
    'chevron-down': { icon: 'chevron-down-outline', pack: 'essentials' },
    'pencil': { icon: 'edit-outline', pack: 'essentials' }
}

/** The Format button's icon. */
const FORMAT_ICON: NbIconConfig = { icon: 'brush-outline', pack: 'essentials' }

/** The command the Format button runs, in either mode. */
const FORMAT_COMMAND = 'nbFormat'

/** UnderFlow's toolbar, with the Format button before the scroll sync switch. */
const TOOLBAR: NbMarkdownEditorToolbar = [
    ['heading', 'bold', 'italic', 'strike'],
    ['hr', 'quote'],
    ['ul', 'ol', 'task', 'indent', 'outdent'],
    ['table', 'image', 'link'],
    ['code', 'codeblock'],
    ['format'],
    ['scrollSync']
]

/** The checkmark of the scroll sync switch, which looks like Lyra's toggle. */
const SWITCH_CHECKMARK: NbIconConfig = { icon: 'checkmark-bold-outline', pack: 'essentials' }

// The editor's texts are registered by language code for all editors, so editors with the same texts share a code.
const languages = new Map<string, string>()

function languageCode(library: typeof Editor, texts: NbMarkdownEditorTexts) {
    const language = nbMarkdownEditorLanguage(texts)
    const key = JSON.stringify(language)
    let code = languages.get(key)
    if (!code) {
        code = `x-nb-markdown-${languages.size}`
        languages.set(key, code)
        library.setLanguage(code, language)
    }
    return code
}

/**
 * A markdown editor, with a toolbar, a preview and a WYSIWYG mode:
 *
 * ```html
 * <nb-markdown-editor [formControl]="text" aria-label="Description" />
 * ```
 *
 * @stacked-example(Showcase, markdown/markdown-editor-showcase.component)
 *
 * ### Installation
 *
 * Install [`@liquid-js/underflow`](https://www.npmjs.com/package/@liquid-js/underflow), which is the editor, with the
 * ProseMirror and DOMPurify packages it uses, and import `NbMarkdownEditorComponent` from
 * `@liquid-js/lyr-extras/markdown-editor`:
 *
 * ```bash
 * npm install @liquid-js/underflow prosemirror-commands prosemirror-history prosemirror-inputrules \
 *   prosemirror-keymap prosemirror-model prosemirror-state prosemirror-transform prosemirror-view dompurify
 * ```
 *
 * The Format button formats with [`remark`](https://remark.js.org), which it loads when it's first used, with
 * `remark-gfm` and `remark-frontmatter`:
 *
 * ```bash
 * npm install remark remark-gfm remark-frontmatter
 * ```
 *
 * The editor loads when the first one shows; its styles come with the component. It highlights code with the
 * highlight.js that [`nxt-highlightjs`](https://www.npmjs.com/package/nxt-highlightjs) loads, when the app sets it up
 * as in `nb-markdown-viewer`, so install them too:
 *
 * ```bash
 * npm install nxt-highlightjs highlight.js
 * ```
 *
 * ### Usage
 *
 * It's a form control whose value is the markdown, CommonMark with GitHub's extensions, e.g. tables and task lists.
 * Its frame has the colours of a field and its `status`, and the text the theme's styles:
 * @stacked-example(States, markdown/markdown-editor-status.component)
 *
 * The preview shows the text's straight quotes, `--`, `---` and `...` as typographic quotes, en and em dashes and
 * ellipses, as `nb-markdown-viewer` does, while the markdown and the WYSIWYG mode keep them as written.
 *
 * In the markdown mode the preview is a tab, or next to the markdown with `previewStyle="vertical"`; the WYSIWYG mode
 * edits the formatted text, and `mode` is the one that shows. The toolbar wraps onto more lines when it doesn't fit,
 * so all of its buttons can be reached with Tab; `toolbarItems` picks them.
 *
 * The Format button, and Shift+Alt+F in the text, writes the markdown in one style with `nbFormatMarkdown`, which
 * also writes typographic quotes, dashes and ellipses as plain characters; Undo brings the text back. It's `format` in
 * `toolbarItems`.
 *
 * In the text, Tab indents list items and moves between table cells, so Escape and then Tab or Shift+Tab moves focus
 * out of it, as in code editors. Name the text with `aria-label`, `aria-labelledby` for a `label`, or an `nbLabel` with
 * `nbValidation`, which also gives it the field's status and errors, as it does an input.
 *
 * With `readonly` the text can be read, selected and copied, but not changed, as in a read-only field: the toolbar
 * and the mode switch are disabled, while the Write and Preview tabs still switch. Disabled, the editor is read-only
 * too, in the colours of a disabled field, and Tab skips it.
 *
 * Text that mixes right-to-left and left-to-right languages, e.g. Arabic or Hebrew quoted in English, reads right
 * with `autoDirection`: each paragraph, heading, list, quote and table takes the direction of its own text, as
 * `dir="auto"` does, in the preview and the WYSIWYG mode, and so does each line of the markdown. Code blocks read left
 * to right. The markdown itself doesn't change.
 *
 * `options` takes the [editor's other options](https://liquid-js.github.io/underflow/docs/), e.g. plugins, widgets
 * or `hooks.addImageBlobHook` to upload pasted images, and `editor()` is the editor, for its methods. It's made again
 * when the options, the toolbar, the texts or `autoDirection` change, keeping the markdown.
 */
@Component({
    selector: 'nb-markdown-editor',
    template: '<div #container></div>',
    styleUrl: './markdown-editor.component.scss',
    encapsulation: ViewEncapsulation.None,
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NbMarkdownEditorComponent), multi: true }],
    host: {
        'class': 'nb-markdown',
        '(keydown)': 'onKeydown($event)',
        '[attr.aria-disabled]': 'isDisabled() || null',
        '[style]': 'statusStyles()',
        // Keeps the editor's place until it loads.
        '[style.min-height]': "editor() ? null : height() === 'auto' ? minHeight() : height()"
    }
})
export class NbMarkdownEditorComponent implements ControlValueAccessor {
    protected readonly texts = injectNbMarkdownEditorTexts()
    protected readonly iconLibraries = inject(NbIconLibraries)

    /** The editor's height with the toolbar, e.g. `300px` (default) or `auto`, which grows with the text. */
    readonly height = input('300px')
    /** `200px` by default. */
    readonly minHeight = input('200px')
    /** The preview in a `tab` (default), or `vertical`, next to the markdown. */
    readonly previewStyle = input<PreviewStyle>('tab')
    /** `markdown` (default) or `wysiwyg`, and the mode the user picks. */
    readonly mode = model<EditorType>('markdown')
    readonly placeholder = input('')
    /** Field status: `basic` (default), `primary`, `info`, `success`, `warning`, `danger` or `control`. */
    readonly status = input<NbComponentOrCustomStatus>('basic')

    // The app's defaults for fields, which the shape starts from, as a textarea's does.
    protected readonly nbDefaults = injectNbDefaults('input')
    /** Field shape: `rectangle` (default), `semi-round` or `round`, only as round as a textarea gets. */
    readonly shapeInput = input<NbComponentShape | undefined>(undefined, { alias: 'shape' })
    /** The shape in use: the input's, the app's default, or 'rectangle'. */
    readonly shape = linkedSignal<NbComponentShape>(() => this.shapeInput() ?? this.nbDefaults().shape ?? 'rectangle')
    /** Groups of toolbar items, e.g. `[['heading', 'bold', 'italic'], ['link']]`. */
    readonly toolbarItems = input<NbMarkdownEditorToolbar>()
    /** Hides the Markdown and WYSIWYG tabs. */
    readonly hideModeSwitch = input(false, { transform: booleanAttribute })
    /**
     * Gives each paragraph, heading, list, quote and table the direction of its own text (`dir="auto"`), for text in
     * more than one direction; `false` by default.
     */
    readonly autoDirection = input(false, { transform: booleanAttribute })
    /** Options of `@liquid-js/underflow`'s editor, e.g. plugins. */
    readonly options = input<NbMarkdownEditorOptions>({})
    /** Names the text area when there's no `aria-labelledby`. */
    readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' })
    /** The id of the element that names the text area, e.g. a `label`. */
    readonly ariaLabelledBy = input<string | undefined>(undefined, { alias: 'aria-labelledby' })
    readonly disabled = input(false, { transform: booleanAttribute })
    /** Lets the user read the text, but not change it. */
    readonly readonly = input(false, { transform: booleanAttribute })

    /** The editor, once it's loaded. */
    readonly editor = signal<Editor | undefined>(undefined)

    protected readonly validation = inject(NbValidationDirective, { self: true, optional: true })
    // With `nbValidation`, the status it gives while the control shows errors or success.
    protected readonly resolvedStatus = computed(() => this.validation?.status() ?? this.status())

    protected readonly value = signal('')
    protected readonly isDisabled = linkedSignal(() => this.disabled())
    protected readonly container = viewChild.required<ElementRef<HTMLElement>>('container')
    /** Loads highlight.js, when the app highlights code. */
    protected readonly highlightLoader = inject(NXT_HIGHLIGHT_OPTIONS, { optional: true })
        ? inject(HighlightLoader)
        : undefined

    protected readonly statusStyles = computed(() => {
        const status = this.resolvedStatus()
        const shape = this.shape()
        return {
            '--nb-markdown-border-radius': `min(var(--input-${shape}-border-radius), var(--input-textarea-max-border-radius))`,
            '--nb-markdown-field-border-radius': `var(--input-${shape}-border-radius)`,
            // At rest; the styles pick the background by state, which an inline value would override.
            '--nb-markdown-rest-background': `var(--input-${status}-background-color)`,
            '--nb-markdown-border-color': `var(--input-${status}-border-color)`,
            '--nb-markdown-hover-background': `var(--input-${status}-hover-background-color)`,
            '--nb-markdown-hover-border-color': `var(--input-${status}-hover-border-color)`,
            '--nb-markdown-focus-background': `var(--input-${status}-focus-background-color)`,
            '--nb-markdown-focus-border-color': `var(--input-${status}-focus-border-color)`,
            '--nb-markdown-focus-and-hover-background': `var(--input-${status}-focus-and-hover-background-color)`,
            '--nb-markdown-focus-and-hover-border-color': `var(--input-${status}-focus-and-hover-border-color)`,
            '--nb-markdown-disabled-background': `var(--input-${status}-disabled-background-color)`,
            '--nb-markdown-disabled-border-color': `var(--input-${status}-disabled-border-color)`
        }
    })

    /** What the editor is made with; it's made again when this changes. */
    protected readonly setup = computed<Setup | undefined>(() => {
        const highlight = this.highlightLoader?.hljs
        // The editor waits for highlight.js rather than being made again when it loads.
        if (highlight?.isLoading()) {
            return undefined
        }
        return {
            texts: this.texts(),
            toolbarItems: this.toolbarItems(),
            hideModeSwitch: this.hideModeSwitch(),
            autoDirection: this.autoDirection(),
            options: this.options(),
            highlighter: highlight?.hasValue() ? highlight.value() : undefined
        }
    })

    protected creating = 0
    protected destroyed = false
    /** Set while the form's value is written, which isn't a change to report. */
    protected writing = false

    protected onChange: (value: string) => void = () => {}
    /** @internal */
    onTouched: () => void = () => {}

    constructor() {
    // The text is the control: it gets the validation's ARIA, and the focus from an `nbLabel`, not the host.
        this.validation?.delegateAria(() => this.editor()?.focus())
        if (!isPlatformBrowser(inject(PLATFORM_ID))) {
            return
        }
        afterRenderEffect(() => {
            const setup = this.setup()
            if (setup) {
                untracked(() => void this.create(setup))
            }
        })
        afterRenderEffect(() => {
            const editor = this.editor()
            const [height, minHeight, previewStyle, placeholder, mode] = [
                this.height(),
                this.minHeight(),
                this.previewStyle(),
                this.placeholder(),
                this.mode()
            ]
            if (!editor) {
                return
            }
            if (editor.getHeight() !== height) {
                editor.setHeight(height)
            }
            if (editor.getMinHeight() !== minHeight) {
                editor.setMinHeight(minHeight)
            }
            if (editor.getCurrentPreviewStyle() !== previewStyle) {
                editor.changePreviewStyle(previewStyle)
                // The vertical preview brings the scroll sync switch.
                this.markSwitch()
            }
            editor.setPlaceholder(placeholder)
            if (editor.isWysiwygMode() !== (mode === 'wysiwyg')) {
                editor.changeMode(mode, true)
            }
        })
        afterRenderEffect(() => {
            const editor = this.editor()
            const [disabled, readonly] = [this.isDisabled(), this.readonly()]
            if (editor) {
                editor.setDisabled(disabled)
                editor.setReadonly(readonly)
            }
        })
        afterRenderEffect(() => {
            const editor = this.editor()
            const validation = this.validation
            const labelledBy = [this.ariaLabelledBy(), validation?.labelledBy()].filter(Boolean).join(' ') || undefined
            const attributes = {
                'aria-label': labelledBy ? undefined : this.ariaLabel(),
                'aria-labelledby': labelledBy,
                'aria-invalid': validation?.ariaInvalid() ?? undefined,
                'aria-describedby': validation?.describedBy() ?? undefined,
                'aria-required': validation?.ariaRequired() ?? undefined
            }
            if (editor) {
                this.label(editor, attributes)
            }
        })
        inject(DestroyRef).onDestroy(() => {
            this.destroyed = true
            this.editor()?.destroy()
        })
    }

    // Untracked, as forms write values from wherever the app sets them, e.g. an effect that mustn't come to depend
    // on the control.
    writeValue(value?: string | null) {
        untracked(() => {
            const markdown = value ?? ''
            this.value.set(markdown)
            const editor = this.editor()
            if (editor && editor.getMarkdown() !== markdown) {
                this.writing = true
                try {
                    editor.setMarkdown(markdown, false, false)
                } finally {
                    this.writing = false
                }
            }
        })
    }

    registerOnChange(fn: (value: string) => void) {
        this.onChange = fn
    }

    registerOnTouched(fn: () => void) {
        this.onTouched = fn
    }

    setDisabledState(disabled: boolean) {
        this.isDisabled.set(disabled)
    }

    /** Moves focus to the text. */
    focus() {
        this.editor()?.focus()
    }

    protected async create(setup: Setup) {
        const creating = ++this.creating
        const [{ Editor }, highlight] = await Promise.all([
            import('@liquid-js/underflow'),
            setup.highlighter ? import('@liquid-js/underflow/plugins/code-syntax-highlight') : undefined
        ])
        if (creating !== this.creating || this.destroyed) {
            return
        }
        const plugins: EditorPlugin[] = [...(setup.options.plugins ?? [])]
        if (highlight && setup.highlighter) {
            plugins.push([highlight.codeSyntaxHighlightPlugin, { highlighter: setup.highlighter }])
        }

        const previous = this.editor()
        previous?.destroy()
        Editor.setIcons(this.icons())
        const editor = new Editor({
            // The preview shows quotes, dashes and ellipses as nb-markdown-viewer does.
            smartPunctuation: true,
            ...setup.options,
            plugins,
            el: this.container().nativeElement,
            initialValue: this.value(),
            initialEditType: this.mode(),
            height: this.height(),
            minHeight: this.minHeight(),
            previewStyle: this.previewStyle(),
            placeholder: this.placeholder(),
            language: languageCode(Editor, setup.texts),
            autofocus: false,
            disabled: this.isDisabled(),
            readonly: this.readonly(),
            // Every button stays in the toolbar, where Tab reaches it, instead of a menu that opens on hover.
            toolbarStyle: 'wrap',
            toolbarItems: this.toolbar(setup),
            hideModeSwitch: setup.hideModeSwitch,
            autoDirection: setup.autoDirection
        })
        editor.on('change', () => this.changed(editor))
        editor.on('blur', () => this.onTouched())
        editor.on('changeMode', (mode: EditorType) => this.mode.set(mode))
        for (const type of ['markdown', 'wysiwyg'] as const) {
            editor.addCommand(type, FORMAT_COMMAND, () => {
                void this.format(editor)
                return true
            })
        }
        this.markSwitch()
        this.editor.set(editor)
    }

    /** The toolbar's groups, with the Format button for `format`. */
    protected toolbar(setup: Setup): NbMarkdownEditorToolbar {
        const button = {
            name: 'format',
            // UnderFlow's class for a toolbar button with an icon, which its own buttons have.
            className: 'nb-markdown-format uf-toolbar-icons',
            tooltip: setup.texts.format,
            icon: this.iconLibraries.getSvgIcon(FORMAT_ICON.icon, FORMAT_ICON.pack)?.icon.getContent(),
            command: FORMAT_COMMAND
        }
        return (setup.toolbarItems ?? TOOLBAR).map((group) => group.map((item) => (item === 'format' ? button : item)))
    }

    /** Formats the markdown, with Shift+Alt+F too, unless the user can't change it. */
    protected onKeydown(event: KeyboardEvent) {
        const editor = this.editor()
        if (event.code === 'KeyF' && event.shiftKey && event.altKey && !event.ctrlKey && !event.metaKey && editor) {
            // The key would type a character, e.g. Ï on a Mac.
            event.preventDefault()
            void this.format(editor)
        }
    }

    /**
     * Writes the markdown in one style, as an edit Undo takes back, keeping the cursor's line; the text stays if the
     * user changes it while the formatter loads.
     */
    protected async format(editor: Editor) {
        if (editor.isReadonly() || editor.isDisabled()) {
            return
        }
        const markdown = editor.getMarkdown()
        const formatted = await nbFormatMarkdown(markdown)
        if (formatted === markdown || editor !== this.editor() || editor.getMarkdown() !== markdown) {
            return
        }
        const line = editor.getCursorLine()
        editor.setMarkdown(formatted, false, false)
        editor.moveCursorTo(Math.min(line, formatted.split('\n').length), true)
    }

    protected changed(editor: Editor) {
        const markdown = editor.getMarkdown()
        if (markdown === this.value()) {
            return
        }
        this.value.set(markdown)
        if (!this.writing) {
            this.onChange(markdown)
        }
    }

    /**
     * The editor's icons as the `essentials` pack has them, so an app that replaces one there replaces it here too; one
     * the pack doesn't have keeps UnderFlow's own.
     */
    protected icons(): Partial<Record<IconName, string>> {
        return Object.fromEntries(
            Object.entries(ICONS).map(([name, { icon, pack }]) => [
                name,
                this.iconLibraries.getSvgIcon(icon, pack)?.icon.getContent() || undefined
            ])
        )
    }

    /** Gives the scroll sync switch the checkmark of Lyra's toggle, which shows when it's on. */
    protected markSwitch() {
        const toggle = this.container().nativeElement.querySelector('.scroll-sync .switch')
        if (!toggle || toggle.querySelector('.nb-markdown-switch-checkmark')) {
            return
        }
        const checkmark = toggle.ownerDocument.createElement('span')
        checkmark.className = 'nb-markdown-switch-checkmark'
        checkmark.setAttribute('aria-hidden', 'true')
        checkmark.innerHTML =
            this.iconLibraries.getSvgIcon(SWITCH_CHECKMARK.icon, SWITCH_CHECKMARK.pack)?.icon.getContent() ?? ''
        toggle.append(checkmark)
    }

    /** Names the texts, the markdown and the WYSIWYG one, leaving out the attributes without a value. */
    protected label(editor: Editor, attributes: Record<string, string | undefined>) {
        const { mdEditor, wwEditor } = editor.getEditorElements()
        for (const text of [mdEditor, wwEditor].map((element) => element.querySelector('.ProseMirror'))) {
            for (const [name, value] of Object.entries(attributes)) {
                if (value) {
                    text?.setAttribute(name, value)
                } else {
                    text?.removeAttribute(name)
                }
            }
        }
    }
}
