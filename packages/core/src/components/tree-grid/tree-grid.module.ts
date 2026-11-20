import { NgModule } from '@angular/core';

import { NbTableModule } from '@liquid-js/lyr-core/cdk-table';
import { NbIconModule } from '@liquid-js/lyr-core/icon';
import { NbTreeGridComponent } from './tree-grid.component';
import {
  NbTreeGridCellDefDirective,
  NbTreeGridFooterCellDefDirective,
  NbTreeGridFooterRowDefDirective,
  NbTreeGridHeaderCellDefDirective,
  NbTreeGridHeaderRowDefDirective,
  NbTreeGridNoDataRowDefDirective,
  NbTreeGridRowDefDirective,
} from './tree-grid-def.component';
import {
  NbTreeGridFooterRowComponent,
  NbTreeGridHeaderRowComponent,
  NbTreeGridRowComponent,
} from './tree-grid-row.component';
import {
  NbTreeGridCellDirective,
  NbTreeGridFooterCellDirective,
  NbTreeGridHeaderCellDirective,
  NbTreeGridNoDataCellDirective,
} from './tree-grid-cell.component';
import {
  NbSortDirective,
  NbSortHeaderComponent,
  NbSortHeaderIconDirective,
  NbSortIconComponent,
} from './tree-grid-sort.component';
import { NbFilterDirective, NbFilterInputDirective } from './tree-grid-filter';
import { NbTreeGridRowToggleDirective } from './tree-grid-row-toggle.directive';
import { NbTreeGridColumnDefDirective } from './tree-grid-column-def.directive';
import { NbTreeGridRowToggleComponent } from './tree-grid-row-toggle.component';

const COMPONENTS = [
  // Tree Grid
  NbTreeGridComponent,

  NbTreeGridRowDefDirective,
  NbTreeGridRowComponent,
  NbTreeGridCellDefDirective,
  NbTreeGridCellDirective,

  NbTreeGridHeaderRowDefDirective,
  NbTreeGridHeaderRowComponent,
  NbTreeGridHeaderCellDefDirective,
  NbTreeGridHeaderCellDirective,

  NbTreeGridFooterRowDefDirective,
  NbTreeGridFooterRowComponent,
  NbTreeGridFooterCellDefDirective,
  NbTreeGridFooterCellDirective,

  NbTreeGridColumnDefDirective,

  NbTreeGridNoDataRowDefDirective,
  NbTreeGridNoDataCellDirective,

  // Sort directives
  NbSortDirective,
  NbSortHeaderComponent,
  NbSortIconComponent,

  // Filter directives
  NbFilterDirective,
  NbFilterInputDirective,

  NbTreeGridRowToggleDirective,
  NbTreeGridRowToggleComponent,
  NbSortHeaderIconDirective,
];

@NgModule({
  imports: [NbTableModule, NbIconModule, ...COMPONENTS],
  exports: [NbTableModule, ...COMPONENTS],
})
export class NbTreeGridModule {}
