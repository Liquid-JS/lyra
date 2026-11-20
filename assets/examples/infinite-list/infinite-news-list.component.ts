import { Observable } from 'rxjs'
import {
    Component,
    ElementRef,
    OnInit,
    PLATFORM_ID,
    OnDestroy,
    inject,
    signal,
    viewChildren,
    afterNextRender,
    Injector
} from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import {
    NbListItemComponent,
    NbLayoutScrollService,
    NB_WINDOW,
    NbCardComponent,
    NbSpinnerDirective,
    NbListComponent,
    NbListItemComponent as NbListItemComponent_1,
    NbInfiniteListDirective,
    NbListPageTrackerDirective
} from '@liquid-js/lyr-core'
import { NewsPost, NewsService } from './news.service'
import { NewsPostComponent } from './components/news-post.component'
import { NewsPostPlaceholderComponent } from './components/news-post-placeholder.component'

@Component({
    templateUrl: './infinite-news-list.component.html',
    styleUrls: ['infinite-news-list.component.scss'],
    providers: [NewsService],
    imports: [
        NbCardComponent,
        NbSpinnerDirective,
        NbListComponent,
        NbInfiniteListDirective,
        NbListPageTrackerDirective,
        NbListItemComponent_1,
        NewsPostComponent,
        NewsPostPlaceholderComponent
    ]
})
export class InfiniteNewsListComponent implements OnInit, OnDestroy {
    private readonly newsService = inject(NewsService)
    private readonly router = inject(Router)
    private readonly route = inject(ActivatedRoute)
    private readonly scrollService = inject(NbLayoutScrollService)
    private readonly platformId = inject(PLATFORM_ID)
    private readonly window = inject(NB_WINDOW)

    readonly news = signal<NewsPost[]>([])
    readonly placeholders = signal<unknown[]>([])
    pageSize = 10
    readonly startPage = signal(1)
    pageToLoadNext = 1
    loadingNext = false
    readonly loadingPrevious = signal(false)
    initialScrollRestoration?: ScrollRestoration

    private readonly listItems = viewChildren(NbListItemComponent, { read: ElementRef<HTMLElement> })
    private readonly injector = inject(Injector)

    constructor() {
        const window = this.window

        if (window?.history.scrollRestoration) {
            // Prevent browsers from scrolling down to last scroll position, when navigating back to this page.
            // It doesn't make sense here, since list is dynamic and we handle last user position ourselves,
            // by storing page number in URL. So for this component, we disable scroll restoration.
            // Don't forget to re-enable it in 'OnDestroy', since this configuration preserved for the whole session
            // and it will not be reset after page reload.
            this.initialScrollRestoration = window.history.scrollRestoration
            window.history.scrollRestoration = 'manual'
        }
    }

    ngOnInit() {
        const { page } = this.route.snapshot.queryParams
        this.startPage.set(page ? Number.parseInt(page, 10) : 1)
        this.pageToLoadNext = this.startPage()
    }

    ngOnDestroy() {
        if (this.initialScrollRestoration && this.window) {
            this.window.history.scrollRestoration = this.initialScrollRestoration
        }
    }

    updateUrl(page: number) {
        void this.router.navigate(['.'], {
            queryParams: { page },
            replaceUrl: true,
            relativeTo: this.route,
            queryParamsHandling: 'merge'
        })
    }

    loadPrevious() {
        if (this.loadingPrevious() || this.startPage() === 1) {
            return
        }

        this.loadingPrevious.set(true)
        this.newsService.load(this.startPage() - 1, this.pageSize).subscribe((news) => {
            this.news.update((loaded) => [...news, ...loaded])
            this.loadingPrevious.set(false)
            this.restoreScrollPosition()
            this.startPage.update((page) => page - 1)
        })
    }

    loadNext() {
        if (this.loadingNext) {
            return
        }

        this.loadingNext = true
        this.placeholders.set(new Array(this.pageSize))
        this.newsService.load(this.pageToLoadNext, this.pageSize).subscribe((news) => {
            this.placeholders.set([])
            this.news.update((loaded) => [...loaded, ...news])
            this.loadingNext = false
            this.pageToLoadNext++
        })
    }

    private restoreScrollPosition() {
        const previousFirstItem = this.listItems()[0]?.nativeElement

        nextRender(this.injector).subscribe(() => {
            const window = this.window
            if (!window) {
                return
            }
            let heightOfAddedItems = 0
            for (const { nativeElement } of this.listItems()) {
                if (nativeElement === previousFirstItem) {
                    break
                }
                heightOfAddedItems += getElementHeight(window, nativeElement)
            }
            this.scrollService.scrollTo(undefined, heightOfAddedItems)
        })
    }
}

export function getElementHeight(window: Window, el: HTMLElement) {
    const style = window.getComputedStyle(el)
    const marginTop = parseInt(style.getPropertyValue('margin-top'), 10)
    const marginBottom = parseInt(style.getPropertyValue('margin-bottom'), 10)
    return el.offsetHeight + marginTop + marginBottom
}

/**
 * Emits once after the next render.
 */
function nextRender(injector: Injector): Observable<void> {
    return new Observable<void>((subscriber) => {
        const render = afterNextRender(() => {
            subscriber.next()
            subscriber.complete()
        }, { injector })
        return () => render.destroy()
    })
}
