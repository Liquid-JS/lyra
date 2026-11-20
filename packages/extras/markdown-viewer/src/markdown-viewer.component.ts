import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  ElementRef,
  inject,
  input,
  TemplateRef,
  viewChild,
  viewChildren,
  ViewEncapsulation,
} from '@angular/core';
import type { Node, Root } from 'mdast';
import { RemarkNodeComponent, RemarkTemplateDirective, RemarkTemplatesService } from 'ngx-remark';
import { HighlightDirective, NXT_HIGHLIGHT_OPTIONS } from 'nxt-highlightjs';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkSmartypants from 'remark-smartypants';

import { prepareTree } from './markdown-tree';
import { injectNbMarkdownViewerTexts } from './texts';

/** A unified processor that parses markdown, with its plugins, e.g. `remark().use(remarkGfm)`. */
export interface NbMarkdownProcessor {
  parse(markdown: string): Node;
  runSync(tree: Node): Node;
}

/** Typographic characters for the plain ones the markdown editor's Format button writes: `--` and `---` are dashes. */
const typography = { dashes: 'oldschool' } as const;

const defaultProcessor: NbMarkdownProcessor = remark().use(remarkGfm).use(remarkSmartypants, typography).freeze();

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
  'wbr',
]);

const blockParents = new Set(['root', 'blockquote', 'listItem', 'footnoteDefinition']);

let nextId = 0;

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
 *
 * @stacked-example(Templates, markdown/markdown-viewer-templates.component)
 *
 * Text that mixes right-to-left and left-to-right languages, e.g. Arabic or Hebrew quoted in English, reads right
 * with `autoDirection`, as in the editor: each block of the document, i.e. a paragraph, heading, list, quote, table,
 * HTML block or the footnotes, takes the direction of its own text, as `dir="auto"` does. Blocks in a quote or a list
 * share its direction, and code blocks read left to right. Templates of your own render their elements as they are, so
 * they need `dir="auto"` themselves.
 *
 * `processor` replaces the parser, e.g. to add remark plugins, whose new types of nodes need templates of their own.
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
  templateUrl: './markdown-viewer.component.html',
  styleUrl: './markdown-viewer.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RemarkTemplatesService],
  imports: [RemarkNodeComponent, RemarkTemplateDirective, HighlightDirective],
  host: {
    class: 'nb-markdown',
  },
})
export class NbMarkdownViewerComponent {
  /** The markdown to show. */
  readonly markdown = input('');
  /** Parses the markdown, `remark().use(remarkGfm).use(remarkSmartypants, { dashes: 'oldschool' })` by default. */
  readonly processor = input<NbMarkdownProcessor>();
  /**
   * Gives each block of the document, e.g. a paragraph or a list, the direction of its own text (`dir="auto"`), for
   * text in more than one direction; `false` by default.
   */
  readonly autoDirection = input(false, { transform: booleanAttribute });

  /** The markdown's syntax tree, as its templates render it. */
  readonly tree = computed(() => {
    const processor = this.processor() ?? defaultProcessor;
    return prepareTree(processor.runSync(processor.parse(this.markdown())) as Root);
  });

  protected readonly id = `nb-markdown-${nextId++}`;
  protected readonly texts = injectNbMarkdownViewerTexts();
  protected readonly htmlElements = htmlElements;
  protected readonly blockParents = blockParents;
  protected readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  /** Whether the app loads highlight.js for code, the same on the server and in the browser. */
  protected readonly highlighting = !!inject(NXT_HIGHLIGHT_OPTIONS, { optional: true });
  protected readonly defaultTemplates = viewChildren(RemarkTemplateDirective);
  protected readonly customTemplates = contentChildren(RemarkTemplateDirective);
  protected readonly fallback = viewChild.required<TemplateRef<unknown>>('fallback');

  constructor() {
    // A node without a template, e.g. of a plugin, shows its content.
    inject(RemarkTemplatesService).templates = computed(() => {
      const templates: Record<string, TemplateRef<unknown> | undefined> = {};
      for (const template of [...this.defaultTemplates(), ...this.customTemplates()]) {
        templates[template.nodeType()] = template.template;
      }
      const fallback = this.fallback();
      return new Proxy(templates, { get: (target, type: string) => target[type] ?? fallback });
    });
  }

  /** `auto` for a block of the document, with `autoDirection`, which a block in a quote or a list shares. */
  protected direction(parent: Node) {
    return this.autoDirection() && parent.type === 'root' ? 'auto' : null;
  }

  protected footnoteId(identifier: string, reference = false) {
    return `${this.id}-${reference ? 'fnref' : 'fn'}-${identifier}`;
  }

  /** Moves to a footnote in the page, whose address the document's base would otherwise change. */
  protected showFootnote(event: Event, id: string) {
    const target = this.element.nativeElement.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
    if (target) {
      event.preventDefault();
      target.scrollIntoView();
    }
  }
}
