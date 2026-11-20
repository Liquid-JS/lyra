import { all, type NgdExampleApp } from '../example-app';

/**
 * Personal finance: the balance first on a dark card, accounts, a spending chart, a transactions table with filters,
 * budgets with their rings, and a transfer in steps, in the calm of a bank that means to be trusted.
 */
export const WALLET_APP: NgdExampleApp = {
  id: 'wallet',
  name: 'Wallet',
  brand: 'Wallet',
  summary:
    'Personal finance: the balance first, accounts and a spending chart, a transactions table with filters, budgets with their rings, and a transfer in steps.',
  showcase: true,
  theme: {
    id: 'wallet',
    name: 'Wallet',
    base: 'default',
    colors: { primary: '#243b8a', success: '#0f9d6e', info: '#2b7fd4', warning: '#d9860b', danger: '#d9435a' },
    fontPrimary: 'Inter, system-ui, sans-serif',
    fontSecondary: '"Space Grotesk", system-ui, sans-serif',
    fonts: ['Space Grotesk:wght@400;500;600;700', 'Inter:wght@400;500;600'],
    radius: 1,
    defaults: { shape: 'semi-round' },
    variables: {
      // Cool off-white, and white cards with a hairline instead of a shadow.
      'color-basic-200': '#f6f8fc',
      'color-basic-300': '#eef1f8',
      'color-basic-400': '#dfe4ef',
      'color-basic-500': '#c8d0e0',
      'color-basic-600': '#8d99b3',
      'color-basic-700': '#4e5a76',
      'color-basic-800': '#1f2a44',
      'color-basic-900': '#172038',
      'color-basic-1000': '#10172b',
      'color-basic-1100': '#0a0f1e',
      'layout-background-color': 'var(--color-basic-200)',
      'card-border-color': 'var(--color-basic-400)',
      'card-shadow': 'none',
      'card-header-text-font-size': '1rem',
      'header-shadow': '0 1px 0 var(--color-basic-400)',
      'input-basic-background-color': 'var(--color-basic-100)',
      'input-basic-border-color': 'var(--color-basic-500)',
      'text-hint-color': 'var(--color-basic-700)',
      'text-heading-1-font-weight': '600',
      'text-heading-2-font-weight': '600',
      'text-heading-3-font-weight': '600',
      'text-heading-4-font-weight': '600',
      'text-heading-5-font-weight': '600',
      'text-heading-6-font-weight': '600',
      'text-button-font-weight': '600',
      'button-filled-text-transform': 'none',
      'button-outline-text-transform': 'none',
      'button-ghost-text-transform': 'none',
      'button-hero-text-transform': 'none',
    },
  },
  devices: ['laptop', 'phone'],
  screens: [
    { id: 'showcase/wallet/overview', title: 'Overview', files: all('showcase/wallet/wallet-overview.component') },
    {
      id: 'showcase/wallet/transactions',
      title: 'Transactions',
      files: all('showcase/wallet/wallet-transactions.component'),
    },
    { id: 'showcase/wallet/budgets', title: 'Budgets', files: all('showcase/wallet/wallet-budgets.component') },
    { id: 'showcase/wallet/transfer', title: 'Transfer', pageTitle: 'Send money', files: all('showcase/wallet/wallet-transfer.component') },
  ],
  files: ['showcase/wallet/wallet.routes.ts', ...all('showcase/wallet/wallet-shell.component'), 'showcase/wallet/wallet-data.ts'],
};
