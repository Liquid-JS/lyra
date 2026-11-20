import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, OnDestroy, OnInit, PLATFORM_ID, Renderer2, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { timer, Subject } from 'rxjs';
import { takeUntil, filter, tap, debounce, share } from 'rxjs/operators';
import { NB_WINDOW, NbLayoutScrollService } from '@liquid-js/lyr-core';
import { NgdVisibilityService } from '../../../@theme/services';

const OBSERVER_OPTIONS = { rootMargin: '-100px 0px 0px' };

@Directive({ selector: '[ngdFragment]' })
export class NgdFragmentTargetDirective implements OnInit, OnDestroy {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly window = inject(NB_WINDOW);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly visibilityService = inject(NgdVisibilityService);
  private readonly scrollService = inject(NbLayoutScrollService);
  private readonly document = inject(DOCUMENT);

  private readonly marginFromTop = 120;
  private isCurrentlyViewed = false;
  private isScrolling = false;
  private destroy$ = new Subject<void>();
  // The section's title, which the page's table of contents lists and links to.
  private title?: HTMLElement;
  private titleObserver?: MutationObserver;

  readonly ngdFragment = input.required<string>();
  readonly ngdFragmentClass = input<string>();
  readonly ngdFragmentSync = input<boolean>(true);
  /**
   * Whether the page's table of contents lists the section's heading: a page's introduction, a section of the page for
   * the address it gives, needn't be listed.
   */
  readonly ngdFragmentListed = input<boolean>(true);

  ngOnInit() {
    this.markTitle();
    if (typeof MutationObserver !== 'undefined') {
      this.titleObserver = new MutationObserver(() => this.markTitle());
      this.titleObserver.observe(this.el.nativeElement, { childList: true, subtree: true });
    }

    this.activatedRoute.fragment
      .pipe(
        share({ resetOnError: false, resetOnComplete: false, resetOnRefCountZero: false }),
        filter(() => this.ngdFragmentSync()),
        takeUntil(this.destroy$),
      )
      .subscribe((fragment) => {
        if (fragment && this.ngdFragment() === fragment) {
          this.selectFragment();
        } else {
          this.deselectFragment();
        }
      });

    this.visibilityService.isTopmostVisible(this.el.nativeElement, OBSERVER_OPTIONS)
      .pipe(takeUntil(this.destroy$))
      .subscribe((isTopmost: boolean) => {
        this.isCurrentlyViewed = isTopmost;
        if (isTopmost) {
          this.updateUrl();
        }
      });

    this.scrollService.onScroll()
      .pipe(
        tap(() => this.isScrolling = true),
        debounce(() => timer(100)),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.isScrolling = false);
  }

  selectFragment() {
    const ngdFragmentClass = this.ngdFragmentClass();
    ngdFragmentClass && this.renderer.addClass(this.el.nativeElement, ngdFragmentClass);

    // The table of contents scrolls to a title it links to, and focuses it.
    if (this.title && this.document.activeElement === this.title) {
      return;
    }

    const shouldScroll = !this.isCurrentlyViewed || !this.isScrolling;
    if (shouldScroll) {
      this.window?.scrollTo(0, this.el.nativeElement.offsetTop - this.marginFromTop);
    }
  }

  deselectFragment() {
    const ngdFragmentClass = this.ngdFragmentClass();
    ngdFragmentClass && this.renderer.removeClass(this.el.nativeElement, ngdFragmentClass);
  }

  updateUrl() {
    const urlFragment = this.activatedRoute.snapshot.fragment;
    const alreadyThere = urlFragment && urlFragment.includes(this.ngdFragment());
    if (!alreadyThere) {
      void this.router.navigate([], { fragment: this.ngdFragment(), replaceUrl: true });
    }
  }

  /** Gives the section's first heading the section's fragment as its id, so the table of contents links to it. */
  private markTitle() {
    const title = this.ngdFragmentListed()
      ? (this.el.nativeElement.querySelector<HTMLElement>('h1, h2, h3') ?? undefined)
      : undefined;
    if (title === this.title && title?.id === this.ngdFragment()) {
      return;
    }
    this.title?.classList.remove('ngd-section-title');
    this.title = title;
    if (title) {
      title.id = this.ngdFragment();
      title.classList.add('ngd-section-title');
    }
  }

  ngOnDestroy() {
    this.titleObserver?.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
    this.visibilityService.unobserve(this.el.nativeElement, OBSERVER_OPTIONS);
  }
}
