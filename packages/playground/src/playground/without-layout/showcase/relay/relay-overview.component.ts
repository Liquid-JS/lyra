import { DatePipe, DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  NbButtonComponent,
  NbCardBodyComponent,
  NbCardComponent,
  NbCardHeaderComponent,
  NbIconComponent,
  NbListComponent,
  NbListItemComponent,
  NbProgressBarComponent,
  NbTagComponent,
} from '@liquid-js/lyr-core';
import { NbChartSeries, NbLineChartComponent } from '@liquid-js/lyr-extras/chart';

import { CONSOLE_STATS, DELIVERIES, DELIVERY_HOURS, DELIVERY_STATUS, ENDPOINTS, EVENTS, FAILED } from './relay-data';

/** The console's overview: the day's numbers, deliveries by the hour, what failed last, and each endpoint's health. */
@Component({
  selector: 'npg-relay-overview',
  templateUrl: './relay-overview.component.html',
  styleUrls: ['./relay-overview.component.scss'],
  imports: [
    DatePipe,
    DecimalPipe,
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbIconComponent,
    NbLineChartComponent,
    NbListComponent,
    NbListItemComponent,
    NbProgressBarComponent,
    NbTagComponent,
    RouterLink,
  ],
})
export class RelayOverviewComponent {
  readonly stats = CONSOLE_STATS;
  readonly hours = DELIVERY_HOURS;
  readonly series: NbChartSeries[] = [
    { name: 'Delivered', data: DELIVERIES },
    { name: 'Failed', data: FAILED, status: 'danger' },
  ];
  readonly failures = EVENTS.filter((event) => event.status !== 'delivered').slice(0, 5);
  readonly status = DELIVERY_STATUS;
  readonly endpoints = ENDPOINTS;

  /** A rate's colour: fine, worth a look, or a problem. */
  health(rate: number): 'success' | 'warning' | 'danger' {
    return rate >= 99 ? 'success' : rate >= 95 ? 'warning' : 'danger';
  }
}
