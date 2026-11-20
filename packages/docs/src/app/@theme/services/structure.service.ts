import { inject, Service } from '@angular/core'
import { Params } from '@angular/router'

import { DOCS, STRUCTURE } from '../../app.options'
import {
    NgdBlockEntry,
    NgdDocClass,
    NgdPreparedArea,
    NgdPreparedAreaChild,
    NgdPreparedBlock,
    NgdPreparedComponent,
    NgdPreparedEntry,
    NgdPreparedPageEntry,
    NgdPreparedSection,
    NgdPreparedSectionChild,
    NgdSectionChildEntry,
    NgdSectionEntry,
    NgdTabbedBlock,
    NgdTheme
} from '../../docs.model'
import { NgdTabbedService } from './tabbed.service'
import { NgdTextService } from './text.service'
import { NgdArticleService } from './article.service'

@Service()
export class NgdStructureService {
    private readonly textService = inject(NgdTextService)
    private readonly tabbedService = inject(NgdTabbedService)
    private readonly articleService = inject(NgdArticleService)
    private readonly docs = inject(DOCS)

    protected readonly areas: NgdPreparedArea[] = inject(STRUCTURE).map((area) => ({
        ...area,
        children: area.children.map((child) =>
            child.type === 'section' ? this.prepareSection(child) : this.prepareSectionChild(child))
    }))

    /** The docs' top sections, each with its own sidebar. */
    getAreas(): NgdPreparedArea[] {
        return this.areas
    }

    /** The pages, groups and sections of the area at `/<path>`. */
    getPreparedStructure(path: string): NgdPreparedAreaChild[] {
        return this.areas.find((area) => area.path === path)?.children ?? []
    }

    /** The page and tab of a docs route's `page`, `subPage` and `tab` params. */
    resolveRoute(area: string, params: Params): { page: NgdPreparedPageEntry, tab?: string } | undefined {
        const segments = [params['page'], params['subPage'], params['tab']].filter((segment) => typeof segment === 'string')
        return this.resolvePage(area, segments)
    }

    /**
     * The page at a URL's segments after its area, and the tab they name: `cdk/calendar-kit/api` is a section's page,
     * `button/api` a page of the area itself, both on their API tab.
     */
    resolvePage(area: string, segments: string[]): { page: NgdPreparedPageEntry, tab?: string } | undefined {
        const structure = this.getPreparedStructure(area)
        const [first, second, third] = segments
        const inSection = second === undefined ? undefined : this.findPageBySlag(structure, `${first}_${second}`)
        if (inSection) {
            return { page: inSection, tab: third }
        }
        const page = first === undefined ? undefined : this.findPageBySlag(structure, first)
        return page ? { page, tab: second } : undefined
    }

    findPageBySlag(structure: NgdPreparedEntry[], slag: string): NgdPreparedPageEntry | undefined {
        for (const item of structure) {
            if ((item.type === 'page' || item.type === 'tabs') && item.slag === slag) {
                return item
            }
            if (item.type === 'section') {
                const deep = this.findPageBySlag(item.children, slag)
                if (deep) {
                    return deep
                }
            }
        }
        return undefined
    }

    protected prepareSection(section: NgdSectionEntry): NgdPreparedSection {
        const slag = this.textService.createSlag(section.name)
        return { ...section, children: section.children.map((child) => this.prepareSectionChild(child, slag)) }
    }

    // A page's slag is its name's, after its section's when it's in one.
    protected prepareSectionChild(item: NgdSectionChildEntry, parentSlag?: string): NgdPreparedSectionChild {
        const name = this.textService.createSlag(item.name)
        const slag = parentSlag ? `${parentSlag}_${name}` : name

        switch (item.type) {
            case 'page': {
                const children = item.children.map((block) => this.prepareBlock(block))
                return { ...item, slag, children }
            }
            case 'tabs': {
                const source = this.getComponents(item.source)
                // we emulate a block here
                const children: [NgdTabbedBlock] = [{ type: 'block', block: 'tabbed', children: source }]
                return {
                    ...item,
                    slag,
                    source,
                    tabs: this.tabbedService.determineTabs({ source }),
                    children
                }
            }
            case 'group':
                return item
        }
    }

    protected prepareBlock(block: NgdBlockEntry): NgdPreparedBlock {
        switch (block.block) {
            case 'markdown':
                return { ...block, sections: this.articleService.getArticle(block.source) }
            case 'component':
                return { ...block, source: this.prepareComponent(this.findClass(block.source)) }
            case 'theme':
                return { ...block, source: this.findTheme(block.source) }
            default:
                return block
        }
    }

    protected getComponents(names: string[]): NgdPreparedComponent[] {
        return names.map((name) => this.prepareComponent(this.findClass(name)))
    }

    protected findClass(name: string): NgdDocClass {
        const component = this.docs.classes.find((data) => data.name === name)
        if (!component) {
            throw new Error(`structure.ts names ${name}, which the API docs don't have.`)
        }
        return component
    }

    protected findTheme(name: string): NgdTheme {
        const theme = this.docs.themes[name]
        if (!theme) {
            throw new Error(`structure.ts names the ${name} theme, which the docs don't have.`)
        }
        return theme
    }

    // The overview opens with the class's name as its heading, added to the prepared copy; the API data stays as it is,
    // so a class on several pages gets it once on each.
    protected prepareComponent(component: NgdDocClass): NgdPreparedComponent {
        const firstText = component.overview.find((node) => node.type === 'text')
        return {
            ...component,
            slag: this.textService.createSlag(component.name),
            overview: component.overview.map((node) => {
                if (node.type === 'text') {
                    const content = node === firstText ? `## ${component.name}\n\n${node.content}` : node.content
                    return { type: node.type, content: this.textService.mdToSections(content) }
                }
                return node
            })
        }
    }
}
