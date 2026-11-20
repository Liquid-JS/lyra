import { InjectionToken, inject, signal, Service } from '@angular/core'
import { Observable, ReplaySubject } from 'rxjs'
import { share } from 'rxjs/operators'

export enum NbLayoutDirection {
    LTR = 'ltr',
    RTL = 'rtl'
}

/** The layout direction to start with, `ltr` by default; `provideNbTheme` sets it. */
export const NB_LAYOUT_DIRECTION = new InjectionToken<NbLayoutDirection>('Layout direction', {
    factory: () => NbLayoutDirection.LTR
})

/**
 * Keeps the layout direction, `ltr` or `rtl`, which the layout, the overlays and the positions follow.
 *
 * It starts as `NB_LAYOUT_DIRECTION` gives it; `setDirection` changes it at run time.
 */
@Service()
export class NbLayoutDirectionService {
    private readonly directionState = signal(inject(NB_LAYOUT_DIRECTION, { optional: true }) ?? NbLayoutDirection.LTR)

    /**
     * The current layout direction; `isLtr()`, `isRtl()` and `getDirection()` read it too, so they're reactive.
     */
    readonly direction = this.directionState.asReadonly()

    private $directionChange = new ReplaySubject<NbLayoutDirection>(1)

    constructor() {
        this.$directionChange.next(this.direction())
    }

    isLtr(): boolean {
        return this.direction() === NbLayoutDirection.LTR
    }

    isRtl(): boolean {
        return this.direction() === NbLayoutDirection.RTL
    }

    getDirection(): NbLayoutDirection {
        return this.direction()
    }

    setDirection(direction: NbLayoutDirection) {
        this.directionState.set(direction)
        this.$directionChange.next(direction)
    }

    /** Emits the direction when it changes, starting with the current one. */
    onDirectionChange(): Observable<NbLayoutDirection> {
        return this.$directionChange.pipe(share<NbLayoutDirection>())
    }
}
