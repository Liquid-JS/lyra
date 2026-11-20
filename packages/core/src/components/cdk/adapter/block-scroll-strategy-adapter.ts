import { Inject, Injectable, inject, Service } from '@angular/core';
import { BlockScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';

import { NbLayoutScrollService } from '@liquid-js/lyr-core/base';
import { NB_DOCUMENT } from '@liquid-js/lyr-core/base';
import { NbViewportRulerAdapter } from './viewport-ruler-adapter';

/** The class a layout that scrolls in its own container puts on the document while its scrolling is blocked. */
export const NB_LAYOUT_SCROLL_BLOCK_CLASS = 'nb-global-scrollblock';

/**
 * The CDK's block scroll strategy, which blocks the document's scrolling only, extended to block the layout's own
 * scroll container too (`withScroll`, `windowMode`).
 */
// The adapter module provides it with constructor injection, which @Service doesn't support.
@Injectable()
export class NbBlockScrollStrategyAdapter extends BlockScrollStrategy {
  /* eslint-disable @angular-eslint/prefer-inject -- constructor injection on purpose, see the note on the class */
  constructor(@Inject(NB_DOCUMENT) protected readonly document: Document,
    viewportRuler: NbViewportRulerAdapter,
    protected scrollService: NbLayoutScrollService) {
    super(viewportRuler, document);
  }
  /* eslint-enable @angular-eslint/prefer-inject */

  /**
   * Blocks the layout's scrolling, then the document's, unless the layout scrolls in its own container (`withScroll`,
   * `windowMode`): it then marks the document as blocked itself, and blocking the document too would pin it at the
   * container's scroll position, moving the page by as much, and put it back there when unblocked, even after
   * navigating to another page.
   */
  override enable() {
    this.scrollService.scrollable(false);
    if (!this.document.documentElement.classList.contains(NB_LAYOUT_SCROLL_BLOCK_CLASS)) {
      super.enable();
    }
  }

  override disable() {
    // A no-op unless it blocked the document.
    super.disable();
    this.scrollService.scrollable(true);
  }
}

@Service({ autoProvided: false })
export class NbScrollStrategyOptions extends ScrollStrategyOptions {
  protected readonly scrollService = inject(NbLayoutScrollService);
  protected readonly viewportRuler = inject(NbViewportRulerAdapter);
  protected readonly document = inject(NB_DOCUMENT);

  override block = () => new NbBlockScrollStrategyAdapter(this.document, this.viewportRuler, this.scrollService);
}

export type NbScrollStrategies = keyof Pick<NbScrollStrategyOptions, 'noop' | 'close' | 'block' | 'reposition'>;
