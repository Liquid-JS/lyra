import type { CommentTag } from './comment.ts'

/**
 * Example tags embedded in component JSDoc, e.g.
 * `@stacked-example(Button Showcase, button/button-showcase.component)`.
 * Produces the overview nodes the docs app renders, in the shape doc-prsr used.
 */

export const EXAMPLE_TYPES = ['inline-example', 'live-example', 'stacked-example', 'additional-example'] as const

export interface ExampleContent {
    name: string
    id: string
    firstLine?: number
    lastLine?: number
    files?: string[]
}

export interface OverviewNode {
    type: string
    content: string | ExampleContent
}

export function exampleNodes(tag: CommentTag): OverviewNode[] | undefined {
    const type = EXAMPLE_TYPES.find((candidate) => tag.tag.startsWith(candidate))
    if (!type) {
        return undefined
    }

    // typedoc lower-cased the token after `@`, which swallowed the first word of the
    // example name; doc-prsr then re-capitalised it. Keep the same result.
    const nameStart = tag.tag.split('(')[1] ?? ''
    const capitalized = nameStart.charAt(0).toUpperCase() + nameStart.slice(1)
    const tagEnd = tag.text.indexOf(')') + 1
    const raw = `${type}(${capitalized.endsWith(',') ? capitalized : capitalized + ' '}${tag.text.substring(0, tagEnd)}`
    const comment = tag.text.substring(tagEnd).trim()

    const match = raw.match(/\((.*)\)/)
    if (!match) {
        throw new Error(`Can't parse example: ${raw}`)
    }
    const [name, id, firstLine, lastLine] = match[1].split(',').map((item) => item.trim())
    const content: ExampleContent =
        type === 'inline-example' ? { name, id, firstLine: +firstLine, lastLine: +lastLine } : { name, id }

    return [
        { type, content },
        { type: 'text', content: comment }
    ]
}
