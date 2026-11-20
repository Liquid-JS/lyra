import { NbComponentStatus } from '@liquid-js/lyr-core'
import { NbChartColor } from '@liquid-js/lyr-extras/chart'

/** One of the person's accounts; a credit card's balance is what's owed, against its limit. */
export interface WalletAccount {
    id: 'checking' | 'savings' | 'credit'
    name: string
    /** The last digits, as a card shows them. */
    number: string
    balance: number
    limit?: number
    icon: string
    status: NbComponentStatus
}

export type WalletCategoryId =
    | 'groceries'
    | 'dining'
    | 'transport'
    | 'housing'
    | 'utilities'
    | 'shopping'
    | 'health'
    | 'income'
    | 'transfers'

export interface WalletCategory {
    id: WalletCategoryId
    name: string
    icon: string
    status: NbComponentStatus
    /** Its colour in charts, where categories that share a status need one each. */
    chart: NbChartColor
}

/** A transaction: money out is negative, money in positive. */
export interface WalletTransaction {
    id: string
    date: Date
    merchant: string
    category: WalletCategoryId
    account: WalletAccount['id']
    amount: number
    pending?: boolean
}

/** A month's budget for a category, with what's spent so far and what the same days of last month came to. */
export interface WalletBudget {
    category: WalletCategoryId
    limit: number
    spent: number
    lastMonth: number
}

export interface WalletRecipient {
    name: string
    bank: string
    /** The last digits of their account. */
    number: string
}

/** The day the examples take as today. */
export const WALLET_TODAY = new Date(2026, 5, 18)

export const WALLET_ACCOUNTS: WalletAccount[] = [
    { id: 'checking', name: 'Everyday checking', number: '4821', balance: 6418.4, icon: 'credit-card-outline', status: 'primary' },
    { id: 'savings', name: 'Rainy day savings', number: '7730', balance: 18900, icon: 'umbrella-outline', status: 'success' },
    { id: 'credit', name: 'Rewards credit card', number: '0192', balance: 1000, limit: 5000, icon: 'shopping-bag-outline', status: 'info' }
]

export const WALLET_CATEGORIES: WalletCategory[] = [
    { id: 'groceries', name: 'Groceries', icon: 'shopping-cart-outline', status: 'success', chart: 'success' },
    { id: 'dining', name: 'Dining', icon: 'utensils-outline', status: 'warning', chart: 'warning' },
    { id: 'transport', name: 'Transport', icon: 'car-outline', status: 'info', chart: 'info' },
    { id: 'housing', name: 'Housing', icon: 'home-outline', status: 'primary', chart: 'primary' },
    { id: 'utilities', name: 'Utilities', icon: 'flash-outline', status: 'primary', chart: 'var(--color-primary-300)' },
    { id: 'shopping', name: 'Shopping', icon: 'shopping-bag-outline', status: 'info', chart: 'var(--color-info-700)' },
    { id: 'health', name: 'Health', icon: 'heart-outline', status: 'danger', chart: 'danger' },
    { id: 'income', name: 'Income', icon: 'trending-up-outline', status: 'success', chart: 'var(--color-success-700)' },
    { id: 'transfers', name: 'Transfers', icon: 'swap-outline', status: 'basic', chart: 'var(--color-basic-600)' }
]

export const walletCategory = (id: WalletCategoryId): WalletCategory =>
    WALLET_CATEGORIES.find((category) => category.id === id) ?? WALLET_CATEGORIES[0]

export const walletAccount = (id: WalletAccount['id']): WalletAccount =>
    WALLET_ACCOUNTS.find((account) => account.id === id) ?? WALLET_ACCOUNTS[0]

// A transaction on a day of June 2026, or of May with a negative day.
let sequence = 0
const on = (
    day: number,
    merchant: string,
    category: WalletCategoryId,
    account: WalletAccount['id'],
    amount: number,
    pending?: boolean
): WalletTransaction => ({
    id: `TX-${String(++sequence).padStart(4, '0')}`,
    date:
        day > 0
            ? new Date(2026, 5, day, 9 + (sequence % 9), (sequence * 7) % 60)
            : new Date(2026, 4, -day, 10 + (sequence % 8)),
    merchant,
    category,
    account,
    amount,
    ...(pending ? { pending } : {})
})

/** The last six weeks of transactions, newest first. */
export const WALLET_TRANSACTIONS: WalletTransaction[] = [
    on(18, 'Tailspin Coffee', 'dining', 'credit', -4.8, true),
    on(18, 'Northwind Grocers', 'groceries', 'checking', -86.32, true),
    on(17, 'City Transit', 'transport', 'checking', -32),
    on(17, 'Fabrikam Pharmacy', 'health', 'credit', -23.5),
    on(16, 'Acme Energy', 'utilities', 'checking', -142.17),
    on(16, 'Contoso Books', 'shopping', 'credit', -38.99),
    on(15, 'Transfer to savings', 'transfers', 'checking', -500),
    on(15, 'Transfer from checking', 'transfers', 'savings', 500),
    on(14, 'Litware Bistro', 'dining', 'credit', -64.2),
    on(13, 'Northwind Grocers', 'groceries', 'checking', -112.08),
    on(12, 'Wide World Importers', 'shopping', 'credit', -129),
    on(11, 'Tailspin Coffee', 'dining', 'credit', -5.4),
    on(10, 'Fourth Coffee Roasters', 'dining', 'checking', -18.5),
    on(9, 'Ride share', 'transport', 'credit', -21.4),
    on(8, 'Northwind Grocers', 'groceries', 'checking', -74.6),
    on(6, 'Fabrikam Dental', 'health', 'checking', -180),
    on(5, 'Litware Bistro', 'dining', 'credit', -48.75),
    on(4, 'City Transit', 'transport', 'checking', -32),
    on(3, 'Contoso Interactive', 'income', 'checking', 4250),
    on(2, 'Tailspin Coffee', 'dining', 'credit', -4.8),
    on(1, 'Oak Street Lettings', 'housing', 'checking', -1650),
    on(1, 'Acme Fibre', 'utilities', 'checking', -49),
    on(-30, 'Credit card payment', 'transfers', 'checking', -960),
    on(-30, 'Payment received', 'transfers', 'credit', 960),
    on(-29, 'Northwind Grocers', 'groceries', 'checking', -97.4),
    on(-27, 'Woodgrove Cinema', 'shopping', 'credit', -28),
    on(-26, 'Fabrikam Pharmacy', 'health', 'credit', -12.9),
    on(-24, 'City Transit', 'transport', 'checking', -32),
    on(-22, 'Litware Bistro', 'dining', 'credit', -71.3),
    on(-20, 'Interest', 'income', 'savings', 42.18),
    on(-18, 'Wide World Importers', 'shopping', 'credit', -54.5),
    on(-15, 'Transfer to savings', 'transfers', 'checking', -500),
    on(-15, 'Transfer from checking', 'transfers', 'savings', 500),
    on(-12, 'Northwind Grocers', 'groceries', 'checking', -103.2),
    on(-8, 'Acme Energy', 'utilities', 'checking', -138.4),
    on(-3, 'Contoso Interactive', 'income', 'checking', 4250),
    on(-1, 'Oak Street Lettings', 'housing', 'checking', -1650)
]

export const WALLET_BUDGETS: WalletBudget[] = [
    { category: 'groceries', limit: 450, spent: 273, lastMonth: 301.4 },
    { category: 'dining', limit: 180, spent: 146.45, lastMonth: 118.2 },
    { category: 'transport', limit: 120, spent: 85.4, lastMonth: 96 },
    { category: 'shopping', limit: 150, spent: 167.99, lastMonth: 82.5 },
    { category: 'utilities', limit: 220, spent: 191.17, lastMonth: 186.8 },
    { category: 'health', limit: 100, spent: 203.5, lastMonth: 25.6 }
]

export const WALLET_RECIPIENTS: WalletRecipient[] = [
    { name: 'John Smith', bank: 'Woodgrove Bank', number: '3310' },
    { name: 'Emma Brown', bank: 'Northwind Credit Union', number: '9087' },
    { name: 'Olivia Wilson', bank: 'Woodgrove Bank', number: '5512' },
    { name: 'Oak Street Lettings', bank: 'Contoso Bank', number: '2204' }
]

/** Spending this week and this month, by day, for the overview's chart. */
export const WALLET_SPENDING = {
    week: {
        labels: ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
        spent: [48.75, 36.2, 74.6, 112.08, 64.2, 181.16, 91.12],
        budget: [72, 72, 72, 72, 72, 72, 72]
    },
    month: {
        labels: ['1', '4', '7', '10', '13', '16', '19', '22', '25', '28'],
        spent: [1699, 1931, 2180, 2259, 2448, 2743, 2834, 2834, 2834, 2834],
        budget: [230, 690, 1380, 1610, 1840, 2070, 2300, 2530, 2760, 2990]
    }
}
