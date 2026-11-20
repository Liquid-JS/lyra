import { AfterViewInit, DestroyRef, Directive, ElementRef, contentChildren, inject, input, output } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Observable, asapScheduler, forkJoin, of as observableOf, interval, timer, Subject, merge } from 'rxjs';
import { filter, switchMap, map, observeOn, take, throttle, skip, takeUntil } from 'rxjs/operators';
import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';
import { NbLayoutScrollService } from '@liquid-js/lyr-core/base';
import { NbLayoutRulerService } from '@liquid-js/lyr-core/base';
import { NbListItemComponent } from './list.component';

export interface NbScrollableContainerDimensions {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
}

/**
 * Tells when a list is scrolled near its top or bottom, e.g. to load more items.
 *
 * ```html
 *  <nb-list nbInfiniteList [threshold]="500" (bottomThreshold)="loadNext()">
 *    @for (item of items; track item) {
 *      <nb-list-item></nb-list-item>
 *    }
 *  </nb-list>
 * ```
 *
 * @stacked-example(Simple infinite list, infinite-list/infinite-list-showcase.component)
 *
 * `bottomThreshold` emits when the list is scrolled down to within `threshold` pixels of its end, and `topThreshold`
 * when it's scrolled up to within `threshold` of its start; both are checked at the start and when items are added
 * or removed, so a list that doesn't fill its container asks for more. By default the list itself scrolls; with
 * `listenWindowScroll`, the page does, as the layout reports it.
 *
 * @stacked-example(Scroll modes, infinite-list/infinite-list-scroll-modes.component)
 *
 * Keeping the page in the URL lets the user return to it, or share it. `nbListPageTracker` on the list, with the
 * page size, tells which page is in view. You can
 * [open the example](example/infinite-list/infinite-news-list.component) in a new tab to see it work.
 *
 * @stacked-example(Infinite list with pager, infinite-list/infinite-news-list.component)
 *
 * @stacked-example(Infinite list with placeholders at the top, infinite-list/infinite-list-placeholders.component)
 *
 */
@Directive({
  selector: '[nbInfiniteList]',
  host: {
    '(scroll)': 'onElementScroll()',
  },
})
export class NbInfiniteListDirective implements AfterViewInit {
  private readonly elementRef = inject(ElementRef);
  private readonly scrollService = inject(NbLayoutScrollService);
  private readonly dimensionsService = inject(NbLayoutRulerService);
  private readonly destroyRef = inject(DestroyRef);

  private lastScrollPosition?: number;

  /** How close to the list's end or start, in pixels, the scroll position is when the thresholds emit. */
  readonly threshold = input.required<number>();

  /** For how long after an emission, in milliseconds, a threshold doesn't emit again. */
  readonly throttleTime = input<number>(0);

  /** Watches the page's scroll position, as the layout reports it, instead of the list's own. */
  readonly listenWindowScroll = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /**
   * Emits when the scroll position comes within `threshold` of the list's end: scrolling down, at the start, and
   * after items change while the position stays.
   */
  readonly bottomThreshold = output();

  /** Emits when the scroll position comes within `threshold` of the list's start: scrolling up, and at the start. */
  readonly topThreshold = output();

  protected readonly listItems = contentChildren(NbListItemComponent);

  private readonly elementScroll$ = new Subject<void>();
  private readonly windowScroll$ = this.scrollService.onScroll().pipe(filter(() => this.listenWindowScroll()));
  private readonly bottomThreshold$ = new Subject<void>();
  private readonly topThreshold$ = new Subject<void>();
  // Emits after list items are added or removed, not for the initial items.
  private readonly listItemsChange$ = toObservable(this.listItems).pipe(skip(1));

  onElementScroll() {
    if (!this.listenWindowScroll()) {
      this.elementScroll$.next();
    }
  }

  ngAfterViewInit() {
    merge(this.windowScroll$, this.elementScroll$)
      .pipe(
        switchMap(() => this.getContainerDimensions()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((dimensions) => this.checkPosition(dimensions));

    // The throttle window starts from the current throttleTime each time. Thresholds are often reached during
    // change detection (the first check runs after the view init), and listeners usually load more items, so they
    // are emitted after it.
    this.topThreshold$
      .pipe(
        throttle(() => interval(this.throttleTime())),
        observeOn(asapScheduler),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.topThreshold.emit());

    this.bottomThreshold$
      .pipe(
        throttle(() => interval(this.throttleTime())),
        observeOn(asapScheduler),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.bottomThreshold.emit());

    this.listItemsChange$
      .pipe(
        // The query changes before a removed item leaves the DOM, when the dimensions are still the old ones:
        // wait, up to a second, until the DOM and the query agree.
        switchMap(() =>
          interval(50).pipe(
            filter(() => this.inSyncWithDom()),
            take(1),
            takeUntil(timer(1000)),
          ),
        ),
        switchMap(() => this.getContainerDimensions()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((dimensions) => this.checkPosition(dimensions));

    this.getContainerDimensions().subscribe((dimensions) => this.checkPosition(dimensions));
  }

  checkPosition({ scrollHeight, scrollTop, clientHeight }: NbScrollableContainerDimensions) {
    const lastScrollPosition = this.lastScrollPosition;
    const initialCheck = lastScrollPosition == null;
    const manualCheck = lastScrollPosition === scrollTop;
    const scrollUp = !initialCheck && scrollTop < lastScrollPosition;
    const scrollDown = !initialCheck && scrollTop > lastScrollPosition;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;

    if ((initialCheck || manualCheck || scrollDown) && distanceToBottom <= this.threshold()) {
      this.bottomThreshold$.next();
    }

    if ((initialCheck || scrollUp) && scrollTop <= this.threshold()) {
      this.topThreshold$.next();
    }

    this.lastScrollPosition = scrollTop;
  }

  private getContainerDimensions(): Observable<NbScrollableContainerDimensions> {
    if (!this.listenWindowScroll()) {
      const { scrollTop, scrollHeight, clientHeight } = this.elementRef.nativeElement;
      return observableOf({ scrollTop, scrollHeight, clientHeight });
    }

    return forkJoin([this.scrollService.getPosition(), this.dimensionsService.getDimensions()]).pipe(
      map(([scrollPosition, dimensions]) => ({
        scrollTop: scrollPosition.y,
        scrollHeight: dimensions.scrollHeight,
        clientHeight: dimensions.clientHeight,
      })),
    );
  }

  private inSyncWithDom(): boolean {
    return this.elementRef.nativeElement.children.length === this.listItems().length;
  }
}
