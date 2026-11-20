import { DOCUMENT, inject, signal, Signal } from '@angular/core'

/** Name of the global style bundle built from `styles/styles.scss` with `inject: false` (see angular.json). */
const PLAYGROUND_THEME_BUNDLE = 'playground-theme'

/**
 * Links the playground theme stylesheet once and reports when it has loaded. It holds the global theme for every
 * component, so it is loaded only when a playground example renders: in the docs app that keeps it off the
 * documentation pages. Examples render only once it has loaded, because some components (the tree grid, for
 * example) read their themed styles when they initialise.
 */
export function loadPlaygroundTheme(): Signal<boolean> {
    const document = inject(DOCUMENT)
    let link = document.getElementById(PLAYGROUND_THEME_BUNDLE) as HTMLLinkElement | null
    const loaded = signal(!!link?.sheet)
    if (loaded()) {
        return loaded.asReadonly()
    }
    if (!link) {
        link = document.createElement('link')
        link.id = PLAYGROUND_THEME_BUNDLE
        link.rel = 'stylesheet'
        link.href = `${PLAYGROUND_THEME_BUNDLE}.css`
        document.head.appendChild(link)
    }
    // Render without the theme rather than not at all if the stylesheet fails to load.
    const done = () => loaded.set(true)
    link.addEventListener('load', done, { once: true })
    link.addEventListener('error', done, { once: true })
    return loaded.asReadonly()
}
