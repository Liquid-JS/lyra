import { Component, computed, inject, input } from '@angular/core';

import { NgdPaginationService } from '../../../@theme/services';
import { NbCardComponent, NbIconComponent } from '@liquid-js/lyr-core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ngd-pager-block',
  styleUrls: ['./pager-block.component.scss'],
  templateUrl: './pager-block.component.html',
  imports: [NbCardComponent, RouterLink, NbIconComponent],
})
export class NgdPagerBlockComponent {
  private readonly paginationService = inject(NgdPaginationService);

  readonly currentItemSlag = input<string>();

  readonly paginationItem = computed(() => this.getPaginationItem(this.currentItemSlag()));

  getPaginationItem(currentItemSlag?: string) {
    return this.paginationService.getPaginationItem(currentItemSlag);
  }
}
