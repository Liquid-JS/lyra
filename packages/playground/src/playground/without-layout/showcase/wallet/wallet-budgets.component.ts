import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  NbButtonComponent,
  NbCardBodyComponent,
  NbCardComponent,
  NbCardFooterComponent,
  NbCardHeaderComponent,
  NbComponentStatus,
  NbDialogRef,
  NbDialogService,
  NbFormFieldComponent,
  NbIconComponent,
  NbInputDirective,
  NbListComponent,
  NbListItemComponent,
  NbOptionComponent,
  NbPrefixDirective,
  NbProgressBarComponent,
  NbSelectComponent,
  NbSliderComponent,
  NbTagComponent,
  NbToastrService,
} from '@liquid-js/lyr-core';

import { WALLET_BUDGETS, WALLET_CATEGORIES, walletCategory, WalletBudget, WalletCategoryId } from './wallet-data';

/** A budget as the page shows it: with how far along it is and how it compares with last month. */
interface BudgetView extends WalletBudget {
  name: string;
  icon: string;
  share: number;
  status: NbComponentStatus;
  label: string;
  trend: number;
}

/**
 * This month's budgets: a summary, one card per category with a ring of how much is spent, and a dialog to add one.
 */
@Component({
  selector: 'npg-wallet-budgets',
  templateUrl: './wallet-budgets.component.html',
  styleUrls: ['./wallet-budgets.component.scss'],
  imports: [
    CurrencyPipe,
    DecimalPipe,
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardFooterComponent,
    NbCardHeaderComponent,
    NbFormFieldComponent,
    NbIconComponent,
    NbInputDirective,
    NbListComponent,
    NbListItemComponent,
    NbOptionComponent,
    NbPrefixDirective,
    NbProgressBarComponent,
    NbSelectComponent,
    NbSliderComponent,
    NbTagComponent,
    ReactiveFormsModule,
  ],
})
export class WalletBudgetsComponent {
  private readonly dialogService = inject(NbDialogService);
  private readonly toastr = inject(NbToastrService);

  readonly months = ['June 2026', 'May 2026', 'April 2026'];
  readonly month = signal(this.months[0]);
  readonly daysLeft = 12;

  readonly budgets = signal(WALLET_BUDGETS);
  readonly views = computed<BudgetView[]>(() =>
    this.budgets().map((budget) => {
      const { name, icon } = walletCategory(budget.category);
      const share = budget.spent / budget.limit;
      return {
        ...budget,
        name,
        icon,
        share: Math.min(100, Math.round(share * 100)),
        status: share >= 1 ? 'danger' : share >= 0.85 ? 'warning' : 'success',
        label: share >= 1 ? 'Over' : share >= 0.85 ? 'Close' : 'On track',
        trend: budget.spent - budget.lastMonth,
      };
    }),
  );
  readonly limit = computed(() => this.budgets().reduce((sum, budget) => sum + budget.limit, 0));
  readonly spent = computed(() => this.budgets().reduce((sum, budget) => sum + budget.spent, 0));
  readonly left = computed(() => Math.max(0, this.limit() - this.spent()));
  readonly over = computed(() => this.views().filter((budget) => budget.status === 'danger').length);

  /** The categories without a budget yet, which the dialog offers. */
  readonly available = computed(() =>
    WALLET_CATEGORIES.filter(
      (category) => !['income', 'transfers'].includes(category.id) && !this.budgets().some((budget) => budget.category === category.id),
    ),
  );

  readonly form = new FormGroup({
    category: new FormControl<WalletCategoryId | ''>('', { nonNullable: true, validators: Validators.required }),
    limit: new FormControl(200, { nonNullable: true, validators: [Validators.required, Validators.min(10)] }),
  });

  readonly tips = [
    { icon: 'alert-triangle-outline', status: 'danger', text: 'Health is $103.50 over, mostly the dental visit on the 6th.' },
    { icon: 'clock-outline', status: 'warning', text: 'Shopping has $0 left; the next item waits for July.' },
    { icon: 'trending-down-outline', status: 'success', text: 'Transport is $10.60 under last month so far.' },
  ] as const;

  private dialog?: NbDialogRef<unknown>;

  open(template: TemplateRef<unknown>) {
    this.form.reset();
    this.dialog = this.dialogService.open(template, { context: {} });
  }

  close() {
    this.dialog?.close();
  }

  add() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { category, limit } = this.form.getRawValue();
    if (category) {
      this.budgets.update((budgets) => [...budgets, { category, limit, spent: 0, lastMonth: 0 }]);
      this.toastr.success(`${walletCategory(category).name} has a budget of $${limit} a month.`, 'Budget added');
    }
    this.close();
  }
}
