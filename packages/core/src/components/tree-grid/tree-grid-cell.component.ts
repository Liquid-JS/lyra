import { computed, Directive, ElementRef, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { NbLayoutDirectionService } from '@liquid-js/lyr-core/base';
import { NB_WINDOW } from '@liquid-js/lyr-core/base';
import { NbCellDirective, NbFooterCellDirective, NbHeaderCellDirective } from '@liquid-js/lyr-core/cdk-table';
import { ɵNbCdkCell as NbCdkCell, ɵNbCdkFooterCell as NbCdkFooterCell, ɵNbCdkHeaderCell as NbCdkHeaderCell } from '@liquid-js/lyr-core/cdk-table';
import { NB_TREE_GRID } from './tree-grid-injection-tokens';
import { NbTreeGridColumnDefDirective } from './tree-grid-column-def.directive';
import { NB_DEFAULT_ROW_LEVEL } from './data-source/tree-grid.model';

/**
 * A data cell. In the first shown column, a nested row's cell is indented by its level (see the grid's
 * `levelPadding`).
 */
@Directive({
  selector: 'td[nbTreeGridCell]',
  host: {
    '[style.width]': 'columnWidth()',
    '[style.padding-left]': 'leftPadding',
    '[style.padding-right]': 'rightPadding',
    class: 'nb-tree-grid-cell',
    role: 'gridcell',
  },
  providers: [{ provide: NbCdkCell, useExisting: NbTreeGridCellDirective }],
})
export class NbTreeGridCellDirective extends NbCellDirective implements OnInit {
  private readonly window = inject(NB_WINDOW);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly directionService = inject(NbLayoutDirectionService);

  private readonly tree = inject(NB_TREE_GRID);
  private readonly columnDef = inject(NbTreeGridColumnDefDirective);
  private initialLeftPadding = '';
  private initialRightPadding = '';
  readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly columnWidth = computed(() => this.tree.getColumnWidth() || null);

  get leftPadding(): string | SafeStyle | undefined {
    if (this.directionService.isLtr()) {
      return this.getStartPadding();
    }
    return undefined;
  }

  get rightPadding(): string | SafeStyle | undefined {
    if (this.directionService.isRtl()) {
      return this.getStartPadding();
    }
    return undefined;
  }

  ngOnInit() {
    if (this.window) {
      const style = this.window.getComputedStyle(this.elementRef.nativeElement);
      this.initialLeftPadding = style.paddingLeft;
      this.initialRightPadding = style.paddingRight;
    }
  }

  toggleRow() {
    this.tree.toggleCellRow(this);
  }

  private get initialStartPadding(): string {
    return this.directionService.isLtr()
      ? this.initialLeftPadding
      : this.initialRightPadding;
  }

  private getStartPadding(): string | SafeStyle | undefined {
    const rowLevel = this.tree.getCellLevel(this, this.columnDef.name);
    if (rowLevel === NB_DEFAULT_ROW_LEVEL) {
      return undefined;
    }

    const nestingLevel = rowLevel + 1;
    let padding = '';
    if (this.tree.levelPadding()) {
      padding = `calc(${this.tree.levelPadding()} * ${nestingLevel})`;
    } else if (this.initialStartPadding) {
      padding = `calc(${this.initialStartPadding} * ${nestingLevel})`;
    }

    if (!padding) {
      return undefined;
    }

    return this.sanitizer.bypassSecurityTrustStyle(padding);
  }
}

@Directive({
  selector: 'th[nbTreeGridHeaderCell]',
  host: {
    '[style.width]': 'columnWidth()',
    class: 'nb-tree-grid-header-cell',
    role: 'columnheader',
  },
  providers: [{ provide: NbCdkHeaderCell, useExisting: NbTreeGridHeaderCellDirective }],
})
export class NbTreeGridHeaderCellDirective extends NbHeaderCellDirective {

  private readonly tree = inject(NB_TREE_GRID);

  readonly columnWidth = computed(() => this.tree.getColumnWidth() || null);
}

@Directive({
  selector: 'td[nbTreeGridFooterCell]',
  host: {
    '[style.width]': 'columnWidth()',
    class: 'nb-tree-grid-footer-cell',
    role: 'gridcell',
  },
  providers: [{ provide: NbCdkFooterCell, useExisting: NbTreeGridFooterCellDirective }],
})
export class NbTreeGridFooterCellDirective extends NbFooterCellDirective {

  private readonly tree = inject(NB_TREE_GRID);

  readonly columnWidth = computed(() => this.tree.getColumnWidth() || null);
}

/**
 * The cell of a tree grid's no-data row (`nbTreeGridNoDataRowDef`), across the columns it shows.
 */
@Directive({
  selector: 'td[nbTreeGridNoDataCell]',
  host: {
    '[attr.colspan]': 'tree.getColumnsCount()',
  },
})
export class NbTreeGridNoDataCellDirective {
  protected readonly tree = inject(NB_TREE_GRID);
}
