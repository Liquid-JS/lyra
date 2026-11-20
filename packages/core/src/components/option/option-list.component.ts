import { AfterViewInit, Component, DestroyRef, ElementRef, inject, input, viewChild } from '@angular/core';

import { NbComponentSize } from '@liquid-js/lyr-core/base';
import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';
import { NbPosition } from '@liquid-js/lyr-core/cdk';
import { NB_OPTION_REVEAL_EVENT } from './option-reveal';

/**
 * The scrolling container of options, groups and nested options, which a select or autocomplete opens in an overlay.
 * With 100 or more options shown, it lays out only the ones near its view; see `NbOptionListWindowing`.
 *
 * @styles
 *
 * option-list-max-height:
 * option-list-scrollbar-color:
 * option-list-scrollbar-background-color:
 * option-list-scrollbar-width:
 * option-list-shadow:
 * option-list-background-color:
 * option-list-border-style:
 * option-list-border-width:
 * option-list-border-color:
 * option-list-border-radius:
 * option-list-adjacent-border-color:
 * option-list-adjacent-border-style:
 * option-list-adjacent-border-width:
 * */
@Component({
  selector: 'nb-option-list',
  templateUrl: './option-list.component.html',
  host: {
    '[class]': "'size-' + size()",
    '[class.position-top]': "position() === 'top'",
    '[class.position-bottom]': "position() === 'bottom'",
    'animate.enter': 'nb-overlay-enter',
    'animate.leave': 'nb-overlay-leave',
  },
})
export class NbOptionListComponent implements AfterViewInit {
  readonly size = input<NbComponentSize>('medium');

  readonly position = input<NbPosition>();

  /**
   * Whether more than one option can be selected, for assistive technology.
   */
  readonly multiple = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /**
   * Id of the listbox, for a search input that controls it.
   */
  readonly listId = input<string>();

  /**
   * The role of the list: a `tree` when it has nested options.
   */
  readonly listRole = input<'listbox' | 'tree'>('listbox');

  readonly list = viewChild<ElementRef<HTMLElement>>('list');

  protected readonly destroyRef = inject(DestroyRef);
  protected readonly windowing = new NbOptionListWindowing();

  // Overlays check the list as they attach it, before positioning it, so a long list lays out only its window from the
  // start; waiting for the first render would measure all its options once.
  ngAfterViewInit() {
    const list = this.list()?.nativeElement;
    if (list) {
      this.windowing.attach(list);
      this.destroyRef.onDestroy(() => this.windowing.detach());
    }
  }

  setScrollTop(scrollTop: number) {
    const list = this.list();
    if (list) {
      list.nativeElement.scrollTop = scrollTop;
    }
  }

  getScrollTop(): number {
    return this.list()?.nativeElement.scrollTop ?? 0;
  }
}

// The rows of a list: its options, and the rows of nested options.
const NB_OPTION_ROWS = 'nb-option, .option-nested-row';
// Left out by a search, collapsed in a nested option, or hidden by the app, by themselves or what they're in.
const NB_HIDDEN = '[hidden], .filtered, .nb-option-collapsed';

// Lists with at least this many shown options lay out only the ones near the view.
const WINDOWING_THRESHOLD = 100;
// Options shown above and below the view, so scrolling a little shows them at once.
const WINDOW_BUFFER = 20;

interface NbWindowRow {
  option: HTMLElement;
  // The group the option is in, or the list.
  parent: HTMLElement;
  // Space before the option that isn't an option, i.e. its group's title.
  before: number;
  top: number;
  height: number;
}

/**
 * Lays out only the options of a long list that are near its view, so opening, scrolling and searching stay fast with
 * thousands of options. The others are hidden, and the space they take is kept as margins, so the scrollbar, groups
 * and positions stay right. It works from the list's DOM, so it applies to any list of `nb-option`s.
 *
 * Options can differ in height: each one laid out keeps its own, and the others take the average of the first ones
 * laid out until they are. As they are, the option at the top of the view stays where it is.
 */
export class NbOptionListWindowing {
  protected list?: HTMLElement;
  protected inView = new Set<HTMLElement>();
  protected spaced = new Set<HTMLElement>();
  protected rows = new Array<NbWindowRow>();
  // The height of options not laid out yet; zero until the list is laid out.
  protected optionHeight = 0;
  protected heights = new WeakMap<HTMLElement, number>();
  protected width = 0;
  // The option last revealed, and the scroll position the windowing last set.
  protected revealed?: HTMLElement;
  protected scrolledTo = 0;
  // Each of these runs before the browser paints, so updating in them keeps every painted frame consistent; waiting for
  // an animation frame would show a frame with the old window, e.g. an empty list after a jump.
  protected readonly mutations = new MutationObserver(() => this.update());
  // Also reports the list's first size, once it's laid out in the document.
  protected readonly resizes = new ResizeObserver(() => this.resize());
  protected readonly onScroll = () => {
    const list = this.list as HTMLElement;
    // Scrolled by the user, not by revealing an option.
    if (Math.abs(list.scrollTop - this.scrolledTo) >= 1) {
      this.revealed = undefined;
    }
    // A list that stops being long scrolls as it shrinks, e.g. as a search leaves out options.
    if (list.classList.contains('nb-option-list-windowed')) {
      this.render();
    }
  };
  protected readonly onReveal = (event: Event) => this.reveal(event.target as HTMLElement);

  attach(list: HTMLElement) {
    this.list = list;
    list.addEventListener('scroll', this.onScroll, { passive: true });
    list.addEventListener(NB_OPTION_REVEAL_EVENT, this.onReveal);
    // Options added, removed, filtered or hidden change the rows.
    this.mutations.observe(list, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'hidden'] });
    this.resizes.observe(list);
    // Options start hidden, so whatever measures the list before this (e.g. its width) doesn't lay out all of them.
    // Updating hides them again, if the list is long, before anything is measured.
    list.classList.remove('nb-option-list-pending');
    this.update();
    this.mutations.takeRecords();
  }

  detach() {
    this.list?.removeEventListener('scroll', this.onScroll);
    this.list?.removeEventListener(NB_OPTION_REVEAL_EVENT, this.onReveal);
    this.mutations.disconnect();
    this.resizes.disconnect();
    // Options outlive the list (they're the app's content), so they're left as they were for the next list.
    this.apply(new Set(), new Map(), new Map());
    this.list?.querySelectorAll('.nb-option-in-view').forEach((option) => option.classList.remove('nb-option-in-view'));
  }

  /**
   * Shows an option and scrolls it into view, at once.
   */
  reveal(option: HTMLElement) {
    const list = this.list;
    // Options can be revealed before what changes the list reaches it, e.g. the first match of a new search, so it's
    // revealed again as the list changes, until the list is scrolled.
    this.revealed = option;
    if (!list) {
      return;
    }
    if (!list.classList.contains('nb-option-list-windowed')) {
      this.scrollIntoView(option);
      return;
    }
    this.measure();
    if (this.rows.some((row) => row.option === option)) {
      this.render(list.scrollTop, option);
    }
  }

  // A short list lays out all its options, but one can still be out of view, e.g. the active option of a search input,
  // which keeps focus. Only the list scrolls, not the page.
  protected scrollIntoView(option: HTMLElement) {
    const list = this.list as HTMLElement;
    const rect = option.getBoundingClientRect();
    if (!rect.height) {
      return;
    }
    // The first option of a group shows with the group's title.
    const title = option.previousElementSibling?.classList.contains('option-group-title') ? option.previousElementSibling : null;
    const start = title?.getBoundingClientRect().top ?? rect.top;
    const top = list.getBoundingClientRect().top + list.clientTop;
    if (start < top) {
      list.scrollTop += start - top;
    } else if (rect.bottom > top + list.clientHeight) {
      list.scrollTop += rect.bottom - top - list.clientHeight;
    }
    this.scrolledTo = list.scrollTop;
  }

  protected resize() {
    const width = this.list?.clientWidth ?? 0;
    // Options wrap differently at another width, so the heights known are stale.
    if (width !== this.width) {
      this.width = width;
      this.heights = new WeakMap();
    }
    this.update();
  }

  protected update() {
    const list = this.list;
    if (!list) {
      return;
    }
    const rows = this.allRows();
    const hidden = this.hiddenRows();
    if (rows.length - hidden.size < WINDOWING_THRESHOLD) {
      if (list.classList.contains('nb-option-list-windowed')) {
        list.classList.remove('nb-option-list-windowed');
        this.apply(new Set(), new Map(), new Map());
      }
      if (this.revealed && this.isShown(this.revealed)) {
        this.scrollIntoView(this.revealed);
      }
      return;
    }
    list.classList.add('nb-option-list-windowed');
    this.measure(rows, hidden);
    const revealed = this.rows.find((row) => row.option === this.revealed)?.option;
    this.render(list.scrollTop, revealed);
  }

  // Collects the shown options, and the group titles before them.
  protected measure(options = this.allRows(), hidden = this.hiddenRows()) {
    const list = this.list as HTMLElement;
    const rows = new Array<NbWindowRow>();
    let parent: HTMLElement | undefined;
    for (const option of options) {
      if (hidden.has(option)) {
        continue;
      }
      const optionParent = (option.closest('nb-option-group') as HTMLElement | null) ?? list;
      let before = 0;
      if (optionParent !== parent) {
        parent = optionParent;
        if (parent !== list) {
          before = (parent.querySelector('.option-group-title') as HTMLElement | null)?.offsetHeight ?? 0;
        }
      }
      rows.push({ option, parent, before, top: 0, height: 0 });
    }
    this.rows = rows;
    this.place();
  }

  // Works out where each option would be if all were laid out.
  protected place() {
    let top = 0;
    for (const row of this.rows) {
      top += row.before;
      row.top = top;
      row.height = this.heights.get(row.option) ?? this.optionHeight;
      top += row.height;
    }
  }

  /**
   * Shows the options near the view and keeps the space of the hidden ones as margins. Options laid out for the first
   * time can turn out taller or shorter than expected, so it measures them and lays out again, scrolling to keep the
   * option at the top of the view (or the one to reveal) in place.
   */
  protected render(scrollTop = (this.list as HTMLElement).scrollTop, target?: HTMLElement) {
    const list = this.list as HTMLElement;
    // Laid out, though maybe without height: the rows are hidden until there's a window, e.g. as the list gets long.
    if (!this.optionHeight && list.getClientRects().length) {
      this.estimate();
    }
    if (!this.optionHeight || !list.clientHeight) {
      // Not in the document yet: show the first options, as many as a list shows at most, until it's laid out and the
      // resize observer reports its size.
      this.optionHeight = 0;
      this.apply(new Set(this.rows.slice(0, WINDOW_BUFFER * 2).map((row) => row.option)), new Map(), new Map());
      return;
    }
    const anchor = this.rows[this.rowAt(scrollTop)];
    const offset = anchor ? scrollTop - anchor.top : 0;
    const targetRow = target && this.rows.find((row) => row.option === target);
    // Each pass measures the options it lays out, so the next has more of them right; one or two do in practice.
    for (let pass = 0; pass < 4; pass++) {
      if (targetRow) {
        scrollTop = this.scrollFor(targetRow, scrollTop);
      } else if (anchor) {
        scrollTop = Math.max(0, anchor.top + offset);
      }
      this.layOut(scrollTop);
      if (!this.measureInView()) {
        break;
      }
      this.place();
    }
    // Only differences of a pixel or more: browsers round scroll positions, and setting one stops a scroll in progress.
    if (Math.abs(list.scrollTop - scrollTop) >= 1) {
      list.scrollTop = scrollTop;
    }
    this.scrolledTo = list.scrollTop;
  }

  // The height options take until they're laid out: the average of the first ones.
  protected estimate() {
    const sample = this.rows.slice(0, WINDOW_BUFFER * 2).map((row) => row.option);
    this.apply(new Set(sample), new Map(), new Map());
    const heights = sample.map((option) => option.getBoundingClientRect().height);
    // Zero while the options aren't laid out, e.g. hidden with the list.
    this.optionHeight = heights.reduce((sum, height) => sum + height, 0) / heights.length || 0;
    if (this.optionHeight) {
      sample.forEach((option, i) => this.heights.set(option, heights[i]));
      this.place();
    }
  }

  // Records the heights of the options laid out, and tells whether any of them differ from what was expected.
  protected measureInView(): boolean {
    let changed = false;
    // Reads only, after the writes of laying out, so the browser lays the list out once.
    for (const row of this.rows) {
      if (this.inView.has(row.option)) {
        const height = row.option.getBoundingClientRect().height;
        this.heights.set(row.option, height);
        changed ||= Math.abs(height - row.height) >= 0.5;
      }
    }
    return changed;
  }

  // The scroll position nearest to this one that shows the whole row.
  protected scrollFor(row: NbWindowRow, scrollTop: number): number {
    const clientHeight = (this.list as HTMLElement).clientHeight;
    // The first option of a group shows with the group's title.
    if (row.top - row.before < scrollTop) {
      return row.top - row.before;
    }
    if (row.top + row.height > scrollTop + clientHeight) {
      return row.top + row.height - clientHeight;
    }
    return scrollTop;
  }

  protected layOut(scrollTop: number) {
    const list = this.list as HTMLElement;
    const rows = this.rows;
    const first = Math.max(0, this.rowAt(scrollTop) - WINDOW_BUFFER);
    const last = Math.min(rows.length - 1, this.rowAt(scrollTop + list.clientHeight) + WINDOW_BUFFER);
    const window = rows.slice(first, last + 1);
    const shown = new Set(window.map((row) => row.option));

    // A run of hidden options becomes the top margin of the shown option after it, or the end space of its group
    // or list when nothing in it follows.
    const margins = new Map<HTMLElement, number>();
    const paddings = new Map<HTMLElement, number>();
    let hidden = 0;
    let parent: HTMLElement | undefined;
    const closeRun = () => {
      if (hidden && parent) {
        paddings.set(parent, (paddings.get(parent) ?? 0) + hidden);
      }
      hidden = 0;
    };
    for (const row of rows) {
      if (row.parent !== parent) {
        closeRun();
        parent = row.parent;
      }
      if (shown.has(row.option)) {
        if (hidden) {
          margins.set(row.option, hidden);
        }
        hidden = 0;
      } else {
        hidden += row.height;
      }
    }
    closeRun();
    this.apply(shown, margins, paddings);

    // Assistive technology hears the position of each shown option among all of them; in a tree, it's among the
    // options next to it, which the browser works out.
    if (list.getAttribute('role') !== 'listbox') {
      return;
    }
    window.forEach((row, i) => {
      row.option.setAttribute('aria-setsize', String(rows.length));
      row.option.setAttribute('aria-posinset', String(first + i + 1));
    });
  }

  protected apply(shown: Set<HTMLElement>, margins: Map<HTMLElement, number>, paddings: Map<HTMLElement, number>) {
    for (const option of this.inView) {
      if (!shown.has(option)) {
        option.classList.remove('nb-option-in-view');
        option.style.removeProperty('margin-top');
        option.removeAttribute('aria-setsize');
        option.removeAttribute('aria-posinset');
      }
    }
    for (const option of shown) {
      option.classList.add('nb-option-in-view');
      const margin = margins.get(option);
      if (margin) {
        option.style.setProperty('margin-top', `${margin}px`);
      } else {
        option.style.removeProperty('margin-top');
      }
    }
    for (const element of this.spaced) {
      if (!paddings.has(element)) {
        this.setEndSpace(element, 0);
      }
    }
    for (const [element, padding] of paddings) {
      this.setEndSpace(element, padding);
    }
    this.inView = shown;
    this.spaced = new Set(paddings.keys());
    // These are the windowing's own changes, not ones it needs to react to.
    this.mutations.takeRecords();
  }

  // The list scrolls, so its end space is content (see the theme), not padding, which would grow it past its height.
  protected setEndSpace(element: HTMLElement, space: number) {
    const property = element === this.list ? '--nb-option-list-end-space' : 'padding-bottom';
    if (space) {
      element.style.setProperty(property, `${space}px`);
    } else {
      element.style.removeProperty(property);
    }
  }

  // Long lists are scanned on every change, so this uses the browser's cached collections where it can; a list
  // without nested options has only options as rows.
  protected allRows(): HTMLCollectionOf<HTMLElement> | NodeListOf<HTMLElement> {
    const list = this.list as HTMLElement;
    return list.getElementsByClassName('option-nested-row').length
      ? list.querySelectorAll<HTMLElement>(NB_OPTION_ROWS)
      : (list.getElementsByTagName('nb-option') as HTMLCollectionOf<HTMLElement>);
  }

  // The rows hidden by themselves, or by what they're in: walking up from every row is slow in long lists, so it
  // starts from what hides them.
  protected hiddenRows(): Set<Element> {
    const list = this.list as HTMLElement;
    const hidden = new Set<Element>();
    const hiding = [
      ...Array.from(list.getElementsByClassName('filtered')),
      ...Array.from(list.getElementsByClassName('nb-option-collapsed')),
      ...Array.from(list.querySelectorAll('[hidden]')),
    ];
    for (const element of hiding) {
      if (element.tagName === 'NB-OPTION' || element.classList.contains('option-nested-row')) {
        hidden.add(element);
      } else {
        element.querySelectorAll(NB_OPTION_ROWS).forEach((row) => hidden.add(row));
      }
    }
    return hidden;
  }

  protected isShown(row: HTMLElement): boolean {
    const hiddenBy = row.closest(NB_HIDDEN);
    return !hiddenBy || !(this.list as HTMLElement).contains(hiddenBy);
  }

  // The row at an offset from the top of the list.
  protected rowAt(offset: number): number {
    const rows = this.rows;
    let low = 0;
    let high = rows.length - 1;
    while (low < high) {
      const middle = (low + high) >> 1;
      if (rows[middle].top + rows[middle].height <= offset) {
        low = middle + 1;
      } else {
        high = middle;
      }
    }
    return low;
  }
}
