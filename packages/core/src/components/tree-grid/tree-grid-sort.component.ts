import {
  Component,
  computed,
  contentChild,
  Directive,
  inject,
  input,
  model,
  output,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput, ɵNbNullableInput as NbNullableInput } from '@liquid-js/lyr-core/base';
import { NB_SORT_HEADER_COLUMN_DEF } from '@liquid-js/lyr-core/cdk-table';

import { NbIconComponent } from '@liquid-js/lyr-core/icon';

/** The column definition of an `NbSortHeaderComponent`. */
interface NbSortHeaderColumnDef {
  name: string;
}

export interface NbSortRequest {
  column: string;
  direction: NbSortDirection;
}

export interface NbSortable {
  sort(sortRequest: NbSortRequest): void;
}

/** Something sorted that also tells how, such as a table's data source, so its sort headers show it. */
export interface NbSortState {
  sortBy(sortRequest: NbSortRequest): void;
  /** The direction a column is sorted in. */
  sortDirection(column: string): NbSortDirection;
}

export type NbSortDirectionValues = 'asc' | 'desc' | '';
export enum NbSortDirection {
  ASCENDING = 'asc',
  DESCENDING = 'desc',
  NONE = '',
}
const sortDirections: NbSortDirection[] = [NbSortDirection.ASCENDING, NbSortDirection.DESCENDING, NbSortDirection.NONE];

/**
 * On the table: when one of its `nbSortHeader` cells is clicked, sorts what it's given (`sortBy` or `sort`, e.g. the
 * tree grid's data source) and emits `sort`. A data source that tells its direction also drives the headers' icons.
 */
@Directive({ selector: '[nbSort]' })
export class NbSortDirective {
  readonly sortable = input<NbSortable | NbSortState, NbSortable | NbSortState | NbNullableInput>(undefined, {
    alias: 'nbSort',
    transform: (sortable: NbSortable | NbSortState | NbNullableInput) =>
      (sortable || undefined) as NbSortable | NbSortState,
  });

  /** The direction a column is sorted in, when what's sorted tells it. */
  directionOf(column: string): NbSortDirection | undefined {
    const sortable = this.sortable();
    return sortable && 'sortDirection' in sortable ? sortable.sortDirection(column) : undefined;
  }

  readonly sort = output<NbSortRequest>();

  emitSort(sortRequest: NbSortRequest) {
    const sortable = this.sortable();
    if (sortable && 'sortBy' in sortable) {
      sortable.sortBy(sortRequest);
    } else if (sortable && sortable.sort) {
      sortable.sort(sortRequest);
    }
    this.sort.emit(sortRequest);
  }
}

export interface NbSortHeaderIconDirectiveContext {
  $implicit: NbSortDirection;
  isAscending: boolean;
  isDescending: boolean;
  isNone: boolean;
}

/**
 * A custom sort icon, as a structural directive inside `nbSortHeader`. The template's implicit context is the current
 * direction; the context also has `isAscending`, `isDescending` and `isNone`.
 */
@Directive({ selector: '[nbSortHeaderIcon]' })
export class NbSortHeaderIconDirective {}

@Component({
  selector: 'nb-sort-icon',
  templateUrl: './sort-icon.component.html',
  imports: [NbIconComponent],
})
export class NbSortIconComponent {
  readonly direction = input<NbSortDirection | NbSortDirectionValues | undefined>(NbSortDirection.NONE);

  readonly isAscending = computed(() => this.direction() === NbSortDirection.ASCENDING);

  readonly isDescending = computed(() => this.direction() === NbSortDirection.DESCENDING);

  readonly isDirectionSet = computed(() => this.isAscending() || this.isDescending());
}

/**
 * A header cell that sorts its column. Each click cycles the direction, ascending, descending, none, and the table's
 * `nbSort` directive sorts and emits. The cell is a button, so the keyboard reaches it, and it carries `aria-sort`.
 */
@Component({
  selector: '[nbSortHeader]',
  templateUrl: './sort-header.component.html',
  imports: [NbSortIconComponent, NgTemplateOutlet],
  host: {
    '[class.disabled]': 'disabled()',
    '[attr.aria-sort]': 'ariaSort()',
    '(click)': 'sortIfEnabled()',
  },
})
export class NbSortHeaderComponent {
  private readonly sort = inject(NbSortDirective);
  private readonly columnDef = inject<NbSortHeaderColumnDef>(NB_SORT_HEADER_COLUMN_DEF);

  readonly sortIcon = contentChild(NbSortHeaderIconDirective, { read: TemplateRef<NbSortHeaderIconDirectiveContext> });

  /**
   * Current sort direction. Possible values: `asc`, `desc`, ``(none). It supports two-way binding with
   * `[(nbSortHeader)]`, and changes when the header sorts.
   */
  readonly direction = model<NbSortDirection | NbSortDirectionValues | undefined>(undefined, { alias: 'nbSortHeader' });

  readonly disabled = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  sortIfEnabled() {
    if (!this.disabled()) {
      this.sortData();
    }
  }

  /** The direction shown: what's sorted tells it, e.g. a table's data source, or else `direction`. */
  readonly shownDirection = computed(() => this.sort.directionOf(this.columnDef.name) ?? this.direction());

  readonly isAscending = computed(() => this.shownDirection() === NbSortDirection.ASCENDING);

  readonly isDescending = computed(() => this.shownDirection() === NbSortDirection.DESCENDING);

  /** For assistive technologies, on the sorted column's header cell only. */
  protected readonly ariaSort = computed(() =>
    this.isAscending() ? 'ascending' : this.isDescending() ? 'descending' : null,
  );

  sortData() {
    const sortRequest = this.createSortRequest();
    this.sort.emitSort(sortRequest);
  }

  readonly iconContext = computed<NbSortHeaderIconDirectiveContext>(() => ({
    $implicit: this.shownDirection() as NbSortDirection,
    isAscending: this.isAscending(),
    isDescending: this.isDescending(),
    isNone: !this.isAscending() && !this.isDescending(),
  }));

  readonly disabledAttributeValue = computed<'' | undefined>(() => (this.disabled() ? '' : undefined));

  private createSortRequest(): NbSortRequest {
    const direction = this.getNextDirection();
    this.direction.set(direction);
    return { direction, column: this.columnDef.name };
  }

  private getNextDirection(): NbSortDirection {
    const sortDirectionCycle = sortDirections;
    let nextDirectionIndex = sortDirectionCycle.indexOf(this.shownDirection() as NbSortDirection) + 1;
    if (nextDirectionIndex >= sortDirectionCycle.length) {
      nextDirectionIndex = 0;
    }
    return sortDirectionCycle[nextDirectionIndex];
  }
}
