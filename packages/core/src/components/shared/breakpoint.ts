import { computed, inject, Signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { map } from 'rxjs/operators'

import { NbMediaBreakpointsService } from '../../services/breakpoints.service'
import { NbThemeService } from '../../services/theme.service'

/**
 * Whether the window is narrower than a media breakpoint, e.g. `md`, as `nb-layout` measures it: a part that changes
 * on phones, e.g. tabs that fold into a menu. Not before the layout measures the window, e.g. on the server, nor
 * without a breakpoint.
 */
export function belowBreakpoint(name: () => string | undefined): Signal<boolean> {
    const breakpoints = inject(NbMediaBreakpointsService)
    const current = toSignal(inject(NbThemeService).onMediaQueryChange().pipe(map(([, point]) => point)))
    return computed(() => {
        const wanted = name()
        const point = current()
        if (!wanted || !point || isNaN(point.width)) {
            return false
        }
        const limit = breakpoints.getByName(wanted).width
        return !isNaN(limit) && point.width < limit
    })
}
