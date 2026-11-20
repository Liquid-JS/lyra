import { Service } from '@angular/core';
import { Observable, Subject, Subscriber } from 'rxjs';

/**
 * The client and scroll size of the layout's scroll container: `documentElement`, or the layout's own
 * `.scrollable-container` with `withScroll`.
 */
export interface NbLayoutDimensions {

  clientWidth: number;

  clientHeight: number;

  scrollWidth: number;

  scrollHeight: number;
}

/**
 * Measures the layout's scroll container: `documentElement` by default, or the layout's own `.scrollable-container`
 * with `withScroll`.
 *
 * The `nb-layout` on the page answers the requests, so there's nothing to measure without one.
 */
@Service()
export class NbLayoutRulerService {

  private contentDimensionsReq$ = new Subject<{ listener: Subject<NbLayoutDimensions> }>();

  /** The dimensions, once the layout answers; it never emits without a layout on the page. */
  getDimensions(): Observable<NbLayoutDimensions> {
    return new Observable((observer: Subscriber<NbLayoutDimensions>) => {
      const listener = new Subject<NbLayoutDimensions>();
      listener.subscribe(observer);
      this.contentDimensionsReq$.next({ listener });

      return () => listener.complete();
    });
  }

  /**
   * The requests `nb-layout` answers.
   * @private
   */
  onGetDimensions(): Subject<{ listener: Subject<NbLayoutDimensions> }> {
    return this.contentDimensionsReq$;
  }
}
