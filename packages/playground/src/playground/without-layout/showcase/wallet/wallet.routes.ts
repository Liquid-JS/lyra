import { Routes } from '@angular/router';
import { provideNbDatepicker, provideNbDialog, provideNbToastr } from '@liquid-js/lyr-core';
import { NB_LINE_CHART_PARTS, NB_PIE_CHART_PARTS, provideNbCharts } from '@liquid-js/lyr-extras/chart';

/** Wallet's screens, in its frame. */
export const WALLET_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./wallet-shell.component').then((m) => m.WalletShellComponent),
    // The chart types the overview draws; the date pickers, the budget dialog and the toasts.
    providers: [
      provideNbCharts(...NB_LINE_CHART_PARTS, ...NB_PIE_CHART_PARTS),
      provideNbDatepicker(),
      provideNbDialog(),
      provideNbToastr(),
    ],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: 'overview',
        data: { title: 'Overview' },
        loadComponent: () => import('./wallet-overview.component').then((m) => m.WalletOverviewComponent),
      },
      {
        path: 'transactions',
        data: { title: 'Transactions' },
        loadComponent: () => import('./wallet-transactions.component').then((m) => m.WalletTransactionsComponent),
      },
      {
        path: 'budgets',
        data: { title: 'Budgets' },
        loadComponent: () => import('./wallet-budgets.component').then((m) => m.WalletBudgetsComponent),
      },
      {
        path: 'transfer',
        data: { title: 'Transfer' },
        loadComponent: () => import('./wallet-transfer.component').then((m) => m.WalletTransferComponent),
      },
    ],
  },
];
