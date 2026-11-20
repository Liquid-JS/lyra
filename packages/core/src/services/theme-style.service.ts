import { DestroyRef, inject, PLATFORM_ID, Service, Signal, signal } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'

import { NB_DOCUMENT } from '../theme.options'

/**
 * Counts changes to what the theme's variables on the page come from: the style and classes of the page and its body,
 * e.g. a variable an app sets there, or another theme's class. Components that read the variables in script, such as
 * a chart that draws on a canvas, read them again as it changes. The theme service's changes come with it.
 */
@Service()
export class NbThemeStyleChanges {
    protected readonly count = signal(0)
    readonly changes: Signal<number> = this.count.asReadonly()

    constructor() {
        const document = inject(NB_DOCUMENT)
        if (!isPlatformBrowser(inject(PLATFORM_ID)) || typeof MutationObserver === 'undefined') {
            return
        }
        let frame = 0
        const observer = new MutationObserver(() => {
            // Once for the changes of a frame, e.g. many variables set one after another.
            if (!frame) {
                frame = requestAnimationFrame(() => {
                    frame = 0
                    this.count.update((count) => count + 1)
                })
            }
        })
        for (const element of [document.documentElement, document.body]) {
            observer.observe(element, { attributes: true, attributeFilter: ['style', 'class'] })
        }
        inject(DestroyRef).onDestroy(() => {
            observer.disconnect()
            cancelAnimationFrame(frame)
        })
    }
}
