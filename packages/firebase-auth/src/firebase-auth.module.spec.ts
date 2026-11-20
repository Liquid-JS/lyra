import { assert } from 'vitest'
import { Injector, runInInjectionContext } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { Auth } from '@angular/fire/auth'
import { ActivatedRoute } from '@angular/router'
import { firstValueFrom } from 'rxjs'

import { NbFirebaseFacebookStrategy } from './strategies/facebook/firebase-facebook.strategy'
import { NbFirebaseGoogleStrategy } from './strategies/google/firebase-google.strategy'
import { NbFirebasePasswordStrategy } from './strategies/password/firebase-password.strategy'
import { NbFirebaseTwitterStrategy } from './strategies/twitter/firebase-twitter.strategy'

describe('firebase auth strategies', () => {
    it('pairs each strategy class with its options in setup()', () => {
        const options = { name: 'test' }
        const strategies = [
            NbFirebasePasswordStrategy,
            NbFirebaseGoogleStrategy,
            NbFirebaseFacebookStrategy,
            NbFirebaseTwitterStrategy
        ]
        for (const strategy of strategies) {
            expect(strategy.setup(options)).toEqual([strategy, options])
        }
    })
})

describe('firebase identity provider strategies', () => {
    // A JWT with an `exp` far in the future: { "exp": 4102444800 }.
    const idToken = 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjQxMDI0NDQ4MDB9.c2lnbmF0dXJl'

    function createStrategy(currentUser: unknown) {
        const auth = { authStateReady: () => Promise.resolve(), currentUser } as unknown as Auth
        const injector = Injector.create({
            providers: [{ provide: Auth, useValue: auth }],
            parent: TestBed.inject(Injector)
        })
        const strategy = runInInjectionContext(injector, () => new NbFirebaseGoogleStrategy())
        strategy.setOptions({ name: 'google' })
        return strategy
    }

    it('refreshes the ID token of the signed-in user', async () => {
        const getIdToken = vi.fn().mockResolvedValue(idToken)
        const result = await firstValueFrom(createStrategy({ getIdToken }).refreshToken())

        expect(getIdToken).toHaveBeenCalledWith(true)
        expect(result.isSuccess()).toBe(true)
        const token = result.getToken()
        assert(token)
        expect(token.getValue()).toBe(idToken)
        expect(result.getMessages()).toEqual(['Your token has been successfully refreshed.'])
    })

    it('fails the refresh without a signed-in user', async () => {
        const result = await firstValueFrom(createStrategy(null).refreshToken())

        expect(result.isFailure()).toBe(true)
    })
})

describe('firebase password strategy: reset password', () => {
    function createStrategy(queryParams: Record<string, string>) {
        const injector = Injector.create({
            providers: [
                { provide: Auth, useValue: {} },
                { provide: ActivatedRoute, useValue: { snapshot: { queryParams } } }
            ],
            parent: TestBed.inject(Injector)
        })
        const strategy = runInInjectionContext(injector, () => new NbFirebasePasswordStrategy())
        strategy.setOptions({ name: 'password' })
        // Firebase itself is out of the test: the strategy's seam around confirmPasswordReset.
        const confirm = vi
            .spyOn(strategy as unknown as { confirmPasswordReset: (code: string, password: string) => Promise<void> }, 'confirmPasswordReset')
            .mockResolvedValue()
        return { strategy, confirm }
    }

    it('confirms the reset with the code of the reset link', async () => {
        const { strategy, confirm } = createStrategy({ mode: 'resetPassword', oobCode: 'reset-code' })
        const result = await firstValueFrom(strategy.resetPassword({ password: 'new-password' }))

        expect(confirm).toHaveBeenCalledWith('reset-code', 'new-password')
        expect(result.isSuccess()).toBe(true)
        expect(result.getMessages()).toEqual(['Your password has been successfully changed.'])
    })

    it('prefers a code given with the data', async () => {
        const { strategy, confirm } = createStrategy({ oobCode: 'reset-code' })
        await firstValueFrom(strategy.resetPassword({ code: 'other-code', password: 'new-password' }))

        expect(confirm).toHaveBeenCalledWith('other-code', 'new-password')
    })

    it('fails without a code, without calling Firebase', async () => {
        const { strategy, confirm } = createStrategy({})
        const result = await firstValueFrom(strategy.resetPassword({ password: 'new-password' }))

        expect(confirm).not.toHaveBeenCalled()
        expect(result.isFailure()).toBe(true)
        expect(result.getErrors()).toEqual(['Something went wrong, please try again.'])
    })
})
