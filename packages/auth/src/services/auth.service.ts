import { inject, Service } from '@angular/core'

import { Observable, of as observableOf } from 'rxjs'
import { switchMap, map } from 'rxjs/operators'

import { NbAuthStrategy } from '../strategies/auth-strategy'
import { NB_AUTH_STRATEGIES } from '../auth.options'
import { NbAuthResult } from './auth-result'
import { NbTokenService } from './token/token.service'
import { NbAuthToken } from './token/token'
import { NbTokenStorageOptions } from './token/token-storage'

/** The "remember me" of a login form's data, if it has one. */
function rememberMe(data: unknown): boolean | undefined {
    return typeof data === 'object' && data !== null && 'rememberMe' in data && typeof data.rememberMe === 'boolean'
        ? data.rememberMe
        : undefined
}

/**
 * Signs in, up and out with a named strategy, and keeps the token it gets in the token storage; the auth components
 * go through it rather than a strategy.
 */
@Service({ autoProvided: false })
export class NbAuthService {
    protected readonly tokenService = inject(NbTokenService)
    protected readonly strategies = inject(NB_AUTH_STRATEGIES)

    /** The stored token; an empty one of the fallback class when there's none. */
    getToken(): Observable<NbAuthToken> {
        return this.tokenService.get()
    }

    /** Whether the stored token is valid. */
    isAuthenticated(): Observable<boolean> {
        return this.getToken()
            .pipe(map((token: NbAuthToken) => token.isValid()))
    }

    /**
     * Whether the stored token is valid, after refreshing it with its strategy when it has a value but isn't valid, e.g.
     * has expired.
     */
    isAuthenticatedOrRefresh(): Observable<boolean> {
        return this.getToken()
            .pipe(
                switchMap((token) => {
                    if (token.getValue() && !token.isValid()) {
                        return this.refreshToken(token.getOwnerStrategyName(), token)
                            .pipe(
                                switchMap((res) => {
                                    if (res.isSuccess()) {
                                        return this.isAuthenticated()
                                    } else {
                                        return observableOf(false)
                                    }
                                })
                            )
                    } else {
                        return observableOf(token.isValid())
                    }
                }))
    }

    /** The token, now and whenever it's set or cleared, also from another tab. */
    onTokenChange(): Observable<NbAuthToken> {
        return this.tokenService.tokenChange()
    }

    /** Whether the token is valid, now and whenever it changes. */
    onAuthenticationChange(): Observable<boolean> {
        return this.onTokenChange()
            .pipe(map((token: NbAuthToken) => token.isValid()))
    }

    /**
     * Signs in with the strategy, and keeps the token it gets. A `rememberMe` in `data`, as the login form sends, tells
     * whether the token outlives the browser session; without it the token stays where the current one is, or is
     * remembered.
     *
     * @param data what the strategy takes, such as the login form's `NbAuthCredentials`
     */
    authenticate(strategyName: string, data?: unknown): Observable<NbAuthResult> {
        return this.getStrategy(strategyName).authenticate(data)
            .pipe(
                switchMap((result: NbAuthResult) =>
                // The login form's "remember me": without it the token is remembered, as after a redirect.
                    this.processResultToken(result, { remember: rememberMe(data) })
                )
            )
    }

    /** Registers with the strategy, and keeps the token it gets. */
    register(strategyName: string, data?: unknown): Observable<NbAuthResult> {
        return this.getStrategy(strategyName).register(data)
            .pipe(
                switchMap((result: NbAuthResult) => this.processResultToken(result))
            )
    }

    /** Signs out with the strategy, and clears the token when that succeeds. */
    logout(strategyName: string): Observable<NbAuthResult> {
        return this.getStrategy(strategyName).logout()
            .pipe(
                switchMap((result: NbAuthResult) => {
                    if (result.isSuccess()) {
                        return this.tokenService.clear().pipe(map(() => result))
                    }
                    return observableOf(result)
                })
            )
    }

    /** Asks the strategy to send the password reset instructions, e.g. to the email in `data`. */
    requestPassword(strategyName: string, data?: unknown): Observable<NbAuthResult> {
        return this.getStrategy(strategyName).requestPassword(data)
    }

    /** Sets a new password with the strategy, from `data`, e.g. the reset password form's. */
    resetPassword(strategyName: string, data?: unknown): Observable<NbAuthResult> {
        return this.getStrategy(strategyName).resetPassword(data)
    }

    /** Refreshes the token with the strategy, e.g. given the current token, and keeps the one it gets. */
    refreshToken(strategyName: string, data?: unknown): Observable<NbAuthResult> {
        return this.getStrategy(strategyName).refreshToken(data)
            .pipe(
                switchMap((result: NbAuthResult) => this.processResultToken(result))
            )
    }

    /** The strategy set up under the name; throws when there's none. */
    protected getStrategy(strategyName: string): NbAuthStrategy {
        const found = this.strategies.find((strategy: NbAuthStrategy) => strategy.getName() === strategyName)

        if (!found) {
            throw new TypeError(`There is no Auth Strategy registered under '${strategyName}' name`)
        }

        return found
    }

    private processResultToken(result: NbAuthResult, options?: NbTokenStorageOptions) {
        const token = result.getToken()
        if (result.isSuccess() && token) {
            return this.tokenService.set(token, options)
                .pipe(
                    map(() => result)
                )
        }

        return observableOf(result)
    }
}
