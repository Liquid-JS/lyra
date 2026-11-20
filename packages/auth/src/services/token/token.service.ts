import { inject, Service } from '@angular/core'
import { Observable, BehaviorSubject, of as observableOf } from 'rxjs'
import { filter, share } from 'rxjs/operators'

import { NbTokenStorage, NbTokenStorageOptions } from './token-storage'
import { NbAuthToken } from './token'

/** Gets, sets and clears the token in the `NbTokenStorage`, and tells when it changes, also from another tab. */
@Service({ autoProvided: false })
export class NbTokenService {
    protected readonly tokenStorage = inject(NbTokenStorage)

    protected token$ = new BehaviorSubject<NbAuthToken | undefined>(undefined)

    constructor() {
        this.publishStoredToken()
        // E.g. another tab signed in or out.
        this.tokenStorage.changes?.subscribe(() => this.publishStoredToken())
    }

    /** The token, now and whenever it's set or cleared. */
    tokenChange(): Observable<NbAuthToken> {
        return this.token$
            .pipe(
                filter((value): value is NbAuthToken => !!value),
                share()
            )
    }

    /** Stores the token, as `NbAuthService` does with the one a strategy gets. */
    set(token: NbAuthToken, options?: NbTokenStorageOptions): Observable<void> {
        this.tokenStorage.set(token, options)
        this.publishStoredToken()
        return observableOf(undefined)
    }

    /** The stored token. */
    get(): Observable<NbAuthToken> {
        const token = this.tokenStorage.get()
        return observableOf(token)
    }

    /** Removes the token. */
    clear(): Observable<void> {
        this.tokenStorage.clear()
        this.publishStoredToken()
        return observableOf(undefined)
    }

    protected publishStoredToken() {
        this.token$.next(this.tokenStorage.get())
    }
}
