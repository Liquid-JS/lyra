import { Component } from '@angular/core';
import {
  NbBadgeComponent,
  NbCardComponent,
  NbCardHeaderComponent,
  NbComponentStatus,
  NbListComponent,
  NbListItemComponent,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-badge-inline',
  templateUrl: './badge-inline.component.html',
  styleUrls: ['./badge-inline.component.scss'],
  imports: [NbBadgeComponent, NbCardComponent, NbCardHeaderComponent, NbListComponent, NbListItemComponent],
})
export class BadgeInlineComponent {
  readonly orders: { id: number; status: NbComponentStatus; label: string }[] = [
    { id: 1042, status: 'info', label: 'Processing' },
    { id: 1041, status: 'warning', label: 'Awaiting payment' },
    { id: 1040, status: 'success', label: 'Paid' },
    { id: 1039, status: 'danger', label: 'Cancelled' },
  ];
}
