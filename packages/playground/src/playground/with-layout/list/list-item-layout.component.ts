import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { NbButtonModule, NbCardModule, NbIconModule, NbListModule } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-list-item-layout',
  templateUrl: './list-item-layout.component.html',
  imports: [RouterLink, NbCardModule, NbListModule, NbIconModule, NbButtonModule],
})
export class ListItemLayoutComponent {
  readonly invoices = [
    { id: '1042', due: '1 March', amount: '$120.00', paid: false },
    { id: '1041', due: '1 February', amount: '$120.00', paid: true },
    { id: '1040', due: '1 January', amount: '$95.50', paid: true },
  ];

  readonly invoiceId = toSignal(inject(ActivatedRoute).queryParamMap.pipe(map((params) => params.get('invoice'))));
  readonly opened = computed(() => this.invoiceId() ?? 'none');
  readonly paying = signal('none');
}
