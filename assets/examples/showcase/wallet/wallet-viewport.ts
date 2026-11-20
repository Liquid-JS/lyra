import { DestroyRef, inject, signal, Signal } from '@angular/core'
import { NB_WINDOW } from '@liquid-js/lyr-core'

/**
 * Whether the viewport is a phone's, as a signal, for what the templates lay out differently there: fewer table
 * columns, a stepper down the page. The styles handle the rest with media queries. Call it in a constructor.
 */
export function phoneViewport(): Signal<boolean> {
    const window = inject(NB_WINDOW, { optional: true })
    const phone = signal(false)
    if (!window || typeof window.matchMedia !== 'function') {
        return phone.asReadonly()
    }
    const query = window.matchMedia('(max-width: 767.98px)')
    const update = () => phone.set(query.matches)
    update()
    query.addEventListener('change', update)
    inject(DestroyRef).onDestroy(() => query.removeEventListener('change', update))
    return phone.asReadonly()
}
