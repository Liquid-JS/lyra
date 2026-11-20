import { CurrencyPipe, DatePipe } from '@angular/common'
import { Component, computed, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import {
    NbButtonComponent,
    NbCardComponent,
    NbCardFooterComponent,
    NbCardHeaderComponent,
    NbContextMenuDirective,
    NbDataTableModule,
    NbDatepickerComponent,
    NbDatepickerDirective,
    NbFormFieldComponent,
    NbIconComponent,
    NbInputDirective,
    NbMenuItem,
    NbOptionComponent,
    NbPaginationComponent,
    NbPrefixDirective,
    NbSelectComponent,
    NbTableFilters,
    nbTableDataSource,
    NbTagComponent,
    NbToastrService
} from '@liquid-js/lyr-core'

import { WALLET_ACCOUNTS, WALLET_CATEGORIES, WALLET_TRANSACTIONS, walletAccount, walletCategory, WalletTransaction } from './wallet-data'
import { phoneViewport } from './wallet-viewport'

// The amounts of this month's transactions, added up.
const sumOf = (transactions: WalletTransaction[]) =>
    transactions
        .filter((transaction) => transaction.date.getMonth() === 5)
        .reduce((sum, transaction) => sum + transaction.amount, 0)

/**
 * Every transaction, newest first, with a search and filters by category, account and dates; what's left after
 * filtering is paged, and each row has its own actions.
 */
@Component({
    selector: 'npg-wallet-transactions',
    templateUrl: './wallet-transactions.component.html',
    styleUrls: ['./wallet-transactions.component.scss'],
    imports: [
        CurrencyPipe,
        DatePipe,
        FormsModule,
        NbButtonComponent,
        NbCardComponent,
        NbCardFooterComponent,
        NbCardHeaderComponent,
        NbContextMenuDirective,
        NbDataTableModule,
        NbDatepickerComponent,
        NbDatepickerDirective,
        NbFormFieldComponent,
        NbIconComponent,
        NbInputDirective,
        NbOptionComponent,
        NbPaginationComponent,
        NbPrefixDirective,
        NbSelectComponent,
        NbTagComponent
    ]
})
export class WalletTransactionsComponent {
    private readonly toastr = inject(NbToastrService)

    readonly categories = WALLET_CATEGORIES
    readonly accounts = WALLET_ACCOUNTS
    readonly categoryOf = walletCategory
    readonly accountOf = walletAccount
    // A phone shows what matters most; the rest is a tap away on a wider screen.
    private readonly phone = phoneViewport()
    readonly columns = computed(() =>
        this.phone() ? ['date', 'merchant', 'amount'] : ['date', 'merchant', 'category', 'account', 'amount', 'actions']
    )

    readonly source = nbTableDataSource({
        data: WALLET_TRANSACTIONS,
        pageSize: 10,
        rowId: (transaction) => transaction.id,
        filter: (transaction, filters) => this.matches(transaction, filters)
    })

    readonly actions: NbMenuItem[] = [{ title: 'Add a note' }, { title: 'Split' }, { title: 'Report a problem' }]

    /** This month's money in and out. */
    readonly moneyIn = sumOf(WALLET_TRANSACTIONS.filter((transaction) => transaction.amount > 0))
    readonly moneyOut = -sumOf(WALLET_TRANSACTIONS.filter((transaction) => transaction.amount < 0))

    // A transaction passes the search by its merchant, the category and account chosen, and lies within the dates.
    private matches(transaction: WalletTransaction, filters: NbTableFilters): boolean {
        const search = String(filters['search'] ?? '')
            .trim()
            .toLowerCase()
        const category = filters['category']
        const account = filters['account']
        const from = filters['from']
        const to = filters['to']
        return (
            (!search || transaction.merchant.toLowerCase().includes(search)) &&
            (!category || transaction.category === category) &&
            (!account || transaction.account === account) &&
            (!(from instanceof Date) || transaction.date >= from) &&
            (!(to instanceof Date) || transaction.date <= new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59))
        )
    }

    clear() {
        this.source.filters.set({})
    }

    export() {
        this.toastr.success(`${this.source.total()} transactions are on their way to your email.`, 'Export started')
    }
}
