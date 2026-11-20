import { Component, computed, ElementRef, inject, input, model, signal, Signal, viewChild } from '@angular/core';

import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';
import { NbIconComponent } from '@liquid-js/lyr-core/icon';
import { NB_SELECT_INJECTION_TOKEN } from '../select/select-injection-tokens';
import { NB_OPTION_LIST_ITEM, NbOptionListItem } from './option-list-item';
import { NbOptionGroupComponent } from './option-group.component';
import { NB_OPTION_REVEAL_EVENT } from './option-reveal';
import { setLevel } from './option-level';

let lastOptionNestedId = 0;

// What a nested option needs of the options in it; importing them here would be circular.
interface NbNestedChildOption {
  filtered: Signal<boolean>;
  selected: Signal<boolean>;
}

/**
 * Options in a `nb-select` that open from a row, as a tree. Only the options in them are selected, not the nested
 * options themselves. Nested options can hold more nested options, and sit in groups.
 *
 * ```html
 * <nb-select placeholder="Import from">
 *   <nb-option value="local">This device</nb-option>
 *   <nb-option-nested title="Cloud">
 *     <nb-option value="drive">Google Drive</nb-option>
 *     <nb-option-nested title="Object storage">
 *       <nb-option value="s3">AWS S3</nb-option>
 *     </nb-option-nested>
 *   </nb-option-nested>
 * </nb-select>
 * ```
 *
 * A row opens and closes on click, Enter or Space; ArrowRight opens it, or moves into it when it's open, and ArrowLeft
 * closes it or moves to its parent. The list shows up to `nestedLevels` levels of the select at once (3 by default):
 * opening a deeper one drills in, so the list starts at a nested option, with a row to go back. A collapsed row shows
 * when an option in it is selected, and opens to show an option that becomes active, e.g. the selected one as the
 * list opens. A search shows the matching options with the nested options they're in.
 *
 * @styles
 *
 * option-nested-icon-color:
 * option-nested-selected-text-color:
 * option-nested-tiny-indent:
 * option-nested-small-indent:
 * option-nested-medium-indent:
 * option-nested-large-indent:
 * option-nested-giant-indent:
 */
@Component({
  selector: 'nb-option-nested',
  templateUrl: './option-nested.component.html',
  styleUrls: ['./option-nested.component.scss'],
  imports: [NbIconComponent],
  providers: [{ provide: NB_OPTION_LIST_ITEM, useExisting: NbOptionNestedComponent }],
  host: {
    tabindex: '-1',
    role: 'treeitem',
    '[attr.id]': 'id',
    '[attr.aria-labelledby]': 'titleId',
    '[attr.aria-disabled]': 'disabled || null',
    '[attr.disabled]': "disabled ? '' : null",
    '[class.active]': 'active()',
    '[class.filtered]': 'filtered()',
    '[class.has-selected]': 'hasSelected()',
  },
})
export class NbOptionNestedComponent implements NbOptionListItem {
  protected readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly select = inject(NB_SELECT_INJECTION_TOKEN, { optional: true });
  readonly group = inject(NbOptionGroupComponent, { optional: true });
  /**
   * The nested option this one is in.
   */
  readonly parentNested = inject(NbOptionNestedComponent, { optional: true, skipSelf: true });

  readonly id = `nb-option-nested-${lastOptionNestedId++}`;
  protected readonly titleId = `${this.id}-title`;
  protected readonly groupId = `${this.id}-group`;
  protected readonly row = viewChild.required<ElementRef<HTMLElement>>('row');

  /**
   * How deep it is in the select: 1 for a nested option at the top.
   */
  readonly depth: number = (this.parentNested?.depth ?? 0) + 1;

  readonly title = input<string>();

  /**
   * Disables the nested option and the options in it.
   */
  readonly disabledInput = input<boolean, NbBooleanInput>(false, { alias: 'disabled', transform: convertToBoolProperty });

  /**
   * Whether its options show.
   */
  readonly expanded = model(false);

  /**
   * Whether it's disabled by itself, a group or a nested option it's in.
   */
  readonly isDisabled: Signal<boolean> = computed(
    () => this.disabledInput() || !!this.group?.disabled() || !!this.parentNested?.isDisabled(),
  );

  // Options register themselves with every nested option they're in.
  protected readonly options = signal(new Array<NbNestedChildOption>());
  protected readonly filtered = computed(() => {
    const options = this.options();
    return options.length > 0 && options.every((option) => option.filtered());
  });
  protected readonly hasSelected = computed(() => this.options().some((option) => option.selected()));
  protected readonly activeState = signal(false);
  protected readonly active = this.activeState.asReadonly();
  protected readonly multiple = computed(() => !!this.select?.multiple());
  protected collapsed = false;

  get disabled(): boolean {
    return this.isDisabled();
  }

  get hidden(): boolean {
    return this.filtered() || this.collapsed;
  }

  addOption(option: NbNestedChildOption) {
    this.options.update((options) => [...options, option]);
  }

  removeOption(option: NbNestedChildOption) {
    this.options.update((options) => options.filter((existing) => existing !== option));
  }

  /**
   * Set by its select: whether its row is out of view (in a collapsed or drilled-past nested option), how deep it is
   * in the view, whether its options show (it's expanded, or a search shows them), and whether the list is drilled
   * into it or a nested option in it, so only its options show.
   */
  setNestedView(collapsed: boolean, level: number, open: boolean, drilledInto: boolean) {
    this.collapsed = collapsed;
    const host = this.elementRef.nativeElement;
    host.classList.toggle('expanded', open);
    host.setAttribute('aria-expanded', String(open));
    const row = this.row().nativeElement;
    row.classList.toggle('nb-option-collapsed', collapsed);
    setLevel(row, level);
    host.setAttribute('aria-level', String(level));
    // Its row is the list's back row then, and its options are at the top of the tree.
    host.setAttribute('role', drilledInto ? 'none' : 'treeitem');
    host.querySelector(`#${this.groupId}`)?.setAttribute('role', drilledInto ? 'none' : 'group');
  }

  getHostElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  /**
   * The row with its title, which shows in the list; the element holds the options in it too.
   */
  getRowElement(): HTMLElement {
    return this.row().nativeElement;
  }

  getLabel(): string {
    return this.title() ?? '';
  }

  focus() {
    // The list scrolls to its row; the element holds the options in it too, so scrolling to it could scroll past it.
    this.reveal();
    this.elementRef.nativeElement.focus({ preventScroll: true });
  }

  setActiveStyles() {
    this.reveal();
    this.activeState.set(true);
  }

  setInactiveStyles() {
    this.activeState.set(false);
  }

  protected toggle(event: Event) {
    event.stopPropagation();
    if (!this.disabled) {
      this.select?.toggleNested(this);
    }
  }

  protected reveal() {
    this.select?.revealNested(this);
    this.row().nativeElement.dispatchEvent(new CustomEvent(NB_OPTION_REVEAL_EVENT, { bubbles: true }));
  }
}
