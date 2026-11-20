import { InjectionToken, inject, Service } from '@angular/core'

import { NB_AUTH_TOKENS } from '../../auth.options'
import { nbAuthCreateToken, NbAuthToken, NbAuthTokenClass } from './token'

export interface NbTokenPack {
    name: string
    ownerStrategyName: string
    createdAt: number
    value: string
}

/**
 * The class a stored token is restored as when its own isn't among `NB_AUTH_TOKENS`, and of the empty token when
 * there's none stored; `NbAuthSimpleToken` as `provideNbAuth` sets it.
 */
export const NB_AUTH_FALLBACK_TOKEN = new InjectionToken<NbAuthTokenClass>('Lyra Auth Options')

/** Writes a token as JSON for the storage, with its class, strategy and creation time, and reads it back. */
@Service({ autoProvided: false })
export class NbAuthTokenParceler {
    private readonly fallbackClass = inject<NbAuthTokenClass>(NB_AUTH_FALLBACK_TOKEN)
    private readonly tokenClasses = inject(NB_AUTH_TOKENS)

    wrap(token: NbAuthToken): string {
        return JSON.stringify({
            name: token.getName(),
            ownerStrategyName: token.getOwnerStrategyName(),
            createdAt: token.getCreatedAt().getTime(),
            value: token.toString()
        })
    }

    /** Restores a token from its parcel; the fallback class's empty token without one, or from one it can't read. */
    unwrap(value?: string): NbAuthToken {
        let tokenClass: NbAuthTokenClass = this.fallbackClass
        let tokenValue = ''
        let tokenOwnerStrategyName = ''
        let tokenCreatedAt: Date | undefined

        const tokenPack = this.parseTokenPack(value)
        if (tokenPack) {
            tokenClass = this.getClassByName(tokenPack.name) || this.fallbackClass
            tokenValue = tokenPack.value
            tokenOwnerStrategyName = tokenPack.ownerStrategyName
            tokenCreatedAt = new Date(Number(tokenPack.createdAt))
        }

        return nbAuthCreateToken(tokenClass, tokenValue, tokenOwnerStrategyName, tokenCreatedAt)

    }

    protected getClassByName(name: string): NbAuthTokenClass | undefined {
        return this.tokenClasses.find((tokenClass: NbAuthTokenClass) => tokenClass.NAME === name)
    }

    protected parseTokenPack(value?: string): NbTokenPack | undefined {
        if (value === undefined) {
            return undefined
        }
        try {
            // JSON gives null for a stored `null`
            return JSON.parse(value) ?? undefined
        } catch { }
        return undefined
    }
}
