import { Component, Directive, Input, ChangeDetectionStrategy, input } from '@angular/core';
import { NbTableRowContext, NbTableRowsOf } from './cell';
import {
  CdkFooterRow,
  CdkFooterRowDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkRow,
  CdkRowDef,
  CdkCellOutlet,
  DataRowOutlet,
  HeaderRowOutlet,
  FooterRowOutlet,
  NoDataRowOutlet,
} from '@angular/cdk/table';

@Directive({
  selector: '[nbRowOutlet]',
  providers: [{ provide: DataRowOutlet, useExisting: NbDataRowOutletDirective }],
})
export class NbDataRowOutletDirective extends DataRowOutlet {}

@Directive({
  selector: '[nbHeaderRowOutlet]',
  providers: [{ provide: HeaderRowOutlet, useExisting: NbHeaderRowOutletDirective }],
})
export class NbHeaderRowOutletDirective extends HeaderRowOutlet {}

@Directive({
  selector: '[nbFooterRowOutlet]',
  providers: [{ provide: FooterRowOutlet, useExisting: NbFooterRowOutletDirective }],
})
export class NbFooterRowOutletDirective extends FooterRowOutlet {}

@Directive({
  selector: '[nbNoDataRowOutlet]',
  providers: [{ provide: NoDataRowOutlet, useExisting: NbNoDataRowOutletDirective }],
})
export class NbNoDataRowOutletDirective extends NoDataRowOutlet {}

@Directive({
  selector: '[nbCellOutlet]',
  providers: [{ provide: CdkCellOutlet, useExisting: NbCellOutletDirective }],
})
export class NbCellOutletDirective extends CdkCellOutlet {}

/**
 * The header row's template and the columns it shows, by name: `<tr nbHeaderRow *nbHeaderRowDef="columns">`.
 * `sticky` keeps it in view as the table scrolls.
 */
@Directive({
  selector: '[nbHeaderRowDef]',
  providers: [{ provide: CdkHeaderRowDef, useExisting: NbHeaderRowDefDirective }],
})
export class NbHeaderRowDefDirective extends CdkHeaderRowDef {
  // The CDK table reads these as plain properties of its base class, so they stay decorated inputs.
  private _hasStickyRowChanged = false;

  @Input('nbHeaderRowDef') override columns: Iterable<string> = [];
  @Input('nbHeaderRowDefSticky')
  override get sticky(): boolean {
    return this._stickyRow;
  }
  override set sticky(value: boolean) {
    if (value !== this._stickyRow) {
      this._stickyRow = value;
      this._hasStickyRowChanged = true;
    }
  }
  private _stickyRow = false;

  /** Whether `sticky` changed since last asked; asking resets it. */
  override hasStickyChanged(): boolean {
    const hasStickyChanged = this._hasStickyRowChanged;
    this.resetStickyChanged();
    return hasStickyChanged;
  }

  override resetStickyChanged() {
    this._hasStickyRowChanged = false;
  }
}

/**
 * The footer row's template and the columns it shows, by name: `<tr nbFooterRow *nbFooterRowDef="columns">`.
 * `sticky` keeps it in view as the table scrolls.
 */
@Directive({
  selector: '[nbFooterRowDef]',
  providers: [{ provide: CdkFooterRowDef, useExisting: NbFooterRowDefDirective }],
})
export class NbFooterRowDefDirective extends CdkFooterRowDef {
  // The CDK table reads these as plain properties of its base class, so they stay decorated inputs.
  private _hasStickyRowChanged = false;

  @Input('nbFooterRowDef') override columns: Iterable<string> = [];
  @Input('nbFooterRowDefSticky')
  override get sticky(): boolean {
    return this._stickyRow;
  }
  override set sticky(value: boolean) {
    if (value !== this._stickyRow) {
      this._stickyRow = value;
      this._hasStickyRowChanged = true;
    }
  }
  private _stickyRow = false;

  /** Whether `sticky` changed since last asked; asking resets it. */
  override hasStickyChanged(): boolean {
    const hasStickyChanged = this._hasStickyRowChanged;
    this.resetStickyChanged();
    return hasStickyChanged;
  }

  override resetStickyChanged() {
    this._hasStickyRowChanged = false;
  }
}

/**
 * A data row's template and the columns it shows, by name: `<tr nbRow *nbRowDef="let row; columns: columns">`.
 * With several row definitions, `when` picks the rows each one renders; the one without `when` renders the rest.
 */
@Directive({
  selector: '[nbRowDef]',
  // `when` has no value until it's bound (the CDK table tells the default row by its missing `when`), so it can't be
  // redeclared with an initialiser; it's bound to the inherited property here instead.
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: [{ name: 'when', alias: 'nbRowDefWhen' }],
  providers: [{ provide: CdkRowDef, useExisting: NbRowDefDirective }],
})
export class NbRowDefDirective<T> extends CdkRowDef<T> {
  // The CDK table reads these as plain properties of its base class, so they stay decorated inputs.
  @Input('nbRowDefColumns') override columns: Iterable<string> = [];

  /** Where the rows come from, for the row's type in the template only: `*nbRowDef="let user; of: source; …"`. */
  readonly of = input<NbTableRowsOf<T> | undefined>(undefined, { alias: 'nbRowDefOf' });

  static ngTemplateContextGuard<T>(
    _directive: NbRowDefDirective<T>,
    _context: unknown,
  ): _context is NbTableRowContext<T> {
    return true;
  }
}

/** A header row, rendering its cells into its outlet, with the `nb-header-row` class and the `row` role. */
@Component({
  selector: 'nb-header-row, tr[nbHeaderRow]',
  template: ` <ng-container nbCellOutlet />`,
  host: {
    class: 'nb-header-row',
    role: 'row',
  },
  providers: [{ provide: CdkHeaderRow, useExisting: NbHeaderRowComponent }],
  // As in the CDK table, rows and the cells rendered into them are checked on every change detection.
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NbCellOutletDirective],
})
export class NbHeaderRowComponent extends CdkHeaderRow {}

/** A footer row, rendering its cells into its outlet, with the `nb-footer-row` class and the `row` role. */
@Component({
  selector: 'nb-footer-row, tr[nbFooterRow]',
  template: ` <ng-container nbCellOutlet />`,
  host: {
    class: 'nb-footer-row',
    role: 'row',
  },
  providers: [{ provide: CdkFooterRow, useExisting: NbFooterRowComponent }],
  // As in the CDK table, rows and the cells rendered into them are checked on every change detection.
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NbCellOutletDirective],
})
export class NbFooterRowComponent extends CdkFooterRow {}

/** A data row, rendering its cells into its outlet, with the `nb-row` class and the `row` role. */
@Component({
  selector: 'nb-row, tr[nbRow]',
  template: ` <ng-container nbCellOutlet />`,
  host: {
    class: 'nb-row',
    role: 'row',
  },
  providers: [{ provide: CdkRow, useExisting: NbRowComponent }],
  // As in the CDK table, rows and the cells rendered into them are checked on every change detection.
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NbCellOutletDirective],
})
export class NbRowComponent extends CdkRow {}
