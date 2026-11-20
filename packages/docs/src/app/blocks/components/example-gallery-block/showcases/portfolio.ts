import { all, type NgdExampleApp } from '../example-app'

/** A photographer's site: an asymmetric picture grid, a project, a CV and a way to get in touch, in editorial type on warm paper. */
export const PORTFOLIO_APP: NgdExampleApp = {
    id: 'portfolio',
    name: 'Portfolio',
    brand: 'Emma Brown',
    summary:
        "A photographer's site: an asymmetric picture grid, a project, a CV and a way to get in touch, in editorial type on warm paper.",
    showcase: true,
    theme: {
        id: 'portfolio',
        name: 'Portfolio',
        base: 'default',
        colors: { primary: '#c2410c' },
        fontPrimary: 'Inter, system-ui, sans-serif',
        fontSecondary: 'Fraunces, Georgia, serif',
        fonts: ['Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600', 'Inter:wght@400;500;600'],
        radius: 0,
        defaults: { button: { size: 'large' } },
        variables: {
            // Warm paper, from off-white to ink.
            'color-basic-100': '#fffdf8',
            'color-basic-200': '#faf6ee',
            'color-basic-300': '#f3ede1',
            'color-basic-400': '#e9e1d2',
            'color-basic-500': '#d6ccb9',
            'color-basic-600': '#a89c88',
            'color-basic-700': '#6b6356',
            'color-basic-800': '#3a362f',
            'color-basic-900': '#26231e',
            'color-basic-1000': '#1a1815',
            'color-basic-1100': '#110f0d',
            'text-basic-color': 'var(--color-basic-900)',
            'text-hint-color': 'var(--color-basic-700)',
            'layout-background-color': 'var(--color-basic-200)',
            // Headings in the serif, light and close-set; the first is the name, as big as the page allows.
            'text-heading-1-font-size': 'clamp(3rem, 9vw, 7.5rem)',
            'text-heading-1-font-weight': '300',
            'text-heading-1-line-height': '0.95',
            'text-heading-2-font-size': '2.5rem',
            'text-heading-2-font-weight': '400',
            'text-heading-2-line-height': '1.1',
            'text-heading-3-font-size': '1.75rem',
            'text-heading-3-font-weight': '400',
            'text-heading-3-line-height': '1.2',
            'text-heading-4-font-size': '1.25rem',
            'text-heading-4-font-weight': '500',
            'text-subtitle-font-weight': '500',
            'text-button-font-weight': '500',
            'text-paragraph-line-height': '1.6',
            // Plain surfaces: no card edges or shadows on the paper.
            'card-border-width': '0',
            'card-shadow': 'none',
            'card-background-color': 'var(--color-basic-100)',
            'divider-color': 'var(--color-basic-400)',
            'input-basic-background-color': 'var(--color-basic-100)',
            'input-basic-border-color': 'var(--color-basic-500)',
            'input-basic-hover-border-color': 'var(--color-basic-700)',
            'select-outline-basic-background-color': 'var(--color-basic-100)',
            'select-outline-basic-border-color': 'var(--color-basic-500)',
            'accordion-shadow': 'none',
            'accordion-item-background-color': 'transparent',
            'accordion-header-text-font-family': 'var(--font-family-secondary)',
            'accordion-header-text-font-size': '1.5rem',
            'accordion-header-text-font-weight': '400',
            'accordion-item-text-font-size': '1rem',
            'button-filled-text-transform': 'none',
            'button-outline-text-transform': 'none',
            'button-ghost-text-transform': 'none',
            'tag-outline-basic-border-color': 'var(--color-basic-500)',
            'tag-outline-basic-text-color': 'var(--color-basic-900)',
            'toastr-border-radius': '0'
        }
    },
    devices: ['laptop', 'phone'],
    screens: [
        { id: 'showcase/portfolio/home', title: 'Home', pageTitle: 'Architecture & portrait photographer', files: all('showcase/portfolio/portfolio-home.component') },
        { id: 'showcase/portfolio/work', title: 'Project', pageTitle: 'Concrete & light', files: all('showcase/portfolio/portfolio-work.component') },
        { id: 'showcase/portfolio/about', title: 'About', files: all('showcase/portfolio/portfolio-about.component') },
        { id: 'showcase/portfolio/contact', title: 'Contact', files: all('showcase/portfolio/portfolio-contact.component') }
    ],
    files: [
        'showcase/portfolio/portfolio.routes.ts',
        ...all('showcase/portfolio/portfolio-shell.component'),
        'showcase/portfolio/portfolio-data.ts',
        'showcase/shared/showcase-grain.component.ts'
    ]
}
