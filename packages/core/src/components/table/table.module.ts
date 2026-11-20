import { NgModule } from '@angular/core';

import { NbTableModule } from '@liquid-js/lyr-core/cdk-table';
import { NbSortDirective, NbSortHeaderComponent, NbSortHeaderIconDirective } from '@liquid-js/lyr-core/tree-grid';
import {
  NbDetailRowComponent,
  NbDetailRowDefDirective,
  NbExpandRowDirective,
  NbNoDataCellDirective,
  NbNoDataRowDirective,
  NbSelectColumnComponent,
  NbTableComponent,
} from './table.component';

const DATA_TABLE = [
  NbTableComponent,
  NbDetailRowDefDirective,
  NbDetailRowComponent,
  NbExpandRowDirective,
  NbNoDataRowDirective,
  NbNoDataCellDirective,
  NbSelectColumnComponent,
  NbSortDirective,
  NbSortHeaderComponent,
  NbSortHeaderIconDirective,
];

/** `nbTable` with its column, row, sort, selection and detail directives. */
@NgModule({
  imports: [NbTableModule, ...DATA_TABLE],
  exports: [NbTableModule, ...DATA_TABLE],
})
export class NbDataTableModule {}
