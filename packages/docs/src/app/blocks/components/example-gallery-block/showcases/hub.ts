import { all, type NgdExampleApp } from '../example-app'

/**
 * A company intranet: a feed, the people and the org tree, documents, room and leave requests, IT tickets on a board,
 * chat and settings. Calm but branded: stone neutrals, a forest green, an ink header, hairline cards.
 */
export const HUB_APP: NgdExampleApp = {
    id: 'hub',
    name: 'Hub',
    brand: 'Acme Hub',
    summary:
        'A company intranet: the feed, the people and their org tree, documents, leave and room requests, IT tickets on a board, chat and settings, calm but branded.',
    showcase: true,
    theme: {
        id: 'hub',
        name: 'Hub',
        base: 'default',
        colors: { primary: '#2d6a4f', info: '#2563a8', success: '#2f8f5b', warning: '#b0700f', danger: '#c0392b' },
        fontPrimary: '"Plus Jakarta Sans", system-ui, sans-serif',
        fontSecondary: '"Plus Jakarta Sans", system-ui, sans-serif',
        fonts: ['Plus Jakarta Sans:wght@400;500;600;700'],
        radius: 0.5,
        defaults: { size: 'medium' },
        variables: {
            // Stone greys, a touch warm.
            'color-basic-100': '#ffffff',
            'color-basic-200': '#f7f7f4',
            'color-basic-300': '#f0f0ec',
            'color-basic-400': '#e3e3dd',
            'color-basic-500': '#cfcfc7',
            'color-basic-600': '#9b9b92',
            'color-basic-700': '#5d5d55',
            'color-basic-800': '#2b2b27',
            'color-basic-900': '#1d1d1a',
            'color-basic-1000': '#141412',
            'color-basic-1100': '#0c0c0b',
            'text-hint-color': 'var(--color-basic-700)',
            'layout-background-color': 'var(--color-basic-200)',
            // An ink header, with its text and controls in light colours.
            'header-background-color': '#15201b',
            'header-text-color': '#e9ede9',
            'header-shadow': 'none',
            'header-height': '3.5rem',
            // A light sidebar with a hairline edge, and menu items as soft pills.
            'sidebar-background-color': 'var(--color-basic-100)',
            'sidebar-shadow': 'inset -1px 0 0 var(--color-basic-400)',
            'sidebar-padding': '0.75rem',
            'sidebar-menu-item-active-background-color': 'var(--color-primary-transparent-100)',
            'sidebar-menu-item-hover-background-color': 'var(--color-basic-300)',
            'menu-item-border-radius': 'var(--border-radius)',
            'menu-item-padding': '0.5rem 0.75rem',
            'menu-item-active-indicator-width': '0',
            'menu-text-font-size': '0.9375rem',
            'menu-text-font-weight': '500',
            // Hairline cards.
            'card-border-width': '1px',
            'card-border-color': 'var(--color-basic-400)',
            'card-shadow': 'none',
            'card-header-text-font-weight': '600',
            'input-basic-border-color': 'var(--color-basic-500)',
            'text-button-font-weight': '600',
            'button-filled-text-transform': 'none',
            'button-outline-text-transform': 'none',
            'button-ghost-text-transform': 'none',
            'button-hero-text-transform': 'none'
        }
    },
    devices: ['laptop'],
    screens: [
        { id: 'showcase/hub/home', title: 'Home', files: all('showcase/hub/hub-home.component') },
        { id: 'showcase/hub/people', title: 'People', files: all('showcase/hub/hub-people.component') },
        {
            id: 'showcase/hub/documents',
            title: 'Documents',
            files: [...all('showcase/hub/hub-documents.component'), 'showcase/hub/parts/hub-documents.service.ts']
        },
        {
            id: 'showcase/hub/documents/new',
            title: 'New document',
            files: [...all('showcase/hub/hub-new-document.component'), 'showcase/hub/parts/hub-documents.service.ts']
        },
        { id: 'showcase/hub/requests', title: 'Requests', files: all('showcase/hub/hub-requests.component') },
        {
            id: 'showcase/hub/tickets',
            title: 'Tickets',
            pageTitle: 'IT tickets',
            files: [...all('showcase/hub/hub-tickets.component'), 'showcase/hub/parts/hub-new-ticket.component.ts']
        },
        { id: 'showcase/hub/chat', title: 'Chat', files: all('showcase/hub/hub-chat.component') },
        { id: 'showcase/hub/settings', title: 'Settings', files: all('showcase/hub/hub-settings.component') }
    ],
    files: ['showcase/hub/hub.routes.ts', ...all('showcase/hub/hub-shell.component'), 'showcase/hub/hub-data.ts']
}
