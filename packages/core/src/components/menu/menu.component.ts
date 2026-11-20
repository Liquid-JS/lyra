import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  DoCheck,
  ElementRef,
  inject,
  input,
  OnChanges,
  OnInit,
  output,
  PLATFORM_ID,
  SimpleChanges,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, NavigationEnd, NavigationExtras, NavigationSkipped, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { NbMenuInternalService, NbMenuItem, NbMenuBag, NbMenuService, NbMenuBadgeConfig } from './menu.service';
import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';
import { NB_WINDOW } from '@liquid-js/lyr-core/base';
import { ɵanimateExpand as animateExpand } from '@liquid-js/lyr-core/base';
import { NbLayoutDirectionService } from '@liquid-js/lyr-core/base';
import { NbIconComponent } from '@liquid-js/lyr-core/icon';
import { NbBadgeComponent } from '@liquid-js/lyr-core/badge';
import { injectNbTexts, NbLocalize } from '@liquid-js/lyr-core/base';
import { NB_MENU_PARENT } from './menu-parent';

/** @internal */
declare const $localize: NbLocalize;

export type NbMenuOrientation = 'vertical' | 'horizontal';

export enum NbToggleStates {
  Expanded = 'expanded',
  Collapsed = 'collapsed',
}

@Component({
  selector: '[nbMenuItem]',
  templateUrl: './menu-item.component.html',
  // Menu items are plain objects that apps and the menu service change in place.
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NbIconComponent, RouterLink, NgTemplateOutlet, NbBadgeComponent],
})
export class NbMenuItemComponent implements DoCheck, AfterViewInit, AfterViewChecked {
  protected readonly menuService = inject(NbMenuService);
  protected readonly directionService = inject(NbLayoutDirectionService);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly texts = injectNbTexts('menu', () => ({
    submenu: (title: string) => $localize`:@@nb.menu.submenu:${title}:title: submenu`,
  }));

  readonly menuItem = input.required<NbMenuItem>();
  readonly badge = input<NbMenuBadgeConfig>();
  /** @internal A top-level item of a horizontal menu, whose children open below it. */
  readonly dropdown = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  readonly hoverItem = output<NbMenuItem>();
  readonly toggleSubMenu = output<NbMenuItem>();
  readonly selectItem = output<NbMenuItem>();
  readonly itemClick = output<NbMenuItem>();

  toggleState = NbToggleStates.Collapsed;

  private readonly submenu = viewChild<ElementRef<HTMLElement>>('submenu');
  private rendered?: { submenu: HTMLElement; state: NbToggleStates };

  ngDoCheck() {
    this.toggleState = this.menuItem().expanded ? NbToggleStates.Expanded : NbToggleStates.Collapsed;
  }

  // Menu items are plain objects, so the item compares the state its submenu rendered with the one it had; a submenu
  // that only now renders shows its state without animating.
  ngAfterViewChecked() {
    const submenu = this.submenu()?.nativeElement;
    if (submenu && this.rendered?.submenu === submenu && this.rendered.state !== this.toggleState) {
      animateExpand(submenu, this.toggleState === NbToggleStates.Expanded, { easing: 'ease-in-out' });
    }
    this.rendered = submenu ? { submenu, state: this.toggleState } : undefined;
  }

  ngAfterViewInit() {
    this.menuService
      .onSubmenuToggle()
      .pipe(
        filter(({ item }) => item === this.menuItem()),
        map(({ item }: NbMenuBag) => item.expanded),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((isExpanded) => (this.toggleState = isExpanded ? NbToggleStates.Expanded : NbToggleStates.Collapsed));
  }

  onToggleSubMenu(item: NbMenuItem) {
    this.toggleSubMenu.emit(item);
  }

  /** Going to a parent's own page opens its submenu, so its pages show. */
  openSubMenu(item: NbMenuItem) {
    if (!item.expanded) {
      this.toggleSubMenu.emit(item);
    }
  }

  onHoverItem(item: NbMenuItem) {
    this.hoverItem.emit(item);
  }

  onSelectItem(item: NbMenuItem) {
    this.selectItem.emit(item);
  }

  onItemClick(item: NbMenuItem) {
    this.itemClick.emit(item);
  }

  /** An item whose children are all hidden renders as a plain item, without an expand toggle. */
  hasVisibleChildren(): boolean {
    return !!this.menuItem().children?.some((child) => !child.hidden);
  }

  /**
   * Whether a `url` item opens in the current tab; a link opened elsewhere (for example `target="_blank"`)
   * shouldn't take the selection.
   * */
  opensInPlace(item: NbMenuItem): boolean {
    return !item.target || item.target === '_self';
  }

  /**
   * One chevron, which the styles turn: down while the submenu is open, else towards the item's end, or up in a
   * dropdown.
   */
  getExpandStateIcon(): string {
    return 'chevron-down-outline';
  }
}

/**
 * A navigation menu of `NbMenuItem`s, with submenus of any depth, in a column or in a row.
 *
 * Basic example
 * @stacked-example(Showcase, menu/menu-showcase.component)
 *
 * ```ts
 * // ...
 * items: NbMenuItem[] = [
 *  {
 *    title: 'Home',
 *    link: '/'
 *  },
 *  {
 *    title: 'Dashboard',
 *    link: 'dashboard'
 *  }
 * ];
 * // ...
 * <nb-menu [items]="items"></nb-menu>
 * ```
 * ### Installation
 *
 * Import `NbMenuComponent` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbMenuComponent],
 * })
 * export class PageComponent { }
 * ```
 *
 * and add `provideNbMenu()` to the application providers:
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [provideNbMenu()],
 * });
 * ```
 *
 * With NgModules:
 *
 * Import `NbMenuModule.forRoot()` to your app module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbMenuModule.forRoot(),
 *   ],
 * })
 * export class AppModule { }
 * ```
 * and `NbMenuModule` to your feature module where the component should be shown:
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbMenuModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * Two-level menu example
 * @stacked-example(Two Levels, menu/menu-children.component)
 *
 * An item with children and a `link` or `url` has its own page: its title goes there and opens its submenu, and a
 * separate button, named "{title} submenu", opens and closes the submenu without leaving the page.
 *
 *
 * With `autoCollapse`, opening a submenu closes the others:
 * @stacked-example(Autocollapse Menu, menu/menu-autocollapse.component)
 *
 * An item's `badge` shows an `nb-badge` after its title:
 * @stacked-example(Menu item badge, menu/menu-badge.component)
 *
 * With `orientation="horizontal"` the top-level items are in a row, e.g. in the layout header, and their children
 * open in a dropdown below them. One dropdown is open at a time, and it closes when an item in it is picked, on
 * Escape, and when focus or a click goes elsewhere. Deeper levels expand inside the dropdown.
 * @stacked-example(Horizontal, menu/menu-horizontal.component)
 *
 * @styles
 *
 * menu-background-color:
 * menu-text-color:
 * menu-text-font-family:
 * menu-text-font-size:
 * menu-text-font-weight:
 * menu-text-line-height:
 * menu-group-text-color:
 * menu-item-border-radius:
 * menu-item-padding:
 * menu-item-hover-background-color:
 * menu-item-hover-cursor:
 * menu-item-focus-background-color:
 * menu-item-hover-text-color:
 * menu-item-icon-hover-color:
 * menu-item-active-background-color:
 * menu-item-active-text-color:
 * menu-item-icon-active-color:
 * menu-item-active-indicator-width:
 * menu-item-active-indicator-color:
 * menu-item-icon-color:
 * menu-item-icon-end-margin:
 * menu-item-icon-width:
 * menu-item-divider-color:
 * menu-item-divider-style:
 * menu-item-divider-width:
 * menu-submenu-background-color:
 * menu-submenu-text-color:
 * menu-submenu-margin:
 * menu-submenu-start-padding:
 * menu-submenu-item-border-color:
 * menu-submenu-item-border-style:
 * menu-submenu-item-border-width:
 * menu-submenu-item-border-radius:
 * menu-submenu-item-padding:
 * menu-submenu-item-hover-background-color:
 * menu-submenu-item-focus-background-color:
 * menu-submenu-item-hover-border-color:
 * menu-submenu-item-hover-text-color:
 * menu-submenu-item-icon-hover-color:
 * menu-submenu-item-active-background-color:
 * menu-submenu-item-active-border-color:
 * menu-submenu-item-active-text-color:
 * menu-submenu-item-icon-active-color:
 * menu-submenu-item-active-hover-background-color:
 * menu-submenu-item-active-hover-border-color:
 * menu-submenu-item-active-hover-text-color:
 * menu-submenu-item-icon-active-hover-color:
 * menu-dropdown-background-color:
 * menu-dropdown-border-style:
 * menu-dropdown-border-width:
 * menu-dropdown-border-color:
 * menu-dropdown-border-radius:
 * menu-dropdown-shadow:
 * menu-dropdown-min-width:
 * menu-dropdown-padding:
 */
@Component({
  selector: 'nb-menu',
  styleUrls: ['./menu.component.scss'],
  templateUrl: './menu.component.html',
  // Menu items are plain objects that apps and the menu service change in place.
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NbMenuItemComponent],
  host: {
    '[class.horizontal]': 'horizontal()',
    '(document:click)': 'onDocumentClick($event)',
    '(focusout)': 'onFocusOut($event)',
    '(keydown.escape)': 'onEscape($event)',
  },
})
export class NbMenuComponent implements OnInit, OnChanges, AfterViewInit {
  protected readonly window = inject(NB_WINDOW);
  protected readonly platformId = inject(PLATFORM_ID);
  protected readonly menuInternalService = inject(NbMenuInternalService);
  protected readonly parent = inject(NB_MENU_PARENT, { optional: true });
  protected readonly router = inject(Router);
  protected readonly cd = inject(ChangeDetectorRef);

  protected readonly destroyRef = inject(DestroyRef);
  protected readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  /**
   * Names the menu, so `NbMenuService` can address it and tell its events apart when there are several menus.
   */
  readonly tag = input<string>();

  /**
   * The items. The menu changes them in place: it sets `parent`, `selected` and `expanded`.
   */
  readonly items = input<NbMenuItem[]>([]);

  /**
   * Closes the other submenus when one opens, and when an item is selected.
   */
  readonly autoCollapse = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /**
   * Shows the top-level items in a column, or in a row with their children in dropdowns.
   */
  readonly orientation = input<NbMenuOrientation>('vertical');

  protected readonly horizontal = computed(() => this.orientation() === 'horizontal');

  ngOnInit() {
    this.menuInternalService.prepareItems(this.items());
    // Before the first render, so the menu opens with the current page's submenu open rather than animating it open.
    // It keeps a selection the app set when the URL matches no item.
    this.selectFromUrl();

    this.menuInternalService
      .onAddItem(this.tag())
      .pipe(
        filter((data: { tag?: string; items: NbMenuItem[] }) => this.compareTag(data.tag)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => this.onAddItem(data));

    this.menuInternalService
      .onNavigateHome(this.tag())
      .pipe(
        filter((data: { tag?: string }) => this.compareTag(data.tag)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.navigateHome());

    this.menuInternalService
      .onGetSelectedItem(this.tag())
      .pipe(
        filter((data) => this.compareTag(data.tag)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => {
        data.listener.next({ tag: this.tag(), item: this.getSelectedItem(this.items()) });
      });

    this.menuInternalService
      .onCollapseAll(this.tag())
      .pipe(
        filter((data: { tag?: string }) => this.compareTag(data.tag)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.collapseAll());

    this.router.events
      .pipe(
        // Also a navigation to the URL already shown, which the router skips.
        filter((event) => event instanceof NavigationEnd || event instanceof NavigationSkipped),
        takeUntilDestroyed(this.destroyRef),
      )
      // The URL changed, so a selection it doesn't match is stale.
      .subscribe(() => this.selectFromUrl(true));
  }

  ngOnChanges(changes: SimpleChanges) {
    // A new items array needs the same preparation and URL selection as the initial one.
    if (changes['items'] && !changes['items'].firstChange) {
      this.menuInternalService.prepareItems(this.items());
      this.selectFromUrl();
    }
  }

  ngAfterViewInit() {
    // Shared items arrays keep `selected` from a menu that was destroyed on another page.
    setTimeout(() => this.selectFromUrl(true));
  }

  onAddItem(data: { tag?: string; items: NbMenuItem[] }) {
    this.items().push(...data.items);

    this.menuInternalService.prepareItems(this.items());
    this.selectFromUrl();
  }

  onHoverItem(item: NbMenuItem) {
    this.menuInternalService.itemHover(item, this.tag());
  }

  onToggleSubMenu(item: NbMenuItem) {
    if (this.parent?.submenuToggle(item) === false) {
      return;
    }
    if (this.horizontal() && this.items().includes(item)) {
      this.closeDropdowns(item);
    }
    if (this.autoCollapse()) {
      this.menuInternalService.collapseAll(this.items(), this.tag(), item);
    }
    item.expanded = !item.expanded;
    this.menuInternalService.submenuToggle(item, this.tag());
  }

  onSelectItem(item: NbMenuItem) {
    this.menuInternalService.selectItem(item, this.items(), this.autoCollapse(), this.tag());
    this.closeDropdowns();
  }

  onItemClick(item: NbMenuItem) {
    this.menuInternalService.itemClick(item, this.tag());
    if (!item.children?.some((child) => !child.hidden)) {
      this.closeDropdowns();
    }
  }

  /** @internal */
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closeDropdowns();
    }
  }

  /**
   * @internal
   * Closes a dropdown that focus leaves for another element. Focus that goes nowhere, as when Safari doesn't focus a
   * clicked link, leaves it open for the click.
   */
  onFocusOut(event: FocusEvent) {
    const target = event.relatedTarget as Node | null;
    if (!target) {
      return;
    }
    const open = this.items().findIndex((item) => item.expanded);
    if (open >= 0 && !this.topLevelElements()[open]?.contains(target)) {
      this.closeDropdowns();
    }
  }

  /** @internal Closes the open dropdown and focuses its item; then Escape closes nothing else, e.g. a popover. */
  onEscape(event: Event) {
    const open = this.horizontal() ? this.items().findIndex((item) => item.expanded) : -1;
    if (open >= 0 && !event.defaultPrevented) {
      event.preventDefault();
      this.closeDropdowns();
      this.topLevelElements()[open]?.querySelector<HTMLElement>(':scope > a')?.focus();
    }
  }

  protected navigateHome() {
    const homeItem = this.getHomeItem(this.items());

    if (homeItem) {
      if (homeItem.link) {
        const extras: NavigationExtras = {
          queryParams: homeItem.queryParams,
          queryParamsHandling: homeItem.queryParamsHandling,
          fragment: homeItem.fragment,
          preserveFragment: homeItem.preserveFragment,
        };
        void this.router.navigate([homeItem.link], extras);
      }

      if (homeItem.url && this.window) {
        this.window.location.href = homeItem.url;
      }
    }
  }

  /** Closes the dropdowns of a horizontal menu, except the given one; open levels inside them stay open. */
  protected closeDropdowns(except?: NbMenuItem) {
    if (!this.horizontal()) {
      return;
    }
    for (const item of this.items()) {
      if (item !== except && item.expanded) {
        item.expanded = false;
        this.menuInternalService.submenuToggle(item, this.tag());
      }
    }
    this.cd.markForCheck();
  }

  /** The elements of the visible top-level items, by their index in `items`. */
  protected topLevelElements(): (HTMLElement | undefined)[] {
    const elements = [
      ...this.elementRef.nativeElement.querySelectorAll<HTMLElement>(':scope > .menu-items > .menu-item'),
    ];
    return this.items().map((item) => (item.hidden ? undefined : elements.shift()));
  }

  protected collapseAll() {
    this.menuInternalService.collapseAll(this.items(), this.tag());
    this.cd.markForCheck();
  }

  /**
   * Selects the item matching the URL. Navigation, timers and service commands don't mark the menu for check, so
   * this does.
   */
  protected selectFromUrl(resetIfNoMatch = false) {
    this.menuInternalService.selectFromUrl(this.items(), this.tag(), this.autoCollapse(), resetIfNoMatch);
    // Selecting an item expands its parents, which in a horizontal menu would open a dropdown.
    this.closeDropdowns();
    this.cd.markForCheck();
  }

  protected getHomeItem(items: NbMenuItem[]): NbMenuItem | undefined {
    for (const item of items) {
      if (item.home) {
        return item;
      }

      const homeItem = item.children && this.getHomeItem(item.children);
      if (homeItem) {
        return homeItem;
      }
    }

    return undefined;
  }

  protected compareTag(tag?: string) {
    return !tag || tag === this.tag();
  }

  protected getSelectedItem(items: NbMenuItem[]): NbMenuItem | undefined {
    let selected: NbMenuItem | undefined;
    items.forEach((item: NbMenuItem) => {
      if (item.selected) {
        selected = item;
      }
      if (item.selected && item.children && item.children.length > 0) {
        selected = this.getSelectedItem(item.children);
      }
    });
    return selected;
  }
}
