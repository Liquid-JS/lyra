import { all, type NgdExampleApp } from '../example-app';

/**
 * A developer product: a landing page with a live code sample and pricing, and a console with usage, API keys, an
 * event log and docs. Near-black surfaces, hairlines, one amber accent and mono for everything the API returns.
 */
export const RELAY_APP: NgdExampleApp = {
  id: 'relay',
  name: 'Relay',
  brand: 'Relay',
  summary:
    'A developer product: a landing page with a live code sample and pricing, and a console with usage, API keys, an event log and docs, dark with mono accents.',
  showcase: true,
  theme: {
    id: 'relay',
    name: 'Relay',
    base: 'dark',
    colors: { primary: '#ffb224', success: '#3ecf8e', info: '#58a6ff', warning: '#f0a020', danger: '#ff5c5c' },
    fontPrimary: 'Inter, system-ui, sans-serif',
    fontSecondary: 'Inter, system-ui, sans-serif',
    fonts: ['Inter:wght@400;500;600;700', 'JetBrains Mono:wght@400;500'],
    radius: 0.5,
    variables: {
      // Neutral near-blacks, from the cards down to the canvas, with hairlines between them.
      'background-basic-color-1': '#141414',
      'background-basic-color-2': '#101010',
      'background-basic-color-3': '#0a0a0a',
      'background-basic-color-4': '#050505',
      'border-basic-color-1': '#1c1c1c',
      'border-basic-color-2': '#202020',
      'border-basic-color-3': '#262626',
      'border-basic-color-4': '#303030',
      'border-basic-color-5': '#3a3a3a',
      'divider-color': '#262626',
      'text-basic-color': '#ededed',
      'text-hint-color': '#9a9a9a',
      'text-disabled-color': 'rgba(237, 237, 237, 0.4)',
      // Dark text on the amber, which white wouldn't read on.
      'text-control-color': '#141414',
      shadow: '0 0.5rem 1.5rem rgba(0, 0, 0, 0.6)',
      'layout-background-color': '#0a0a0a',
      'header-background-color': 'rgba(10, 10, 10, 0.88)',
      'header-shadow': '0 1px 0 #262626',
      'sidebar-background-color': '#0a0a0a',
      'sidebar-shadow': 'none',
      'card-border-color': '#262626',
      'card-shadow': 'none',
      'input-basic-background-color': '#0a0a0a',
      'input-basic-border-color': '#303030',
      'input-basic-hover-border-color': '#3a3a3a',
      'text-heading-1-font-weight': '600',
      'text-heading-2-font-weight': '600',
      'text-heading-3-font-weight': '600',
      'text-heading-4-font-weight': '600',
      'text-heading-5-font-weight': '600',
      'text-heading-6-font-weight': '600',
      'text-button-font-weight': '500',
      'button-filled-text-transform': 'none',
      'button-outline-text-transform': 'none',
      'button-ghost-text-transform': 'none',
      'button-hero-text-transform': 'none',
      // The product's own variable: the mono face for code, ids and figures.
      'relay-mono': '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
    },
  },
  devices: ['laptop'],
  screens: [
    { id: 'showcase/relay/home', title: 'Home', pageTitle: 'Webhooks and event delivery', files: all('showcase/relay/relay-home.component') },
    { id: 'showcase/relay/pricing', title: 'Pricing', files: all('showcase/relay/relay-pricing.component') },
    { id: 'showcase/relay/overview', title: 'Overview', files: all('showcase/relay/relay-overview.component') },
    {
      id: 'showcase/relay/keys',
      title: 'API keys',
      files: [...all('showcase/relay/relay-keys.component'), 'showcase/relay/parts/relay-create-key-dialog.component.ts'],
    },
    { id: 'showcase/relay/events', title: 'Events', files: all('showcase/relay/relay-events.component') },
    { id: 'showcase/relay/docs', title: 'Docs', files: all('showcase/relay/relay-docs.component') },
  ],
  files: [
    'showcase/relay/relay.routes.ts',
    ...all('showcase/relay/relay-shell.component'),
    'showcase/relay/relay-data.ts',
    'showcase/relay/_relay-page.scss',
  ],
};
