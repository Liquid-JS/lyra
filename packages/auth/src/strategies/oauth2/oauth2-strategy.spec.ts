import { assert } from 'vitest'
import { inject, TestBed } from '@angular/core/testing'
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { NB_WINDOW } from '@liquid-js/lyr-core'
import {
    NbOAuth2AuthStrategy,
    NbOAuth2ClientAuthMethod,
    NbOAuth2GrantType,
    NbOAuth2ResponseType,
    NbAuthResult,
    nbAuthCreateToken,
    NbAuthOAuth2Token
} from '@liquid-js/lyr-auth'

function tokenOf(result: NbAuthResult) {
    const token = result.getToken()
    assert(token, 'result has no token')
    return token
}

function createURL(params: any) {
    return Object.keys(params)
        .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
        .join('&')
}

function parseQueryParams(params: string): { [key: string]: string } {
    return params
        ? params.split('&').reduce((acc: any, part: string) => {
            const item = part.split('=')
            acc[item[0]] = decodeURIComponent(item[1])
            return acc
        }, {})
        : {}
}

/** `sessionStorage`, in memory. */
function memoryStorage(): Storage {
    const items = new Map<string, string>()
    return {
        get length() {
            return items.size
        },
        clear: () => items.clear(),
        getItem: (key: string) => items.get(key) ?? null,
        key: (index: number) => [...items.keys()][index] ?? null,
        removeItem: (key: string) => void items.delete(key),
        setItem: (key: string, value: string) => void items.set(key, value)
    }
}

/** A PKCE challenge, as the server checks it: base64url of the verifier's SHA-256. */
async function s256(verifier: string) {
    const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)))
    return btoa(String.fromCharCode(...digest))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')
}

describe('oauth2-auth-strategy', () => {
    let strategy: NbOAuth2AuthStrategy
    let httpMock: HttpTestingController
    let routeMock: any
    let windowMock: any

    const successMessages = ['You have been successfully authenticated.']
    const errorMessages = ['Something went wrong, please try again.']
    const authHeader = 'Basic Y2xpZW50SWQ6Y2xpZW50U2VjcmV0'

    const tokenSuccessResponse = {
        access_token: '2YotnFZFEjr1zCsicMWpAA',
        expires_in: 3600,
        refresh_token: 'tGzv3JOkF0XG5Qx2TlKWIA',
        example_parameter: 'example_value'
    }

    const tokenWithoutRefreshTokenResponse = {
        access_token: '8uoloUIg765fHGF9jknjksdn9',
        expires_in: 3600,
        example_parameter: 'example_refresh_value'
    }

    const refreshedTokenPayload = {
        access_token: '8uoloUIg765fHGF9jknjksdn9',
        expires_in: 3600,
        refresh_token: 'tGzv3JOkF0XG5Qx2TlKWIA',
        example_parameter: 'example_refresh_value'
    }

    const refreshedTokenResponse = {
        access_token: '8uoloUIg765fHGF9jknjksdn9',
        expires_in: 3600,
        refresh_token: 'dfsjkgkdh989JHJHJDSHJns',
        example_parameter: 'example_refresh_value'
    }

    const tokenErrorResponse = {
        error: 'unauthorized_client',
        error_description: 'unauthorized',
        error_uri: 'some'
    }

    const successToken = nbAuthCreateToken(NbAuthOAuth2Token, tokenSuccessResponse, 'strategy') as NbAuthOAuth2Token
    const refreshedToken = nbAuthCreateToken(NbAuthOAuth2Token, refreshedTokenPayload, 'strategy') as NbAuthOAuth2Token
    const refreshedTokenWithRefreshToken = nbAuthCreateToken(
        NbAuthOAuth2Token,
        refreshedTokenResponse,
        'strategy'
    ) as NbAuthOAuth2Token

    beforeEach(() => {
        windowMock = { location: { href: '' }, sessionStorage: memoryStorage() }
        routeMock = { snapshot: { params: {}, queryParams: {}, fragment: '' } }

        TestBed.configureTestingModule({
            imports: [RouterModule.forRoot([])],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                NbOAuth2AuthStrategy,
                { provide: ActivatedRoute, useFactory: () => routeMock },
                { provide: NB_WINDOW, useFactory: () => windowMock } // useValue will clone, we need reference
            ]
        })
    })

    beforeEach(
        inject(
            [NbOAuth2AuthStrategy, HttpTestingController],
            (_strategy: NbOAuth2AuthStrategy, _httpMock: HttpTestingController) => {
                strategy = _strategy
                httpMock = _httpMock

                strategy.setOptions({})
            }
        )
    )

    afterEach(() => {
        httpMock.verify()
    })

    /** What the browser keeps of the sign-in it started, for the way back. */
    const pending = () => JSON.parse(windowMock.sessionStorage.getItem('nb-oauth2-strategy') ?? 'null')
    /** A sign-in this browser started, which the server redirects back from. */
    const signInStarted = (state = 'state', verifier = 'verifier') =>
        windowMock.sessionStorage.setItem('nb-oauth2-strategy', JSON.stringify({ state, verifier }))
    /** A sign-in in the implicit (token) flow, which has no PKCE verifier. */
    const tokenSignInStarted = (state = 'state') =>
        windowMock.sessionStorage.setItem('nb-oauth2-strategy', JSON.stringify({ state }))
    /** The query of a URL. */
    const queryOf = (url: string) => parseQueryParams(url.split('?')[1])

    describe('out of the box: type CODE', () => {
        const basicOptions = {
            name: 'strategy',
            baseEndpoint: 'http://example.com/',
            clientId: 'clientId'
        }

        beforeEach(() => {
            strategy.setOptions(basicOptions)
        })

        it('redirect to auth server', () => new Promise<void>((done) => {
            windowMock.location = {
                set href(value: string) {
                    const query = queryOf(value)
                    expect(value.startsWith('http://example.com/authorize?response_type=code&client_id=clientId&state=')).toBe(
                        true
                    )
                    // A random state and verifier, kept for the way back, and the verifier's S256 challenge.
                    expect(query['state']).toBe(pending().state)
                    expect(query['state'].length).toBeGreaterThanOrEqual(20)
                    expect(query['code_challenge_method']).toBe('S256')
                    void s256(pending().verifier).then((challenge) => {
                        expect(query['code_challenge']).toBe(challenge)
                        done()
                    })
                }
            }

            strategy.authenticate().subscribe(() => {})
        }))

        it('handle success redirect and sends correct token request', () => new Promise<void>((done) => {
            routeMock.snapshot.queryParams = { code: 'code', state: 'state' }
            signInStarted()

            strategy.authenticate().subscribe((result: NbAuthResult) => {
                expect(result).toBeTruthy()
                expect(result.isSuccess()).toBe(true)
                expect(result.isFailure()).toBe(false)
                expect(tokenOf(result).getValue()).toEqual(successToken.getValue())
                expect(tokenOf(result).getOwnerStrategyName()).toEqual(successToken.getOwnerStrategyName())
                expect(result.getMessages()).toEqual(successMessages)
                expect(result.getErrors()).toEqual([]) // no error message, response is success
                expect(result.getRedirect()).toEqual('/')
                done()
            })

            httpMock
                .expectOne((req) => {
                    const params = parseQueryParams(req.body)
                    return (
                        req.url === 'http://example.com/token' &&
            req.headers.get('Content-Type') === 'application/x-www-form-urlencoded' &&
            decodeURIComponent(params['grant_type']) === NbOAuth2GrantType.AUTHORIZATION_CODE &&
            decodeURIComponent(params['code']) === 'code' &&
            decodeURIComponent(params['client_id']) === 'clientId' &&
            decodeURIComponent(params['code_verifier']) === 'verifier' &&
            !params['redirect_uri']
                    )
                })
                .flush(tokenSuccessResponse)
        }))

        it('refuses a redirect back with another state, or none started, without asking for a token', async () => {
            routeMock.snapshot.queryParams = { code: 'code', state: 'forged' }
            signInStarted()
            let result = await new Promise<NbAuthResult>((resolve) => strategy.authenticate().subscribe(resolve))
            expect(result.isFailure()).toBe(true)
            expect(result.getErrors()).toEqual(["This sign-in couldn't be verified, please try again."])
            expect(result.getToken()).toBeUndefined()

            // The started sign-in is used up: the same redirect again is refused too.
            routeMock.snapshot.queryParams = { code: 'code', state: 'state' }
            result = await new Promise<NbAuthResult>((resolve) => strategy.authenticate().subscribe(resolve))
            expect(result.isFailure()).toBe(true)
            httpMock.expectNone('http://example.com/token')
        })

        it('sends neither challenge nor verifier without PKCE', async () => {
            strategy.setOptions({ ...basicOptions, authorize: { pkce: false } })
            const url = await new Promise<string>((resolve) => {
                windowMock.location = {
                    set href(value: string) {
                        resolve(value)
                    }
                }
                strategy.authenticate().subscribe(() => {})
            })
            expect(queryOf(url)['code_challenge']).toBeUndefined()
            expect(pending().verifier).toBeUndefined()

            routeMock.snapshot.queryParams = { code: 'code', state: queryOf(url)['state'] }
            strategy.authenticate().subscribe(() => {})
            const request = httpMock.expectOne('http://example.com/token')
            expect(parseQueryParams(request.request.body)['code_verifier']).toBeUndefined()
            request.flush(tokenSuccessResponse)
        })

        it('sends and checks an app\'s own state', async () => {
            strategy.setOptions({ ...basicOptions, authorize: { state: 'app-state' } })
            const url = await new Promise<string>((resolve) => {
                windowMock.location = {
                    set href(value: string) {
                        resolve(value)
                    }
                }
                strategy.authenticate().subscribe(() => {})
            })
            expect(queryOf(url)['state']).toBe('app-state')
            expect(pending().state).toBe('app-state')
        })

        it('handle error redirect back', () => new Promise<void>((done) => {
            routeMock.snapshot.queryParams = tokenErrorResponse

            strategy.authenticate().subscribe((result: NbAuthResult) => {
                expect(result).toBeTruthy()
                expect(result.isSuccess()).toBe(false)
                expect(result.isFailure()).toBe(true)
                expect(result.getToken()).toBeUndefined()
                expect(result.getResponse()).toEqual(tokenErrorResponse)
                expect(result.getMessages()).toEqual([])
                expect(result.getErrors()).toEqual(errorMessages)
                expect(result.getRedirect()).toBeUndefined()
                done()
            })
        }))

        it('handle error token response', () => new Promise<void>((done) => {
            routeMock.snapshot.queryParams = { code: 'code', state: 'state' }
            signInStarted()

            strategy.authenticate().subscribe((result: NbAuthResult) => {
                expect(result).toBeTruthy()
                expect(result.isSuccess()).toBe(false)
                expect(result.isFailure()).toBe(true)
                expect(result.getToken()).toBeUndefined()
                expect((result.getResponse() as HttpErrorResponse).error).toEqual(tokenErrorResponse)
                expect(result.getMessages()).toEqual([])
                expect(result.getErrors()).toEqual([tokenErrorResponse.error_description])
                expect(result.getRedirect()).toBeUndefined()
                done()
            })

            httpMock
                .expectOne((req) => (
                    req.url === 'http://example.com/token' &&
            req.headers.get('Content-Type') === 'application/x-www-form-urlencoded'
                ))
                .flush(tokenErrorResponse, { status: 400, statusText: 'Bad Request' })
        }))

        it('handle refresh token with basic client auth', () => new Promise<void>((done) => {
            strategy.setOptions({
                ...basicOptions,
                clientSecret: 'clientSecret',
                clientAuthMethod: NbOAuth2ClientAuthMethod.BASIC
            })
            strategy.refreshToken(successToken).subscribe((result: NbAuthResult) => {
                expect(result).toBeTruthy()
                expect(result.isSuccess()).toBe(true)
                expect(result.isFailure()).toBe(false)
                expect(tokenOf(result).getValue()).toEqual(successToken.getValue())
                expect(tokenOf(result).getOwnerStrategyName()).toEqual(successToken.getOwnerStrategyName())
                expect(result.getMessages()).toEqual(successMessages)
                expect(result.getErrors()).toEqual([]) // no error message, response is success
                expect(result.getRedirect()).toEqual('/')
                done()
            })

            httpMock
                .expectOne((req) => {
                    const params = parseQueryParams(req.body)
                    return (
                        req.url === 'http://example.com/token' &&
            req.headers.get('Authorization') === authHeader &&
            req.headers.get('Content-Type') === 'application/x-www-form-urlencoded' &&
            decodeURIComponent(params['grant_type']) === NbOAuth2GrantType.REFRESH_TOKEN &&
            decodeURIComponent(params['refresh_token']) === successToken.getRefreshToken() &&
            !params['scope']
                    )
                })
                .flush(tokenSuccessResponse)
        }))

        it('handle refresh token with requestBody client auth', () => new Promise<void>((done) => {
            strategy.setOptions({
                ...basicOptions,
                clientSecret: 'clientSecret',
                clientAuthMethod: NbOAuth2ClientAuthMethod.REQUEST_BODY
            })
            strategy.refreshToken(successToken).subscribe((result: NbAuthResult) => {
                expect(result).toBeTruthy()
                expect(result.isSuccess()).toBe(true)
                expect(result.isFailure()).toBe(false)
                expect(tokenOf(result).getValue()).toEqual(successToken.getValue())
                expect(tokenOf(result).getOwnerStrategyName()).toEqual(successToken.getOwnerStrategyName())
                expect(result.getMessages()).toEqual(successMessages)
                expect(result.getErrors()).toEqual([]) // no error message, response is success
                expect(result.getRedirect()).toEqual('/')
                done()
            })

            httpMock
                .expectOne((req) => {
                    const params = parseQueryParams(req.body)
                    return (
                        req.url === 'http://example.com/token' &&
            req.headers.get('Content-Type') === 'application/x-www-form-urlencoded' &&
            decodeURIComponent(params['grant_type']) === NbOAuth2GrantType.REFRESH_TOKEN &&
            decodeURIComponent(params['refresh_token']) === successToken.getRefreshToken() &&
            decodeURIComponent(params['client_id']) === strategy.getOption('clientId') &&
            decodeURIComponent(params['client_secret']) === strategy.getOption('clientSecret') &&
            !params['scope']
                    )
                })
                .flush(tokenSuccessResponse)
        }))

        it('handle refresh token with NO client auth', () => new Promise<void>((done) => {
            strategy.setOptions(basicOptions)
            strategy.refreshToken(successToken).subscribe((result: NbAuthResult) => {
                expect(result).toBeTruthy()
                expect(result.isSuccess()).toBe(true)
                expect(result.isFailure()).toBe(false)
                expect(tokenOf(result).getValue()).toEqual(successToken.getValue())
                expect(tokenOf(result).getOwnerStrategyName()).toEqual(successToken.getOwnerStrategyName())
                expect(result.getMessages()).toEqual(successMessages)
                expect(result.getErrors()).toEqual([]) // no error message, response is success
                expect(result.getRedirect()).toEqual('/')
                done()
            })

            httpMock
                .expectOne((req) => {
                    const params = parseQueryParams(req.body)
                    return (
                        req.url === 'http://example.com/token' &&
            req.headers.get('Content-Type') === 'application/x-www-form-urlencoded' &&
            decodeURIComponent(params['grant_type']) === NbOAuth2GrantType.REFRESH_TOKEN &&
            decodeURIComponent(params['refresh_token']) === successToken.getRefreshToken() &&
            !params['scope']
                    )
                })
                .flush(tokenSuccessResponse)
        }))

        it('handle refresh token and inserts existing refresh_token if needed', () => new Promise<void>((done) => {
            strategy.setOptions(basicOptions)
            strategy.refreshToken(successToken).subscribe((result: NbAuthResult) => {
                expect(result).toBeTruthy()
                expect(result.isSuccess()).toBe(true)
                expect(result.isFailure()).toBe(false)
                expect(tokenOf(result).getValue()).toEqual(refreshedToken.getValue())
                expect(tokenOf(result).getOwnerStrategyName()).toEqual(refreshedToken.getOwnerStrategyName())
                expect(result.getMessages()).toEqual(successMessages)
                expect(result.getErrors()).toEqual([]) // no error message, response is success
                expect(result.getRedirect()).toEqual('/')
                done()
            })

            httpMock
                .expectOne((req) => {
                    const params = parseQueryParams(req.body)
                    return (
                        req.url === 'http://example.com/token' &&
            req.headers.get('Content-Type') === 'application/x-www-form-urlencoded' &&
            decodeURIComponent(params['grant_type']) === NbOAuth2GrantType.REFRESH_TOKEN &&
            decodeURIComponent(params['refresh_token']) === successToken.getRefreshToken() &&
            !params['scope']
                    )
                })
                .flush(tokenWithoutRefreshTokenResponse)
        }))

        it('Handle refresh-token and leaves refresh_token unchanged if present', () => new Promise<void>((done) => {
            strategy.setOptions(basicOptions)
            strategy.refreshToken(successToken).subscribe((result: NbAuthResult) => {
                expect(result).toBeTruthy()
                expect(result.isSuccess()).toBe(true)
                expect(result.isFailure()).toBe(false)
                expect(tokenOf(result).getValue()).toEqual(refreshedTokenWithRefreshToken.getValue())
                expect(tokenOf(result).getOwnerStrategyName())
                    .toEqual(refreshedTokenWithRefreshToken.getOwnerStrategyName())
                expect(result.getMessages()).toEqual(successMessages)
                expect(result.getErrors()).toEqual([]) // no error message, response is success
                expect(result.getRedirect()).toEqual('/')
                done()
            })

            httpMock
                .expectOne((req) => {
                    const params = parseQueryParams(req.body)
                    return (
                        req.url === 'http://example.com/token' &&
            req.headers.get('Content-Type') === 'application/x-www-form-urlencoded' &&
            decodeURIComponent(params['grant_type']) === NbOAuth2GrantType.REFRESH_TOKEN &&
            decodeURIComponent(params['refresh_token']) === successToken.getRefreshToken() &&
            !params['scope']
                    )
                })
                .flush(refreshedTokenResponse)
        }))

        it('handle error token refresh response', () => new Promise<void>((done) => {
            strategy.refreshToken(successToken).subscribe((result: NbAuthResult) => {
                expect(result).toBeTruthy()
                expect(result.isSuccess()).toBe(false)
                expect(result.isFailure()).toBe(true)
                expect(result.getToken()).toBeUndefined() // we don't have a token at this stage yet
                expect((result.getResponse() as HttpErrorResponse).error).toEqual(tokenErrorResponse)
                expect(result.getMessages()).toEqual([])
                expect(result.getErrors()).toEqual([tokenErrorResponse.error_description])
                expect(result.getRedirect()).toBeUndefined()
                done()
            })

            httpMock
                .expectOne((req) => (
                    req.url === 'http://example.com/token' &&
            req.headers.get('Content-Type') === 'application/x-www-form-urlencoded'
                ))
                .flush(tokenErrorResponse, { status: 400, statusText: 'Bad Request' })
        }))
    })

    describe('configured: type TOKEN', () => {
        const basicOptions = {
            name: 'strategy',
            baseEndpoint: 'http://example.com/',
            clientId: 'clientId',
            authorize: {
                responseType: NbOAuth2ResponseType.TOKEN
            }
        }

        beforeEach(() => {
            strategy.setOptions(basicOptions)
        })

        it('redirect to auth server', () => new Promise<void>((done) => {
            windowMock.location = {
                set href(value: string) {
                    const query = queryOf(value)
                    expect(value.startsWith('http://example.com/authorize?response_type=token&client_id=clientId&state=')).toBe(
                        true
                    )
                    expect(query['state']).toBe(pending().state)
                    // No PKCE without a code.
                    expect(query['code_challenge']).toBeUndefined()
                    expect(pending().verifier).toBeUndefined()
                    done()
                }
            }

            strategy.authenticate().subscribe(() => {})
        }))

        it('handle success redirect back with token', () => new Promise<void>((done) => {
            const token = { access_token: 'token', token_type: 'bearer' }

            routeMock.snapshot.fragment = createURL({ ...token, state: 'state' })
            tokenSignInStarted()

            strategy.authenticate().subscribe((result: NbAuthResult) => {
                expect(result).toBeTruthy()
                expect(result.isSuccess()).toBe(true)
                expect(result.isFailure()).toBe(false)

                expect(tokenOf(result).getValue()).toEqual(
                    nbAuthCreateToken(NbAuthOAuth2Token, token, 'strategy').getValue()
                )
                expect(result.getMessages()).toEqual(successMessages)
                expect(result.getErrors()).toEqual([]) // no error message, response is success
                expect(result.getRedirect()).toEqual('/')
                done()
            })
        }))

        it('refuses a token brought back with another state', async () => {
            routeMock.snapshot.fragment = createURL({ access_token: 'token', token_type: 'bearer', state: 'forged' })
            tokenSignInStarted()
            const result = await new Promise<NbAuthResult>((resolve) => strategy.authenticate().subscribe(resolve))
            expect(result.isFailure()).toBe(true)
            expect(result.getToken()).toBeUndefined()
        })

        it('handle error redirect back', () => new Promise<void>((done) => {
            routeMock.snapshot.fragment = createURL(tokenErrorResponse)

            strategy.authenticate().subscribe((result: NbAuthResult) => {
                expect(result).toBeTruthy()
                expect(result.isSuccess()).toBe(false)
                expect(result.isFailure()).toBe(true)
                expect(result.getToken()).toBeUndefined() // we don't have a token at this stage yet
                expect(result.getResponse()).toEqual(tokenErrorResponse)
                expect(result.getMessages()).toEqual([])
                expect(result.getErrors()).toEqual(errorMessages)
                expect(result.getRedirect()).toBeUndefined()
                done()
            })
        }))
    })

    describe('configured redirect, redirectUri, scope and additional params: type TOKEN', () => {
        const basicOptions = {
            name: 'strategy',
            baseEndpoint: 'http://example.com/',
            clientId: 'clientId',
            redirect: {
                success: '/success',
                failure: '/failure'
            },
            authorize: {
                endpoint: 'custom',
                redirectUri: 'http://localhost:4200/callback',
                scope: 'read',
                params: {
                    display: 'popup',
                    foo: 'bar'
                }
            },
            token: {
                endpoint: 'custom',
                redirectUri: 'http://localhost:4200/callback'
            },
            refresh: {
                endpoint: 'custom',
                scope: 'read'
            }
        }

        beforeEach(() => {
            strategy.setOptions(basicOptions)
        })

        it('redirect to auth server', () => new Promise<void>((done) => {
            windowMock.location = {
                set href(value: string) {
                    const baseUrl = 'http://example.com/custom?response_type=code&client_id=clientId&redirect_uri='
                    const redirect = encodeURIComponent('http://localhost:4200/callback')
                    const query = queryOf(value)

                    expect(value.startsWith(`${baseUrl}${redirect}&scope=read&state=`)).toBe(true)
                    expect(value.endsWith('&display=popup&foo=bar')).toBe(true)
                    expect(query['state']).toBe(pending().state)
                    expect(query['code_challenge_method']).toBe('S256')
                    done()
                }
            }

            strategy.authenticate().subscribe(() => {})
        }))

        it('handle success redirect and sends correct token request with NO client Auth', () => new Promise<void>((done) => {
            routeMock.snapshot.queryParams = { code: 'code', state: 'state' }
            signInStarted()

            strategy.authenticate().subscribe((result: NbAuthResult) => {
                expect(result).toBeTruthy()
                expect(result.isSuccess()).toBe(true)
                expect(result.isFailure()).toBe(false)
                expect(tokenOf(result).getValue()).toEqual(successToken.getValue())
                expect(tokenOf(result).getOwnerStrategyName()).toEqual(successToken.getOwnerStrategyName())
                expect(result.getMessages()).toEqual(successMessages)
                expect(result.getErrors()).toEqual([]) // no error message, response is success
                expect(result.getRedirect()).toEqual('/success')
                done()
            })

            httpMock
                .expectOne((req) => {
                    const params = parseQueryParams(req.body)
                    return (
                        req.url === 'http://example.com/custom' &&
            req.headers.get('Content-Type') === 'application/x-www-form-urlencoded' &&
            decodeURIComponent(params['grant_type']) === NbOAuth2GrantType.AUTHORIZATION_CODE &&
            decodeURIComponent(params['code']) === 'code' &&
            decodeURIComponent(params['client_id']) === 'clientId' &&
            decodeURIComponent(params['redirect_uri']) === 'http://localhost:4200/callback'
                    )
                })
                .flush(tokenSuccessResponse)
        }))

        it('handle success redirect and sends correct token request with BASIC client Auth', () => new Promise<void>((done) => {
            routeMock.snapshot.queryParams = { code: 'code', state: 'state' }
            signInStarted()
            strategy.setOptions({
                ...basicOptions,
                clientSecret: 'clientSecret',
                clientAuthMethod: NbOAuth2ClientAuthMethod.BASIC
            })

            strategy.authenticate().subscribe((result: NbAuthResult) => {
                expect(result).toBeTruthy()
                expect(result.isSuccess()).toBe(true)
                expect(result.isFailure()).toBe(false)
                expect(tokenOf(result).getValue()).toEqual(successToken.getValue())
                expect(tokenOf(result).getOwnerStrategyName()).toEqual(successToken.getOwnerStrategyName())
                expect(result.getMessages()).toEqual(successMessages)
                expect(result.getErrors()).toEqual([]) // no error message, response is success
                expect(result.getRedirect()).toEqual('/success')
                done()
            })

            httpMock
                .expectOne((req) => {
                    const params = parseQueryParams(req.body)
                    return (
                        req.url === 'http://example.com/custom' &&
            req.headers.get('Authorization') === authHeader &&
            req.headers.get('Content-Type') === 'application/x-www-form-urlencoded' &&
            decodeURIComponent(params['grant_type']) === NbOAuth2GrantType.AUTHORIZATION_CODE &&
            decodeURIComponent(params['code']) === 'code' &&
            decodeURIComponent(params['client_id']) === 'clientId' &&
            decodeURIComponent(params['redirect_uri']) === 'http://localhost:4200/callback'
                    )
                })
                .flush(tokenSuccessResponse)
        }))

        it('handle success redirect and sends correct token request with REQUEST_BODY client Auth', () => new Promise<void>((done) => {
            routeMock.snapshot.queryParams = { code: 'code', state: 'state' }
            signInStarted()
            strategy.setOptions({
                ...basicOptions,
                clientSecret: 'clientSecret',
                clientAuthMethod: NbOAuth2ClientAuthMethod.REQUEST_BODY
            })

            strategy.authenticate().subscribe((result: NbAuthResult) => {
                expect(result).toBeTruthy()
                expect(result.isSuccess()).toBe(true)
                expect(result.isFailure()).toBe(false)
                expect(tokenOf(result).getValue()).toEqual(successToken.getValue())
                expect(tokenOf(result).getOwnerStrategyName()).toEqual(successToken.getOwnerStrategyName())
                expect(result.getMessages()).toEqual(successMessages)
                expect(result.getErrors()).toEqual([]) // no error message, response is success
                expect(result.getRedirect()).toEqual('/success')
                done()
            })

            httpMock
                .expectOne((req) => {
                    const params = parseQueryParams(req.body)
                    return (
                        req.url === 'http://example.com/custom' &&
            req.headers.get('Content-Type') === 'application/x-www-form-urlencoded' &&
            decodeURIComponent(params['grant_type']) === NbOAuth2GrantType.AUTHORIZATION_CODE &&
            decodeURIComponent(params['code']) === 'code' &&
            decodeURIComponent(params['client_id']) === strategy.getOption('clientId') &&
            decodeURIComponent(params['client_secret']) === strategy.getOption('clientSecret') &&
            decodeURIComponent(params['redirect_uri']) === 'http://localhost:4200/callback'
                    )
                })
                .flush(tokenSuccessResponse)
        }))

        it('handle error redirect back', () => new Promise<void>((done) => {
            routeMock.snapshot.queryParams = tokenErrorResponse

            strategy.authenticate().subscribe((result: NbAuthResult) => {
                expect(result).toBeTruthy()
                expect(result.isSuccess()).toBe(false)
                expect(result.isFailure()).toBe(true)
                expect(result.getToken()).toBeUndefined()
                expect(result.getResponse()).toEqual(tokenErrorResponse)
                expect(result.getMessages()).toEqual([])
                expect(result.getErrors()).toEqual(errorMessages)
                expect(result.getRedirect()).toEqual('/failure')
                done()
            })
        }))
        it('handle refresh token with NO client auth', () => new Promise<void>((done) => {
            strategy.setOptions({
                ...basicOptions,
                clientId: 'clientId'
            })

            strategy.refreshToken(successToken).subscribe((result: NbAuthResult) => {
                expect(result).toBeTruthy()
                expect(result.isSuccess()).toBe(true)
                expect(result.isFailure()).toBe(false)
                expect(tokenOf(result).getValue()).toEqual(successToken.getValue())
                expect(tokenOf(result).getOwnerStrategyName()).toEqual(successToken.getOwnerStrategyName())
                expect(result.getMessages()).toEqual(successMessages)
                expect(result.getErrors()).toEqual([]) // no error message, response is success
                expect(result.getRedirect()).toEqual('/success')
                done()
            })

            httpMock
                .expectOne((req) => {
                    const params = parseQueryParams(req.body)
                    return (
                        req.url === 'http://example.com/custom' &&
            req.headers.get('Content-Type') === 'application/x-www-form-urlencoded' &&
            decodeURIComponent(params['grant_type']) === NbOAuth2GrantType.REFRESH_TOKEN &&
            decodeURIComponent(params['refresh_token']) === successToken.getRefreshToken() &&
            decodeURIComponent(params['scope']) === 'read' &&
            decodeURIComponent(params['client_id']) === 'clientId'
                    )
                })
                .flush(tokenSuccessResponse)
        }))

        it('handle refresh token with BASIC client auth', () => new Promise<void>((done) => {
            strategy.setOptions({
                ...basicOptions,
                clientSecret: 'clientSecret',
                clientAuthMethod: NbOAuth2ClientAuthMethod.BASIC
            })

            strategy.refreshToken(successToken).subscribe((result: NbAuthResult) => {
                expect(result).toBeTruthy()
                expect(result.isSuccess()).toBe(true)
                expect(result.isFailure()).toBe(false)
                expect(tokenOf(result).getValue()).toEqual(successToken.getValue())
                expect(tokenOf(result).getOwnerStrategyName()).toEqual(successToken.getOwnerStrategyName())
                expect(result.getMessages()).toEqual(successMessages)
                expect(result.getErrors()).toEqual([]) // no error message, response is success
                expect(result.getRedirect()).toEqual('/success')
                done()
            })

            httpMock
                .expectOne((req) => {
                    const params = parseQueryParams(req.body)
                    return (
                        req.url === 'http://example.com/custom' &&
            req.headers.get('Authorization') === authHeader &&
            req.headers.get('Content-Type') === 'application/x-www-form-urlencoded' &&
            decodeURIComponent(params['grant_type']) === NbOAuth2GrantType.REFRESH_TOKEN &&
            decodeURIComponent(params['refresh_token']) === successToken.getRefreshToken() &&
            decodeURIComponent(params['scope']) === 'read'
                    )
                })
                .flush(tokenSuccessResponse)
        }))

        it('handle refresh token with REQUEST_BODY client auth', () => new Promise<void>((done) => {
            strategy.setOptions({
                ...basicOptions,
                clientSecret: 'clientSecret',
                clientAuthMethod: NbOAuth2ClientAuthMethod.REQUEST_BODY
            })

            strategy.refreshToken(successToken).subscribe((result: NbAuthResult) => {
                expect(result).toBeTruthy()
                expect(result.isSuccess()).toBe(true)
                expect(result.isFailure()).toBe(false)
                expect(tokenOf(result).getValue()).toEqual(successToken.getValue())
                expect(tokenOf(result).getOwnerStrategyName()).toEqual(successToken.getOwnerStrategyName())
                expect(result.getMessages()).toEqual(successMessages)
                expect(result.getErrors()).toEqual([]) // no error message, response is success
                expect(result.getRedirect()).toEqual('/success')
                done()
            })

            httpMock
                .expectOne((req) => {
                    const params = parseQueryParams(req.body)
                    return (
                        req.url === 'http://example.com/custom' &&
            req.headers.get('Content-Type') === 'application/x-www-form-urlencoded' &&
            decodeURIComponent(params['grant_type']) === NbOAuth2GrantType.REFRESH_TOKEN &&
            decodeURIComponent(params['refresh_token']) === successToken.getRefreshToken() &&
            decodeURIComponent(params['client_id']) === strategy.getOption('clientId') &&
            decodeURIComponent(params['client_secret']) === strategy.getOption('clientSecret') &&
            decodeURIComponent(params['scope']) === 'read'
                    )
                })
                .flush(tokenSuccessResponse)
        }))

        it('handle error token response', () => new Promise<void>((done) => {
            routeMock.snapshot.queryParams = { code: 'code', state: 'state' }
            signInStarted()

            strategy.authenticate().subscribe((result: NbAuthResult) => {
                expect(result).toBeTruthy()
                expect(result.isSuccess()).toBe(false)
                expect(result.isFailure()).toBe(true)
                expect(result.getToken()).toBeUndefined()
                expect((result.getResponse() as HttpErrorResponse).error).toEqual(tokenErrorResponse)
                expect(result.getMessages()).toEqual([])
                expect(result.getErrors()).toEqual([tokenErrorResponse.error_description])
                expect(result.getRedirect()).toEqual('/failure')
                done()
            })

            httpMock
                .expectOne((req) => (
                    req.url === 'http://example.com/custom' &&
            req.headers.get('Content-Type') === 'application/x-www-form-urlencoded'
                ))
                .flush(tokenErrorResponse, { status: 400, statusText: 'Bad Request' })
        }))
    })

    describe('configured: additionnal param: token, grant_type:password', () => {
        const scope = 'theScope'
        const basicOptions = {
            name: 'strategy',
            baseEndpoint: 'http://example.com/',
            clientId: 'clientId',
            token: {
                grantType: NbOAuth2GrantType.PASSWORD,
                endpoint: 'token',
                scope
            }
        }

        beforeEach(() => {
            strategy.setOptions(basicOptions)
        })

        it('handle success login with NO client auth', () => new Promise<void>((done) => {
            const credentials = { email: 'example@akveo.com', password: '123456' }
            strategy.authenticate(credentials).subscribe((result: NbAuthResult) => {
                expect(result).toBeTruthy()
                expect(result.isSuccess()).toBe(true)
                expect(result.isFailure()).toBe(false)
                expect(tokenOf(result).getValue()).toEqual(successToken.getValue())
                expect(tokenOf(result).getOwnerStrategyName()).toEqual(successToken.getOwnerStrategyName())
                expect(result.getMessages()).toEqual(successMessages)
                expect(result.getErrors()).toEqual([]) // no error message, response is success
                expect(result.getRedirect()).toEqual('/')
                done()
            })

            httpMock
                .expectOne((req) => {
                    const params = parseQueryParams(req.body)
                    return (
                        req.url === 'http://example.com/token' &&
            req.headers.get('Content-Type') === 'application/x-www-form-urlencoded' &&
            decodeURIComponent(params['grant_type']) === NbOAuth2GrantType.PASSWORD &&
            decodeURIComponent(params['username']) === credentials.email &&
            decodeURIComponent(params['password']) === credentials.password &&
            decodeURIComponent(params['scope']) === scope
                    )
                })
                .flush(tokenSuccessResponse)
        }))

        it('handle success login with BASIC client auth', () => new Promise<void>((done) => {
            const credentials = { email: 'example@akveo.com', password: '123456' }
            strategy.setOptions({
                ...basicOptions,
                clientSecret: 'clientSecret',
                clientAuthMethod: NbOAuth2ClientAuthMethod.BASIC
            })

            strategy.authenticate(credentials).subscribe((result: NbAuthResult) => {
                expect(result).toBeTruthy()
                expect(result.isSuccess()).toBe(true)
                expect(result.isFailure()).toBe(false)
                expect(tokenOf(result).getValue()).toEqual(successToken.getValue())
                expect(tokenOf(result).getOwnerStrategyName()).toEqual(successToken.getOwnerStrategyName())
                expect(result.getMessages()).toEqual(successMessages)
                expect(result.getErrors()).toEqual([]) // no error message, response is success
                expect(result.getRedirect()).toEqual('/')
                done()
            })

            httpMock
                .expectOne((req) => {
                    const params = parseQueryParams(req.body)
                    return (
                        req.url === 'http://example.com/token' &&
            req.headers.get('Content-Type') === 'application/x-www-form-urlencoded' &&
            req.headers.get('Authorization') === authHeader &&
            decodeURIComponent(params['grant_type']) === NbOAuth2GrantType.PASSWORD &&
            decodeURIComponent(params['username']) === credentials.email &&
            decodeURIComponent(params['password']) === credentials.password &&
            decodeURIComponent(params['scope']) === scope
                    )
                })
                .flush(tokenSuccessResponse)
        }))

        it('handle success login with REQUEST_BODY client auth', () => new Promise<void>((done) => {
            const credentials = { email: 'example@akveo.com', password: '123456' }
            strategy.setOptions({
                ...basicOptions,
                clientSecret: 'clientSecret',
                clientAuthMethod: NbOAuth2ClientAuthMethod.REQUEST_BODY
            })

            strategy.authenticate(credentials).subscribe((result: NbAuthResult) => {
                expect(result).toBeTruthy()
                expect(result.isSuccess()).toBe(true)
                expect(result.isFailure()).toBe(false)
                expect(tokenOf(result).getValue()).toEqual(successToken.getValue())
                expect(tokenOf(result).getOwnerStrategyName()).toEqual(successToken.getOwnerStrategyName())
                expect(result.getMessages()).toEqual(successMessages)
                expect(result.getErrors()).toEqual([]) // no error message, response is success
                expect(result.getRedirect()).toEqual('/')
                done()
            })

            httpMock
                .expectOne((req) => {
                    const params = parseQueryParams(req.body)
                    return (
                        req.url === 'http://example.com/token' &&
            req.headers.get('Content-Type') === 'application/x-www-form-urlencoded' &&
            decodeURIComponent(params['grant_type']) === NbOAuth2GrantType.PASSWORD &&
            decodeURIComponent(params['username']) === credentials.email &&
            decodeURIComponent(params['password']) === credentials.password &&
            decodeURIComponent(params['scope']) === scope &&
            decodeURIComponent(params['client_id']) === strategy.getOption('clientId') &&
            decodeURIComponent(params['client_secret']) === strategy.getOption('clientSecret')
                    )
                })
                .flush(tokenSuccessResponse)
        }))

        it('handle error login', () => new Promise<void>((done) => {
            strategy.setOptions(basicOptions)
            const credentials = { email: 'example@akveo.com', password: '123456' }

            strategy.authenticate(credentials).subscribe((result: NbAuthResult) => {
                expect(result).toBeTruthy()
                expect(result.isSuccess()).toBe(false)
                expect(result.isFailure()).toBe(true)
                expect(result.getToken()).toBeUndefined() // we don't have a token at this stage yet
                expect((result.getResponse() as HttpErrorResponse).error).toEqual(tokenErrorResponse)
                expect(result.getMessages()).toEqual([])
                expect(result.getErrors()).toEqual([tokenErrorResponse.error_description])
                expect(result.getRedirect()).toBeUndefined()
                done()
            })

            httpMock
                .expectOne((req) => {
                    const params = parseQueryParams(req.body)
                    return (
                        req.url === 'http://example.com/token' &&
            req.headers.get('Content-Type') === 'application/x-www-form-urlencoded' &&
            decodeURIComponent(params['grant_type']) === NbOAuth2GrantType.PASSWORD &&
            decodeURIComponent(params['username']) === credentials.email &&
            decodeURIComponent(params['password']) === credentials.password &&
            decodeURIComponent(params['scope']) === scope
                    )
                })
                .flush(tokenErrorResponse, { status: 401, statusText: 'unauthorized' })
        }))
    })
})
