import { ChangeDetectionStrategy, Component, ElementRef, inject, input, OnDestroy } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ɵNbCdkFooterRow as NbCdkFooterRow, ɵNbCdkHeaderRow as NbCdkHeaderRow, ɵNbCdkRow as NbCdkRow } from '@liquid-js/lyr-core/cdk-table';
import { NbFooterRowComponent, NbHeaderRowComponent, NbRowComponent, NbCellOutletDirective } from '@liquid-js/lyr-core/cdk-table';
import { NB_TREE_GRID } from './tree-grid-injection-tokens';
import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';

export const NB_ROW_DOUBLE_CLICK_DELAY: number = 200;

/**
 * A data row. A click toggles it and a double click toggles it with all its descendants, unless `clickToToggle` is
 * off.
 */
@Component({
  selector: 'tr[nbTreeGridRow]',
  template: `<ng-container nbCellOutlet />`,
  host: {
    class: 'nb-tree-grid-row',
    role: 'row',
    '(click)': 'toggleIfEnabledNode()',
    '(dblclick)': 'toggleIfEnabledNodeDeep()',
  },
  providers: [{ provide: NbCdkRow, useExisting: NbTreeGridRowComponent }],
  // As in the CDK table, rows and the cells rendered into them are checked on every change detection.
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NbCellOutletDirective],
})
export class NbTreeGridRowComponent extends NbRowComponent implements OnDestroy {
  readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  private readonly doubleClick$ = new Subject<void>();
  private readonly tree = inject(NB_TREE_GRID);

  /**
   * How long a click waits for a second one, in ms, before it toggles the row; a double click within that time
   * toggles the row deeply instead. 200 by default.
   */
  readonly doubleClickDelay = input<number>(NB_ROW_DOUBLE_CLICK_DELAY);

  /**
   * Whether clicks toggle the row.
   */
  readonly clickToToggle = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty });

  toggleIfEnabledNode() {
    if (!this.clickToToggle()) {
      return;
    }

    timer(this.doubleClickDelay())
      .pipe(take(1), takeUntil(this.doubleClick$))
      .subscribe(() => this.tree.toggleRow(this));
  }

  toggleIfEnabledNodeDeep() {
    if (!this.clickToToggle()) {
      return;
    }

    this.doubleClick$.next();
    this.tree.toggleRow(this, { deep: true });
  }

  ngOnDestroy() {
    this.doubleClick$.complete();
  }
}

@Component({
  selector: 'tr[nbTreeGridHeaderRow]',
  template: ` <ng-container nbCellOutlet />`,
  host: {
    class: 'nb-tree-grid-header-row',
    role: 'row',
  },
  providers: [{ provide: NbCdkHeaderRow, useExisting: NbTreeGridHeaderRowComponent }],
  // As in the CDK table, rows and the cells rendered into them are checked on every change detection.
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NbCellOutletDirective],
})
export class NbTreeGridHeaderRowComponent extends NbHeaderRowComponent {}

@Component({
  selector: 'tr[nbTreeGridFooterRow]',
  template: ` <ng-container nbCellOutlet />`,
  host: {
    class: 'nb-tree-grid-footer-row',
    role: 'row',
  },
  providers: [{ provide: NbCdkFooterRow, useExisting: NbTreeGridFooterRowComponent }],
  // As in the CDK table, rows and the cells rendered into them are checked on every change detection.
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NbCellOutletDirective],
})
export class NbTreeGridFooterRowComponent extends NbFooterRowComponent {}
