import { PLATFORM_ID } from '@angular/core'
import { inject, TestBed } from '@angular/core/testing'

import {
    NbTokenLocalStorage,
    NbTokenStorage,
    NB_AUTH_TOKENS,
    NbAuthSimpleToken,
    nbAuthCreateToken,
    NbAuthJWTToken,
    NB_AUTH_FALLBACK_TOKEN,
    NbAuthTokenParceler
} from '@liquid-js/lyr-auth'

describe('token-storage', () => {

    let tokenStorage: NbTokenStorage
    let tokenParceler: NbAuthTokenParceler
    const testTokenKey = 'auth_app_token'
    const testTokenValue = 'test-token'
    const ownerStrategyName = 'strategy'

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: NbTokenStorage, useClass: NbTokenLocalStorage },
                { provide: NB_AUTH_FALLBACK_TOKEN, useValue: NbAuthSimpleToken },
                { provide: NB_AUTH_TOKENS, useValue: [NbAuthSimpleToken, NbAuthJWTToken] },
                NbAuthTokenParceler
            ]
        })
    })

    beforeEach(inject(
        [NbTokenStorage, NbAuthTokenParceler],
        (_tokenStorage: NbTokenStorage, _tokenParceler: NbAuthTokenParceler) => {
            tokenStorage = _tokenStorage
            tokenParceler = _tokenParceler
        }
    ))

    afterEach(() => {
        localStorage.removeItem(testTokenKey)
    })

    it('set test token', () => {
        const token = nbAuthCreateToken(NbAuthSimpleToken, testTokenValue, ownerStrategyName)

        tokenStorage.set(token)
        expect(localStorage.getItem(testTokenKey)).toEqual(tokenParceler.wrap(token))
    })

    it('setter set invalid token to localStorage as empty string', () => {
        let token

        token = nbAuthCreateToken(NbAuthSimpleToken, null, ownerStrategyName)
        tokenStorage.set(token)
        expect(localStorage.getItem(testTokenKey)).toEqual(tokenParceler.wrap(token))

        token = nbAuthCreateToken(NbAuthSimpleToken, undefined, ownerStrategyName)
        tokenStorage.set(token)
        expect(localStorage.getItem(testTokenKey)).toEqual(tokenParceler.wrap(token))
    })

    it('get return null in case token was not set', () => {
        const token = tokenStorage.get()
        expect(token.getValue()).toBe('')
        expect(token.isValid()).toBe(false)
    })

    it('should return correct value', () => {
        const token = nbAuthCreateToken(NbAuthSimpleToken, 'test', ownerStrategyName)
        localStorage.setItem(testTokenKey, tokenParceler.wrap(token))

        expect(tokenStorage.get().getValue()).toEqual(token.getValue())
    })

    it('clear remove token', () => {
        const token = nbAuthCreateToken(NbAuthSimpleToken, 'test', ownerStrategyName)
        localStorage.setItem(testTokenKey, tokenParceler.wrap(token))

        tokenStorage.clear()

        expect(localStorage.getItem(testTokenKey)).toBeNull()
    })

    it('clear remove token only', () => {
        const token = nbAuthCreateToken(NbAuthSimpleToken, 'test', ownerStrategyName)
        localStorage.setItem(testTokenKey, tokenParceler.wrap(token))
        localStorage.setItem(testTokenKey + '2', tokenParceler.wrap(token))

        tokenStorage.clear()

        expect(localStorage.getItem(testTokenKey + '2')).toEqual(tokenParceler.wrap(token))
        expect(localStorage.getItem(testTokenKey)).toBeNull()
    })
})

/** `sessionStorage` of another tab, in memory. */
function tabSession(): Storage {
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

describe('token-storage with remember me', () => {
    const key = 'auth_app_token'
    let storage: NbTokenLocalStorage
    let parceler: NbAuthTokenParceler
    const token = (value = 'token') => nbAuthCreateToken(NbAuthSimpleToken, value, 'strategy')
    /** The value of a kept token. */
    const valueOf = (raw: string | null) => (raw ? parceler.unwrap(raw).getValue() : null)
    /** Lets the tabs' messages arrive. */
    const delivered = () => new Promise((resolve) => setTimeout(resolve, 30))

    /** Another tab of the same app: its own session, the same local storage. */
    const otherTab = () => {
        const tab = TestBed.runInInjectionContext(() => new NbTokenLocalStorage())
        const session = tabSession();
        (tab as unknown as { session: Storage }).session = session
        return { tab, session }
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: NB_AUTH_FALLBACK_TOKEN, useValue: NbAuthSimpleToken },
                { provide: NB_AUTH_TOKENS, useValue: [NbAuthSimpleToken, NbAuthJWTToken] },
                NbAuthTokenParceler
            ]
        })
        storage = TestBed.runInInjectionContext(() => new NbTokenLocalStorage())
        parceler = TestBed.inject(NbAuthTokenParceler)
    })

    afterEach(() => {
        localStorage.removeItem(key)
        sessionStorage.removeItem(key)
    })

    it('should keep a remembered token in localStorage, and another for the session only', () => {
        storage.set(token('remembered'), { remember: true })
        expect(valueOf(localStorage.getItem(key))).toBe('remembered')
        expect(sessionStorage.getItem(key)).toBeNull()

        storage.set(token('session'), { remember: false })
        expect(valueOf(sessionStorage.getItem(key))).toBe('session')
        expect(localStorage.getItem(key)).toBeNull()
        expect(storage.get().getValue()).toBe('session')
    })

    it('should keep a new token where the current one is, e.g. when it\'s refreshed', () => {
        storage.set(token('session'), { remember: false })
        storage.set(token('refreshed'))
        expect(valueOf(sessionStorage.getItem(key))).toBe('refreshed')
        expect(localStorage.getItem(key)).toBeNull()

        storage.clear()
        expect(sessionStorage.getItem(key)).toBeNull()
        // Without one, it's remembered.
        storage.set(token('first'))
        expect(valueOf(localStorage.getItem(key))).toBe('first')
    })

    it('should share a session token with the other tabs, and its sign-out', async () => {
        const { tab, session } = otherTab()
        const changes = vi.fn()
        tab.changes.subscribe(changes)

        storage.set(token('session'), { remember: false })
        await delivered()
        expect(valueOf(session.getItem(key))).toBe('session')
        expect(tab.get().getValue()).toBe('session')
        expect(changes).toHaveBeenCalled()

        storage.clear()
        await delivered()
        expect(session.getItem(key)).toBeNull()
        expect(tab.get().getValue()).toBeFalsy()
    })

    it('should give a session token to a new tab that asks', async () => {
        storage.set(token('session'), { remember: false })
        const { tab, session } = otherTab();
        // A new tab without a token asks as it opens; this one opened with the page's session, so it asks again.
        (tab as unknown as { post: (message: unknown) => void }).post({ type: 'request' })
        await delivered()
        expect(valueOf(session.getItem(key))).toBe('session')
    })
})

describe('token-storage on the server', () => {
    it('should not touch localStorage', () => {
        TestBed.configureTestingModule({
            providers: [
                { provide: PLATFORM_ID, useValue: 'server' },
                { provide: NbTokenStorage, useClass: NbTokenLocalStorage },
                { provide: NB_AUTH_FALLBACK_TOKEN, useValue: NbAuthSimpleToken },
                { provide: NB_AUTH_TOKENS, useValue: [NbAuthSimpleToken, NbAuthJWTToken] },
                NbAuthTokenParceler
            ]
        })
        const getItem = vi.spyOn(Storage.prototype, 'getItem')
        const setItem = vi.spyOn(Storage.prototype, 'setItem')
        const storage = TestBed.inject(NbTokenStorage)

        expect(storage.get().getValue()).toBeFalsy()
        storage.set(new NbAuthSimpleToken('token', 'strategy'))
        storage.clear()

        expect(getItem).not.toHaveBeenCalled()
        expect(setItem).not.toHaveBeenCalled()
    })
})
