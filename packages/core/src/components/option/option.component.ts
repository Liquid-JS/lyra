import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';

// Component class scoped counter for aria attributes.
let lastOptionId = 0;

import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';
import { NbFocusableOption } from '@liquid-js/lyr-core/cdk';
import { ɵNbHighlightableOption as NbHighlightableOption } from '@liquid-js/lyr-core/cdk';
import { NB_SELECT_INJECTION_TOKEN } from '../select/select-injection-tokens';
import { NB_OPTION_REVEAL_EVENT } from './option-reveal';
import { NbCheckboxComponent } from '@liquid-js/lyr-core/checkbox';
import { NbOptionGroupComponent } from './option-group.component';
import { NbOptionNestedComponent } from './option-nested.component';
import { setLevel } from './option-level';
import { NB_OPTION_LIST_ITEM, NbOptionListItem } from './option-list-item';
import { ɵenableTransitionsAfterRender as enableTransitionsAfterRender } from '@liquid-js/lyr-core/base';

/**
 * An option of an `nb-select` or `nb-autocomplete`, with the `value` it selects; its content is its label. A
 * `disabled` option can't be chosen.
 *
 * @styles
 *
 * option-background-color:
 * option-text-color:
 * option-text-font-family:
 * option-hover-background-color:
 * option-hover-text-color:
 * option-active-background-color:
 * option-active-text-color:
 * option-focus-background-color:
 * option-focus-text-color:
 * option-selected-background-color:
 * option-selected-text-color:
 * option-selected-hover-background-color:
 * option-selected-hover-text-color:
 * option-selected-active-background-color:
 * option-selected-active-text-color:
 * option-selected-focus-background-color:
 * option-selected-focus-text-color:
 * option-disabled-background-color:
 * option-disabled-text-color:
 * option-tiny-text-font-size:
 * option-tiny-text-font-weight:
 * option-tiny-text-line-height:
 * option-tiny-padding:
 * option-tiny-padding-inline:
 * option-small-text-font-size:
 * option-small-text-font-weight:
 * option-small-text-line-height:
 * option-small-padding:
 * option-small-padding-inline:
 * option-medium-text-font-size:
 * option-medium-text-font-weight:
 * option-medium-text-line-height:
 * option-medium-padding:
 * option-medium-padding-inline:
 * option-large-text-font-size:
 * option-large-text-font-weight:
 * option-large-text-line-height:
 * option-large-padding:
 * option-large-padding-inline:
 * option-giant-text-font-size:
 * option-giant-text-font-weight:
 * option-giant-text-line-height:
 * option-giant-padding:
 * option-giant-padding-inline:
 **/
@Component({
  selector: 'nb-option',
  styleUrls: ['./option.component.scss'],
  templateUrl: './option.component.html',
  imports: [NbCheckboxComponent],
  providers: [{ provide: NB_OPTION_LIST_ITEM, useExisting: NbOptionComponent }],
  host: {
    tabindex: '-1',
    // A treeitem in a select with nested options, which sets it.
    role: 'option',
    '[attr.id]': 'id',
    '[attr.aria-selected]': 'checkboxChecked()',
    '[attr.aria-disabled]': 'disabled || null',
    '[class.multiple]': 'multiple()',
    '[class.selected]': 'selected()',
    '[class.active]': 'active()',
    '[class.filtered]': 'filtered()',
    '[attr.disabled]': "disabled ? '' : null",
    '(click)': 'onClick($event)',
    '(keydown.space)': 'onClick($event)',
    '(keydown.enter)': 'onClick($event)',
  },
})
export class NbOptionComponent<T = unknown> implements NbFocusableOption, NbHighlightableOption, NbOptionListItem {
  protected readonly elementRef = inject(ElementRef);
  readonly group = inject(NbOptionGroupComponent, { optional: true });
  /**
   * The nested option this one is in.
   */
  readonly parentNested = inject(NbOptionNestedComponent, { optional: true });
  /**
   * How deep it is in its select: 1 at the top, 2 in a nested option, and so on.
   */
  readonly depth: number = (this.parentNested?.depth ?? 0) + 1;
  protected readonly parent = inject(NB_SELECT_INJECTION_TOKEN, { optional: true });

  /**
   * The value the select gets when the option is selected; an option without one clears the selection.
   */
  readonly value = input<T>();

  /**
   * Disables the option. An option in a disabled `nb-option-group` is disabled too.
   */
  readonly disabledInput = input<boolean, NbBooleanInput>(false, { alias: 'disabled', transform: convertToBoolProperty });

  /**
   * Emits the option as it's selected or deselected.
   */
  readonly selectionChange = output<NbOptionComponent<T>>();

  // Emits on click, Enter and Space; the select listens to it.
  protected click$: Subject<NbOptionComponent<T>> = new Subject<NbOptionComponent<T>>();
  get click(): Observable<NbOptionComponent<T>> {
    return this.click$.asObservable();
  }

  protected readonly selectedState = signal(false);

  /**
   * Whether the option is selected.
   */
  readonly selected = this.selectedState.asReadonly();

  protected readonly activeState = signal(false);
  protected readonly active = this.activeState.asReadonly();

  protected alive = true;

  /**
   * Unique id of the element, for ARIA references such as `aria-activedescendant`.
   */
  readonly id: string = `nb-option-${lastOptionId++}`;

  /**
   * In a multiple select, makes this the option that selects all others, or clears them when they're all selected.
   * It acts on the options a search shows, and up to `maxSelections`.
   */
  readonly selectAll = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /**
   * Whether the option is disabled by itself or its group, as opposed to by its select's `maxSelections`.
   */
  readonly ownDisabled = computed(
    () => this.disabledInput() || !!this.group?.disabled() || !!this.parentNested?.isDisabled(),
  );

  // Disabled by itself, by its group, or because its select has as many options selected as it allows.
  protected readonly isDisabled = computed(() => this.ownDisabled() || !!this.parent?.isLimited(this));

  // A select-all option shows whether all, some or none of the options are selected.
  protected readonly checkboxChecked = computed(() =>
    this.selectAll() ? this.parent?.selectAllState() === 'all' : this.selected(),
  );
  protected readonly checkboxIndeterminate = computed(() => this.selectAll() && this.parent?.selectAllState() === 'some');
  // As big as the select's text.
  protected readonly checkboxSize = computed(() => this.parent?.size() ?? 'medium');

  /**
   * Whether the option is in a multiple select.
   */
  readonly multiple = computed(() => !!this.parent?.multiple());

  /**
   * Whether the option shows a checkbox: in a multiple select, unless it clears the selection (`null` is a value in a
   * `nullable` select).
   */
  readonly withCheckbox = computed(
    () =>
      this.multiple() &&
      (this.selectAll() || !(this.parent ? this.parent.isEmptyValue(this.value()) : this.value() == null)),
  );

  constructor() {
    enableTransitionsAfterRender(this.elementRef.nativeElement);

    this.group?.addOption(this);
    for (let nested = this.parentNested; nested; nested = nested.parentNested) {
      nested.addOption(this);
    }
    inject(DestroyRef).onDestroy(() => {
      this.alive = false;
      this.group?.removeOption(this);
      for (let nested = this.parentNested; nested; nested = nested.parentNested) {
        nested.removeOption(this);
      }
    });
  }

  /**
   * Whether the option is disabled: by itself, its group, a nested option it's in, or its select's `maxSelections`.
   * A plain boolean, which the keyboard managers read.
   */
  get disabled(): boolean {
    return this.isDisabled();
  }

  get content() {
    return this.elementRef.nativeElement.textContent;
  }

  get hidden() {
    return this.elementRef.nativeElement.hidden || this.filtered() || this.collapsed;
  }

  protected collapsed = false;
  protected nestedView?: string;

  /**
   * Set by a select with nested options: whether the option is out of view (in a collapsed or drilled-past nested
   * option), and how deep it is in the view, as an item of its tree.
   */
  setNestedView(collapsed: boolean, level: number) {
    // A tree sets this on all its options as it changes, so only the ones that change touch the DOM.
    if (this.nestedView === `${collapsed} ${level}`) {
      return;
    }
    this.nestedView = `${collapsed} ${level}`;
    this.collapsed = collapsed;
    const host = this.elementRef.nativeElement;
    host.setAttribute('role', 'treeitem');
    host.classList.toggle('nb-option-collapsed', collapsed);
    setLevel(host, level);
    host.setAttribute('aria-level', String(level));
  }

  /**
   * Whether a select's search left the option out.
   */
  readonly filtered = signal(false);

  onClick(event: Event) {
    this.click$.next(this);

    // Prevent scroll on space click, etc.
    event.preventDefault();
  }

  select() {
    this.setSelection(true);
  }

  deselect() {
    this.setSelection(false);
  }

  protected setSelection(selected: boolean) {
    // A select keeps a reference to a selected option that was replaced at runtime, and Angular can call writeValue on
    // a destroyed view (angular/angular#27803), so a destroyed option ignores the change rather than throwing.
    if (this.alive && this.selected() !== selected) {
      this.selectedState.set(selected);
      this.selectionChange.emit(this);
    }
  }

  focus() {
    this.reveal();
    this.elementRef.nativeElement.focus();
  }

  getLabel(): string {
    return this.content;
  }

  setActiveStyles() {
    this.reveal();
    this.activeState.set(true);
  }

  // A long option list lays out only the options near its view; it shows and scrolls to this one on request.
  protected reveal() {
    this.parent?.revealNested(this);
    this.elementRef.nativeElement.dispatchEvent(new CustomEvent(NB_OPTION_REVEAL_EVENT, { bubbles: true }));
  }

  setInactiveStyles() {
    this.activeState.set(false);
  }

  getHostElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }
}
