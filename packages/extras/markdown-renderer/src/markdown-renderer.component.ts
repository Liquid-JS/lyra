import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core'
import { RemarkNodeComponent, RemarkTemplateDirective, RemarkTemplatesService } from 'ngx-remark'
import { HighlightDirective } from 'nxt-highlightjs'

import { NbMarkdownProcessor, NbMarkdownRendering } from './markdown-rendering'

/**
 * Renders markdown with a processor of the app's, and no styles of its own, for an app that styles its content itself:
 *
 * ```html
 * <nb-markdown-renderer [markdown]="text" [processor]="processor" />
 * ```
 *
 * @stacked-example(Renderer, markdown/markdown-renderer.component)
 *
 * It renders as `nb-markdown-viewer` does, with the same templates, which templates of the app's replace the same way,
 * and the same `autoDirection`, footnotes and code highlighting. Unlike the viewer, it doesn't load `remark` or
 * `remark-smartypants` for a default processor, nor the editor's content styles: the processor is the app's, and the
 * content is styled by the app, in the element with class `uf-contents`.
 *
 * ```sh
 * npm install ngx-remark nxt-highlightjs highlight.js
 * ```
 *
 * Import `NbMarkdownRendererComponent` from `@liquid-js/lyr-extras/markdown-renderer`, and give it a processor that
 * parses markdown, e.g. with `unified` and `remark-parse`, which `ngx-remark` uses too:
 *
 * ```ts
 * import { unified } from 'unified';
 * import remarkParse from 'remark-parse';
 * import remarkGfm from 'remark-gfm';
 *
 * readonly processor = unified().use(remarkParse).use(remarkGfm).freeze();
 * ```
 */
@Component({
    selector: 'nb-markdown-renderer',
    templateUrl: './markdown-renderer.component.html',
    styleUrl: './markdown-renderer.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [RemarkTemplatesService],
    imports: [RemarkNodeComponent, RemarkTemplateDirective, HighlightDirective]
})
export class NbMarkdownRendererComponent extends NbMarkdownRendering {
    /** Parses the markdown, with the plugins the app uses. */
    readonly processor = input.required<NbMarkdownProcessor>()

    protected parser() {
        return this.processor()
    }
}
