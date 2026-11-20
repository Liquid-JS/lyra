import { Service } from '@angular/core'
import remarkParse from 'remark-parse'
import { unified } from 'unified'

export interface NgdMdSection {
    fragment: string
    source: string
    title: string
}

/** A URL segment or fragment for a name: `Built-in Themes` is `built-in-themes`, `Modals & Overlays` `modals-overlays`. */
export function createSlag(name: string) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
}

@Service()
export class NgdTextService {
    private readonly TITLE_MASK = '^#{1,6}[^#]?(.+)\n'
    // Markdown's syntax and HTML tags, for the words of a section without a heading.
    private readonly STRIP_MARKDOWN = '<\\/?[^>]+(>|$)|[#*_`>\\[\\]()]'

    mdToSections(markdown: string): NgdMdSection[] {
        return this.splitIntoSections(markdown)
            .map((section) => {
                const source = section.trim()
                const title = this.extractTitle(section) || this.extractFirstTwoWords(source)
                const fragment = this.createSlag(title)
                return {
                    source,
                    title,
                    fragment
                }
            })
    }

    /** The markdown between its rules, `---`; one in code or a list doesn't split it. */
    splitIntoSections(markdown: string) {
        const rules = unified()
            .use(remarkParse)
            .parse(markdown)
            .children.filter((node) => node.type === 'thematicBreak')
            .map(({ position }) => [position?.start.offset ?? 0, position?.end.offset ?? 0])
        const ends = [...rules, [markdown.length, markdown.length]]
        return ends
            .map(([start], i) => markdown.slice(i ? ends[i - 1][1] : 0, start))
            .filter((section) => section.trim())
    }

    extractTitle(section: string) {
        const titleMatch = section.trim().match(new RegExp(this.TITLE_MASK, 'i'))
        return titleMatch ? titleMatch[1] : ''
    }

    extractFirstTwoWords(section: string) {
        return section
            .replace(new RegExp(this.STRIP_MARKDOWN, 'g'), '')
            .trim()
            .split(/\s+/g)
            .slice(0, 2)
            .join(' ')
    }

    /** A URL segment or fragment for a name, see {@link createSlag}. */
    createSlag(name: string) {
        return createSlag(name)
    }
}
