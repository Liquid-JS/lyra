import { inject, TestBed } from '@angular/core/testing'
import { take } from 'rxjs/operators'

import {
    NbTokenLocalStorage,
    NbTokenStorage,
    NbAuthSimpleToken,
    NbAuthToken,
    nbAuthCreateToken,
    NbTokenService,
    NbAuthJWTToken,
    NB_AUTH_FALLBACK_TOKEN,
    NbAuthTokenParceler,
    NB_AUTH_TOKENS
} from '@liquid-js/lyr-auth'

const noop = () => {}
const ownerStrategyName = 'strategy'

describe('token-service', () => {

    let tokenService: NbTokenService
    let tokenStorage: NbTokenLocalStorage
    const simpleToken = nbAuthCreateToken(NbAuthSimpleToken, 'test value', ownerStrategyName)
    const emptyToken = nbAuthCreateToken(NbAuthSimpleToken, '', ownerStrategyName)
    const testTokenKey = 'auth_app_token'

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: NbTokenStorage, useClass: NbTokenLocalStorage },
                { provide: NB_AUTH_FALLBACK_TOKEN, useValue: NbAuthSimpleToken },
                { provide: NB_AUTH_TOKENS, useValue: [NbAuthSimpleToken, NbAuthJWTToken] },
                NbAuthTokenParceler,
                NbTokenService
            ]
        })
    })

    beforeEach(inject(
        [NbTokenService, NbTokenStorage],
        (_tokenService: NbTokenService, _tokenStorage: NbTokenLocalStorage) => {
            tokenService = _tokenService
            tokenStorage = _tokenStorage
        }
    ))

    afterEach(() => {
        localStorage.removeItem(testTokenKey)
    })

    it('set calls storage set', () => {

        const spy = vi.spyOn(tokenStorage, 'set').mockReturnValue(undefined)

        tokenService.set(simpleToken).subscribe(() => {
            expect(spy).toHaveBeenCalled()
        })
    })

    it('get return null in case token was not set', () => {

        const spy = vi.spyOn(tokenStorage, 'get').mockReturnValue(emptyToken)

        tokenService.get()
            .subscribe((token: NbAuthToken) => {
                expect(spy).toHaveBeenCalled()
                expect(token.getValue()).toEqual('')
                expect(token.isValid()).toBe(false)
            })
    })

    it('should return correct value', () => {
        tokenService.set(simpleToken).subscribe(noop)

        tokenService.get()
            .subscribe((token: NbAuthToken) => {
                expect(token.getValue()).toEqual(simpleToken.getValue())
            })
    })

    it('clear remove token', () => {

        const spy = vi.spyOn(tokenStorage, 'clear').mockReturnValue(undefined)

        tokenService.set(simpleToken).subscribe(noop)

        tokenService.clear().subscribe(() => {
            expect(spy).toHaveBeenCalled()
        })
    })

    it('token should be published', () => new Promise<void>((done) => {
        tokenService.tokenChange()
            .pipe(take(1))
            .subscribe((token: NbAuthToken) => {
                expect(token.getValue()).toEqual('')
            })
        tokenService.set(simpleToken).subscribe(noop)
        tokenService.tokenChange()
            .subscribe((token: NbAuthToken) => {
                expect(token.getValue()).toEqual(simpleToken.getValue())
                done()
            })
    }))

    it('clear should be published', () => new Promise<void>((done) => {
        tokenService.tokenChange()
            .pipe(take(1))
            .subscribe((token: NbAuthToken) => {
                expect(token.getValue()).toEqual('')
            })
        tokenService.set(simpleToken).subscribe(noop)
        tokenService.tokenChange()
            .pipe(take(1))
            .subscribe((token: NbAuthToken) => {
                expect(token.getValue()).toEqual(simpleToken.getValue())
            })
        tokenService.clear().subscribe(noop)
        tokenService.tokenChange()
            .subscribe((token: NbAuthToken) => {
                expect(token.getValue()).toEqual('')
                done()
            })
    }))
})
