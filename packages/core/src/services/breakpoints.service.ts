import { inject, Service } from '@angular/core'
import { NB_MEDIA_BREAKPOINTS } from '../theme.options'

/** A media breakpoint: its name (`xs`, `sm`, `md`…) and the width it starts at, in pixels. */
export interface NbMediaBreakpoint {
    name: string
    width: number
}

export { DEFAULT_MEDIA_BREAKPOINTS } from '../theme.options'

/**
 * Tells which of the configured media breakpoints a width falls in, e.g. 200px is `xs` with the defaults.
 *
 * The breakpoints come from `NB_MEDIA_BREAKPOINTS`, which `provideNbTheme` sets; `DEFAULT_MEDIA_BREAKPOINTS`
 * otherwise.
 */
@Service()
export class NbMediaBreakpointsService {
    private readonly breakpoints = inject(NB_MEDIA_BREAKPOINTS)

    private readonly breakpointsMap = this.breakpoints.reduce<{ [breakpoint: string]: number }>((res, b) => {
        res[b.name] = b.width
        return res
    }, {})

    /** The breakpoint the width falls in; `unknown`, keeping the width, when none does or there's no width. */
    getByWidth(width?: number): NbMediaBreakpoint {
    // Like getByName('unknown'), an unknown width is NaN.
        const unknown = { name: 'unknown', width: width ?? NaN }
        const breakpoints = this.getBreakpoints()

        return breakpoints
            .find((point: NbMediaBreakpoint, index: number) => {
                const next = breakpoints[index + 1]
                return width !== undefined && width >= point.width && (!next || width < next.width)
            }) || unknown
    }

    /** The breakpoint with the name; `unknown`, with width `NaN`, when there's none. */
    getByName(name: string): NbMediaBreakpoint {
        const unknown = { name: 'unknown', width: NaN }
        const breakpoints = this.getBreakpoints()

        return breakpoints.find((point: NbMediaBreakpoint) => name === point.name) || unknown
    }

    /** The configured breakpoints, in the order given: `getByWidth` expects them by ascending width. */
    getBreakpoints(): NbMediaBreakpoint[] {
        return this.breakpoints
    }

    /** The width each configured breakpoint starts at, by name. */
    getBreakpointsMap(): { [breakpoint: string]: number } {
        return this.breakpointsMap
    }
}
