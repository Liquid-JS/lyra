import { DOCUMENT } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  linkedSignal,
  model,
  output,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { combineLatest, fromEvent, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';
import { NbThemeService } from '@liquid-js/lyr-core/base';
import { NbMediaBreakpoint } from '@liquid-js/lyr-core/base';
import { NbSidebarService, getSidebarState$, getSidebarResponsiveState$ } from './sidebar.service';
import { ɵNB_MENU_PARENT as NB_MENU_PARENT } from '@liquid-js/lyr-core/menu';
import type { NbMenuItem } from '@liquid-js/lyr-core/menu';
import { ɵenableTransitionsAfterRender as enableTransitionsAfterRender } from '@liquid-js/lyr-core/base';

export type NbSidebarState = 'expanded' | 'collapsed' | 'compacted';
export type NbSidebarResponsiveState = 'mobile' | 'tablet' | 'pc';

/**
 * The top of a sidebar, outside its scrolling content.
 */
@Component({
  selector: 'nb-sidebar-header',
  template: ` <ng-content /> `,
})
export class NbSidebarHeaderComponent {}

/**
 * The bottom of a sidebar, outside its scrolling content.
 */
@Component({
  selector: 'nb-sidebar-footer',
  template: ` <ng-content /> `,
})
export class NbSidebarFooterComponent {}

/**
 * A sidebar of the layout, e.g. for a menu, that expands, compacts or collapses.
 *
 * @stacked-example(Showcase, sidebar/sidebar-showcase.component)
 *
 * ### Installation
 *
 * Import `NbSidebarComponent` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbSidebarComponent],
 * })
 * export class PageComponent { }
 * ```
 *
 * and add `provideNbSidebar()` to the application providers:
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [provideNbSidebar()],
 * });
 * ```
 *
 * With NgModules:
 *
 * Import `NbSidebarModule.forRoot()` to your app module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbSidebarModule.forRoot(),
 *   ],
 * })
 * export class AppModule { }
 * ```
 * and `NbSidebarModule` to your feature module where the component should be shown:
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbSidebarModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * The sidebar is placed on the start edge of the layout by default: on the left in a left to right document and on
 * the right in a right to left one. `end` places it on the other edge, and `left` or `right` on that side whatever
 * the direction. A `fixed` sidebar lies over the content; otherwise it pushes the content aside.
 *
 * It has three states, `expanded`, `collapsed` and `compacted` (icons only), set with `state` or through
 * `NbSidebarService`. Its content stays in place while the page scrolls (`containerFixed`).
 *
 * @stacked-example(Compacted Sidebar, sidebar/sidebar-compacted.component)
 *
 * A `responsive` sidebar follows the screen size: it compacts on the `compactedBreakpoints`, collapses on the
 * `collapsedBreakpoints`, and expands again on the larger ones.
 *
 * With a `subheader` header, the header sits beside the sidebar rather than above it:
 * ```html
 * <nb-layout-header subheader></nb-layout-header>
 * ```
 * @stacked-example(Subheader, layout/layout-sidebar-subheader.component)
 * The sidebar then has no shadow, and the header can't be `fixed`.
 *
 * A sidebar that overlays the content, as a `fixed` or a responsive one does on smaller screens, can close itself
 * when it's expanded: `closeOnNavigation` closes it when the router navigates or a link in it is picked, and
 * `closeOnOutsideClick` when the user clicks outside it. It then compacts on tablets and collapses otherwise. A
 * click that expands the sidebar, e.g. on a toggle button in the header, doesn't close it.
 * @stacked-example(Closing an overlaying sidebar, sidebar/sidebar-close.component)
 *
 * @additional-example(Right Sidebar, sidebar/sidebar-right.component)
 * @additional-example(Fixed Sidebar, sidebar/sidebar-fixed.component)
 *
 * @styles
 *
 * sidebar-background-color:
 * sidebar-text-color:
 * sidebar-text-font-family:
 * sidebar-text-font-size:
 * sidebar-text-font-weight:
 * sidebar-text-line-height:
 * sidebar-height:
 * sidebar-width:
 * sidebar-width-compact:
 * sidebar-transition-duration:
 * sidebar-padding:
 * sidebar-header-height:
 * sidebar-footer-height:
 * sidebar-shadow:
 * sidebar-menu-item-highlight-color:
 * sidebar-menu-text-color:
 * sidebar-menu-group-text-color:
 * sidebar-menu-item-icon-color:
 * sidebar-menu-item-hover-background-color:
 * sidebar-menu-item-hover-text-color:
 * sidebar-menu-item-focus-background-color:
 * sidebar-menu-item-active-background-color:
 * sidebar-menu-item-active-text-color:
 * sidebar-menu-item-divider-color:
 * sidebar-menu-submenu-text-color:
 * sidebar-scrollbar-background-color:
 * sidebar-scrollbar-color:
 * sidebar-scrollbar-width:
 */
@Component({
  selector: 'nb-sidebar',
  styleUrls: ['./sidebar.component.scss'],
  templateUrl: './sidebar.component.html',
  // Its menus ask it before a submenu opens or closes.
  providers: [{ provide: NB_MENU_PARENT, useExisting: forwardRef(() => NbSidebarComponent) }],
  host: {
    '[class.fixed]': 'isFixed()',
    '[class.right]': "side() === 'right'",
    '[class.left]': "side() === 'left'",
    '[class.start]': "side() === 'start'",
    '[class.end]': "side() === 'end'",
    '[class.expanded]': 'expanded()',
    '[class.collapsed]': 'collapsed()',
    '[class.compacted]': 'compacted()',
  },
})
export class NbSidebarComponent {
  private readonly sidebarService = inject(NbSidebarService);
  private readonly themeService = inject(NbThemeService);
  private readonly element = inject(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router, { optional: true });

  protected readonly responsiveState = signal<NbSidebarResponsiveState>('pc');

  /** Places the sidebar on the right, whatever the direction of the page. */
  readonly right = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /** Places the sidebar on the left, whatever the direction of the page. */
  readonly left = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /** Places the sidebar on the start edge of the layout, as it is by default; takes precedence over the others. */
  readonly start = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /** Places the sidebar on the end edge of the layout. */
  readonly end = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /** The sidebar lies over the layout's content instead of pushing it aside. */
  readonly fixed = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /**
   * The sidebar's content stays in place while the page scrolls. A responsive sidebar is also `fixed` on its
   * compacted breakpoints while this is on.
   */
  readonly containerFixed = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty });

  /** The state; `expanded` by default. The sidebar changes it too, on toggles, breakpoints and closing. */
  readonly state = model<NbSidebarState>('expanded');

  /**
   * The sidebar follows the screen size: it compacts on the `compactedBreakpoints`, collapses on the
   * `collapsedBreakpoints` and expands on the larger ones, lying over the content on the smaller ones. Turning it
   * off expands the sidebar.
   */
  readonly responsive = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /**
   * Tells the sidebars apart in `NbSidebarService` when a page has several: a call with a tag reaches the sidebar
   * with that tag, and the sidebars without one.
   */
  readonly tag = input<string>();

  /** The breakpoints a `responsive` sidebar compacts on, by name. */
  readonly compactedBreakpoints = input<string[]>(['xs', 'is', 'sm', 'md', 'lg']);

  /** The breakpoints a `responsive` sidebar collapses on, by name. */
  readonly collapsedBreakpoints = input<string[]>(['xs', 'is']);

  /**
   * Closes the sidebar when the router navigates or a link in it is picked, while it's expanded over the content.
   */
  readonly closeOnNavigation = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /**
   * Closes the sidebar when the user clicks outside it, while it's expanded over the content.
   */
  readonly closeOnOutsideClick = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /**
   * Emits when a `responsive` sidebar moves to another kind of screen: `mobile` on the collapsed breakpoints,
   * `tablet` on the compacted ones, `pc` on the rest.
   */
  readonly responsiveStateChange = output<NbSidebarResponsiveState>();

  /**
   * The side the sidebar is placed on: `start` unless an input says otherwise.
   */
  readonly side = computed<'left' | 'right' | 'start' | 'end'>(() => {
    if (this.start()) {
      return 'start';
    }
    if (this.end()) {
      return 'end';
    }
    if (this.right()) {
      return 'right';
    }
    return this.left() ? 'left' : 'start';
  });

  /**
   * Whether the sidebar is fixed: the `fixed` input, until a responsive sidebar changes it on a breakpoint.
   */
  readonly isFixed = linkedSignal(() => this.fixed());

  readonly expanded = computed(() => this.state() === 'expanded');
  readonly collapsed = computed(() => this.state() === 'collapsed');
  readonly compacted = computed(() => this.state() === 'compacted');

  constructor() {
    // The width animates between states, but not into the state the sidebar first renders with.
    enableTransitionsAfterRender(this.element.nativeElement);

    const forThisSidebar = <T extends { tag?: string }>({ tag }: T) => !this.tag() || this.tag() === tag;

    this.sidebarService
      .onToggle()
      .pipe(filter(forThisSidebar), takeUntilDestroyed())
      .subscribe(({ compact }) => this.toggle(compact));

    this.sidebarService
      .onExpand()
      .pipe(filter(forThisSidebar), takeUntilDestroyed())
      .subscribe(() => this.expand());

    this.sidebarService
      .onCollapse()
      .pipe(filter(forThisSidebar), takeUntilDestroyed())
      .subscribe(() => this.collapse());

    this.sidebarService
      .onCompact()
      .pipe(filter(forThisSidebar), takeUntilDestroyed())
      .subscribe(() => this.compact());

    getSidebarState$
      .pipe(filter(forThisSidebar), takeUntilDestroyed())
      .subscribe(({ observer }) => observer.next(this.state()));

    getSidebarResponsiveState$
      .pipe(filter(forThisSidebar), takeUntilDestroyed())
      .subscribe(({ observer }) => observer.next(this.responsiveState()));

    // Turning `responsive` off expands the sidebar.
    let wasResponsive = false;
    effect(() => {
      const responsive = this.responsive();
      if (wasResponsive && !responsive) {
        untracked(() => this.expand());
      }
      wasResponsive = responsive;
    });

    this.subscribeToMediaQueryChange();

    this.router?.events
      .pipe(
        filter((event) => event instanceof NavigationEnd && this.closeOnNavigation()),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.closeOverlay());

    // Picking the page that's already open doesn't navigate, so a picked link closes the sidebar too; a menu item
    // that opens a submenu isn't a pick.
    fromEvent<MouseEvent>(this.element.nativeElement, 'click')
      .pipe(
        filter((event) => {
          const link = (event.target as HTMLElement).closest('a[href]');
          return this.closeOnNavigation() && !!link && !link.hasAttribute('aria-expanded');
        }),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.closeOverlay());

    // Whether the sidebar was expanded before the click, so a click that expands it doesn't close it again.
    let expandedBeforeClick = false;
    fromEvent<MouseEvent>(this.document, 'click', { capture: true })
      .pipe(takeUntilDestroyed())
      .subscribe(() => (expandedBeforeClick = this.expanded()));
    fromEvent<MouseEvent>(this.document, 'click')
      .pipe(
        filter(
          (event) =>
            this.closeOnOutsideClick() &&
            expandedBeforeClick &&
            !this.element.nativeElement.contains(event.target as Node),
        ),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.closeOverlay());
  }

  /**
   * A menu in the sidebar asks before a submenu opens or closes. The sidebar expands to show it, and a compacted one
   * keeps an open submenu open, as it shows none of them.
   */
  submenuToggle(item: NbMenuItem): boolean {
    const keepOpen = this.compacted() && !!item.expanded;
    this.sidebarService.expand(this.tag());
    return !keepOpen;
  }

  collapse() {
    this.updateState('collapsed');
  }

  expand() {
    this.updateState('expanded');
  }

  compact() {
    this.updateState('compacted');
  }

  /**
   * Expands a collapsed or compacted sidebar; otherwise collapses it, or with `compact` compacts it. A responsive
   * sidebar on a mobile screen always collapses.
   */
  toggle(compact: boolean = false) {
    if (this.responsive() && this.responsiveState() === 'mobile') {
      compact = false;
    }

    if (this.state() === 'compacted' || this.state() === 'collapsed') {
      this.updateState('expanded');
    } else {
      this.updateState(compact ? 'compacted' : 'collapsed');
    }
  }

  /** Closes an expanded sidebar that overlays the content: compacts it on tablets and collapses it otherwise. */
  protected closeOverlay() {
    if (!this.isFixed() || !this.expanded()) {
      return;
    }
    if (this.responsive() && this.responsiveState() === 'tablet') {
      this.compact();
    } else {
      this.collapse();
    }
  }

  protected subscribeToMediaQueryChange() {
    combineLatest([
      toObservable(this.responsive),
      this.themeService.onMediaQueryChange() as Observable<[NbMediaBreakpoint, NbMediaBreakpoint]>,
    ])
      .pipe(
        filter(([responsive]) => responsive),
        map(([, breakpoints]) => breakpoints),
        takeUntilDestroyed(),
      )
      .subscribe(([prev, current]: [NbMediaBreakpoint, NbMediaBreakpoint]) => {
        const isCollapsed = this.collapsedBreakpoints().includes(current.name);
        const isCompacted = this.compactedBreakpoints().includes(current.name);

        let newResponsiveState: NbSidebarResponsiveState | undefined;

        if (isCompacted) {
          this.isFixed.set(this.containerFixed());
          this.compact();
          newResponsiveState = 'tablet';
        }
        if (isCollapsed) {
          this.isFixed.set(true);
          this.collapse();
          newResponsiveState = 'mobile';
        }
        if (!isCollapsed && !isCompacted && (!prev.width || prev.width < current.width)) {
          this.expand();
          this.isFixed.set(false);
          newResponsiveState = 'pc';
        }

        if (newResponsiveState && newResponsiveState !== this.responsiveState()) {
          this.responsiveState.set(newResponsiveState);
          this.responsiveStateChange.emit(newResponsiveState);
        }
      });
  }

  protected updateState(state: NbSidebarState) {
    // The model emits `stateChange`.
    this.state.set(state);
  }
}
