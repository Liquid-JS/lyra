import {
    booleanAttribute,
    computed,
    contentChildren,
    Directive,
    ElementRef,
    inject,
    input,
    TemplateRef,
    viewChild,
    viewChildren
} from '@angular/core'
import type { Node, Root } from 'mdast'
import { RemarkTemplateDirective, RemarkTemplatesService } from 'ngx-remark'
import { NXT_HIGHLIGHT_OPTIONS } from 'nxt-highlightjs'

import { prepareTree } from './markdown-tree'
import { injectNbMarkdownViewerTexts } from './texts'

/** A unified processor that parses markdown, with its plugins, e.g. `remark().use(remarkGfm)`. */
export interface NbMarkdownProcessor {
    parse(markdown: string): Node
    runSync(tree: Node): Node
}

/** HTML elements the markdown can use in a line of text, without their attributes. */
const htmlElements = new Set([
    'abbr',
    'b',
    'br',
    'cite',
    'code',
    'del',
    'em',
    'i',
    'ins',
    'kbd',
    'mark',
    's',
    'samp',
    'small',
    'span',
    'strong',
    'sub',
    'sup',
    'u',
    'var',
    'wbr'
])

const blockParents = new Set(['root', 'blockquote', 'listItem', 'footnoteDefinition'])

let nextId = 0

/**
 * What `nb-markdown-renderer` and `nb-markdown-viewer` share: the markdown's syntax tree and the templates that render
 * it. They differ in the processor they parse with and in their styles. Each provides its own `RemarkTemplatesService`,
 * so templates put in it, and the templates' own content, find its templates.
 */
@Directive()
export abstract class NbMarkdownRendering {
    /** The markdown to show. */
    readonly markdown = input('')
    /**
     * Gives each block of the document, e.g. a paragraph or a list, the direction of its own text (`dir="auto"`), for
     * text in more than one direction; `false` by default.
     */
    readonly autoDirection = input(false, { transform: booleanAttribute })

    /** The markdown's syntax tree, as its templates render it. */
    readonly tree = computed(() => {
        const processor = this.parser()
        return prepareTree(processor.runSync(processor.parse(this.markdown())) as Root)
    })

    protected readonly id = `nb-markdown-${nextId++}`
    protected readonly texts = injectNbMarkdownViewerTexts()
    protected readonly htmlElements = htmlElements
    protected readonly blockParents = blockParents
    protected readonly element = inject<ElementRef<HTMLElement>>(ElementRef)
    /** Whether the app loads highlight.js for code, the same on the server and in the browser. */
    protected readonly highlighting = !!inject(NXT_HIGHLIGHT_OPTIONS, { optional: true })
    protected readonly defaultTemplates = viewChildren(RemarkTemplateDirective)
    protected readonly customTemplates = contentChildren(RemarkTemplateDirective)
    protected readonly fallback = viewChild.required<TemplateRef<unknown>>('fallback')

    constructor() {
        // A node without a template, e.g. of a plugin, shows its content.
        inject(RemarkTemplatesService).templates = computed(() => {
            const templates: Record<string, TemplateRef<unknown> | undefined> = {}
            for (const template of [...this.defaultTemplates(), ...this.customTemplates()]) {
                templates[template.nodeType()] = template.template
            }
            const fallback = this.fallback()
            return new Proxy(templates, { get: (target, type: string) => target[type] ?? fallback })
        })
    }

    /** The processor the markdown is parsed with. */
    protected abstract parser(): NbMarkdownProcessor

    /** `auto` for a block of the document, with `autoDirection`, which a block in a quote or a list shares. */
    protected direction(parent: Node) {
        return this.autoDirection() && parent.type === 'root' ? 'auto' : null
    }

    protected footnoteId(identifier: string, reference = false) {
        return `${this.id}-${reference ? 'fnref' : 'fn'}-${identifier}`
    }

    /** Moves to a footnote in the page, whose address the document's base would otherwise change. */
    protected showFootnote(event: Event, id: string) {
        const target = this.element.nativeElement.querySelector<HTMLElement>(`#${CSS.escape(id)}`)
        if (target) {
            event.preventDefault()
            target.scrollIntoView()
        }
    }
}
