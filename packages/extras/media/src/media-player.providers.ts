import { inject, InjectionToken, Provider } from '@angular/core'

import type { NbMediaEngine, NbMediaExtension, NbMediaSourceKind } from './media-types'

/**
 * Loads an engine when a player first needs one, so its code is only downloaded then, e.g.
 * `() => import('@videojs/hlsjs-video').then((m) => m.HlsJsAdapter)`.
 */
export type NbMediaEngineLoader = () => NbMediaEngine | Promise<NbMediaEngine>

/** Loads an extension when a player first needs one, so its code is only downloaded then. */
export type NbMediaExtensionLoader = () => NbMediaExtension | Promise<NbMediaExtension>

/** The engines and extensions the players use. */
export interface NbMediaPlayerConfig {
    /** An engine for each kind of source; video and audio files play in the browser without one. */
    engines: Partial<Record<NbMediaSourceKind, NbMediaEngineLoader>>
    /** The extensions each player has. */
    extensions: NbMediaExtensionLoader[]
}

/** The engines and extensions `provideNbMediaPlayer` sets. */
export const NB_MEDIA_PLAYER_CONFIG = new InjectionToken<NbMediaPlayerConfig>('NB_MEDIA_PLAYER_CONFIG', {
    factory: () => ({ engines: {}, extensions: [] })
})

/** A part of the players' setup, for `provideNbMediaPlayer`. */
export interface NbMediaPlayerFeature {
    engines?: NbMediaPlayerConfig['engines']
    extensions?: NbMediaExtensionLoader[]
}

/**
 * Engines for kinds of source, each loaded when a player first plays one:
 *
 * ```ts
 * withMediaEngines({
 *   hls: () => import('@videojs/hlsjs-video').then((m) => m.HlsJsAdapter),
 *   dash: () => import('@videojs/dash-video').then((m) => m.DashAdapter),
 *   youtube: () => import('@videojs/youtube-video').then((m) => m.YouTubeAdapter),
 * })
 * ```
 *
 * An engine that needs another element than its kind of source suggests says so:
 * `() => import(...).then((m) => ({ adapter: m.SomeAdapter, element: 'iframe' }))`.
 */
export function withMediaEngines(engines: NbMediaPlayerConfig['engines']): NbMediaPlayerFeature {
    return { engines }
}

/**
 * Extensions every player has, each loaded when a player first plays a source, e.g. analytics:
 *
 * ```ts
 * withMediaExtensions(() => import('./player-analytics').then((m) => m.playerAnalytics))
 * ```
 */
export function withMediaExtensions(...extensions: NbMediaExtensionLoader[]): NbMediaPlayerFeature {
    return { extensions }
}

/**
 * Sets the engines and extensions of the video and audio players. Video and audio files play in the browser without
 * any; streams and embeds need an engine for their kind of source, from Video.js 10's packages:
 *
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideNbMediaPlayer(
 *       withMediaEngines({ hls: () => import('@videojs/hlsjs-video').then((m) => m.HlsJsAdapter) }),
 *     ),
 *   ],
 * });
 * ```
 *
 * It sets them for the app, or for a route's or a component's players, on top of what's set above them.
 */
export function provideNbMediaPlayer(...features: NbMediaPlayerFeature[]): Provider {
    return {
        provide: NB_MEDIA_PLAYER_CONFIG,
        useFactory: (): NbMediaPlayerConfig => {
            const parent = inject(NB_MEDIA_PLAYER_CONFIG, { skipSelf: true, optional: true })
            const config: NbMediaPlayerConfig = {
                engines: { ...parent?.engines },
                extensions: [...(parent?.extensions ?? [])]
            }
            for (const feature of features) {
                Object.assign(config.engines, feature.engines)
                config.extensions.push(...(feature.extensions ?? []))
            }
            return config
        }
    }
}
