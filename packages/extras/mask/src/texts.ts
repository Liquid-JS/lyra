import { injectNbTexts, NbLocalize } from '@liquid-js/lyr-core';

/** @internal */
declare const $localize: NbLocalize;

/**
 * The texts of masked fields. `provideNbTexts({ mask: { ... } })` changes them, and they're translated with Angular's
 * i18n, as `$localize` messages with ids like `@@nb.mask.incomplete`.
 */
export interface NbMaskTexts {
  /** The message of the `nbMask` error for a value that doesn't fill the mask. */
  incomplete: string;
}

declare module '@liquid-js/lyr-core' {
  interface NbTexts {
    mask: NbMaskTexts;
  }
}

/** @internal */
export function injectNbMaskTexts() {
  return injectNbTexts('mask', () => ({
    incomplete: $localize`:@@nb.mask.incomplete:Complete the value`,
  }));
}
