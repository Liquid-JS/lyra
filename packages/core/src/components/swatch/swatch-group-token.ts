import { InjectionToken, Signal } from '@angular/core'
import type { NbComponentShape, NbComponentSize } from '@liquid-js/lyr-core/base'

/** A swatch as its group sees it. */
export interface NbSwatchOption {
    readonly value: () => unknown
    readonly isDisabled: () => boolean
    readonly ready: () => boolean
    focus(): void
}

/** What a swatch reads of its group: how it looks and whether it's chosen, and the group's handling of it. */
export interface NbSwatchGroup {
    readonly size: Signal<NbComponentSize>
    readonly shape: Signal<NbComponentShape>
    readonly multiple: Signal<boolean>
    readonly isDisabled: Signal<boolean>
    isSelected(swatch: NbSwatchOption): boolean
    isShown(swatch: NbSwatchOption): boolean
    isTabStop(swatch: NbSwatchOption): boolean
    choose(swatch: NbSwatchOption): void
    onKeydown(event: KeyboardEvent, swatch: NbSwatchOption): void
}

/** The group a swatch is in. */
export const NB_SWATCH_GROUP = new InjectionToken<NbSwatchGroup>('Lyra Swatch Group')
