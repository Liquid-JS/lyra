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
  Injector,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  NbListItemComponent,
  NbLayoutScrollService,
  NB_WINDOW,
  NbLayoutRulerService,
  NbCardComponent,
  NbListComponent,
  NbListItemComponent as NbListItemComponent_1,
  NbInfiniteListDirective,
  NbListPageTrackerDirective,
} from '@liquid-js/lyr-core';
import { NewsPost, NewsService } from './news.service';
import { NewsPostPlaceholderComponent } from './components/news-post-placeholder.component';
import { NewsPostComponent } from './components/news-post.component';

@Component({
  templateUrl: './infinite-list-placeholders.component.html',
  styleUrls: ['infinite-news-list.component.scss'],
  providers: [NewsService],
  imports: [
    NbCardComponent,
    NbListComponent,
    NbInfiniteListDirective,
    NbListPageTrackerDirective,
    NbListItemComponent_1,
    NewsPostPlaceholderComponent,
    NewsPostComponent,
  ],
})
export class InfiniteListPlaceholdersComponent implements OnInit, OnDestroy {
  private readonly newsService = inject(NewsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly scrollService = inject(NbLayoutScrollService);
  private readonly layoutService = inject(NbLayoutRulerService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly window = inject(NB_WINDOW);

  readonly news = signal<NewsPost[]>([]);
  readonly topPlaceholders = signal<unknown[]>([]);
  readonly bottomPlaceholders = signal<unknown[]>([]);
  pageSize = 10;
  readonly startPage = signal(1);
  pageToLoadNext = 1;
  loadingNext = false;
  loadingPrevious = false;
  initialScrollRestoration?: ScrollRestoration;

  private readonly listItems = viewChildren(NbListItemComponent, { read: ElementRef<HTMLElement> });
  private readonly injector = inject(Injector);

  constructor() {
    const window = this.window;

    if (window?.history.scrollRestoration) {
      // Prevent browsers from scrolling down to last scroll position, when navigating back to this page.
      // It doesn't make sense here, since list is dynamic and we handle last user position ourselves,
      // by storing page number in URL. So for this component, we disable scroll restoration.
      // Don't forget to re-enable it in 'OnDestroy', since this configuration preserved for the whole session
      // and it will not be reset after page reload.
      this.initialScrollRestoration = window.history.scrollRestoration;
      window.history.scrollRestoration = 'manual';
    }
  }

  ngOnInit() {
    const { page } = this.route.snapshot.queryParams;
    this.startPage.set(page ? Number.parseInt(page, 10) : 100);
    this.pageToLoadNext = this.startPage();
  }

  ngOnDestroy() {
    if (this.initialScrollRestoration && this.window) {
      this.window.history.scrollRestoration = this.initialScrollRestoration;
    }
  }

  updateUrl(page: number) {
    void this.router.navigate(['.'], {
      queryParams: { page },
      replaceUrl: true,
      relativeTo: this.route,
      queryParamsHandling: 'merge',
    });
  }

  loadPrevious() {
    if (this.loadingPrevious || this.startPage() === 1) {
      return;
    }

    this.loadingPrevious = true;
    this.topPlaceholders.set(new Array(this.pageSize));
    this.restoreScrollPosition();
    this.startPage.update((page) => page - 1);
    this.newsService.load(this.startPage(), this.pageSize).subscribe({
      next: (news) => {
        this.topPlaceholders.set([]);
        this.news.update((loaded) => [...news, ...loaded]);
        this.loadingPrevious = false;
      },
      error: () => this.startPage.update((page) => page + 1),
    });
  }

  loadNext() {
    if (this.loadingNext) {
      return;
    }

    this.loadingNext = true;
    this.bottomPlaceholders.set(new Array(this.pageSize));
    this.newsService.load(this.pageToLoadNext, this.pageSize).subscribe((news) => {
      this.bottomPlaceholders.set([]);
      this.news.update((loaded) => [...loaded, ...news]);
      this.loadingNext = false;
      this.pageToLoadNext++;
    });
  }

  private restoreScrollPosition() {
    // Measure before the placeholders render and again after, then keep the visible items in place.
    const measure = () => forkJoin([this.layoutService.getDimensions(), this.scrollService.getPosition()]);
    measure()
      .pipe(
        switchMap((before) => nextRender(this.injector).pipe(
          switchMap(() => measure()),
          map((after) => [before, after] as const),
        )),
      )
      .subscribe(([[oldDimensions, oldScrollPosition], [dimensions, scrollPosition]]) => {
        const oldHeight = oldDimensions.scrollHeight;
        const oldScrollTop = oldScrollPosition.y;
        const currentHeight = dimensions.scrollHeight;
        const currentScrollTop = scrollPosition.y;
        const heightDiff = currentHeight - oldHeight;

        // chrome automatically changes scrollTop
        if (oldScrollTop + heightDiff === currentScrollTop) {
          return;
        }

        const newScrollTop = currentScrollTop + heightDiff;
        this.scrollService.scrollTo(undefined, newScrollTop);
      });
  }

}

/**
 * Emits once after the next render.
 */
function nextRender(injector: Injector): Observable<void> {
  return new Observable<void>((subscriber) => {
    const render = afterNextRender(() => {
      subscriber.next();
      subscriber.complete();
    }, { injector });
    return () => render.destroy();
  });
}
