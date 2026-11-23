import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core'
import { NbMarkdownProcessor, NbMarkdownRendering } from '@liquid-js/lyr-extras/markdown-renderer'
import { RemarkNodeComponent, RemarkTemplateDirective, RemarkTemplatesService } from 'ngx-remark'
import { HighlightDirective } from 'nxt-highlightjs'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkSmartypants from 'remark-smartypants'

/** Typographic characters for the plain ones the markdown editor's Format button writes: `--` and `---` are dashes. */
const typography = { dashes: 'oldschool' } as const

const defaultProcessor: NbMarkdownProcessor = remark().use(remarkGfm).use(remarkSmartypants, typography).freeze()

/**
 * Shows markdown, in the theme's text styles:
 *
 * ```html
 * <nb-markdown-viewer [markdown]="text" />
 * ```
 *
 * @stacked-example(Showcase, markdown/markdown-viewer-showcase.component)
 *
 * ### Installation
 *
 * It renders the markdown with Angular's templates through [`ngx-remark`](https://www.npmjs.com/package/ngx-remark),
 * which parses it with [`remark`](https://remark.js.org), [`remark-gfm`](https://www.npmjs.com/package/remark-gfm) and
 * [`remark-smartypants`](https://www.npmjs.com/package/remark-smartypants), and highlights code with
 * [`nxt-highlightjs`](https://www.npmjs.com/package/nxt-highlightjs); install them and import
 * `NbMarkdownViewerComponent` from `@liquid-js/lyr-extras/markdown-viewer`.
 *
 * ```sh
 * npm install ngx-remark remark remark-gfm remark-smartypants nxt-highlightjs highlight.js
 * ```
 *
 * `remark` uses a CommonJS module, `extend`, which Angular's build warns about unless it's in
 * `allowedCommonJsDependencies` in `angular.json`.
 *
 * ### Usage
 *
 * The markdown is CommonMark with GitHub's extensions: tables, task lists, strikethrough, autolinks and footnotes. It
 * renders as the editor's preview shows it, on the server too, so a prerendered page has the text before scripts run.
 * The text's straight quotes, `--`, `---` and `...` show as typographic quotes, en and em dashes and ellipses, so the
 * markdown can keep the plain characters that the editor's Format button writes; code shows them as they are.
 *
 * HTML blocks in the markdown are sanitized by Angular. In a line of text, only formatting elements such as `<kbd>`,
 * `<sup>` or `<mark>` apply, without their attributes.
 *
 * Each element is rendered by an Angular template, which a template of your own can replace, e.g. to render links
 * with the router or code with a highlighter. Import `RemarkModule` from `ngx-remark`, and put the templates in the
 * viewer, named by the [type of node](https://github.com/syntax-tree/mdast#nodes) they render; `[remarkNode]` renders
 * the node's content in an element, or `<remark-node [remarkNode]="node" />` in a component:
 *
 * ```html
 * <nb-markdown-viewer [markdown]="text">
 *   <a *remarkTemplate="'link'; let node" [routerLink]="node.url" [remarkNode]="node"></a>
 * </nb-markdown-viewer>
 * ```
 * @stacked-example(Templates, markdown/markdown-viewer-templates.component)
 *
 * Text that mixes right-to-left and left-to-right languages, e.g. Arabic or Hebrew quoted in English, reads right
 * with `autoDirection`, as in the editor: each block of the document, i.e. a paragraph, heading, list, quote, table,
 * HTML block or the footnotes, takes the direction of its own text, as `dir="auto"` does. Blocks in a quote or a list
 * share its direction, and code blocks read left to right. Templates of your own render their elements as they are, so
 * they need `dir="auto"` themselves.
 *
 * `processor` replaces the parser, e.g. to add remark plugins, whose new types of nodes need templates of their own.
 * An app with a processor and content styles of its own can use `nb-markdown-renderer` instead, which renders the same
 * way without loading the default processor's packages or these styles.
 *
 * ### Code highlighting
 *
 * Code blocks are highlighted in the theme's colours once the app loads highlight.js, with the languages it uses:
 *
 * ```ts
 * import { provideHighlightOptions } from 'nxt-highlightjs';
 *
 * provideHighlightOptions({
 *   coreLibraryLoader: () => import('highlight.js/lib/core').then((m) => m.default),
 *   languages: {
 *     typescript: () => import('highlight.js/lib/languages/typescript').then((m) => m.default),
 *     xml: () => import('highlight.js/lib/languages/xml').then((m) => m.default),
 *   },
 * });
 * ```
 *
 * Code in other languages, or without one, shows as plain text. The server waits for highlight.js, so a prerendered
 * page has highlighted code. `nb-markdown-editor` highlights its preview and WYSIWYG code the same way.
 */
@Component({
    selector: 'nb-markdown-viewer',
    // The renderer's templates, so both render the markdown the same way.
    templateUrl: '../../markdown-renderer/src/markdown-renderer.component.html',
    styleUrl: './markdown-viewer.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [RemarkTemplatesService],
    imports: [RemarkNodeComponent, RemarkTemplateDirective, HighlightDirective],
    host: {
        class: 'nb-markdown'
    }
})
export class NbMarkdownViewerComponent extends NbMarkdownRendering {
    /** Parses the markdown, `remark().use(remarkGfm).use(remarkSmartypants, { dashes: 'oldschool' })` by default. */
    readonly processor = input<NbMarkdownProcessor>()

    protected parser() {
        return this.processor() ?? defaultProcessor
    }
}
