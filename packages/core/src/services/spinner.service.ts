import { inject, Service } from '@angular/core'
import { NB_DOCUMENT } from '../theme.options'

/**
 * Shows the page's loading spinner, the element with the id `nb-global-spinner` in `index.html`, until the registered
 * loaders finish.
 *
 * Without such an element, `load` only waits for the loaders.
 */
@Service()
export class NbSpinnerService {
    private readonly document = inject(NB_DOCUMENT)

    private loaders = new Array<Promise<unknown>>()
    private selector = 'nb-global-spinner'

    /** Adds a promise `load` waits for. */
    registerLoader(method: Promise<unknown>) {
        this.loaders.push(method)
    }

    /** Forgets the registered loaders. */
    clear() {
        this.loaders = []
    }

    /**
     * Shows the spinner until the registered loaders finish, and hides it whether they succeed or fail: resolves with
     * their values, or rejects with the first failure.
     */
    load(): Promise<unknown[]> {
        this.showSpinner()
        return Promise.all(this.loaders).finally(() => this.hideSpinner())
    }

    // The spinner is in index.html, outside the app, so it's shown and hidden through the DOM.
    private showSpinner() {
        const el = this.getSpinnerElement()
        if (el) {
            el.style.display = 'block'
        }
    }

    private hideSpinner() {
        const el = this.getSpinnerElement()
        if (el) {
            el.style.display = 'none'
        }
    }

    private getSpinnerElement() {
        return this.document.getElementById(this.selector)
    }
}
