import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  NbButtonComponent,
  NbButtonGroupComponent,
  NbButtonToggleDirective,
  NbCardBodyComponent,
  NbCardComponent,
  NbCardHeaderComponent,
  NbIconComponent,
  NbListComponent,
  NbListItemComponent,
  NbProgressBarComponent,
  NbTagComponent,
} from '@liquid-js/lyr-core';
import { NbChartSeries, NbChartSlice, NbLineChartComponent, NbPieChartComponent } from '@liquid-js/lyr-extras/chart';

import { ShowcaseGlowComponent } from '../shared/showcase-glow.component';
import {
  WALLET_ACCOUNTS,
  WALLET_BUDGETS,
  WALLET_SPENDING,
  WALLET_TODAY,
  WALLET_TRANSACTIONS,
  walletCategory,
} from './wallet-data';

type Period = keyof typeof WALLET_SPENDING;

/**
 * The overview: the balance first, on its own dark card with what to do with it, then the accounts, spending against
 * the budget, where it went, the latest transactions and a word of advice.
 */
@Component({
  selector: 'npg-wallet-overview',
  templateUrl: './wallet-overview.component.html',
  styleUrls: ['./wallet-overview.component.scss'],
  imports: [
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    NbButtonComponent,
    NbButtonGroupComponent,
    NbButtonToggleDirective,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbIconComponent,
    NbLineChartComponent,
    NbListComponent,
    NbListItemComponent,
    NbPieChartComponent,
    NbProgressBarComponent,
    NbTagComponent,
    RouterLink,
    ShowcaseGlowComponent,
  ],
})
export class WalletOverviewComponent {
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);

  readonly today = WALLET_TODAY;
  readonly accounts = WALLET_ACCOUNTS;
  /** What the person has, less what the card owes. */
  readonly total = WALLET_ACCOUNTS.reduce((sum, account) => sum + (account.id === 'credit' ? -account.balance : account.balance), 0);
  readonly monthChange = 1240.5;
  readonly monthChangeShare = 5.4;

  readonly periods: { id: Period; title: string }[] = [
    { id: 'week', title: 'Week' },
    { id: 'month', title: 'Month' },
  ];
  readonly period = signal<Period>('week');
  readonly labels = computed(() => WALLET_SPENDING[this.period()].labels);
  readonly spending = computed<NbChartSeries[]>(() => {
    const { spent, budget } = WALLET_SPENDING[this.period()];
    return [
      { name: 'Spent', data: spent },
      { name: 'Budget', data: budget, status: 'basic', area: false, dashed: true },
    ];
  });
  readonly spentThisMonth = WALLET_BUDGETS.reduce((sum, budget) => sum + budget.spent, 0);
  readonly budgetThisMonth = WALLET_BUDGETS.reduce((sum, budget) => sum + budget.limit, 0);

  /** Spending by category this month, largest first, each in its category's colour. */
  readonly slices: NbChartSlice[] = [...WALLET_BUDGETS]
    .sort((a, b) => b.spent - a.spent)
    .map(({ category, spent }) => {
      const { name, chart } = walletCategory(category);
      return { label: name, value: Math.round(spent), color: chart };
    });

  readonly recent = WALLET_TRANSACTIONS.slice(0, 6);
  readonly categoryOf = walletCategory;

  readonly insights = [
    {
      icon: 'bulb-outline',
      status: 'warning',
      title: 'Dining is running ahead',
      text: 'You\'ve spent $146 of $180 with 12 days to go. Two fewer lunches out keeps it on track.',
    },
    {
      icon: 'checkmark-circle-2-outline',
      status: 'success',
      title: 'Savings on schedule',
      text: 'The $500 monthly transfer went through on the 15th. Three more and you reach $20,000.',
    },
    {
      icon: 'credit-card-outline',
      status: 'info',
      title: 'Card payment due 27 June',
      text: 'Paying the $1,000 in full keeps the card interest-free, and checking covers it with room to spare.',
    },
  ] as const;

  /** How much of a credit card's limit is used, in percent. */
  used(balance: number, limit: number): number {
    return Math.round((balance / limit) * 100);
  }

  pickPeriod(value: unknown) {
    const match = this.periods.find((period) => period.id === value);
    if (match) {
      this.period.set(match.id);
    }
  }

  // A page of this app, wherever it's mounted.
  link(page: string): string {
    return this.router.serializeUrl(this.router.createUrlTree(['..', page], { relativeTo: this.route }));
  }
}
