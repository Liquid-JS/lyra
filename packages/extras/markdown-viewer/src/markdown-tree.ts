import type { Definition, FootnoteDefinition, Html, Node, Nodes, Parent, Root, RootContent } from 'mdast'

/** An inline HTML element of the markdown, e.g. `<kbd>Ctrl</kbd>`, with the markdown between its tags. */
export interface NbMarkdownHtmlElement extends Parent {
    type: 'nbHtmlElement'
    tagName: string
}

/** A link from a footnote back to where the text refers to it, at the end of the footnote. */
export interface NbMarkdownFootnoteBack extends Node {
    type: 'nbFootnoteBack'
    identifier: string
}

/** The footnotes, at the end of the document. */
export interface NbMarkdownFootnotes extends Parent {
    type: 'nbFootnotes'
    children: FootnoteDefinition[]
}

declare module 'mdast' {
    interface PhrasingContentMap {
        nbHtmlElement: NbMarkdownHtmlElement
        nbFootnoteBack: NbMarkdownFootnoteBack
    }
    interface RootContentMap {
        nbHtmlElement: NbMarkdownHtmlElement
        nbFootnoteBack: NbMarkdownFootnoteBack
        nbFootnotes: NbMarkdownFootnotes
    }
}

const voidElements = new Set(['br', 'wbr', 'img', 'hr'])
const openingTag = /^<([a-z][a-z0-9-]*)(?:\s[^>]*)?>$/i
const selfClosingTag = /^<([a-z][a-z0-9-]*)(?:\s[^>]*)?\/>$/i
const closingTag = /^<\/([a-z][a-z0-9-]*)\s*>$/i
/** Parents of block content, whose HTML is a block of its own rather than tags in a line of text. */
const blockParents = new Set(['root', 'blockquote', 'listItem', 'footnoteDefinition', 'nbFootnotes'])

function tagName(node: RootContent, pattern: RegExp) {
    return node.type === 'html' ? pattern.exec(node.value)?.[1].toLowerCase() : undefined
}

/** Pairs the opening and closing tags of HTML in a line of text into elements, with the content between them. */
function pairTags(children: RootContent[]): RootContent[] {
    const paired = new Array<RootContent>()
    for (let index = 0; index < children.length; index++) {
        const child = children[index]
        const name = tagName(child, openingTag)
        const selfClosing = tagName(child, selfClosingTag)
        if (selfClosing || (name && voidElements.has(name))) {
            paired.push({ type: 'nbHtmlElement', tagName: selfClosing ?? name ?? '', children: [] })
            continue
        }
        if (!name) {
            paired.push(child)
            continue
        }
        let depth = 0
        let end = index + 1
        for (; end < children.length; end++) {
            if (tagName(children[end], openingTag) === name) {
                depth++
            } else if (tagName(children[end], closingTag) === name && depth-- === 0) {
                break
            }
        }
        if (end === children.length) {
            paired.push(child)
            continue
        }
        const content = pairTags(children.slice(index + 1, end)) as NbMarkdownHtmlElement['children']
        paired.push({ type: 'nbHtmlElement', tagName: name, children: content })
        index = end
    }
    return paired
}

/** Whether a list's items hold their text without paragraphs, as in `mdast-util-to-hast`. */
function isTight(node: Nodes) {
    if (node.type !== 'list' || node.spread) {
        return false
    }
    return node.children.every((item) => !(item.spread ?? item.children.length > 1))
}

/**
 * Prepares the markdown's syntax tree for its templates, as `remark-rehype` prepares it for HTML: references become
 * links and images, a tight list's items lose their paragraphs, footnotes move to the end, and the tags of HTML in a
 * line of text are paired into elements.
 */
export function prepareTree(tree: Root) {
    const definitions = new Map<string, Definition>()
    const footnotes = new Array<FootnoteDefinition>()
    const collect = (node: Nodes) => {
        if (node.type === 'definition') {
            definitions.set(node.identifier, node)
        }
        if ('children' in node) {
            node.children.forEach(collect)
        }
    }
    collect(tree)

    const transform = (node: Nodes) => {
        if (!('children' in node)) {
            return
        }
        const children = new Array<RootContent>()
        for (const child of node.children as RootContent[]) {
            if (child.type === 'definition') {
                continue
            }
            if (child.type === 'footnoteDefinition') {
                footnotes.push(child)
                transform(child)
                continue
            }
            if (child.type === 'linkReference') {
                const { url = '', title } = definitions.get(child.identifier) ?? {}
                const link = { type: 'link', url, title, children: child.children } as const
                transform(link)
                children.push(link)
                continue
            }
            if (child.type === 'imageReference') {
                const { url = '', title } = definitions.get(child.identifier) ?? {}
                children.push({ type: 'image', url, title, alt: child.alt })
                continue
            }
            transform(child)
            if (child.type === 'listItem' && isTight(node)) {
                child.children = child.children.flatMap((content) =>
                    content.type === 'paragraph' ? (content.children as typeof child.children) : [content]
                )
            }
            children.push(child)
        }
        const hasHtml = children.some((child): child is Html => child.type === 'html')
        node.children = (hasHtml && !blockParents.has(node.type) ? pairTags(children) : children) as typeof node.children
    }
    transform(tree)

    if (footnotes.length) {
    // Each footnote ends with a link back to where the text refers to it, as GitHub's do.
        for (const footnote of footnotes) {
            const back: NbMarkdownFootnoteBack = { type: 'nbFootnoteBack', identifier: footnote.identifier }
            const last = footnote.children.at(-1)
            if (last?.type === 'paragraph') {
                last.children.push(back)
            } else {
                footnote.children.push({ type: 'paragraph', children: [back] })
            }
        }
        tree.children.push({ type: 'nbFootnotes', children: footnotes })
    }
    return tree
}
