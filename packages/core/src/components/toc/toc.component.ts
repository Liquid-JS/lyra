import { DOCUMENT, isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { Component, DestroyRef, effect, inject, input, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectNbTexts, NbLocalize } from '@liquid-js/lyr-core/base';
import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';

/** @internal */
declare const $localize: NbLocalize;

/**
 * A heading in `nb-toc`, with the headings below it.
 */
export interface NbTocEntry {
  id: string;
  title: string;
  /** The title in parts where a word starts inside a name, e.g. `NbMarkdownEditor` and `Component`. */
  parts: string[];
  /** The heading's level, from `aria-level` or its tag; 1 for every heading when the list isn't `nested`. */
  level: number;
  element: HTMLElement;
  children: NbTocEntry[];
}

/**
 * Lists the headings of a page and shows which section is in view (scroll-spy).
 *
 * ```html
 * <article #article>
 *   <h2>Installation</h2>
 *   ...
 * </article>
 * <nb-toc [container]="article" />
 * ```
 *
 * @stacked-example(Showcase, toc/toc-showcase.component)
 *
 * It lists the `h2` and `h3` headings in `container`, nested by level, and follows them as the content changes;
 * `selector` picks other headings. Headings without an `id` get one from their text, so the links work.
 *
 * A link scrolls to its heading and focuses it, and the URL gets the heading's `id` as its fragment. The current
 * section follows how far the area that scrolls, the window or a scrolling element such as `nb-layout`'s, has
 * scrolled: each heading's place in the content, mapped onto the scroll range in proportion, so every section gets
 * a turn on a short page and the last is current at the end, while on a long page a section's turn comes about as
 * its heading reaches the top. A heading's `scroll-margin-top`, e.g. for a fixed header, counts as above it. Before
 * any heading's turn the first section is current. Its link has `aria-current="location"`.
 *
 * @styles
 *
 * toc-text-font-family:
 * toc-text-font-size:
 * toc-text-font-weight:
 * toc-text-line-height:
 * toc-text-color:
 * toc-item-padding:
 * toc-item-indent:
 * toc-border-width:
 * toc-border-color:
 * toc-hover-text-color:
 * toc-focus-text-color:
 * toc-active-text-color:
 * toc-active-border-color:
 * toc-outline-width:
 * toc-outline-color:
 * toc-border-radius:
 */
@Component({
  selector: 'nb-toc',
  templateUrl: './toc.component.html',
  styleUrls: ['./toc.component.scss'],
  imports: [NgTemplateOutlet, RouterLink],
  host: {
    role: 'navigation',
    '[attr.aria-label]': 'ariaLabel() ?? texts().label',
  },
})
export class NbTocComponent {
  protected readonly texts = injectNbTexts('toc', () => ({
    label: $localize`:@@nb.toc.label:Table of contents`,
  }));

  protected readonly document = inject(DOCUMENT);

  /** The element with the headings. */
  readonly container = input.required<HTMLElement>();

  /** A selector for the headings to list; empty headings are skipped. */
  readonly selector = input('h2, h3');

  /** Names the navigation landmark; "Table of contents" by default. */
  readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' });

  /** Nests the headings by level, which it does by default; without it, they're one flat list. */
  readonly nested = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty });

  protected readonly entries = signal<NbTocEntry[]>([]);
  protected readonly active = signal<string | undefined>(undefined);

  protected headings: HTMLElement[] = [];
  /** The heading of a clicked link stays current until the user scrolls. */
  protected pinned = false;
  protected frame?: number;

  constructor() {
    // The list follows the page as it lays out and scrolls, which only happens in a browser; on a server it's empty,
    // as it starts in the browser.
    const view = isPlatformBrowser(inject(PLATFORM_ID)) ? this.document.defaultView : null;

    effect((onCleanup) => {
      const container = this.container();
      this.selector();
      this.nested();
      if (!view) {
        return;
      }
      this.scan();
      if (typeof MutationObserver === 'undefined') {
        return;
      }
      const observer = new MutationObserver(() => this.schedule(() => this.scan()));
      observer.observe(container, { childList: true, subtree: true, characterData: true });
      onCleanup(() => observer.disconnect());
    });

    if (view) {
      const update = () => this.schedule(() => this.update());
      const unpin = () => (this.pinned = false);
      this.document.addEventListener('scroll', update, { capture: true, passive: true });
      view.addEventListener('resize', update, { passive: true });
      for (const type of ['wheel', 'touchmove', 'keydown', 'pointerdown']) {
        this.document.addEventListener(type, unpin, { capture: true, passive: true });
      }
      inject(DestroyRef).onDestroy(() => {
        this.document.removeEventListener('scroll', update, { capture: true });
        view.removeEventListener('resize', update);
        for (const type of ['wheel', 'touchmove', 'keydown', 'pointerdown']) {
          this.document.removeEventListener(type, unpin, { capture: true });
        }
        if (this.frame !== undefined) {
          view.cancelAnimationFrame(this.frame);
        }
      });
    }
  }

  /** @internal */
  onLinkClick(event: MouseEvent, entry: NbTocEntry) {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
      return;
    }
    const reduceMotion = this.document.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    entry.element.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    // Focus moves to the heading, so screen readers read on and Tab continues from there; it's not a control, so
    // the theme hides its focus ring.
    if (!entry.element.hasAttribute('tabindex')) {
      entry.element.setAttribute('tabindex', '-1');
      entry.element.classList.add('nb-toc-target');
    }
    entry.element.focus({ preventScroll: true });
    this.active.set(entry.id);
    // The pointer down that started the click unpinned; this click pins.
    this.pinned = true;
  }

  protected schedule(task: () => void) {
    const view = this.document.defaultView;
    if (!view || this.frame !== undefined) {
      return;
    }
    this.frame = view.requestAnimationFrame(() => {
      this.frame = undefined;
      task();
    });
  }

  protected scan() {
    const headings = [...this.container().querySelectorAll<HTMLElement>(this.selector())].filter((heading) =>
      heading.textContent?.trim(),
    );
    const roots: NbTocEntry[] = [];
    const parents: NbTocEntry[] = [];
    for (const element of headings) {
      if (!element.id) {
        element.id = this.uniqueId(slugify(element.textContent ?? ''));
      }
      const title = element.textContent?.trim() ?? '';
      const entry: NbTocEntry = {
        id: element.id,
        title,
        // A long name, e.g. a component's, may break where a word starts in it, so it fits a narrow column.
        parts: title.split(/(?<=[\p{Ll}\p{N}])(?=\p{Lu})/u),
        level: this.nested() ? headingLevel(element) : 1,
        element,
        children: [],
      };
      while (parents.length && (parents.at(-1) as NbTocEntry).level >= entry.level) {
        parents.pop();
      }
      (parents.at(-1)?.children ?? roots).push(entry);
      parents.push(entry);
    }
    this.headings = headings;
    this.entries.set(roots);
    this.update();
  }

  protected update() {
    if (this.pinned || !this.headings.length) {
      return;
    }
    const scroller = scrollParent(this.headings[0]);
    const root = this.document.documentElement;
    const viewTop = scroller ? scroller.getBoundingClientRect().top : 0;
    const scrollTop = scroller ? scroller.scrollTop : (this.document.defaultView?.scrollY ?? 0);
    const total = scroller ? scroller.scrollHeight : root.scrollHeight;
    const range = Math.max(0, total - (scroller ? scroller.clientHeight : root.clientHeight));

    // Each heading's place in the content, where scrolling brings it to the line (its scroll margin below the top),
    // mapped onto the scroll range in proportion: every section gets a turn, though on a short page few headings can
    // reach the top, and none before it's in view, as its turn comes less than a view's height early.
    let active: HTMLElement | undefined;
    for (const heading of this.headings) {
      const margin = parseFloat(getComputedStyle(heading).scrollMarginTop) || 0;
      const place = Math.max(0, scrollTop + heading.getBoundingClientRect().top - viewTop - margin);
      if (total > 0 && (place * range) / total <= scrollTop + 1) {
        active = heading;
      }
    }
    // Before any heading's turn, e.g. at the top of the page, the first section is the current one.
    this.active.set((active ?? this.headings[0])?.id);
  }

  protected uniqueId(base: string) {
    const id = base || 'section';
    let unique = id;
    for (let i = 2; this.document.getElementById(unique); i++) {
      unique = `${id}-${i}`;
    }
    return unique;
  }
}

function slugify(text: string) {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

function headingLevel(element: HTMLElement) {
  return Number(element.getAttribute('aria-level')) || Number(/^H(\d)$/.exec(element.tagName)?.[1]) || 2;
}

/** The nearest ancestor that scrolls vertically, or undefined for the window. */
function scrollParent(element: HTMLElement): HTMLElement | undefined {
  for (let parent = element.parentElement; parent; parent = parent.parentElement) {
    const overflow = getComputedStyle(parent).overflowY;
    if ((overflow === 'auto' || overflow === 'scroll') && parent.scrollHeight > parent.clientHeight) {
      return parent;
    }
  }
  return undefined;
}
