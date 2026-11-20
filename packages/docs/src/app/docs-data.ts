import { inject, InjectionToken, Provider } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { CanMatchFn } from '@angular/router'
import { firstValueFrom } from 'rxjs'

import { DOCS } from './app.options'
import { NgdDocs } from './docs.model'

/** Loads one of the docs' generated data files, e.g. `output.json`: with `HttpClient` in the browser. */
export const NGD_DATA_LOADER = new InjectionToken<<T>(file: string) => Promise<T>>('NGD_DATA_LOADER', {
    factory: () => {
        const http = inject(HttpClient)
        return <T>(file: string) => firstValueFrom(http.get<T>(file))
    }
})

const docsData: { value?: NgdDocs, loading?: Promise<NgdDocs> } = {}

/**
 * Loads the generated API data, `output.json`, once, before a route that shows it is even matched (its routes read
 * the data): the home page and the docs areas. It's served as a static file, being too big to bundle, and the
 * examples in frames open without it.
 */
export const loadDocs: CanMatchFn = async () => {
    const load = inject(NGD_DATA_LOADER)
    docsData.loading ??= load<NgdDocs>('output.json').then((docs) => (docsData.value = docs))
    await docsData.loading
    return true
}

/** The API data, for the routes `loadDocs` guards. */
export function provideDocs(): Provider {
    return {
        provide: DOCS,
        useFactory: () => {
            if (!docsData.value) {
                throw new Error('The API docs are loaded by the routes that show them (`loadDocs`); this one doesn\'t.')
            }
            return docsData.value
        }
    }
}
