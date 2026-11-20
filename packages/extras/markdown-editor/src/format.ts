import { NB_MARKDOWN_STYLE, nbRemarkNormalise } from './format-style'

/**
 * Formats markdown, CommonMark with GitHub's extensions, in one style, as `nb-markdown-editor`'s Format button does:
 * the same document, written the same way wherever it came from. Prose is written in plain characters, quotes,
 * dashes and ellipses as `'`, `"`, `--`, `---` and `...`, leaving how they look to the renderer, and a rule written
 * as `<hr>` as `---`. Code stays as it is, and so does front matter, YAML between `---` lines or TOML between `+++`
 * lines. It loads `remark`, `remark-gfm` and `remark-frontmatter` when first called.
 *
 * ```ts
 * import { nbFormatMarkdown } from '@liquid-js/lyr-extras/markdown-editor';
 *
 * const formatted = await nbFormatMarkdown('* one\n* two\n\n__it’s bold__');
 * // "- one\n- two\n\n**it's bold**\n"
 * ```
 */
export async function nbFormatMarkdown(markdown: string): Promise<string> {
    const [{ remark }, { default: remarkGfm }, { default: remarkFrontmatter }] = await Promise.all([
        import('remark'),
        import('remark-gfm'),
        import('remark-frontmatter')
    ])
    const file = await remark()
        .use(remarkFrontmatter, ['yaml', 'toml'])
        .use(remarkGfm)
        .use(nbRemarkNormalise)
        .data('settings', NB_MARKDOWN_STYLE)
        .process(markdown)
    return String(file)
}
