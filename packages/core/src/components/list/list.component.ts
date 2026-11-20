import {
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  NgZone,
  OnDestroy,
  inject,
  input,
} from '@angular/core';

/**
 * A list of `nb-list-item`s, each holding any content, with dividers between them.
 *
 * @stacked-example(Simple list, list/simple-list-showcase.component)
 *
 * ### Installation
 *
 * Import `NbListComponent`, `NbListItemComponent` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbListComponent, NbListItemComponent],
 * })
 * export class PageComponent { }
 * ```
 *
 * With NgModules:
 *
 * Import `NbListModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbListModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * @stacked-example(Users list, list/users-list-showcase.component)
 *
 * An item can have a title, with a description under it, between what comes before it, such as an icon or an
 * avatar, and its actions at the end:
 *
 * ```html
 * <nb-list-item>
 *   <nb-icon icon="file-text-outline" />
 *   <nb-list-item-title>
 *     Invoice 1042
 *     <nb-list-item-description>Due 1 March, $120.00</nb-list-item-description>
 *   </nb-list-item-title>
 *   <nb-list-item-actions>
 *     <button nbButton ghost size="small">Pay</button>
 *   </nb-list-item-actions>
 * </nb-list-item>
 * ```
 *
 * An item that leads somewhere has an `nbListItemLink`, usually in its title: it covers the whole item, so the
 * item responds to hover, presses and focus as one, while its actions stay their own.
 * @stacked-example(Item layout and links, list/list-item-layout.component)
 *
 * A list that scrolls, e.g. one with a fixed height, takes the keyboard focus so it can be scrolled with the keys; a
 * `tabindex` set on it is left alone.
 *
 * @styles
 *
 * list-scrollbar-color:
 * list-scrollbar-background-color:
 * list-scrollbar-width:
 * list-item-divider-color:
 * list-item-divider-style:
 * list-item-divider-width:
 * list-item-padding:
 * list-item-padding-inline:
 * list-card-edge-padding:
 * list-item-text-color:
 * list-item-font-family:
 * list-item-font-size:
 * list-item-font-weight:
 * list-item-line-height:
 * list-item-gap:
 * list-item-title-text-color:
 * list-item-title-font-family:
 * list-item-title-font-size:
 * list-item-title-font-weight:
 * list-item-title-line-height:
 * list-item-description-text-color:
 * list-item-description-font-family:
 * list-item-description-font-size:
 * list-item-description-font-weight:
 * list-item-description-line-height:
 * list-item-actions-gap:
 * list-item-hover-background-color:
 * list-item-active-background-color:
 * list-item-outline-width:
 * list-item-outline-color:
 */
@Component({
  selector: 'nb-list',
  // Everything is projected: items rendered inside an <ng-container> don't match a `nb-list-item` selector.
  template: `<ng-content />`,
  styleUrls: ['./list.component.scss'],
  host: {
    '[attr.role]': 'role()',
  },
})
export class NbListComponent implements AfterViewInit, OnDestroy {
  protected readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly zone = inject(NgZone);

  /** The ARIA role; `list` by default. */
  readonly role = input('list');

  protected resizeObserver?: ResizeObserver;
  protected mutationObserver?: MutationObserver;
  protected hasOwnTabIndex = false;

  ngAfterViewInit() {
    if (typeof ResizeObserver === 'undefined' || typeof MutationObserver === 'undefined') {
      return;
    }

    // A list that scrolls takes focus, so it can be scrolled with the keyboard. The list overflows when it or
    // its items change size, or when items are added.
    this.zone.runOutsideAngular(() => {
      const host = this.hostRef.nativeElement;
      const resizeObserver = new ResizeObserver(() => this.updateTabIndex());
      const observeItems = () => Array.from(host.children).forEach((item) => resizeObserver.observe(item));

      this.resizeObserver = resizeObserver;
      resizeObserver.observe(host);
      observeItems();

      const mutationObserver = new MutationObserver(() => {
        observeItems();
        this.updateTabIndex();
      });
      this.mutationObserver = mutationObserver;
      mutationObserver.observe(host, { childList: true });
    });
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
    this.mutationObserver?.disconnect();
  }

  protected updateTabIndex() {
    const host = this.hostRef.nativeElement;
    const scrollable = host.scrollHeight > host.clientHeight || host.scrollWidth > host.clientWidth;

    // A tabindex set by the app is left alone.
    if (scrollable && !host.hasAttribute('tabindex')) {
      host.setAttribute('tabindex', '0');
      this.hasOwnTabIndex = true;
    } else if (!scrollable && this.hasOwnTabIndex) {
      host.removeAttribute('tabindex');
      this.hasOwnTabIndex = false;
    }
  }
}

/**
 * An item of a `nb-list`, holding any content; a direct child of the list.
 */
@Component({
  selector: 'nb-list-item',
  template: `<ng-content />`,
  styleUrls: ['list-item.component.scss'],
  host: {
    '[attr.role]': 'role()',
  },
})
export class NbListItemComponent {
  /** The ARIA role; `listitem` by default. */
  readonly role = input('listitem');
}

/**
 * The title of a `nb-list-item`, which takes its free space. A `nb-list-item-description` in it goes under the
 * title.
 */
@Component({
  selector: 'nb-list-item-title',
  template: `<ng-content />`,
})
export class NbListItemTitleComponent {}

/** A description under the title of a `nb-list-item`, in a `nb-list-item-title`. */
@Component({
  selector: 'nb-list-item-description',
  template: `<ng-content />`,
})
export class NbListItemDescriptionComponent {}

/** The actions of a `nb-list-item`, such as buttons, at its end. */
@Component({
  selector: 'nb-list-item-actions',
  template: `<ng-content />`,
})
export class NbListItemActionsComponent {}

/**
 * Makes a link or button in a `nb-list-item`, usually its title, cover the whole item: a click anywhere on the item
 * follows it, and the item shows its hover, active and focus states. Its actions stay clickable on their own.
 *
 * ```html
 * <nb-list-item>
 *   <nb-list-item-title><a nbListItemLink routerLink="/invoices/1042">Invoice 1042</a></nb-list-item-title>
 * </nb-list-item>
 * ```
 */
@Directive({
  selector: '[nbListItemLink]',
  host: { class: 'list-item-link' },
})
export class NbListItemLinkDirective {}
