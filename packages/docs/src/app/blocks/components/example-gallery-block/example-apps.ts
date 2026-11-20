import { all, component, type NgdExampleApp, type NgdExampleScreen, type NgdExampleTheme } from './example-app'
import { PORTFOLIO_APP } from './showcases/portfolio'
import { PULSE_APP } from './showcases/pulse'
import { BOOK_APP } from './showcases/book'
import { SUMMIT_APP } from './showcases/summit'
import { RELAY_APP } from './showcases/relay'
import { HUB_APP } from './showcases/hub'
import { LEARN_APP } from './showcases/learn'
import { WALLET_APP } from './showcases/wallet'
import { STAY_APP } from './showcases/stay'

export type { NgdExampleApp, NgdExampleScreen, NgdExampleTheme } from './example-app'

// The sign-in pages' files every frame shares.
const AUTH_FILES = [
    'showcase/auth/auth.routes.ts',
    'showcase/auth/auth-frame.ts',
    'showcase/auth/_auth-page.scss',
    'showcase/auth/parts/auth-panel.component.ts'
]

// The sign-in pages, in the frame under `frame`, e.g. `pastel/`.
const authScreens = (frame: string): NgdExampleScreen[] => [
    { id: `showcase/auth/${frame}sign-in`, title: 'Sign in', files: all('showcase/auth/auth-sign-in.component') },
    { id: `showcase/auth/${frame}sign-up`, title: 'Sign up', files: all('showcase/auth/auth-sign-up.component') },
    {
        id: `showcase/auth/${frame}forgot-password`,
        title: 'Forgot password',
        files: all('showcase/auth/auth-forgot-password.component')
    }
]

export const EXAMPLE_APPS: NgdExampleApp[] = [
    {
        id: 'web-app',
        name: 'Web app',
        brand: 'Acme CRM',
        summary: 'A SaaS app: a dashboard with charts, a customer table, a customer form, an invoice and settings.',
        theme: 'corporate',
        devices: ['laptop', 'phone'],
        files: [...all('showcase/saas/saas-shell.component'), 'showcase/saas/saas-data.ts'],
        screens: [
            { id: 'showcase/saas/dashboard', title: 'Dashboard', files: all('showcase/saas/saas-dashboard.component') },
            { id: 'showcase/saas/customers', title: 'Customers', files: all('showcase/saas/saas-customers.component') },
            {
                id: 'showcase/saas/customers/edit',
                title: 'Edit customer',
                files: all('showcase/saas/saas-customer-edit.component')
            },
            { id: 'showcase/saas/invoice', title: 'Invoice', pageTitle: 'Invoice INV-0731', files: all('showcase/saas/saas-invoice.component') },
            { id: 'showcase/saas/settings', title: 'Settings', files: all('showcase/saas/saas-settings.component') }
        ]
    },
    {
        id: 'sign-in',
        name: 'Sign-in pages',
        brand: 'Acme',
        summary: 'Sign in, sign up and a forgotten password, beside a panel with a picture of the product.',
        theme: 'material-light',
        devices: ['laptop', 'phone'],
        files: [...AUTH_FILES, 'showcase/auth/auth-shell.component.ts'],
        screens: authScreens('')
    },
    {
        id: 'website',
        name: 'Website',
        brand: 'Acme',
        summary: 'A product site: a landing page with pricing and testimonials, a blog and an article.',
        theme: 'default',
        devices: ['laptop', 'phone'],
        files: [...all('showcase/site/site-shell.component'), 'showcase/site/site-posts.ts'],
        screens: [
            { id: 'showcase/site/home', title: 'Home', pageTitle: 'The CRM for small teams', files: all('showcase/site/site-home.component') },
            { id: 'showcase/site/blog', title: 'Blog', files: all('showcase/site/site-blog.component') },
            { id: 'showcase/site/article', title: 'Article', pageTitle: 'How Fabrikam closed its books in an afternoon', files: all('showcase/site/site-article.component') }
        ]
    },
    {
        id: 'mobile-app',
        name: 'Mobile app',
        brand: 'Acme Field',
        summary: "A field sales app: today's visits, customers, a customer, messages and settings.",
        theme: 'material-dark',
        devices: ['phone'],
        files: [...all('showcase/mobile/mobile-shell.component'), 'showcase/mobile/mobile-screen.scss'],
        screens: [
            { id: 'showcase/mobile/today', title: 'Today', files: all('showcase/mobile/mobile-today.component') },
            { id: 'showcase/mobile/customers', title: 'Customers', files: all('showcase/mobile/mobile-customers.component') },
            { id: 'showcase/mobile/customer', title: 'Customer', files: all('showcase/mobile/mobile-customer.component') },
            {
                id: 'showcase/mobile/messages',
                title: 'Messages',
                files: component('showcase/mobile/mobile-messages.component', 'ts')
            },
            { id: 'showcase/mobile/settings', title: 'Settings', files: all('showcase/mobile/mobile-settings.component') }
        ]
    },
    {
        id: 'shop',
        name: 'Shop',
        brand: 'Acme Store',
        summary: 'A store: products by category, a product, a working cart, checkout in steps, and past orders.',
        theme: 'cosmic',
        devices: ['laptop', 'phone'],
        files: [
            ...all('showcase/shop/shop-shell.component'),
            'showcase/shop/shop-cart.service.ts',
            'showcase/shop/shop-data.ts',
            'showcase/shop/parts/shop-picture.component.ts'
        ],
        screens: [
            { id: 'showcase/shop/products', title: 'Products', files: all('showcase/shop/shop-products.component') },
            {
                id: 'showcase/shop/products/backpack',
                title: 'Product',
                pageTitle: 'Leather backpack',
                files: [...all('showcase/shop/shop-product.component'), 'showcase/shop/parts/shop-quantity.component.ts']
            },
            {
                id: 'showcase/shop/cart',
                title: 'Cart',
                files: [...all('showcase/shop/shop-cart.component'), 'showcase/shop/parts/shop-order-summary.component.ts']
            },
            { id: 'showcase/shop/checkout', title: 'Checkout', files: all('showcase/shop/shop-checkout.component') },
            {
                id: 'showcase/shop/order-placed',
                title: 'Order placed',
                files: all('showcase/shop/shop-order-placed.component')
            },
            { id: 'showcase/shop/orders', title: 'Orders', files: all('showcase/shop/shop-orders.component') }
        ]
    },
    {
        id: 'sign-in-pastel',
        name: 'Pastel sign-in',
        brand: 'Acme',
        summary: 'The sign-in pages in a light, friendly theme: a round card on soft shapes, with a word from a customer.',
        showcase: true,
        theme: {
            id: 'pastel',
            name: 'Pastel',
            base: 'default',
            colors: { primary: '#7c5cff', info: '#3ab0ff', success: '#2ec4a6', warning: '#ffb547', danger: '#ff6b8b' },
            fontPrimary: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
            fontSecondary: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
            radius: 1,
            defaults: { shape: 'semi-round', button: { shape: 'round' } }
        },
        devices: ['laptop', 'phone'],
        files: [...AUTH_FILES, 'showcase/auth/auth-pastel-shell.component.ts'],
        screens: authScreens('pastel/')
    },
    {
        id: 'sign-in-studio',
        name: 'Studio sign-in',
        brand: 'Acme',
        summary: 'The sign-in pages in a bold, dark theme: a frosted card on a photo, with a serif quote beside it.',
        showcase: true,
        theme: {
            id: 'studio',
            name: 'Studio',
            base: 'dark',
            colors: { primary: '#ff8a3d', info: '#4fc3f7', success: '#34d399', warning: '#fbbf24', danger: '#f87171' },
            fontSecondary: 'Georgia, "Times New Roman", serif',
            radius: 0.375
        },
        devices: ['laptop', 'phone'],
        files: [...AUTH_FILES, 'showcase/auth/auth-studio-shell.component.ts'],
        screens: authScreens('studio/')
    }
]

/** An app above in a theme of its own: the same screens and code, another look. */
function showcaseOf(id: string, showcase: Pick<NgdExampleApp, 'id' | 'name' | 'summary' | 'theme'>): NgdExampleApp {
    const app = EXAMPLE_APPS.find((item) => item.id === id)
    if (!app) {
        throw new Error(`No example app ${id}`)
    }
    return { ...app, ...showcase, showcase: true }
}

// The showcases' own looks go past the editor's controls: their grey ramps, surfaces, shadows and text styles.
const NO_CAPS = {
    'button-filled-text-transform': 'none',
    'button-outline-text-transform': 'none',
    'button-ghost-text-transform': 'none',
    'button-hero-text-transform': 'none'
}

EXAMPLE_APPS.push(
    showcaseOf('shop', {
        id: 'shop-boutique',
        name: 'Boutique shop',
        summary: 'The shop as a warm boutique: cream paper and ink, terracotta, serif headings and soft, borderless cards.',
        theme: {
            id: 'boutique',
            name: 'Boutique',
            base: 'default',
            colors: { primary: '#b5532a', info: '#7d4f8f', success: '#4f7a28', warning: '#b8791a', danger: '#b3263e' },
            fontSecondary: '"Iowan Old Style", Palatino, Georgia, serif',
            radius: 1,
            defaults: { button: { shape: 'round' } },
            variables: {
                // Warm greys, from paper to ink.
                'color-basic-100': '#fffdf9',
                'color-basic-200': '#fbf6ee',
                'color-basic-300': '#f3eadc',
                'color-basic-400': '#e8dccb',
                'color-basic-500': '#d3c2ab',
                'color-basic-600': '#a38f75',
                'color-basic-700': '#6b5843',
                'color-basic-800': '#3b2e22',
                'color-basic-900': '#2a2018',
                'color-basic-1000': '#1d1611',
                'color-basic-1100': '#120d09',
                'text-hint-color': 'var(--color-basic-700)',
                'layout-background-color': 'var(--color-basic-200)',
                'header-shadow': '0 1px 0 var(--color-basic-400)',
                'card-border-width': '0',
                'card-shadow': '0 0.75rem 2rem -1rem rgba(59, 46, 34, 0.35)',
                'input-basic-background-color': 'var(--color-basic-100)',
                'input-basic-border-color': 'var(--color-basic-500)',
                'text-heading-1-font-weight': '600',
                'text-heading-2-font-weight': '600',
                'text-heading-3-font-weight': '600',
                'text-heading-4-font-weight': '600',
                'text-heading-5-font-weight': '600',
                'text-heading-6-font-weight': '600',
                'text-button-font-weight': '600',
                ...NO_CAPS
            }
        }
    }),
    showcaseOf('website', {
        id: 'website-midnight',
        name: 'Midnight website',
        summary: 'The product site at night: near-black blue, glowing cyan edges, dark text on bright buttons, heavy headings.',
        theme: {
            id: 'midnight',
            name: 'Midnight',
            base: 'dark',
            colors: { primary: '#22c3e6', info: '#818cf8', success: '#34d399', warning: '#fbbf24', danger: '#fb7185' },
            fontSecondary: '"Avenir Next", "Segoe UI", system-ui, sans-serif',
            radius: 0.75,
            textScale: 1.05,
            defaults: { shape: 'semi-round' },
            variables: {
                'background-basic-color-1': '#0f1629',
                'background-basic-color-2': '#0a1020',
                'background-basic-color-3': '#060a16',
                'background-basic-color-4': '#03060e',
                'border-basic-color-3': '#1b2642',
                'border-basic-color-4': '#202d4f',
                'border-basic-color-5': '#2a3a63',
                'divider-color': '#1b2642',
                // Dark text on the bright colours, which white wouldn't read on.
                'text-control-color': '#04121c',
                'header-background-color': 'rgba(10, 16, 32, 0.88)',
                'header-shadow': '0 1px 0 rgba(34, 195, 230, 0.18)',
                'card-border-color': 'rgba(34, 195, 230, 0.2)',
                'card-shadow': '0 0 0 1px rgba(34, 195, 230, 0.08), 0 1.5rem 3rem -1.25rem rgba(34, 195, 230, 0.35)',
                'text-heading-1-font-weight': '800',
                'text-heading-2-font-weight': '800',
                'text-heading-3-font-weight': '800',
                'text-heading-4-font-weight': '700',
                'text-button-font-weight': '700',
                ...NO_CAPS
            }
        }
    }),
    showcaseOf('web-app', {
        id: 'web-app-slate',
        name: 'Slate web app',
        summary: 'The web app for people who live in it: a dark slate sidebar, crisp hairline cards, small controls in teal.',
        theme: {
            id: 'slate',
            name: 'Slate',
            base: 'default',
            colors: { primary: '#0f766e', info: '#2563a8', success: '#2f7d3f', warning: '#b0700f', danger: '#c0392b' },
            radius: 0.25,
            textScale: 0.95,
            defaults: { size: 'small' },
            variables: {
                // Cool slate greys.
                'color-basic-100': '#ffffff',
                'color-basic-200': '#f8fafc',
                'color-basic-300': '#f1f5f9',
                'color-basic-400': '#e2e8f0',
                'color-basic-500': '#cbd5e1',
                'color-basic-600': '#94a3b8',
                'color-basic-700': '#475569',
                'color-basic-800': '#1e293b',
                'color-basic-900': '#0f172a',
                'color-basic-1000': '#0b1120',
                'color-basic-1100': '#060a14',
                'text-hint-color': 'var(--color-basic-700)',
                'header-shadow': '0 1px 0 var(--color-basic-400)',
                'card-shadow': 'none',
                'card-border-color': 'var(--color-basic-400)',
                // The sidebar in ink, its menu in light text; menus elsewhere keep theirs.
                'sidebar-background-color': 'var(--color-basic-900)',
                'sidebar-shadow': 'none',
                'sidebar-text-color': 'var(--color-basic-500)',
                'sidebar-menu-text-color': 'var(--color-basic-500)',
                'sidebar-menu-group-text-color': 'var(--color-basic-600)',
                'sidebar-menu-item-icon-color': 'var(--color-basic-600)',
                'sidebar-menu-item-hover-background-color': 'rgba(255, 255, 255, 0.06)',
                'sidebar-menu-item-hover-text-color': '#ffffff',
                'sidebar-menu-item-active-background-color': 'rgba(45, 212, 191, 0.14)',
                'sidebar-menu-item-active-text-color': '#5eead4',
                'sidebar-menu-item-divider-color': 'rgba(255, 255, 255, 0.06)',
                'sidebar-menu-submenu-text-color': 'var(--color-basic-500)',
                'text-button-font-weight': '600',
                ...NO_CAPS
            }
        }
    }),
    showcaseOf('mobile-app', {
        id: 'mobile-app-candy',
        name: 'Candy mobile app',
        summary: 'The mobile app in a playful mood: pink-tinted everything, floating pillowy cards and very round controls.',
        theme: {
            id: 'candy',
            name: 'Candy',
            base: 'default',
            colors: { primary: '#d6338a', info: '#7c4ddb', success: '#0f8f6b', warning: '#c27710', danger: '#d23a3a' },
            fontPrimary: 'ui-rounded, "SF Pro Rounded", system-ui, sans-serif',
            fontSecondary: 'ui-rounded, "SF Pro Rounded", system-ui, sans-serif',
            radius: 1.5,
            defaults: { shape: 'round' },
            variables: {
                // Pink-tinted greys.
                'color-basic-100': '#ffffff',
                'color-basic-200': '#fff5fa',
                'color-basic-300': '#ffe8f3',
                'color-basic-400': '#fbd5e7',
                'color-basic-500': '#efb6d0',
                'color-basic-600': '#c2849f',
                'color-basic-700': '#7a3a58',
                'color-basic-800': '#4a1a33',
                'color-basic-900': '#331126',
                'color-basic-1000': '#22091a',
                'color-basic-1100': '#14040e',
                'text-hint-color': 'var(--color-basic-700)',
                // Its pink's 600 falls just short on the pink ground.
                'text-primary-color': 'var(--color-primary-700)',
                // A deeper pink under the messages' white text.
                'chat-message-background': 'var(--color-primary-600)',
                'layout-background-color': 'var(--color-basic-300)',
                'header-shadow': '0 0.5rem 1.5rem -1rem rgba(214, 51, 138, 0.45)',
                'card-border-width': '0',
                'card-shadow': '0 0.75rem 1.75rem -0.75rem rgba(214, 51, 138, 0.35)',
                'text-heading-1-font-weight': '800',
                'text-heading-2-font-weight': '800',
                'text-heading-3-font-weight': '800',
                'text-heading-4-font-weight': '800',
                'text-heading-5-font-weight': '800',
                'text-heading-6-font-weight': '800',
                'text-button-font-weight': '800',
                ...NO_CAPS
            }
        }
    })
)

// The showcases with use cases of their own, each in its own file.
EXAMPLE_APPS.push(PORTFOLIO_APP, PULSE_APP, BOOK_APP, SUMMIT_APP, RELAY_APP, HUB_APP, LEARN_APP, WALLET_APP, STAY_APP)

/** The app a screen is part of, and the screen, by the screen's example id. */
export function findExampleScreen(id: string): { app: NgdExampleApp, screen: NgdExampleScreen } | undefined {
    for (const app of EXAMPLE_APPS) {
        const screen = app.screens.find((item) => item.id === id)
        if (screen) {
            return { app, screen }
        }
    }
    return undefined
}

/** Where the gallery's picture of a screen is, made by `yarn docs:example-pictures`. */
export const examplePicture = (app: NgdExampleApp, screen: NgdExampleScreen) =>
    `assets/example-pictures/${app.id}/${screen.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.webp`

/**
 * A screen's page title as the made-up app would have it, marked as Lyra's example: e.g. `Events · Relay | Lyra
 * example`, or for a home page the app and what it does.
 */
export function examplePageTitle(app: NgdExampleApp, screen: NgdExampleScreen): string {
    const page =
        screen.title === 'Home'
            ? [app.brand, screen.pageTitle].filter(Boolean).join(' – ')
            : `${screen.pageTitle ?? screen.title} · ${app.brand}`
    return `${page} | Lyra example`
}

/** A screen's description: that it's a mockup made with Lyra, then what the app is. */
export function examplePageDescription(app: NgdExampleApp): string {
    return `A mockup made with Lyra, the Angular UI library: ${app.brand} and everything on the page are made up. ${app.summary}`
}

/** The name the link to an app's screens gives its theme: a theme of Lyra's, or the app's own by its id. */
export const themeId = (theme: string | NgdExampleTheme) => (typeof theme === 'string' ? theme : theme.id)

/** An example app's own theme, by its id. */
export const findExampleTheme = (id: string): NgdExampleTheme | undefined =>
    EXAMPLE_APPS.map(({ theme }) => theme).find((theme): theme is NgdExampleTheme => typeof theme !== 'string' && theme.id === id)
