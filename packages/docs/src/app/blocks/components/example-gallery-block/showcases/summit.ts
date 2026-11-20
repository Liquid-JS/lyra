import { all, type NgdExampleApp } from '../example-app'

/** A conference site: the agenda by day, the speakers, ticket tiers and a checkout, in giant display type on one bold colour. */
export const SUMMIT_APP: NgdExampleApp = {
    id: 'summit',
    name: 'Summit',
    brand: 'Summit ’27',
    summary:
        'A conference site: the agenda by day, the speakers, ticket tiers and a checkout, in giant display type on one bold colour.',
    showcase: true,
    theme: {
        id: 'summit',
        name: 'Summit',
        base: 'default',
        colors: { primary: '#ff4d2e', success: '#2fbf71', info: '#3b9cff', warning: '#ffb020', danger: '#e5484d' },
        fontPrimary: 'Archivo, system-ui, sans-serif',
        fontSecondary: 'Archivo, system-ui, sans-serif',
        fonts: ['Archivo:wdth,wght@75..125,400..900'],
        radius: 0.125,
        defaults: { shape: 'rectangle' },
        variables: {
            // Paper, from off-white to ink.
            'color-basic-100': '#fffdfa',
            'color-basic-200': '#f6f3ee',
            'color-basic-300': '#ece8e1',
            'color-basic-400': '#dedad2',
            'color-basic-500': '#c9c4bb',
            'color-basic-600': '#938e85',
            'color-basic-700': '#5b5750',
            'color-basic-800': '#2b2925',
            'color-basic-900': '#1b1a17',
            'color-basic-1000': '#121110',
            'color-basic-1100': '#0b0b0a',
            'text-basic-color': 'var(--color-basic-900)',
            'text-hint-color': 'var(--color-basic-700)',
            // Ink on the bold colour, which white wouldn't read on.
            'text-control-color': 'var(--color-basic-1000)',
            'text-primary-color': 'var(--color-primary-700)',
            'text-primary-hover-color': 'var(--color-primary-800)',
            'text-primary-focus-color': 'var(--color-primary-800)',
            'layout-background-color': 'var(--color-basic-100)',
            'header-background-color': 'var(--color-basic-100)',
            'header-shadow': '0 1px 0 var(--color-basic-400)',
            'card-border-color': 'var(--color-basic-400)',
            'card-shadow': 'none',
            'divider-color': 'var(--color-basic-400)',
            // Heavy, tight headings.
            'text-heading-1-font-size': '3.5rem',
            'text-heading-1-line-height': '1',
            'text-heading-1-font-weight': '900',
            'text-heading-2-font-size': '2.5rem',
            'text-heading-2-line-height': '1.05',
            'text-heading-2-font-weight': '900',
            'text-heading-3-font-size': '1.75rem',
            'text-heading-3-line-height': '1.1',
            'text-heading-3-font-weight': '800',
            'text-heading-4-font-weight': '800',
            'text-heading-5-font-weight': '800',
            'text-heading-6-font-weight': '800',
            'text-button-font-weight': '800',
            'button-filled-text-transform': 'uppercase',
            'button-outline-text-transform': 'uppercase',
            'button-ghost-text-transform': 'uppercase',
            'button-hero-text-transform': 'uppercase'
        }
    },
    devices: ['laptop', 'phone'],
    screens: [
        { id: 'showcase/summit/home', title: 'Home', pageTitle: 'Product and design, in the same room', files: all('showcase/summit/summit-home.component') },
        { id: 'showcase/summit/agenda', title: 'Agenda', files: all('showcase/summit/summit-agenda.component') },
        {
            id: 'showcase/summit/speakers',
            title: 'Speakers',
            files: [...all('showcase/summit/summit-speakers.component'), 'showcase/summit/parts/summit-speaker-dialog.component.ts']
        },
        { id: 'showcase/summit/tickets', title: 'Tickets', files: all('showcase/summit/summit-tickets.component') }
    ],
    files: ['showcase/summit/summit.routes.ts', ...all('showcase/summit/summit-shell.component'), 'showcase/summit/summit-data.ts']
}
