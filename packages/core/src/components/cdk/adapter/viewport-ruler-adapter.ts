import { inject, Service } from '@angular/core';
import { ViewportRuler } from '@angular/cdk/overlay';
import { map } from 'rxjs/operators';

import { NbLayoutRulerService } from '@liquid-js/lyr-core/base';
import { NbLayoutScrollService, NbScrollPosition } from '@liquid-js/lyr-core/base';

/** The CDK's viewport ruler, measuring the layout's scroll container instead of the window when there's a layout. */
@Service({ autoProvided: false })
export class NbViewportRulerAdapter extends ViewportRuler {
  protected readonly ruler = inject(NbLayoutRulerService);
  protected readonly scroll = inject(NbLayoutScrollService);

  override getViewportSize(): Readonly<{ width: number; height: number }> {
    let res;
    // The layout answers getDimensions() synchronously, which the CDK's synchronous interface relies on.
    this.ruler.getDimensions()
      .pipe(map((dimensions) => ({ width: dimensions.clientWidth, height: dimensions.clientHeight })))
      .subscribe((rect) => res = rect);
    // Without a layout to measure, the window is the viewport.
    return res ?? super.getViewportSize();
  }

  override getViewportScrollPosition(): { left: number; top: number } {
    let res;
    // The layout answers getPosition() synchronously, which the CDK's synchronous interface relies on.
    this.scroll.getPosition()
      .pipe(map((position: NbScrollPosition) => ({ top: position.y, left: position.x })))
      .subscribe((position) => res = position);
    return res ?? super.getViewportScrollPosition();
  }
}
