import { inject, Service } from '@angular/core';
import { ScrollDispatcher } from '@angular/cdk/overlay';
import { ScrollDispatcherTarget } from '@angular/cdk/scrolling';
import { merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { NbLayoutScrollService } from '@liquid-js/lyr-core/base';

/** The CDK's scroll dispatcher, reporting the layout's scrolls too, so overlays follow a layout that scrolls. */
@Service({ autoProvided: false })
export class NbScrollDispatcherAdapter extends ScrollDispatcher {
  protected readonly scrollService = inject(NbLayoutScrollService);

  // The layout's scrolls come without a target, like the CDK's own window scrolls.
  override scrolled(auditTimeInMs?: number): Observable<ScrollDispatcherTarget | void> {
    return merge(
      super.scrolled(auditTimeInMs),
      this.scrollService.onScroll().pipe(map(() => undefined)),
    );
  }
}
