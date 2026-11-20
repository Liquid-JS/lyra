import { DestroyRef, inject, Injectable, signal } from '@angular/core'
import { audioFeatures, videoFeatures, type PlayerTarget } from '@videojs/core/dom'
import { resolveAdapterType, type CommonMedia, type Media } from '@videojs/media'
import { HTMLMediaAdapter, HTMLVideoAdapter } from '@videojs/media/dom'
import { combine, createStore } from '@videojs/store'

import { NB_MEDIA_PLAYER_CONFIG } from './media-player.providers'
import type {
    NbMediaAdapter,
    NbMediaAdapterConstructor,
    NbMediaElementKind,
    NbMediaEngine,
    NbMediaExtension,
    NbMediaSource,
    NbMediaSourceKind,
    NbMediaState,
    NbMediaStore
} from './media-types'

/** Video or audio: what a player shows, and the features of its store. */
export type NbMediaKind = 'video' | 'audio'

// Embeds play in an iframe; the other kinds in a video or audio element.
const EMBEDS = new Set<NbMediaSourceKind>([
    'youtube',
    'vimeo',
    'wistia',
    'spotify',
    'soundcloud',
    'mixcloud',
    'tiktok',
    'twitch',
    'dailymotion'
])

// Each loader runs once, so an engine or extension is downloaded the first time any player needs it, and again only
// when that failed.
const loads = new WeakMap<() => unknown, Promise<unknown>>()
function loadOnce<T>(loader: () => T | Promise<T>): Promise<T> {
    let load = loads.get(loader) as Promise<T> | undefined
    if (!load) {
        load = Promise.resolve().then(loader)
        loads.set(loader, load)
        load.catch(() => loads.delete(loader))
    }
    return load
}

/** The engine for a source, and the element it plays in. */
interface Engine {
    adapter: NbMediaAdapterConstructor
    element: NbMediaElementKind
}

/**
 * The media logic of one player: Video.js's store, and the engine and extensions that play its source.
 *
 * @internal
 */
@Injectable()
export class NbMediaController {
    protected readonly config = inject(NB_MEDIA_PLAYER_CONFIG)
    protected store?: NbMediaStore
    protected loading = 0
    protected unload?: () => void

    /** The store's state, as it changes; empty until the player first plays something. */
    readonly state = signal<Partial<NbMediaState>>({}, { equal: () => false })
    /** Why the source can't be played, e.g. no engine is set for its kind, or its engine didn't load. */
    readonly loadError = signal<string | undefined>(undefined)
    /** The element the source plays in, once its engine has loaded. */
    readonly element = signal<HTMLElement | undefined>(undefined)
    /** The engine's media, which dispatches the media's events, once its engine has loaded. */
    readonly media = signal<CommonMedia | undefined>(undefined)

    constructor() {
        inject(DestroyRef).onDestroy(() => {
            this.stop()
            this.store?.destroy()
        })
    }

    /** The store, once the player has started playing something. */
    get current(): NbMediaStore | undefined {
        return this.store
    }

    /** Stops playing the source, and loading one. */
    stop(): void {
        this.loading++
        this.unload?.()
        this.unload = undefined
        this.element.set(undefined)
        this.media.set(undefined)
        this.loadError.set(undefined)
    }

    /**
     * Plays a source in `host`, instead of the one before: the engine for its kind makes the element it plays in, which
     * `prepare` sets up, e.g. with a poster. `container` holds the media and the controls, and goes full screen.
     */
    async load(
        host: HTMLElement,
        container: HTMLElement,
        source: NbMediaSource,
        media: NbMediaKind,
        prepare: (element: HTMLElement, kind: NbMediaElementKind) => void
    ): Promise<void> {
        this.stop()
        const load = this.loading
        const { src, type, ...options } = source
        const kind = resolveAdapterType(src, type) ?? media

        let engine: Engine
        let extensions: NbMediaExtension[]
        try {
            [engine, extensions] = await Promise.all([
                this.engineFor(kind, media, host.ownerDocument),
                Promise.all(this.config.extensions.map((loader) => loadOnce(loader)))
            ])
        } catch (error) {
            if (load === this.loading) {
                this.loadError.set(error instanceof Error ? error.message : String(error))
            }
            return
        }
        if (load !== this.loading) {
            return
        }

        const store = this.init(media)
        const element = host.ownerDocument.createElement(engine.element)
        prepare(element, engine.element)
        host.append(element)

        const adapter: NbMediaAdapter = new engine.adapter()
        adapter.attach(element)
        if (Object.keys(options).length && 'source' in adapter) {
            adapter.source = source
        } else {
            adapter.src = src
        }

        // Every adapter is media the store can control; the type only names what all of them have in common.
        const target: PlayerTarget = { media: adapter as unknown as Media, container }
        const detach = store.attach(target)
        const player = { media: target.media, element, container, store, source }
        const cleanups = extensions.map((extension) => extension(player))

        this.element.set(element)
        this.media.set(adapter as unknown as CommonMedia)
        this.unload = () => {
            for (const cleanup of cleanups) {
                cleanup?.()
            }
            detach()
            adapter.detach()
            adapter.destroy()
            element.remove()
        }
    }

    /** The store, created for video or audio the first time. */
    protected init(media: NbMediaKind): NbMediaStore {
        if (!this.store) {
            const store: NbMediaStore = createStore<PlayerTarget>()(
                combine(...(media === 'video' ? videoFeatures : audioFeatures))
            )
            this.store = store
            this.state.set(store.state)
            store.subscribe(() => this.state.set(store.state))
        }
        return this.store
    }

    /** The engine for a kind of source: the app's, else the browser's own for files, and for HLS where it plays it. */
    protected async engineFor(kind: NbMediaSourceKind, media: NbMediaKind, document: Document): Promise<Engine> {
        const loader = this.config.engines[kind]
        if (loader) {
            const engine: NbMediaEngine = await loadOnce(loader)
            return typeof engine === 'function'
                ? { adapter: engine, element: EMBEDS.has(kind) ? 'iframe' : kind === 'audio' ? 'audio' : media }
                : engine
        }
        const native: Engine = {
            adapter: (media === 'audio' ? HTMLMediaAdapter : HTMLVideoAdapter) as unknown as NbMediaAdapterConstructor,
            element: media
        }
        if (kind === 'video' || kind === 'audio') {
            return native
        }
        // Safari plays HLS itself.
        if (kind === 'hls' && document.createElement('video').canPlayType('application/vnd.apple.mpegurl')) {
            return native
        }
        throw new Error(`No engine plays ${kind} sources; set one with withMediaEngines({ ${kind}: ... }).`)
    }
}
