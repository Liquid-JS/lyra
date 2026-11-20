import { DestroyRef, inject, Service } from '@angular/core';

import { NB_DOCUMENT, ɵisComposing as isComposing } from '@liquid-js/lyr-core/base';

/** An overlay that closes on Escape, while it's open. */
export interface NbEscapeEntry {
  /** Makes it the first to close, e.g. as a window comes to the front. */
  raise(): void;
  /** Takes it off the stack, as it closes. */
  remove(): void;
}

interface NbEscapeItem {
  close: (event: KeyboardEvent) => void;
  enabled: () => boolean;
}

/**
 * One Escape closes one overlay: the dialog, window, popover, context menu or tooltip opened, or brought to the
 * front, last. A control that handles Escape itself, e.g. a select closing its options, prevents its default, and then
 * nothing here closes. Overlays add themselves while they're open.
 */
@Service()
export class NbEscapeStack {
  protected readonly document = inject(NB_DOCUMENT);
  protected readonly items = new Array<NbEscapeItem>();

  // Listens on the document, after the controls in the page handled the key, and only while overlays are open.
  protected readonly listener = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || event.defaultPrevented || isComposing(event)) {
      return;
    }
    const item = [...this.items].reverse().find(({ enabled }) => enabled());
    if (item) {
      event.preventDefault();
      item.close(event);
    }
  };

  constructor() {
    inject(DestroyRef).onDestroy(() => this.document.removeEventListener('keydown', this.listener));
  }

  /**
   * Adds an open overlay, `close` closing it on Escape; `enabled` tells whether Escape reaches it now, e.g. not while
   * a window is minimized, when the one below it closes instead.
   */
  add(close: (event: KeyboardEvent) => void, enabled: () => boolean = () => true): NbEscapeEntry {
    const item: NbEscapeItem = { close, enabled };
    if (!this.items.length) {
      this.document.addEventListener('keydown', this.listener);
    }
    this.items.push(item);
    return {
      raise: () => {
        const index = this.items.indexOf(item);
        if (index >= 0) {
          this.items.splice(index, 1);
          this.items.push(item);
        }
      },
      remove: () => {
        const index = this.items.indexOf(item);
        if (index >= 0) {
          this.items.splice(index, 1);
          if (!this.items.length) {
            this.document.removeEventListener('keydown', this.listener);
          }
        }
      },
    };
  }
}
