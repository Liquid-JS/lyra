import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  contentChild,
  contentChildren,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  TemplateRef,
} from '@angular/core';
import { injectNbTexts, NbLocalize } from '@liquid-js/lyr-core/base';

/** @internal */
declare const $localize: NbLocalize;

/**
 * Replaces the `/` between breadcrumbs, e.g. with an icon.
 *
 * ```html
 * <ng-template nbBreadcrumbSeparator><nb-icon icon="chevron-right-outline" /></ng-template>
 * ```
 */
@Directive({
  selector: 'ng-template[nbBreadcrumbSeparator]',
})
export class NbBreadcrumbSeparatorDirective {
  readonly template = inject(TemplateRef);
}

/**
 * A breadcrumb in `nb-breadcrumbs`: a link to a page, or the current page as text.
 */
@Component({
  selector: 'nb-breadcrumb',
  template: `
    @if (!first()) {
      <span class="separator" aria-hidden="true">
        @if (breadcrumbs.separatorTemplate(); as separator) {
          <ng-container [ngTemplateOutlet]="separator" />
        } @else {
          /
        }
      </span>
    }
    <ng-content />
  `,
  imports: [NgTemplateOutlet],
  host: {
    role: 'listitem',
    '[class.current]': 'current()',
    '[attr.aria-current]': "current() ? 'page' : null",
  },
})
export class NbBreadcrumbComponent {
  protected readonly breadcrumbs = inject(NbBreadcrumbsComponent);

  protected readonly current = computed(() => this.breadcrumbs.last() === this);
  protected readonly first = computed(() => this.breadcrumbs.breadcrumbs().at(0) === this);

  constructor() {
    // Safari skips links with Tab by default; its link gets a `tabindex`, as menu items have, unless it has one.
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const focusable = () =>
      element.querySelectorAll(':scope > a[href]:not([tabindex])').forEach((link) => link.setAttribute('tabindex', '0'));
    focusable();
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(focusable);
      observer.observe(element, { childList: true, attributes: true, attributeFilter: ['href'], subtree: true });
      inject(DestroyRef).onDestroy(() => observer.disconnect());
    }
  }
}

/**
 * Shows the pages leading to the current one, e.g. above its title. Each `nb-breadcrumb` holds a link to a page, and
 * the last one the current page:
 *
 * ```html
 * <nb-breadcrumbs>
 *   <nb-breadcrumb><a routerLink="/">Home</a></nb-breadcrumb>
 *   <nb-breadcrumb><a routerLink="/orders">Orders</a></nb-breadcrumb>
 *   <nb-breadcrumb>Order #1042</nb-breadcrumb>
 * </nb-breadcrumbs>
 * ```
 *
 * @stacked-example(Showcase, breadcrumbs/breadcrumbs-showcase.component)
 *
 * It's a navigation landmark named "Breadcrumb", which `aria-label` changes, with a list of the breadcrumbs. The last one
 * is marked as the current page, and the separators are hidden from screen readers. Long trails wrap onto more
 * lines.
 *
 * The separator is a `/`; an `ng-template` with `nbBreadcrumbSeparator` replaces it, e.g. with an icon. Mirror
 * an arrow for right-to-left text yourself, as icons aren't mirrored:
 * @stacked-example(Custom separator, breadcrumbs/breadcrumbs-separator.component)
 *
 * @styles
 *
 * breadcrumbs-gap:
 * breadcrumbs-text-color:
 * breadcrumbs-text-font-family:
 * breadcrumbs-text-font-size:
 * breadcrumbs-text-font-weight:
 * breadcrumbs-text-line-height:
 * breadcrumbs-link-text-color:
 * breadcrumbs-link-hover-text-color:
 * breadcrumbs-link-focus-text-color:
 * breadcrumbs-link-outline-width:
 * breadcrumbs-link-outline-color:
 * breadcrumbs-link-border-radius:
 * breadcrumbs-current-text-color:
 * breadcrumbs-separator-text-color:
 */
@Component({
  selector: 'nb-breadcrumbs',
  template: `
    <ol>
      <ng-content />
    </ol>
  `,
  styleUrls: ['./breadcrumbs.component.scss'],
  host: {
    role: 'navigation',
    '[attr.aria-label]': 'ariaLabel() ?? texts().label',
  },
})
export class NbBreadcrumbsComponent {
  protected readonly texts = injectNbTexts('breadcrumbs', () => ({
    label: $localize`:@@nb.breadcrumbs.label:Breadcrumb`,
  }));

  /**
   * Names the navigation landmark; "Breadcrumb" by default.
   */
  readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' });

  /** @internal */
  readonly breadcrumbs = contentChildren(NbBreadcrumbComponent);
  protected readonly separator = contentChild(NbBreadcrumbSeparatorDirective);

  /** @internal */
  readonly separatorTemplate = computed(() => this.separator()?.template);

  /** @internal */
  readonly last = computed(() => this.breadcrumbs().at(-1));
}
