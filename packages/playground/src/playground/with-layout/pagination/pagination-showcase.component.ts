import { Component, computed, signal } from '@angular/core';
import {
  NbCardComponent,
  NbCardFooterComponent,
  NbListComponent,
  NbListItemComponent,
  NbPaginationComponent,
} from '@liquid-js/lyr-core';

const orders = Array.from({ length: 57 }, (_, i) => `Order #${1001 + i}`);

@Component({
  selector: 'nb-pagination-showcase',
  templateUrl: './pagination-showcase.component.html',
  imports: [
    NbCardComponent,
    NbCardFooterComponent,
    NbListComponent,
    NbListItemComponent,
    NbPaginationComponent,
  ],
})
export class PaginationShowcaseComponent {
  readonly length = orders.length;
  readonly page = signal(0);
  readonly pageSize = signal(5);
  readonly orders = computed(() => {
    const start = this.page() * this.pageSize();
    return orders.slice(start, start + this.pageSize());
  });
}
