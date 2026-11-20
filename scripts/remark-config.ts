import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import type { Preset } from 'unified'

import { NB_MARKDOWN_STYLE, nbRemarkNormalise } from '../packages/extras/markdown-editor/src/format-style.ts'

/**
 * The markdown formatter's settings, as the markdown editor's Format button has them: `yarn format:md` formats with
 * them, and so does VS Code's remark extension (unifiedjs.vscode-remark), with Format Document, through
 * `.remarkrc.mjs`.
 */
export const remarkConfig: Preset = {
    settings: NB_MARKDOWN_STYLE,
    plugins: [[remarkFrontmatter, ['yaml', 'toml']], remarkGfm, nbRemarkNormalise]
}
