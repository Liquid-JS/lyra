import { inject, Service } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { filter, pairwise, startWith, map } from 'rxjs/operators';
import { ɵgetPathPartOfUrl as getPathPartOfUrl } from '@liquid-js/lyr-core/menu';

/**
 * Tells the layout when to scroll back to the top: when a navigation ends on another path than the previous one, so
 * not on a change of the query or the fragment alone.
 *
 * Angular's ViewportScroller scrolls the window on every URL change; the layout scrolls its own container in
 * `withScroll` and window mode.
 */
@Service()
export class NbRestoreScrollTopHelper {
  private readonly router = inject(Router);

  /** Emits when a navigation ends on another path than the previous one, the first navigation included. */
  shouldRestore(): Observable<boolean> {
    return this.router.events
      .pipe(
        startWith(null),
        filter((event) => event === null || event instanceof NavigationEnd),
        pairwise(),
        map(([prev, current]) => this.pageChanged(prev as NavigationEnd, current as NavigationEnd)),
        filter((res) => !!res),
      );
  }

  private pageChanged(prev: NavigationEnd, current: NavigationEnd) {
    return !prev || getPathPartOfUrl(prev.url) !== getPathPartOfUrl(current.url);
  }
}
