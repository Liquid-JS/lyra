import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject, Service } from '@angular/core';
import { NB_WINDOW } from '@liquid-js/lyr-core';
import { EMPTY, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, finalize, map, takeUntil, tap, share } from 'rxjs/operators';

interface ObserverWithStream {
  intersectionObserver: IntersectionObserver;
  visibilityChange$: Observable<IntersectionObserverEntry[]>;
}

@Service()
export class NgdVisibilityService {
  private readonly window = inject(NB_WINDOW);

  private readonly isBrowser: boolean;
  private readonly supportsIntersectionObserver: boolean;

  private readonly visibilityObservers = new Map<IntersectionObserverInit, ObserverWithStream>();
  private readonly topmostObservers = new Map<IntersectionObserverInit, Observable<Element | undefined>>();
  private readonly visibleElements = new Map<IntersectionObserverInit, Element[]>();
  private readonly unobserve$ = new Subject<{ target: Element; options: IntersectionObserverInit }>();

  constructor() {
    const platformId = inject(PLATFORM_ID);

    this.isBrowser = isPlatformBrowser(platformId);
    this.supportsIntersectionObserver = !!this.window?.IntersectionObserver;
  }

  visibilityChange(target: Element, options: IntersectionObserverInit): Observable<IntersectionObserverEntry> {
    if (!this.isBrowser || !this.supportsIntersectionObserver) {
      return EMPTY;
    }

    let visibilityObserver = this.visibilityObservers.get(options);
    if (!visibilityObserver) {
      visibilityObserver = this.addVisibilityChangeObserver(options);
    }
    const { intersectionObserver, visibilityChange$ } = visibilityObserver;
    intersectionObserver.observe(target);

    const targetUnobserved$ = this.unobserve$.pipe(filter((e) => e.target === target && e.options === options));

    return visibilityChange$.pipe(
      map((entries: IntersectionObserverEntry[]) => entries.find((entry) => entry.target === target)),
      filter((entry): entry is IntersectionObserverEntry => !!entry),
      finalize(() => {
        intersectionObserver.unobserve(target);
        this.removeFromVisible(options, target);
      }),
      takeUntil(targetUnobserved$),
    );
  }

  isTopmostVisible(target: Element, options: IntersectionObserverInit): Observable<boolean> {
    if (!this.isBrowser || !this.supportsIntersectionObserver) {
      return EMPTY;
    }

    const targetUnobserve$ = this.unobserve$.pipe(filter((e) => e.target === target && e.options === options));
    const topmostChange$ = this.topmostObservers.get(options) || this.addTopmostChangeObserver(options);

    const { intersectionObserver } = this.visibilityObservers.get(options) || this.addVisibilityChangeObserver(options);
    intersectionObserver.observe(target);

    return topmostChange$.pipe(
      finalize(() => {
        intersectionObserver.unobserve(target);
        this.removeFromVisible(options, target);
      }),
      map((element) => element === target),
      distinctUntilChanged(),
      takeUntil(targetUnobserve$),
    );
  }

  unobserve(target: Element, options: IntersectionObserverInit) {
    this.unobserve$.next({ target, options });
  }

  private addVisibilityChangeObserver(options: IntersectionObserverInit): ObserverWithStream {
    const visibilityChange$ = new Subject<IntersectionObserverEntry[]>();
    const intersectionObserver = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => visibilityChange$.next(entries),
      options,
    );
    const refCountedObserver = visibilityChange$.pipe(
      finalize(() => {
        this.visibilityObservers.delete(options);
        this.visibleElements.delete(options);
        intersectionObserver.disconnect();
      }),
      tap((entries: IntersectionObserverEntry[]) => this.updateVisibleItems(options, entries)),
      share({ resetOnError: false, resetOnComplete: false, resetOnRefCountZero: false }),
    );

    const observerWithStream = { intersectionObserver, visibilityChange$: refCountedObserver };
    this.visibilityObservers.set(options, observerWithStream);
    return observerWithStream;
  }

  private addTopmostChangeObserver(options: IntersectionObserverInit): Observable<Element | undefined> {
    const { visibilityChange$ } = this.visibilityObservers.get(options) || this.addVisibilityChangeObserver(options);

    const topmostChange$ = visibilityChange$.pipe(
      finalize(() => this.topmostObservers.delete(options)),
      map(() => this.findTopmostElement(options)),
      distinctUntilChanged(),
      share({ resetOnError: false, resetOnComplete: false, resetOnRefCountZero: false }),
    );

    this.topmostObservers.set(options, topmostChange$);
    return topmostChange$;
  }

  private updateVisibleItems(options: IntersectionObserverInit, entries: IntersectionObserverEntry[]) {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        this.addToVisible(options, entry.target);
      } else {
        this.removeFromVisible(options, entry.target);
      }
    }
  }

  private addToVisible(options: IntersectionObserverInit, element: Element) {
    const existing = this.visibleElements.get(options);
    if (!existing) {
      this.visibleElements.set(options, [element]);
    } else if (!existing.includes(element)) {
      existing.push(element);
    }
  }

  private removeFromVisible(options: IntersectionObserverInit, element: Element) {
    const visibleEntries = this.visibleElements.get(options);
    if (!visibleEntries) {
      return;
    }

    const index = visibleEntries.indexOf(element);
    if (index !== -1) {
      visibleEntries.splice(index, 1);
    }
  }

  private findTopmostElement(options: IntersectionObserverInit): Element | undefined {
    const visibleElements = this.visibleElements.get(options);
    if (!visibleElements) {
      return undefined;
    }

    let topmost: Element | undefined;
    for (const element of visibleElements) {
      if (!topmost || element.getBoundingClientRect().top < topmost.getBoundingClientRect().top) {
        topmost = element;
      }
    }
    return topmost;
  }
}
