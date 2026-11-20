import { injectNbTexts, NbLocalize } from '@liquid-js/lyr-core';
import type { ColorPickerTexts } from 'nxt-color-picker';

/** @internal */
declare const $localize: NbLocalize;

/**
 * The texts of the colour picker. `provideNbTexts({ colorPicker: { ... } })` changes them, and they're translated with
 * Angular's i18n, as `$localize` messages with ids like `@@nb.colorPicker.invalid`.
 *
 * The dialog's texts, e.g. `ok` or `presetColors`, are `nxt-color-picker`'s, with ids like
 * `@@nxt-color-picker.button.ok`; set them here too to change them.
 */
export interface NbColorPickerTexts extends Partial<ColorPickerTexts> {
  /** Names the field when it has no `aria-label` or `aria-labelledby`. */
  color: string;
  /** Label of the button that clears the colour. */
  clear: string;
  /** The message of the `nbColorPicker` error for text that isn't a colour. */
  invalid: string;
}

declare module '@liquid-js/lyr-core' {
  interface NbTexts {
    colorPicker: NbColorPickerTexts;
  }
}

/** The default texts, in the app's language. @internal */
export function nbColorPickerTexts(): NbColorPickerTexts {
  return {
    color: $localize`:@@nb.colorPicker.color:Color`,
    clear: $localize`:@@nb.colorPicker.clear:Clear color`,
    invalid: $localize`:@@nb.colorPicker.invalid:Enter a valid color`,
  };
}

/** @internal */
export function injectNbColorPickerTexts() {
  return injectNbTexts('colorPicker', nbColorPickerTexts);
}
