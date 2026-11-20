import { Location } from '@angular/common'
import { booleanAttribute, Component, inject, input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { RemarkModule } from 'ngx-remark'
import { HighlightDirective } from 'nxt-highlightjs'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkSmartypants from 'remark-smartypants'
import { type Plugin, unified } from 'unified'

/**
 * The text's plain quotes, `--`, `---` and `...`, as the markdown formatter writes them, show as typographic ones. It
 * only changes text, so the tree keeps its type, which ngx-remark's `processor` needs.
 */
const typography = remarkSmartypants as Plugin<Parameters<typeof remarkSmartypants>, undefined>

const processor = unified().use(remarkParse).use(remarkGfm).use(typography, { dashes: 'oldschool' }).freeze()

/** Parents of block content, whose HTML is a block of its own rather than a tag in a line of text. */
const blockParents = new Set(['root', 'blockquote', 'listItem'])

/**
 * Markdown of the articles and doc comments, rendered with templates: links in the docs use the router, and code is
 * highlighted.
 */
@Component({
    selector: 'ngd-markdown',
    templateUrl: './markdown.component.html',
    // The markdown's blocks are blocks of the page: ngx-remark's elements are inline, and wrap them without a box of
    // their own, as the extras' markdown viewer does. Safari counts an inline wrapper around blocks into a card's height,
    // which then scrolls a pixel.
    styles: `
    :host {
      display: block;
    }

    :host ::ng-deep :is(remark, remark-node) {
      display: contents;
    }

    // A name in a line of text that's wider than the card, e.g. on a phone, breaks rather than run past it; one that
    // fits a line moves to the next whole, as before.
    :host ::ng-deep :not(pre) > code {
      overflow-wrap: break-word;
    }

    // A code block scrolls sideways itself where its lines are wider than the card.
    pre > code {
      display: block;
      overflow-x: auto;
    }
  `,
    imports: [RemarkModule, RouterLink, HighlightDirective]
})
export class NgdMarkdownComponent {
    private readonly location = inject(Location)

    readonly markdown = input('')
    /** Shows HTML as text, as in doc comments, where it's part of the description. */
    readonly description = input(false, { transform: booleanAttribute })

    protected readonly processor = processor
    protected readonly blockParents = blockParents

    /** Whether a link leaves the docs, and opens in a new tab: it has a scheme, or it's protocol-relative. */
    protected isExternal(url: string) {
        return /^([a-z][a-z0-9+.-]*:|\/\/)/i.test(url)
    }

    /** The route and fragment of a link in the docs, whose paths are relative to the base href. */
    protected route(url: string) {
        const [path, fragment] = url.split('#', 2)
        return { path: path ? `/${path.replace(/^\//, '')}` : undefined, fragment }
    }

    /** An image's address, relative to the base href. */
    protected asset(url: string) {
        return this.isExternal(url) || url.startsWith('/') ? url : this.location.prepareExternalUrl(url)
    }
}
