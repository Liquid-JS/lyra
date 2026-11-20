import { InjectionToken, Provider } from '@angular/core'

/**
 * Country names in a language, as the language files of
 * [`i18n-iso-countries`](https://www.npmjs.com/package/i18n-iso-countries) have them, e.g. its `langs/de.json`: the
 * language and the names by ISO 3166-1 code, each a name or a list of names, the first of which is shown.
 */
export interface NbCountryNames {
    locale: string
    countries: Record<string, string | string[]>
}

/** Country names, or a function that loads them, e.g. `() => import('i18n-iso-countries/langs/de.json')`. */
export type NbCountryNamesSource = NbCountryNames | (() => Promise<NbCountryNames | { default: NbCountryNames }>)

/** @internal */
export const NB_COUNTRY_NAMES = new InjectionToken<NbCountryNamesSource>('Lyra Country Names', {
    factory: () => () => import('i18n-iso-countries/langs/en.json', { with: { type: 'json' } })
})

/**
 * Sets the language of the country names in the phone input, English by default, for the app or for the components
 * inside the one that provides it:
 *
 * ```ts
 * providers: [provideNbCountryNames(() => import('i18n-iso-countries/langs/de.json'))]
 * ```
 */
export function provideNbCountryNames(names: NbCountryNamesSource): Provider[] {
    return [{ provide: NB_COUNTRY_NAMES, useValue: names }]
}

/** @internal */
export async function loadCountryNames(source: NbCountryNamesSource): Promise<NbCountryNames> {
    if (typeof source !== 'function') {
        return source
    }
    const loaded = await source()
    return 'default' in loaded ? loaded.default : loaded
}
