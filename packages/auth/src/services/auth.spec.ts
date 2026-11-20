import { TestBed } from '@angular/core/testing'
import { Injector } from '@angular/core'
import { HttpResponse } from '@angular/common/http'
import { of as observableOf, defer, EMPTY } from 'rxjs'
import { delay, first } from 'rxjs/operators'
import {
    NB_AUTH_OPTIONS,
    NB_AUTH_USER_OPTIONS,
    NB_AUTH_STRATEGIES,
    NB_AUTH_TOKENS,
    NbAuthService,
    NbDummyAuthStrategy,
    nbStrategiesFactory,
    nbOptionsFactory,
    NbAuthResult,
    NbTokenService,
    NbAuthSimpleToken,
    nbAuthCreateToken,
    NbAuthJWTToken,
    NbAuthToken,
    NbTokenLocalStorage,
    NbTokenStorage,
    NB_AUTH_FALLBACK_TOKEN,
    NbAuthTokenParceler
} from '@liquid-js/lyr-auth'

describe('auth-service', () => {
    let authService: NbAuthService
    let tokenService: NbTokenService
    let dummyAuthStrategy: NbDummyAuthStrategy
    const testTokenValue = 'test-token'
    const ownerStrategyName = 'dummy'

    const resp401 = new HttpResponse<unknown>({ body: {}, status: 401 })
    const resp200 = new HttpResponse<unknown>({ body: {}, status: 200 })

    const testToken = nbAuthCreateToken(NbAuthSimpleToken, testTokenValue, ownerStrategyName)
    const invalidToken = nbAuthCreateToken(NbAuthSimpleToken, testTokenValue, ownerStrategyName)
    const emptyToken = nbAuthCreateToken(NbAuthSimpleToken, null, '')

    const failResult = new NbAuthResult(false, resp401, null, ['Something went wrong.'])

    const successResult = new NbAuthResult(true, resp200, '/', [], ['Successfully logged in.'], testToken)

    const successLogoutResult = new NbAuthResult(true, resp200, '/', [], ['Successfully logged out.'])

    const successResetPasswordResult = new NbAuthResult(true, resp200, '/', [], ['Successfully reset password.'])

    const successRequestPasswordResult = new NbAuthResult(true, resp200, '/', [], ['Successfully requested password.'])

    const successRefreshTokenResult = new NbAuthResult(
        true,
        resp200,
        null,
        [],
        ['Successfully refreshed token.'],
        testToken
    )

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: NB_AUTH_OPTIONS, useValue: {} },
                { provide: NB_AUTH_FALLBACK_TOKEN, useValue: NbAuthSimpleToken },
                { provide: NB_AUTH_TOKENS, useValue: [NbAuthSimpleToken, NbAuthJWTToken] },
                NbAuthTokenParceler,
                {
                    provide: NB_AUTH_USER_OPTIONS,
                    useValue: {
                        forms: {
                            login: {
                                redirectDelay: 3000
                            }
                        },
                        strategies: [
                            NbDummyAuthStrategy.setup({
                                name: 'dummy',

                                alwaysFail: true,
                                delay: 1000
                            })
                        ]
                    }
                },
                { provide: NB_AUTH_OPTIONS, useFactory: nbOptionsFactory, deps: [NB_AUTH_USER_OPTIONS] },
                { provide: NB_AUTH_STRATEGIES, useFactory: nbStrategiesFactory, deps: [NB_AUTH_OPTIONS, Injector] },
                { provide: NbTokenStorage, useClass: NbTokenLocalStorage },
                NbTokenService,
                NbAuthService,
                NbDummyAuthStrategy
            ]
        })
        authService = TestBed.inject(NbAuthService)
        tokenService = TestBed.inject(NbTokenService)
        dummyAuthStrategy = TestBed.inject(NbDummyAuthStrategy)
    })

    it('get test token before set', () => {
        const spy = vi.spyOn(tokenService, 'get').mockReturnValue(observableOf(testToken))

        authService.getToken().subscribe((val: NbAuthToken) => {
            expect(spy).toHaveBeenCalled()
            expect(val.getValue()).toEqual(testTokenValue)
        })
    })

    it('is authenticated true if token exists', () => {
        const spy = vi.spyOn(tokenService, 'get').mockReturnValue(observableOf(testToken))

        authService.isAuthenticated().subscribe((isAuth: boolean) => {
            expect(spy).toHaveBeenCalled()
            expect(isAuth).toBeTruthy()
        })
    })

    it("is authenticated false if token doesn't exist", () => {
        const spy = vi.spyOn(tokenService, 'get').mockReturnValue(observableOf(emptyToken))

        authService.isAuthenticated().subscribe((isAuth: boolean) => {
            expect(spy).toHaveBeenCalled()
            expect(isAuth).toBeFalsy()
        })
    })

    it('isAuthenticatedOrRefresh, token valid, strategy refreshToken not called, returns true', () => new Promise<void>((done) => {
        const spy = vi.spyOn(dummyAuthStrategy, 'refreshToken').mockReturnValue(EMPTY)

        vi.spyOn(tokenService, 'get').mockReturnValue(observableOf(testToken))

        authService
            .isAuthenticatedOrRefresh()
            .pipe(first())
            .subscribe((isAuth: boolean) => {
                expect(spy).not.toHaveBeenCalled()
                expect(isAuth).toBeTruthy()
                done()
            })
    }))

    it('isAuthenticatedOrRefresh, token invalid, strategy refreshToken called, returns true', () => new Promise<void>((done) => {
        vi.spyOn(invalidToken, 'isValid').mockReturnValue(false)

        const spy = vi.spyOn(dummyAuthStrategy, 'refreshToken').mockReturnValue(observableOf(successResult))

        vi.spyOn(tokenService, 'get').mockReturnValueOnce(observableOf(invalidToken)).mockReturnValueOnce(observableOf(testToken))

        authService
            .isAuthenticatedOrRefresh()
            .pipe(first())
            .subscribe((isAuth: boolean) => {
                expect(spy).toHaveBeenCalled()
                expect(isAuth).toBeTruthy()
                done()
            })
    }))

    it('isAuthenticatedOrRefresh, token invalid, strategy refreshToken called, returns false', () => new Promise<void>((done) => {
        vi.spyOn(invalidToken, 'isValid').mockReturnValue(false)

        const spy = vi.spyOn(dummyAuthStrategy, 'refreshToken').mockReturnValue(observableOf(failResult))

        vi.spyOn(tokenService, 'get').mockReturnValueOnce(observableOf(invalidToken)).mockReturnValueOnce(observableOf(invalidToken))

        authService
            .isAuthenticatedOrRefresh()
            .pipe(first())
            .subscribe((isAuth: boolean) => {
                expect(spy).toHaveBeenCalled()
                expect(isAuth).toBeFalsy()
                done()
            })
    }))

    it("isAuthenticatedOrRefresh, token doesn't exist, strategy refreshToken called, returns false", () => new Promise<void>((done) => {
        const spy = vi.spyOn(tokenService, 'get').mockReturnValue(observableOf(emptyToken))

        authService
            .isAuthenticatedOrRefresh()
            .pipe(first())
            .subscribe((isAuth: boolean) => {
                expect(spy).toHaveBeenCalled()
                expect(isAuth).toBeFalsy()
                done()
            })
    }))

    it('onTokenChange return correct stream and gets test token', () => new Promise<void>((done) => {
        const spy = vi.spyOn(tokenService, 'tokenChange').mockReturnValue(observableOf(testToken))

        authService
            .onTokenChange()
            .pipe(first())
            .subscribe((token: NbAuthToken) => {
                expect(spy).toHaveBeenCalled()
                expect(token.getValue()).toEqual(testTokenValue)
                done()
            })
    }))

    it('authenticate failed', () => new Promise<void>((done) => {
        const spy = vi.spyOn(dummyAuthStrategy, 'authenticate').mockReturnValue(observableOf(failResult).pipe(delay(1000)))

        authService.authenticate(ownerStrategyName).subscribe((authRes: NbAuthResult) => {
            expect(spy).toHaveBeenCalled()
            expect(authRes.isFailure()).toBeTruthy()
            expect(authRes.isSuccess()).toBeFalsy()
            expect(authRes.getMessages()).toEqual([])
            expect(authRes.getErrors()).toEqual(['Something went wrong.'])
            expect(authRes.getRedirect()).toBeUndefined()
            expect(authRes.getToken()).toBeUndefined()
            expect(authRes.getResponse()).toEqual(resp401)
            done()
        })
    }))

    it('authenticate succeed', () => new Promise<void>((done) => {
        const strategySpy = vi.spyOn(dummyAuthStrategy, 'authenticate').mockReturnValue(observableOf(successResult).pipe(delay(1000)))

        const tokenServiceSetSpy = vi.spyOn(tokenService, 'set').mockReturnValue(observableOf(undefined))

        authService.authenticate(ownerStrategyName).subscribe((authRes: NbAuthResult) => {
            expect(strategySpy).toHaveBeenCalled()
            expect(tokenServiceSetSpy).toHaveBeenCalled()

            expect(authRes.isFailure()).toBeFalsy()
            expect(authRes.isSuccess()).toBeTruthy()
            expect(authRes.getMessages()).toEqual(['Successfully logged in.'])
            expect(authRes.getErrors()).toEqual([])
            expect(authRes.getRedirect()).toEqual('/')
            expect(authRes.getToken()).toEqual(testToken)
            expect(authRes.getResponse()).toEqual(resp200)
            done()
        })
    }))

    it('keeps the token for the session only when the login form doesn\'t remember it', async () => {
        vi.spyOn(dummyAuthStrategy, 'authenticate').mockReturnValue(observableOf(successResult))
        const set = vi.spyOn(tokenService, 'set').mockReturnValue(observableOf(undefined))

        await new Promise((resolve) =>
            authService.authenticate(ownerStrategyName, { email: 'jane@example.com', rememberMe: false }).subscribe(resolve)
        )
        expect(set).toHaveBeenLastCalledWith(testToken, { remember: false })

        // Without the form, e.g. after a redirect, the storage decides: the token is remembered.
        await new Promise((resolve) => authService.authenticate(ownerStrategyName).subscribe(resolve))
        expect(set).toHaveBeenLastCalledWith(testToken, { remember: undefined })
    })

    it('register failed', () => new Promise<void>((done) => {
        const spy = vi.spyOn(dummyAuthStrategy, 'register').mockReturnValue(observableOf(failResult).pipe(delay(1000)))

        authService.register(ownerStrategyName).subscribe((authRes: NbAuthResult) => {
            expect(spy).toHaveBeenCalled()
            expect(authRes.isFailure()).toBeTruthy()
            expect(authRes.isSuccess()).toBeFalsy()
            expect(authRes.getMessages()).toEqual([])
            expect(authRes.getErrors()).toEqual(['Something went wrong.'])
            expect(authRes.getRedirect()).toBeUndefined()
            expect(authRes.getToken()).toBeUndefined()
            expect(authRes.getResponse()).toEqual(resp401)
            done()
        })
    }))

    it('register succeed', () => new Promise<void>((done) => {
        const strategySpy = vi.spyOn(dummyAuthStrategy, 'register').mockReturnValue(observableOf(successResult).pipe(delay(1000)))

        const tokenServiceSetSpy = vi.spyOn(tokenService, 'set').mockReturnValue(observableOf(undefined))

        authService.register(ownerStrategyName).subscribe((authRes: NbAuthResult) => {
            expect(strategySpy).toHaveBeenCalled()
            expect(tokenServiceSetSpy).toHaveBeenCalled()

            expect(authRes.isFailure()).toBeFalsy()
            expect(authRes.isSuccess()).toBeTruthy()
            expect(authRes.getMessages()).toEqual(['Successfully logged in.'])
            expect(authRes.getErrors()).toEqual([])
            expect(authRes.getRedirect()).toEqual('/')
            expect(authRes.getToken()).toEqual(testToken)
            expect(authRes.getResponse()).toEqual(resp200)
            done()
        })
    }))

    it('logout failed', () => new Promise<void>((done) => {
        const spy = vi.spyOn(dummyAuthStrategy, 'logout').mockReturnValue(observableOf(failResult).pipe(delay(1000)))

        authService.logout(ownerStrategyName).subscribe((authRes: NbAuthResult) => {
            expect(spy).toHaveBeenCalled()

            expect(authRes.isFailure()).toBeTruthy()
            expect(authRes.isSuccess()).toBeFalsy()
            expect(authRes.getMessages()).toEqual([])
            expect(authRes.getErrors()).toEqual(['Something went wrong.'])
            expect(authRes.getRedirect()).toBeUndefined()
            expect(authRes.getToken()).toBeUndefined()
            expect(authRes.getResponse()).toEqual(resp401)
            done()
        })
    }))

    it('logout succeed', () => new Promise<void>((done) => {
        const strategyLogoutSpy = vi.spyOn(dummyAuthStrategy, 'logout').mockReturnValue(observableOf(successLogoutResult).pipe(delay(1000)))
        const tokenServiceClearSpy = vi.spyOn(tokenService, 'clear').mockReturnValue(observableOf(undefined))

        authService.logout(ownerStrategyName).subscribe((authRes: NbAuthResult) => {
            expect(strategyLogoutSpy).toHaveBeenCalled()
            expect(tokenServiceClearSpy).toHaveBeenCalled()

            expect(authRes.isFailure()).toBeFalsy()
            expect(authRes.isSuccess()).toBeTruthy()
            expect(authRes.getMessages()).toEqual(['Successfully logged out.'])
            expect(authRes.getErrors()).toEqual([])
            expect(authRes.getRedirect()).toEqual('/')
            expect(authRes.getToken()).toBeUndefined()
            expect(authRes.getResponse()).toEqual(resp200)
            done()
        })
    }))

    it('logout should wait for the token to be cleared', () => new Promise<void>((done) => {
        vi.spyOn(dummyAuthStrategy, 'logout').mockReturnValue(observableOf(successLogoutResult))
        let cleared = false
        // A token service whose clear() is lazy, like one backed by an async storage.
        vi.spyOn(tokenService, 'clear').mockReturnValue(defer(() => {
            cleared = true
            return observableOf(undefined)
        }))

        authService.logout(ownerStrategyName).subscribe(() => {
            expect(cleared).toBe(true)
            done()
        })
    }))

    it('requestPassword failed', () => new Promise<void>((done) => {
        const spy = vi.spyOn(dummyAuthStrategy, 'requestPassword').mockReturnValue(observableOf(failResult).pipe(delay(1000)))

        authService.requestPassword(ownerStrategyName).subscribe((authRes: NbAuthResult) => {
            expect(spy).toHaveBeenCalled()

            expect(authRes.isFailure()).toBeTruthy()
            expect(authRes.isSuccess()).toBeFalsy()
            expect(authRes.getMessages()).toEqual([])
            expect(authRes.getErrors()).toEqual(['Something went wrong.'])
            expect(authRes.getRedirect()).toBeUndefined()
            expect(authRes.getToken()).toBeUndefined()
            expect(authRes.getResponse()).toEqual(resp401)
            done()
        })
    }))

    it('requestPassword succeed', () => new Promise<void>((done) => {
        const strategyLogoutSpy = vi.spyOn(dummyAuthStrategy, 'requestPassword').mockReturnValue(observableOf(successRequestPasswordResult).pipe(delay(1000)))

        authService.requestPassword(ownerStrategyName).subscribe((authRes: NbAuthResult) => {
            expect(strategyLogoutSpy).toHaveBeenCalled()

            expect(authRes.isFailure()).toBeFalsy()
            expect(authRes.isSuccess()).toBeTruthy()
            expect(authRes.getMessages()).toEqual(['Successfully requested password.'])
            expect(authRes.getErrors()).toEqual([])
            expect(authRes.getRedirect()).toEqual('/')
            expect(authRes.getToken()).toBeUndefined()
            expect(authRes.getResponse()).toEqual(resp200)
            done()
        })
    }))

    it('resetPassword failed', () => new Promise<void>((done) => {
        const spy = vi.spyOn(dummyAuthStrategy, 'resetPassword').mockReturnValue(observableOf(failResult).pipe(delay(1000)))

        authService.resetPassword(ownerStrategyName).subscribe((authRes: NbAuthResult) => {
            expect(spy).toHaveBeenCalled()

            expect(authRes.isFailure()).toBeTruthy()
            expect(authRes.isSuccess()).toBeFalsy()
            expect(authRes.getMessages()).toEqual([])
            expect(authRes.getErrors()).toEqual(['Something went wrong.'])
            expect(authRes.getRedirect()).toBeUndefined()
            expect(authRes.getToken()).toBeUndefined()
            expect(authRes.getResponse()).toEqual(resp401)
            done()
        })
    }))

    it('resetPassword succeed', () => new Promise<void>((done) => {
        const strategyLogoutSpy = vi.spyOn(dummyAuthStrategy, 'resetPassword').mockReturnValue(observableOf(successResetPasswordResult).pipe(delay(1000)))

        authService.resetPassword(ownerStrategyName).subscribe((authRes: NbAuthResult) => {
            expect(strategyLogoutSpy).toHaveBeenCalled()

            expect(authRes.isFailure()).toBeFalsy()
            expect(authRes.isSuccess()).toBeTruthy()
            expect(authRes.getMessages()).toEqual(['Successfully reset password.'])
            expect(authRes.getErrors()).toEqual([])
            expect(authRes.getRedirect()).toEqual('/')
            expect(authRes.getToken()).toBeUndefined()
            expect(authRes.getResponse()).toEqual(resp200)
            done()
        })
    }))

    it('refreshToken failed', () => new Promise<void>((done) => {
        const spy = vi.spyOn(dummyAuthStrategy, 'refreshToken').mockReturnValue(observableOf(failResult).pipe(delay(1000)))

        authService.refreshToken(ownerStrategyName).subscribe((authRes: NbAuthResult) => {
            expect(spy).toHaveBeenCalled()
            expect(authRes.isFailure()).toBeTruthy()
            expect(authRes.isSuccess()).toBeFalsy()
            expect(authRes.getMessages()).toEqual([])
            expect(authRes.getErrors()).toEqual(['Something went wrong.'])
            expect(authRes.getRedirect()).toBeUndefined()
            expect(authRes.getToken()).toBeUndefined()
            expect(authRes.getResponse()).toEqual(resp401)
            done()
        })
    }))

    it('refreshToken succeed', () => new Promise<void>((done) => {
        const strategySpy = vi.spyOn(dummyAuthStrategy, 'refreshToken').mockReturnValue(observableOf(successRefreshTokenResult).pipe(delay(1000)))

        const tokenServiceSetSpy = vi.spyOn(tokenService, 'set').mockReturnValue(observableOf(undefined))

        authService.refreshToken(ownerStrategyName).subscribe((authRes: NbAuthResult) => {
            expect(strategySpy).toHaveBeenCalled()
            expect(tokenServiceSetSpy).toHaveBeenCalled()

            expect(authRes.isFailure()).toBeFalsy()
            expect(authRes.isSuccess()).toBeTruthy()
            expect(authRes.getMessages()).toEqual(['Successfully refreshed token.'])
            expect(authRes.getErrors()).toEqual([])
            expect(authRes.getRedirect()).toBeUndefined()
            expect(authRes.getToken()).toEqual(testToken)
            expect(authRes.getResponse()).toEqual(resp200)
            done()
        })
    }))
})
