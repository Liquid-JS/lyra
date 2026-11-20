import { Component, OnInit, computed, inject, viewChild } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute, Router } from '@angular/router'
import { filter, map, take, tap } from 'rxjs/operators'
import { NB_WINDOW, NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent, NbTocComponent } from '@liquid-js/lyr-core'
import { NgdTabbedBlockComponent } from '../../blocks/components/tabbed-block/tabbed-block.component'
import { NgdSeoService, NgdStructureService } from '../../@theme/services'
import { NgdPreparedPageEntry } from '../../docs.model'
import { NgdPageTabsComponent } from '../../@theme/components/page-tabs/page-tabs.component'
import { NgdMdBLockComponent } from '../../blocks/components/md-block/md-block.component'
import { NgdComponentBlockComponent } from '../../blocks/components/component-block/component-block.component'
import { NgdThemeComponent } from '../../blocks/components/theme-block/theme-block.component'
import { NgdComponentsOverviewBlockComponent } from '../../blocks/components/components-overview-block/components-overview-block.component'
import { NgdIconsBlockComponent } from '../../blocks/components/icons-block/icons-block.component'
import { NgdThemeEditorBlockComponent } from '../../blocks/components/theme-editor-block/theme-editor-block.component'
import { NgdExampleGalleryBlockComponent } from '../../blocks/components/example-gallery-block/example-gallery-block.component'
import { NgdPagerBlockComponent } from '../../blocks/components/pager-block/pager-block.component'
import { NGD_AREA } from '../../app.options'

@Component({
    selector: 'ngd-page',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.scss'],
    imports: [
        NbCardComponent,
        NbCardHeaderComponent,
        NbCardBodyComponent,
        NgdPageTabsComponent,
        NgdMdBLockComponent,
        NgdComponentBlockComponent,
        NgdTabbedBlockComponent,
        NgdThemeComponent,
        NgdComponentsOverviewBlockComponent,
        NgdIconsBlockComponent,
        NgdThemeEditorBlockComponent,
        NgdExampleGalleryBlockComponent,
        NgdPagerBlockComponent,
        NbTocComponent
    ]
})
export class NgdPageComponent implements OnInit {
    private readonly window = inject(NB_WINDOW)
    private readonly router = inject(Router)
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly structureService = inject(NgdStructureService)
    private readonly seo = inject(NgdSeoService)
    private readonly area = inject(NGD_AREA)

    readonly currentItem = toSignal(
        this.activatedRoute.params.pipe(
            map((params) => this.structureService.resolveRoute(this.area, params)),
            filter((route) => route !== undefined),
            tap(({ page, tab }) => {
                let title = `Lyra - ${page.name}`

                if (page.type === 'tabs') {
                    title += ' Angular UI Component'
                    if (tab) {
                        title += ` - component ${tab}`
                    }
                }
                this.describe(page, title)
            }),
            map(({ page }) => page)
        )
    )

    /** The page the title and description are of. */
    protected described?: NgdPreparedPageEntry

    readonly tabbedBlock = viewChild(NgdTabbedBlockComponent)

    readonly currentTabName = computed(() => this.tabbedBlock()?.currentTab()?.tab ?? '')

    readonly tabs = computed(() => {
        const currentItem = this.currentItem()
        return currentItem?.type === 'tabs' ? currentItem.tabs : undefined
    })

    readonly showSettings = computed(() => {
        const currentItem = this.currentItem()
        return (
            currentItem &&
            currentItem.children.some((item) => ['markdown', 'component', 'tabbed', 'icons'].includes(item.block))
        )
    })

    /** The headings the table of contents lists: an article's own, or the page's sections' titles. */
    readonly tocSelector = computed(() => {
        const item = this.currentItem()
        return item?.type === 'page' && item.toc === 'headings' ? 'ngd-md-block h2' : '.ngd-section-title'
    })

    /** What the table of contents lists: the icons' categories, or the page's sections. */
    readonly tocTitle = computed(() =>
        this.currentItem()?.children.some((item) => item.block === 'icons') ? 'Categories' : 'Overview'
    )

    /**
     * The page's title, description and URL for search engines and link previews: a component's summary, or an
     * article's first paragraph once it has loaded.
     */
    protected describe(item: NgdPreparedPageEntry, title: string) {
    // A component's summary is the first text of its overview.
        const overview = item.type === 'tabs' ? item.source[0]?.overview.find((node) => node.type === 'text') : undefined
        const description = overview?.type === 'text'
            ? overview.content.map((section) => section.source).join('\n\n')
            : item.type === 'page' ? item.description : undefined
        this.seo.setPage({ title, description, path: this.router.url.split(/[?#]/)[0] })
        this.described = item
        const article = item.type === 'page' ? item.children.find((block) => block.block === 'markdown') : undefined
        if (article && !description) {
            // Once loaded; straight away when the prerendered page handed it over. A later page may be shown by then.
            article.sections.pipe(take(1)).subscribe((sections) => {
                if (this.described === item) {
                    this.seo.setDescription(sections.map((section) => section.source).join('\n\n'))
                }
            })
        }
    }

    ngOnInit() {
        if (this.window) {
            this.window.history.scrollRestoration = 'manual'
        }
    }
}
