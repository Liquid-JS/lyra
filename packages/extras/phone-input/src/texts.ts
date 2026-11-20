import { injectNbTexts, NbLocalize } from '@liquid-js/lyr-core';

/** @internal */
declare const $localize: NbLocalize;

/**
 * The texts of the phone input. `provideNbTexts({ phoneInput: { ... } })` changes them, and they're translated with
 * Angular's i18n, as `$localize` messages with ids like `@@nb.phoneInput.invalid`.
 */
export interface NbPhoneInputTexts {
  /** Names the number field when it has no `aria-label` or `aria-labelledby`. */
  number: string;
  /** Label of the button that picks the country, given the country's name. */
  country: (name: string) => string;
  /** Label of the button that picks the country while there's none. */
  noCountry: string;
  /** Label and placeholder of the field that searches the countries. */
  search: string;
  /** The message of the `nbPhoneNumber` error for a number that isn't valid. */
  invalid: string;
  /** The message of the `nbPhoneNumber` error for a number from a country that isn't allowed. */
  otherCountry: string;
}

declare module '@liquid-js/lyr-core' {
  interface NbTexts {
    phoneInput: NbPhoneInputTexts;
  }
}

/** The default texts, in the app's language. @internal */
export function nbPhoneInputTexts(): NbPhoneInputTexts {
  return {
    number: $localize`:@@nb.phoneInput.number:Phone number`,
    country: (name: string) => $localize`:@@nb.phoneInput.country:Country: ${name}:country:`,
    noCountry: $localize`:@@nb.phoneInput.noCountry:Choose a country`,
    search: $localize`:@@nb.phoneInput.search:Search countries`,
    invalid: $localize`:@@nb.phoneInput.invalid:Enter a valid phone number`,
    otherCountry: $localize`:@@nb.phoneInput.otherCountry:Enter a phone number from one of the allowed countries`,
  };
}

/** @internal */
export function injectNbPhoneInputTexts() {
  return injectNbTexts('phoneInput', nbPhoneInputTexts);
}
