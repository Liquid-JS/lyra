import { DestroyRef, PLATFORM_ID, inject, Service } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { isPlatformBrowser } from '@angular/common'

import { NbAuthToken } from './token'
import { NbAuthTokenParceler } from './token-parceler'

/** Where a token is kept. */
export interface NbTokenStorageOptions {
    /**
     * Whether the token outlives the browser session, e.g. the login form's "remember me". Without it, a token stays
     * where the current one is, or is remembered.
     */
    remember?: boolean
}

export abstract class NbTokenStorage {

    abstract get(): NbAuthToken
    abstract set(token: NbAuthToken, options?: NbTokenStorageOptions): void
    abstract clear(): void

    /** Tells when the token changes from elsewhere, e.g. another tab, so the token service reads it again. */
    readonly changes?: Observable<void>
}

/** What tabs tell each other about a token kept for the session only. */
type NbTokenMessage =
    | { type: 'request' }
    | { type: 'session', raw: string }
    | { type: 'remembered' }
    | { type: 'clear' }

/**
 * Keeps the token in `localStorage` when it's remembered, and in `sessionStorage` when it isn't, so it's gone when the
 * browser closes. Tabs share a session token over a `BroadcastChannel`: a new tab asks the open ones for it, and a
 * new, refreshed or cleared token reaches them all.
 */
@Service({ autoProvided: false })
export class NbTokenLocalStorage extends NbTokenStorage {
    private readonly parceler = inject(NbAuthTokenParceler)

    protected key = 'auth_app_token'

    /** `localStorage`; not set during server-side rendering, where the token is simply absent. */
    protected storage?: Storage
    /** `sessionStorage`, for a token that isn't remembered. */
    protected session?: Storage
    protected channel?: BroadcastChannel
    protected readonly changed = new Subject<void>()
    override readonly changes = this.changed.asObservable()

    constructor() {
        const platformId = inject(PLATFORM_ID, { optional: true })

        super()
        const isBrowser = !platformId || isPlatformBrowser(platformId)
        this.storage = isBrowser && typeof localStorage !== 'undefined' ? localStorage : undefined
        this.session = isBrowser && typeof sessionStorage !== 'undefined' ? sessionStorage : undefined

        if (isBrowser && typeof BroadcastChannel !== 'undefined') {
            const channel = new BroadcastChannel(`nb-auth-${this.key}`)
            this.channel = channel
            channel.onmessage = (event: MessageEvent<NbTokenMessage>) => this.receive(event.data)
            inject(DestroyRef, { optional: true })?.onDestroy(() => channel.close())
            // A new tab without a token asks the open ones for theirs.
            if (!this.read()) {
                this.post({ type: 'request' })
            }
        }
    }

    /** The stored token, the session's over the remembered one; an empty token of the fallback class without one. */
    get(): NbAuthToken {
        return this.parceler.unwrap(this.read())
    }

    /**
     * Keeps the token: in `localStorage` when it's remembered, in `sessionStorage`, shared with the other tabs, when it
     * isn't.
     */
    set(token: NbAuthToken, options?: NbTokenStorageOptions) {
        const raw = this.parceler.wrap(token)
        const remember = options?.remember ?? !this.session?.getItem(this.key)
        if (remember) {
            this.session?.removeItem(this.key)
            this.storage?.setItem(this.key, raw)
            this.post({ type: 'remembered' })
        } else {
            this.storage?.removeItem(this.key)
            this.session?.setItem(this.key, raw)
            this.post({ type: 'session', raw })
        }
    }

    /** Removes the token from both storages, and from the other tabs. */
    clear() {
        this.storage?.removeItem(this.key)
        this.session?.removeItem(this.key)
        this.post({ type: 'clear' })
    }

    protected read(): string | undefined {
        return this.session?.getItem(this.key) ?? this.storage?.getItem(this.key) ?? undefined
    }

    protected post(message: NbTokenMessage) {
        this.channel?.postMessage(message)
    }

    protected receive(message: NbTokenMessage) {
        switch (message.type) {
            case 'request': {
                const raw = this.session?.getItem(this.key)
                if (raw) {
                    this.post({ type: 'session', raw })
                }
                return
            }
            case 'session':
                this.session?.setItem(this.key, message.raw)
                break
            case 'remembered':
            case 'clear':
                this.session?.removeItem(this.key)
                break
        }
        this.changed.next()
    }
}
