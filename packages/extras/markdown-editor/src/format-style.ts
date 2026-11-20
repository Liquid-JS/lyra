// The formatter's style and plugin, which `scripts/remark-config.ts` uses too, for `yarn format:md` and VS Code's
// remark extension: this module only has type imports, so Node runs it as it is.
import type { Nodes, Root } from 'mdast';
import type { Options } from 'remark-stringify';

/**
 * How formatted markdown is written: `-` bullets, `1.` numbers, `_emphasis_`, `**strong**`, fenced code with
 * backticks, `#` headings, `---` rules, and tables with their columns lined up.
 */
export const NB_MARKDOWN_STYLE: Options = {
  bullet: '-',
  bulletOrdered: '.',
  emphasis: '_',
  strong: '*',
  fence: '`',
  fences: true,
  rule: '-',
  setext: false,
  closeAtx: false,
  listItemIndent: 'one',
  incrementListMarker: true,
  quote: '"',
};

/** Typographic characters and the plain ones they're written as: the renderer decides how to show them. */
const PLAIN: [RegExp, string][] = [
  [/[‘’′]/g, "'"],
  [/[“”″]/g, '"'],
  [/—/g, '---'],
  [/–/g, '--'],
  [/…/g, '...'],
];

function plain(value: string): string {
  return PLAIN.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
}

/** A rule written as HTML, `<hr>`, on a line of its own; the formatter writes it as markdown's. */
const HR = /^<hr\s*\/?>$/i;

/** The nodes whose children are blocks, where an `<hr>` is a rule rather than a tag in the text. */
const BLOCKS = new Set(['root', 'blockquote', 'listItem']);

/** An HTML block as markdown's rule where it is, or ends with, an `<hr>`: e.g. one right after a `</div>`. */
function rules(node: Nodes): Nodes[] {
  if (node.type !== 'html') {
    return [node];
  }
  const lines = node.value.trimEnd().split('\n');
  if (!HR.test(lines[lines.length - 1].trim())) {
    return [node];
  }
  const html = lines.slice(0, -1).join('\n');
  return [...(html.trim() ? [{ ...node, value: html }] : []), { type: 'thematicBreak' }];
}

/**
 * Writes prose in plain characters, text and the titles and alt text of links and images, and rules as markdown's;
 * code and other HTML stay.
 */
function normalise(node: Nodes): void {
  if (node.type === 'text') {
    node.value = plain(node.value);
  }
  if ((node.type === 'link' || node.type === 'image' || node.type === 'definition') && node.title) {
    node.title = plain(node.title);
  }
  if ((node.type === 'image' || node.type === 'imageReference') && node.alt) {
    node.alt = plain(node.alt);
  }
  if ('children' in node) {
    node.children.forEach(normalise);
    if (BLOCKS.has(node.type)) {
      node.children = node.children.flatMap(rules) as typeof node.children;
    }
  }
}

/**
 * A remark plugin that writes prose in plain characters and rules written as `<hr>` as markdown's, as the formatter
 * does.
 */
export function nbRemarkNormalise() {
  return (tree: Root) => normalise(tree);
}
