import { Injectable } from '@angular/core'
import { NbNativeDateService, type NbComponentSize, type NbComponentStatus } from '@liquid-js/lyr-core'

/**
 * Helpers for the design kit's specimen pages: each page renders a component in every combination of the inputs a
 * design tool's symbols and styles are made from, and tags each rendered component with `data-kit`, the inputs it
 * was rendered with, for `packages/design-kit/src/capture.ts` to read.
 */

export const SIZES: ReadonlyArray<NbComponentSize> = ['tiny', 'small', 'medium', 'large', 'giant']
export const STATUSES: ReadonlyArray<NbComponentStatus> = ['basic', 'primary', 'success', 'info', 'warning', 'danger', 'control']

/** Every combination of the given inputs' values, the first input's values changing slowest. */
export function combinations<T extends Record<string, ReadonlyArray<unknown>>>(inputs: T): Array<{ [K in keyof T]: T[K][number] }> {
    return Object.entries(inputs).reduce<Array<Record<string, unknown>>>(
        (list, [input, values]) => list.flatMap((combination) => values.map((value) => ({ ...combination, [input]: value }))),
        [{}]
    ) as Array<{ [K in keyof T]: T[K][number] }>
}

/** The `data-kit` tag of a rendered component: the component's name and the inputs it was rendered with. */
export function kit(component: string, inputs: object): string {
    return JSON.stringify({ component, ...inputs })
}

/** A today of its own, 18 March 2026, so calendars show a today cell in the month they show, whenever they're made. */
@Injectable()
export class FixedTodayDateService extends NbNativeDateService {
    override today(): Date {
        return new Date(2026, 2, 18)
    }
}
