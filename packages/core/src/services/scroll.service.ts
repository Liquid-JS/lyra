import { Service } from '@angular/core';
import { Observable, Subject, Subscriber } from 'rxjs';
import { share } from 'rxjs/operators';

/** How far the layout is scrolled, in pixels. */
export interface NbScrollPosition {

  /** From the left. */
  x: number;

  /** From the top. */
  y: number;
}

/**
 * The layout's scroll: its position, its scroll events, and `scrollTo`.
 *
 * The `nb-layout` on the page answers through it, since it scrolls on the body by default and in an element of its
 * own with `withScroll`; code that uses the service needn't know which.
 */
@Service()
export class NbLayoutScrollService {

  private scrollPositionReq$ = new Subject<{ listener: Subject<NbScrollPosition> }>();
  private manualScroll$ = new Subject<{ x?: number; y?: number }>();
  private scroll$ = new Subject<Event>();
  private scrollable$ = new Subject<boolean>();

  /** The scroll position, once the layout answers; it never emits without a layout on the page. */
  getPosition(): Observable<NbScrollPosition> {
    return new Observable((observer: Subscriber<NbScrollPosition>) => {
      const listener = new Subject<NbScrollPosition>();
      listener.subscribe(observer);
      this.scrollPositionReq$.next({ listener });

      return () => listener.complete();
    });
  }

  /** Scrolls the layout; a coordinate left out keeps its current value. */
  scrollTo(x?: number, y?: number) {
    this.manualScroll$.next({ x, y });
  }

  /** The layout's scroll events. */
  onScroll(): Observable<Event> {
    return this.scroll$.pipe(share());
  }

  /**
   * The `scrollTo` requests `nb-layout` carries out.
   * @private
   */
  onManualScroll(): Observable<{ x?: number; y?: number }> {
    return this.manualScroll$.pipe(share());
  }

  /**
   * The position requests `nb-layout` answers.
   * @private
   */
  onGetPosition(): Subject<{ listener: Subject<NbScrollPosition> }> {
    return this.scrollPositionReq$;
  }

  /** Whether the layout may scroll: the block scroll strategy turns it off while a modal overlay is open. */
  onScrollableChange(): Observable<boolean> {
    return this.scrollable$.pipe(share());
  }

  /**
   * Called by `nb-layout` with its scroll events.
   * @private
   */
  fireScrollChange(event: Event) {
    this.scroll$.next(event);
  }

  /** Blocks or frees the layout's scrolling; `NbBlockScrollStrategyAdapter` calls it. */
  scrollable(scrollable: boolean) {
    this.scrollable$.next(scrollable);
  }
}
