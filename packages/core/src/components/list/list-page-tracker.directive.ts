import { DestroyRef, Directive, ElementRef, contentChildren, effect, inject, input, output } from '@angular/core';
import { NbListItemComponent } from './list.component';

/**
 * Tells which page of a list's items is in view, given the page size: the page whose items are the most visible,
 * counting the items that are at least half in view. Items are pages of `pageSize` in the order they're in the
 * list, from `startPage`.
 */
@Directive({ selector: '[nbListPageTracker]' })
export class NbListPageTrackerDirective {
  private readonly observer = new IntersectionObserver((entries) => this.checkForPageChange(entries), {
    threshold: 0.5,
  });
  private currentPage?: number;

  readonly pageSize = input.required<number>();

  /** The page the first items are on; 1 by default. */
  readonly startPage = input<number>(1);

  /** Emits the page in view when it changes. */
  readonly pageChange = output<number>();

  protected readonly listItems = contentChildren(NbListItemComponent, { read: ElementRef });

  constructor() {
    // Observing an item that is already observed does nothing, so all current items are observed on every change.
    effect(() => this.listItems().forEach((item) => this.observer.observe(item.nativeElement)));
    inject(DestroyRef).onDestroy(() => this.observer.disconnect());
  }

  private checkForPageChange(entries: IntersectionObserverEntry[]) {
    const mostVisiblePage = this.findMostVisiblePage(entries);

    if (mostVisiblePage && this.currentPage !== mostVisiblePage) {
      this.currentPage = mostVisiblePage;
      this.pageChange.emit(this.currentPage);
    }
  }

  private findMostVisiblePage(entries: IntersectionObserverEntry[]): number | undefined {
    const intersectionRatioByPage = new Map<number, number>();

    for (const entry of entries) {
      if (entry.intersectionRatio < 0.5) {
        continue;
      }

      const elementIndex = this.elementIndex(entry.target);
      if (elementIndex === -1) {
        continue;
      }
      const page = this.startPage() + Math.floor(elementIndex / this.pageSize());

      let ratio = entry.intersectionRatio;
      const pageRatio = intersectionRatioByPage.get(page);
      if (pageRatio !== undefined) {
        ratio += pageRatio;
      }
      intersectionRatioByPage.set(page, ratio);
    }

    let maxRatio = 0;
    let mostVisiblePage: number | undefined;
    intersectionRatioByPage.forEach((ratio, page) => {
      if (ratio > maxRatio) {
        maxRatio = ratio;
        mostVisiblePage = page;
      }
    });

    return mostVisiblePage;
  }

  private elementIndex(element: Element): number {
    return element.parentElement && element.parentElement.children
      ? Array.from(element.parentElement.children).indexOf(element)
      : -1;
  }
}
