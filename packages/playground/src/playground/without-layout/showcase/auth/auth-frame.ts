import { InjectionToken } from '@angular/core'

/**
 * How the sign-in pages' frame shows a page: in a `card`, or `plain` on a column of its own, as the split frame does.
 * The frame's route provides it.
 */
export const AUTH_FRAME = new InjectionToken<'card' | 'plain'>('AUTH_FRAME', { factory: () => 'card' })
