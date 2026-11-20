import { Directive, effect, ElementRef, inject, input, signal } from '@angular/core';

import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';

// One observer for all placeholders, which tells each where it is across the viewport: the shimmer's waves move across
// the viewport, and each placeholder shows its part of them. A placeholder that moves without changing its size, as when
// the viewport's width changes, is told again. An inline element has no box of its own to observe changing, so it's
// measured as it's first observed.
const placeholders = new Map<Element, (left: number) => void>();
let observer: ResizeObserver | undefined;

function place(element: Element) {
  placeholders.get(element)?.(Math.round(element.getBoundingClientRect().left));
}

function observePlacement(element: Element, report: (left: number) => void): () => void {
  if (!observer) {
    observer = new ResizeObserver((entries) => entries.forEach((entry) => place(entry.target)));
    addEventListener('resize', () => placeholders.forEach((_, placeholder) => place(placeholder)));
  }
  placeholders.set(element, report);
  observer.observe(element);
  return () => {
    observer?.unobserve(element);
    placeholders.delete(element);
  };
}

/**
 * Shows an element as a placeholder while its content loads: the content is hidden and the element's own box is
 * painted, with a shimmer whose waves move across the page at a steady pace, over all placeholders as one.
 *
 * ```html
 * <h3 [nbSkeleton]="!user">{{ user?.name ?? 'Jane Doe' }}</h3>
 * ```
 *
 * @stacked-example(Showcase, skeleton/skeleton-showcase.component)
 *
 * The placeholder takes the shape of the content, so give it sample content while loading, e.g. a typical name. On an
 * inline element, such as a `span` in a paragraph, each line of text is its own bar. `nbSkeletonShape="circle"`
 * rounds it, e.g. for an avatar, and `nbSkeletonWidth` sizes an element with no content yet.
 *
 * While loading, the element is `inert`: its sample content can't be focused or clicked, and assistive technologies
 * skip it. Tell them the region is loading on the region itself, e.g. with `aria-busy="true"`. The shimmer stands
 * still when the user prefers reduced motion.
 *
 * @styles
 *
 * skeleton-background-color:
 * skeleton-highlight-color:
 * skeleton-border-radius:
 */
@Directive({
  selector: '[nbSkeleton]',
  exportAs: 'nbSkeleton',
  host: {
    '[class.nb-skeleton]': 'loading()',
    '[class.nb-skeleton-circle]': 'loading() && shape() === "circle"',
    '[class.nb-skeleton-sized]': 'loading() && !!width()',
    '[style.--nb-skeleton-width]': 'loading() ? width() : null',
    '[style.--nb-skeleton-left]': 'loading() ? left() : null',
    '[style.--nb-skeleton-clock]': 'loading() ? clock() : null',
    '[attr.inert]': 'loading() ? "" : null',
    // What the placeholder stands for is loading, as under a spinner.
    '[attr.aria-busy]': 'loading() || null',
  },
})
export class NbSkeletonDirective {
  /** Whether the element shows as a placeholder; on its own, `nbSkeleton` always does. */
  readonly loading = input<boolean, NbBooleanInput>(true, { alias: 'nbSkeleton', transform: convertToBoolProperty });

  /** The placeholder's shape: `text` (default) follows the element, `circle` rounds it. */
  readonly shape = input<'text' | 'circle'>('text', { alias: 'nbSkeletonShape' });

  /** The width of an element with no content yet, e.g. `8rem` or `60%`. */
  readonly width = input<string | undefined>(undefined, { alias: 'nbSkeletonWidth' });

  /** The placeholder's distance from the viewport's start, which places its part of the waves; known once measured. */
  protected readonly left = signal<number | undefined>(undefined);

  /**
   * The page's time, in milliseconds, as the placeholder shows: its shimmer starts that far along, so all placeholders
   * keep to the page's one set of waves, whenever they show.
   */
  protected readonly clock = signal<number | undefined>(undefined);

  constructor() {
    const element: Element = inject(ElementRef).nativeElement;
    effect((onCleanup) => {
      if (this.loading() && typeof ResizeObserver !== 'undefined') {
        this.clock.set(Math.round(performance.now()));
        onCleanup(observePlacement(element, (left) => this.left.set(left)));
      }
    });
  }
}
