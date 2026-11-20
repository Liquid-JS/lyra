import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  NbBadgeComponent,
  NbButtonComponent,
  NbCardBodyComponent,
  NbCardComponent,
  NbCardHeaderComponent,
  NbComponentStatus,
  NbIconComponent,
  NbListComponent,
  NbListItemComponent,
  NbOptionComponent,
  NbProgressBarComponent,
  NbSelectComponent,
  NbUserComponent,
} from '@liquid-js/lyr-core';
import { NbChartSeries, NbLineChartComponent, NbPieChartComponent } from '@liquid-js/lyr-extras/chart';

import { EVENTS, ORDER_STATUS, ORDERS, photoOf, TOP_PRODUCTS } from './saas-data';

interface Stat {
  title: string;
  value: string;
  change: number;
}

/** A SaaS dashboard: key numbers, revenue over time, top products, a target, events and the latest orders. */
@Component({
  selector: 'npg-saas-dashboard',
  templateUrl: './saas-dashboard.component.html',
  styleUrls: ['./saas-dashboard.component.scss'],
  imports: [
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    NbBadgeComponent,
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbIconComponent,
    NbLineChartComponent,
    NbListComponent,
    NbListItemComponent,
    NbOptionComponent,
    NbPieChartComponent,
    NbProgressBarComponent,
    NbSelectComponent,
    NbUserComponent,
    RouterLink,
  ],
})
export class SaasDashboardComponent {
  readonly stats: Stat[] = [
    { title: 'Revenue', value: '$95,595', change: 3.55 },
    { title: 'Expenses', value: '$12,789', change: 2.67 },
    { title: 'New customers', value: '1,984', change: 12.1 },
    { title: 'Churn', value: '1.8%', change: -0.4 },
  ];

  readonly days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  readonly sales: NbChartSeries[] = [
    { name: 'Income', data: [12400, 14800, 20100, 11900, 15300, 9800, 16900] },
    { name: 'Expenses', data: [8100, 9400, 9900, 8700, 11200, 7400, 9600], status: 'info' },
  ];

  readonly categories: { label: string; value: number; status: NbComponentStatus }[] = [
    { label: 'Subscriptions', value: 60, status: 'primary' },
    { label: 'Services', value: 28, status: 'info' },
    { label: 'Add-ons', value: 13, status: 'warning' },
  ];

  readonly products = TOP_PRODUCTS;
  readonly events = EVENTS;
  readonly orders = ORDERS;
  readonly orderStatus = ORDER_STATUS;
  readonly photoOf = photoOf;
}
