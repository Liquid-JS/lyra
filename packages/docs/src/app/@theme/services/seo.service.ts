import { DOCUMENT } from '@angular/common'
import { inject, Service } from '@angular/core'
import { Meta, Title } from '@angular/platform-browser'

/** Where the docs are published: canonical URLs and link previews point there. */
export const NGD_SITE_URL = 'https://liquid-js.github.io/lyra/'

/** The site's own title and description, for the home page and pages that have none of their own. */
export const NGD_SITE_TITLE = 'Lyra - Customizable Angular UI Library, Auth and Security'
export const NGD_SITE_DESCRIPTION =
    'Angular UI library with a design system of its own: 54 components, 6 themes, a theme editor, and Auth and Security packages'

/** What a page tells search engines and link previews about itself. */
export interface NgdPageMeta {
    title: string
    description?: string
    /** The page's route, e.g. `components/forms/button/overview`; `''` for the home page. */
    path: string
    /** Whether search engines list it; the live examples, shown in frames, are left out. */
    index?: boolean
    /** A picture for link previews, under the site, e.g. `assets/example-pictures/relay/events.webp`. */
    image?: string
}

/**
 * Sets a page's title, description and canonical URL, and the Open Graph and Twitter tags link previews read, in the
 * prerendered page and as the app navigates.
 */
@Service()
export class NgdSeoService {
    private readonly title = inject(Title)
    private readonly meta = inject(Meta)
    private readonly document = inject(DOCUMENT)

    setPage({ title, description, path, index = true, image }: NgdPageMeta) {
        const url = NGD_SITE_URL + (path ? `${path.replace(/^\/|\/$/g, '')}/` : '')
        this.setTitle(title)
        this.setDescription(description)
        this.tag('property', 'og:type', 'website')
        this.tag('property', 'og:site_name', 'Lyra')
        this.tag('property', 'og:url', url)
        this.tag('name', 'twitter:card', image ? 'summary_large_image' : 'summary')
        if (image) {
            this.tag('property', 'og:image', NGD_SITE_URL + image)
        } else {
            this.meta.removeTag('property="og:image"')
        }
        this.tag('name', 'robots', index ? 'index, follow' : 'noindex')
        let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
        if (!link) {
            link = this.document.createElement('link')
            link.setAttribute('rel', 'canonical')
            this.document.head.appendChild(link)
        }
        link.setAttribute('href', url)
    }

    /** The title, also for link previews. */
    setTitle(title: string) {
        this.title.setTitle(title)
        this.tag('property', 'og:title', title)
        this.tag('name', 'twitter:title', title)
    }

    /** The description, from markdown, e.g. an article's first paragraph; the site's when there's none. */
    setDescription(markdown?: string) {
        const description = summary(markdown ?? '') || NGD_SITE_DESCRIPTION
        this.tag('name', 'description', description)
        this.tag('property', 'og:description', description)
        this.tag('name', 'twitter:description', description)
    }

    protected tag(attribute: 'name' | 'property', key: string, content: string) {
        this.meta.updateTag({ [attribute]: key, content }, `${attribute}="${key}"`)
    }
}

/** The first paragraph of markdown, as plain text of up to about 160 characters, ending at a word. */
export function summary(markdown: string): string {
    const paragraph = markdown
        .split(/\n\s*\n/)
        .map((block) => block.trim())
        .find((block) => block && !/^(#|\||-|\*\s|>|```|<|!\[|@)/.test(block))
    if (!paragraph) {
        return ''
    }
    const text = paragraph
        .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/`([^`]*)`/g, '$1')
        .replace(/(\*\*|__|\*|_)(\S[^*_]*?)\1/g, '$2')
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    if (text.length <= 160) {
        return text
    }
    const cut = text.slice(0, 157)
    return `${cut.slice(0, cut.lastIndexOf(' '))}…`
}
