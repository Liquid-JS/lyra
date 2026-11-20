import { Component, signal } from '@angular/core';
import {
  NbCardComponent,
  NbCardFooterComponent,
  NbPaginationComponent,
  NbTreeGridCellDefDirective,
  NbTreeGridCellDirective,
  NbTreeGridColumnDefDirective,
  NbTreeGridComponent,
  NbTreeGridHeaderCellDefDirective,
  NbTreeGridHeaderCellDirective,
  NbTreeGridHeaderRowComponent,
  NbTreeGridHeaderRowDefDirective,
  NbTreeGridRowComponent,
  NbTreeGridRowDefDirective,
} from '@liquid-js/lyr-core';

interface Invoice {
  number: string;
  customer: string;
  total: string;
}

const customers = ['Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli'];
const invoices: Invoice[] = Array.from({ length: 132 }, (_, i) => ({
  number: `INV-${2001 + i}`,
  customer: customers[i % customers.length],
  total: `€${(((i * 37) % 900) + 100).toFixed(2)}`,
}));

@Component({
  selector: 'nb-pagination-tree-grid',
  templateUrl: './pagination-tree-grid.component.html',
  imports: [
    NbCardComponent,
    NbCardFooterComponent,
    NbPaginationComponent,
    NbTreeGridComponent,
    NbTreeGridRowDefDirective,
    NbTreeGridRowComponent,
    NbTreeGridHeaderRowDefDirective,
    NbTreeGridHeaderRowComponent,
    NbTreeGridColumnDefDirective,
    NbTreeGridHeaderCellDefDirective,
    NbTreeGridHeaderCellDirective,
    NbTreeGridCellDefDirective,
    NbTreeGridCellDirective,
  ],
})
export class PaginationTreeGridComponent {
  readonly columns = ['number', 'customer', 'total'] as const;
  readonly length = invoices.length;
  readonly page = signal(0);
  readonly pageSize = signal(10);
  readonly loading = signal(false);
  readonly rows = signal(this.slice());

  // Stands in for loading a page from a server.
  load() {
    this.loading.set(true);
    setTimeout(() => {
      this.rows.set(this.slice());
      this.loading.set(false);
    }, 500);
  }

  private slice() {
    const start = this.page() * this.pageSize();
    return invoices.slice(start, start + this.pageSize()).map((data) => ({ data }));
  }
}
