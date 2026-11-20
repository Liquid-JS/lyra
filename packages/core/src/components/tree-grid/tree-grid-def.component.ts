import { Directive, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CdkNoDataRow } from '@angular/cdk/table';
import { ɵNbCdkCellDef as NbCdkCellDef, ɵNbCdkFooterCellDef as NbCdkFooterCellDef, ɵNbCdkFooterRowDef as NbCdkFooterRowDef, ɵNbCdkHeaderCellDef as NbCdkHeaderCellDef, ɵNbCdkHeaderRowDef as NbCdkHeaderRowDef, ɵNbCdkRowDef as NbCdkRowDef } from '@liquid-js/lyr-core/cdk-table';
import { NbCellDefDirective, NbFooterCellDefDirective, NbHeaderCellDefDirective } from '@liquid-js/lyr-core/cdk-table';
import { NbFooterRowDefDirective, NbHeaderRowDefDirective, NbRowDefDirective } from '@liquid-js/lyr-core/cdk-table';
import { NbColumnsService } from './tree-grid-columns.service';

export interface NbTreeGridResponsiveRowDef {
  hideColumn(column: string): void;
  showColumn(column: string): void;
}

/**
 * Defines the data row: its template, and the columns it shows via `nbTreeGridRowDefColumns`.
 */
@Directive({
  selector: '[nbTreeGridRowDef]',
  providers: [{ provide: NbCdkRowDef, useExisting: NbTreeGridRowDefDirective }],
})
export class NbTreeGridRowDefDirective<T> extends NbRowDefDirective<T>
  implements OnChanges, NbTreeGridResponsiveRowDef {
  private readonly columnsService = inject(NbColumnsService);

  /**
   * The names of the columns to show, in order.
   */
  // The CDK table reads the columns as a plain property of its base class, so they stay a decorated input. The input
  // sets all columns; the property then holds the visible ones, which the table renders.
  @Input('nbTreeGridRowDefColumns') override columns: Iterable<string> = [];

  override ngOnChanges(changes: SimpleChanges<this>) {
    super.ngOnChanges(changes);

    if (changes.columns) {
      this.updateColumns(changes.columns.currentValue);
    }
  }

  updateColumns(columns: Iterable<string>) {
    this.columnsService.setColumns(columns);
    this.columns = this.columnsService.getVisibleColumns();
  }

  getVisibleColumns(): Iterable<string> {
    return this.columnsService.getVisibleColumns();
  }

  /** @docs-private */
  hideColumn(column: string) {
    this.columnsService.hideColumn(column);
    this.columns = this.columnsService.getVisibleColumns();
  }

  /** @docs-private */
  showColumn(column: string) {
    this.columnsService.showColumn(column);
    this.columns = this.columnsService.getVisibleColumns();
  }
}

/**
 * Defines the header row: its template, and the columns it shows.
 */
@Directive({
  selector: '[nbTreeGridHeaderRowDef]',
  providers: [{ provide: NbCdkHeaderRowDef, useExisting: NbTreeGridHeaderRowDefDirective }],
})
export class NbTreeGridHeaderRowDefDirective extends NbHeaderRowDefDirective
  implements OnChanges, NbTreeGridResponsiveRowDef {
  private readonly columnsService = inject(NbColumnsService);

  /**
   * The names of the columns to show, in order.
   */
  // The CDK table reads the columns as a plain property of its base class, so they stay a decorated input. The input
  // sets all columns; the property then holds the visible ones, which the table renders.
  @Input('nbTreeGridHeaderRowDef') override columns: Iterable<string> = [];

  override ngOnChanges(changes: SimpleChanges<this>) {
    super.ngOnChanges(changes);

    if (changes.columns) {
      this.updateColumns(changes.columns.currentValue);
    }
  }

  updateColumns(columns: Iterable<string>) {
    this.columnsService.setColumns(columns);
    this.columns = this.columnsService.getVisibleColumns();
  }

  getVisibleColumns(): Iterable<string> {
    return this.columnsService.getVisibleColumns();
  }

  /** @docs-private */
  hideColumn(column: string) {
    this.columnsService.hideColumn(column);
    this.columns = this.columnsService.getVisibleColumns();
  }

  /** @docs-private */
  showColumn(column: string) {
    this.columnsService.showColumn(column);
    this.columns = this.columnsService.getVisibleColumns();
  }
}

/**
 * Defines the footer row: its template, and the columns it shows.
 */
@Directive({
  selector: '[nbTreeGridFooterRowDef]',
  providers: [{ provide: NbCdkFooterRowDef, useExisting: NbTreeGridFooterRowDefDirective }],
})
export class NbTreeGridFooterRowDefDirective extends NbFooterRowDefDirective
  implements OnChanges, NbTreeGridResponsiveRowDef {
  private readonly columnsService = inject(NbColumnsService);

  /**
   * The names of the columns to show, in order.
   */
  // The CDK table reads the columns as a plain property of its base class, so they stay a decorated input. The input
  // sets all columns; the property then holds the visible ones, which the table renders.
  @Input('nbTreeGridFooterRowDef') override columns: Iterable<string> = [];

  override ngOnChanges(changes: SimpleChanges<this>) {
    super.ngOnChanges(changes);

    if (changes.columns) {
      this.updateColumns(changes.columns.currentValue);
    }
  }

  updateColumns(columns: Iterable<string>) {
    this.columnsService.setColumns(columns);
    this.columns = this.columnsService.getVisibleColumns();
  }

  getVisibleColumns(): Iterable<string> {
    return this.columnsService.getVisibleColumns();
  }

  /** @docs-private */
  hideColumn(column: string) {
    this.columnsService.hideColumn(column);
    this.columns = this.columnsService.getVisibleColumns();
  }

  /** @docs-private */
  showColumn(column: string) {
    this.columnsService.showColumn(column);
    this.columns = this.columnsService.getVisibleColumns();
  }
}

/**
 * The template of a column's data cell, inside `nbTreeGridColumnDef`.
 */
@Directive({
  selector: '[nbTreeGridCellDef]',
  providers: [{ provide: NbCdkCellDef, useExisting: NbTreeGridCellDefDirective }],
})
export class NbTreeGridCellDefDirective extends NbCellDefDirective {}

/**
 * The template of a column's header cell, inside `nbTreeGridColumnDef`.
 */
@Directive({
  selector: '[nbTreeGridHeaderCellDef]',
  providers: [{ provide: NbCdkHeaderCellDef, useExisting: NbTreeGridHeaderCellDefDirective }],
})
export class NbTreeGridHeaderCellDefDirective extends NbHeaderCellDefDirective {}

/**
 * The template of a column's footer cell, inside `nbTreeGridColumnDef`.
 */
@Directive({
  selector: '[nbTreeGridFooterCellDef]',
  providers: [{ provide: NbCdkFooterCellDef, useExisting: NbTreeGridFooterCellDefDirective }],
})
export class NbTreeGridFooterCellDefDirective extends NbFooterCellDefDirective {}

/**
 * The row a tree grid shows while it has no rows to show, e.g. no data, or none that matches a filter. Put it on a
 * `tr` with an `nbTreeGridNoDataCell`, which spans the columns:
 *
 * ```html
 * <tr *nbTreeGridNoDataRowDef>
 *   <td nbTreeGridNoDataCell>No orders yet</td>
 * </tr>
 * ```
 */
@Directive({
  selector: 'ng-template[nbTreeGridNoDataRowDef]',
  providers: [{ provide: CdkNoDataRow, useExisting: NbTreeGridNoDataRowDefDirective }],
})
export class NbTreeGridNoDataRowDefDirective extends CdkNoDataRow {
  // The table adds these to the row and its cells as it renders them, so they take the tree grid's styles.
  override _contentClassNames = ['nb-tree-grid-row', 'nb-tree-grid-no-data-row'];
  override _cellClassNames = ['nb-tree-grid-cell', 'nb-tree-grid-no-data-cell'];
}
