import {
    afterRenderEffect,
    booleanAttribute,
    numberAttribute,
    computed,
    Directive,
    ElementRef,
    inject,
    input,
    LOCALE_ID,
    output,
    untracked,
    viewChild
} from '@angular/core'
import { NbSliderValue } from '@liquid-js/lyr-core'

import { NbMediaController, NbMediaKind } from './media-controller'
import type { NbMediaError, NbMediaSource, NbMediaStore, NbMediaTrack } from './media-types'
import { injectNbMediaPlayerTexts } from './texts'

/**
 * A position or length in the media as text: `m:ss`, or `h:mm:ss` from an hour, e.g. `47:12` into an episode of
 * `1:58:04`, as podcast and video players write them.
 */
export function nbFormatMediaTime(seconds: number): string {
    const total = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0
    const hours = Math.floor(total / 3600)
    const minutes = Math.floor((total % 3600) / 60)
    const rest = String(total % 60).padStart(2, '0')
    return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${rest}` : `${minutes}:${rest}`
}

let nextId = 0

/** What the video and audio players have in common: their source, how it plays, and the actions of the controls. */
@Directive()
export abstract class NbMediaPlayer {
    protected abstract readonly kind: NbMediaKind
    protected readonly controller = inject(NbMediaController)
    protected readonly texts = injectNbMediaPlayerTexts()
    /** Where to go once the media knows its length. */
    protected pendingSeek?: number
    /** Prefixes the ids of the player's labels. */
    protected readonly id = `nb-media-${nextId++}`
    protected readonly rateFormat = new Intl.NumberFormat(inject(LOCALE_ID), { maximumFractionDigits: 2 })
    protected readonly percentFormat = new Intl.NumberFormat(inject(LOCALE_ID), { style: 'percent' })

    /**
     * What it plays: a URL, or a source with its type and its options for the engine. Video and audio files play in the
     * browser; streams and embeds need an engine, set with `provideNbMediaPlayer`.
     */
    readonly src = input.required<string | NbMediaSource>()
    /** Captions or subtitles, in WebVTT files. */
    readonly tracks = input<NbMediaTrack[]>([])
    /** Whether it starts playing by itself, which browsers allow when it's muted. */
    readonly autoplay = input(false, { transform: booleanAttribute })
    /** Whether it's muted. */
    readonly muted = input(false, { transform: booleanAttribute })
    /** Whether it starts again from the beginning when it ends. */
    readonly loop = input(false, { transform: booleanAttribute })
    /** How much of it loads before it plays: `none`, `metadata` for its length, or `auto`. */
    readonly preload = input<'none' | 'metadata' | 'auto'>('metadata')
    /** Whether a source from another site is loaded with CORS, which captions from there need. */
    readonly crossorigin = input<'anonymous' | 'use-credentials' | undefined>(undefined)
    /** Where each source starts, in seconds, e.g. where the viewer left off. */
    readonly startTime = input(0, { transform: numberAttribute })
    /** The speeds of the speed menu. */
    readonly playbackRates = input<number[]>([0.5, 0.75, 1, 1.25, 1.5, 2])
    /** Names the player for assistive technologies, e.g. after what it plays. */
    readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' })
    /**
     * Whether it shows its controls. Without them it's just the media, e.g. a silent background video, which `autoplay`,
     * `muted` and `loop` play, or code with `togglePlay()`.
     */
    readonly controls = input(true, { transform: booleanAttribute })

    /** When it starts playing, from the start or after a pause. */
    readonly play = output<void>()
    /** When it pauses, which it also does when it ends. */
    readonly pause = output<void>()
    /** When it reaches the end, unless it loops. */
    readonly ended = output<void>()
    /** The position, in seconds, as it changes while it plays or seeks, a few times a second. */
    readonly timeUpdate = output<number>()
    /** When it can't play its source. */
    readonly error = output<NbMediaError>()

    /** What it shows and can do, as it changes: empty until it has loaded its source. */
    readonly state = this.controller.state.asReadonly()

    protected readonly frame = viewChild.required<ElementRef<HTMLElement>>('frame')
    protected readonly mediaHost = viewChild.required<ElementRef<HTMLElement>>('media')

    protected readonly paused = computed(() => this.state().paused ?? true)
    protected readonly currentTime = computed(() => this.state().currentTime ?? 0)
    protected readonly duration = computed(() => this.state().duration ?? 0)
    protected readonly live = computed(() => this.state().streamType === 'live' || this.duration() === Infinity)
    /** Whether it has a length to seek in. */
    protected readonly seekable = computed(() => Number.isFinite(this.duration()) && this.duration() > 0)
    protected readonly waiting = computed(() => !!this.state().waiting && !this.paused())
    protected readonly failed = computed(() => !!this.state().error || !!this.controller.loadError())
    protected readonly volume = computed(() => (this.state().muted ? 0 : (this.state().volume ?? 1)))
    protected readonly volumeIcon = computed(() => {
        const volume = this.volume()
        return volume === 0 ? 'volume-off-outline' : volume < 0.5 ? 'volume-down-outline' : 'volume-up-outline'
    })
    /** Why it can't play its source, once for each reason. */
    protected readonly mediaError = computed<NbMediaError | undefined>(
        () => {
            // An engine that can't load is about the current source; the store may still hold the last source's error.
            const loadError = this.controller.loadError()
            const error = this.state().error
            return loadError ? { message: loadError } : error ? { message: error.message, code: error.code } : undefined
        },
        { equal: (a, b) => a?.message === b?.message && a?.code === b?.code }
    )
    protected readonly elapsed = computed(() => nbFormatMediaTime(this.currentTime()))
    protected readonly length = computed(() => nbFormatMediaTime(this.duration()))
    /** The position as assistive technologies read it, with the length. */
    protected readonly formatPosition = (value: number) =>
        this.texts().time(nbFormatMediaTime(value), this.length())
    protected readonly formatVolume = (value: number) => this.percentFormat.format(value)
    /** A speed, e.g. 1.5×, which reads left to right in every language, also where the select copies its text. */
    protected readonly formatRate = (rate: number) => `\u2066${this.rateFormat.format(rate)}×\u2069`

    constructor() {
        afterRenderEffect(() => {
            const src = this.src()
            const source = typeof src === 'string' ? { src } : src
            const tracks = this.tracks()
            untracked(() => {
                const start = this.startTime()
                this.pendingSeek = start > 0 ? start : undefined
                void this.controller.load(
                    this.mediaHost().nativeElement,
                    this.frame().nativeElement,
                    source,
                    this.kind,
                    (element) => this.prepare(element, tracks)
                )
            })
        })
        afterRenderEffect(() => {
            const muted = this.muted()
            untracked(() => this.controller.current?.setMuted(muted))
        })
        afterRenderEffect((onCleanup) => {
            const media = this.controller.media()
            if (!media) {
                return
            }
            const events = new AbortController()
            const options = { signal: events.signal }
            media.addEventListener('play', () => this.play.emit(), options)
            media.addEventListener('pause', () => this.pause.emit(), options)
            media.addEventListener('ended', () => this.ended.emit(), options)
            media.addEventListener('timeupdate', () => this.timeUpdate.emit(media.currentTime), options)
            // A position asked for before the media knew its length, e.g. `startTime`.
            const seekPending = () => {
                const time = this.pendingSeek
                this.pendingSeek = undefined
                if (time !== undefined) {
                    this.seekTo(time)
                }
            }
            media.addEventListener('loadedmetadata', seekPending, options)
            if (media.readyState >= HTMLMediaElement.HAVE_METADATA) {
                untracked(seekPending)
            }
            onCleanup(() => events.abort())
        })
        afterRenderEffect(() => {
            const error = this.mediaError()
            if (error) {
                untracked(() => this.error.emit(error))
            }
        })
        afterRenderEffect(() => {
            const element = this.controller.element()
            const loop = this.loop()
            if (element instanceof HTMLMediaElement) {
                element.loop = loop
            }
        })
    }

    /** The player's Video.js store, once it has loaded its source, which plays, seeks and so on. */
    get store(): NbMediaStore | undefined {
        return this.controller.current
    }

    /** Plays, or pauses when it's playing. */
    togglePlay(): void {
        const store = this.controller.current
        if (!store) {
            return
        }
        if (store.paused || store.ended) {
            void store.play().catch(() => {})
        } else {
            store.pause()
        }
    }

    /** Goes to a position, in seconds; before the media has loaded, once it has. */
    seek(time: number): void {
        const media = this.controller.media()
        if (!media || media.readyState < HTMLMediaElement.HAVE_METADATA) {
            this.pendingSeek = Math.max(0, time)
            return
        }
        this.seekTo(time)
    }

    protected seekTo(time: number): void {
        const duration = this.duration()
        const end = Number.isFinite(duration) && duration > 0 ? duration : Infinity
        void this.controller.current?.seek(Math.max(0, Math.min(time, end))).catch(() => {})
    }

    /** Mutes, or unmutes and brings the volume back when it was all the way down. */
    toggleMuted(): void {
        const store = this.controller.current
        if (!store) {
            return
        }
        if (this.volume() === 0) {
            store.setMuted(false)
            if (store.volume === 0) {
                store.setVolume(0.5)
            }
        } else {
            store.setMuted(true)
        }
    }

    /** Sets the volume, from 0 to 1, unmuting it when it's above 0. */
    setVolume(volume: number): void {
        const store = this.controller.current
        store?.setVolume(volume)
        store?.setMuted(volume === 0)
    }

    protected onPosition(value: NbSliderValue): void {
        if (typeof value === 'number' && Math.abs(value - this.currentTime()) > 0.05) {
            this.seek(value)
        }
    }

    protected onVolume(value: NbSliderValue): void {
        if (typeof value === 'number' && value !== this.volume()) {
            this.setVolume(value)
        }
    }

    protected setRate(rate: number | null): void {
        if (rate !== null) {
            this.controller.current?.setPlaybackRate(rate)
        }
    }

    /** The keyboard: space or `k` plays, the arrows seek and set the volume, Home and End go to the ends, `m` mutes. */
    protected onKeydown(event: KeyboardEvent): void {
        if (!this.controls() || event.target !== event.currentTarget || event.altKey || event.ctrlKey || event.metaKey) {
            return
        }
        if (this.handleKey(event.key)) {
            event.preventDefault()
        }
    }

    protected handleKey(key: string): boolean {
        switch (key) {
            case ' ':
            case 'k':
                this.togglePlay()
                return true
            case 'ArrowLeft':
            case 'ArrowRight':
                this.seek(this.currentTime() + (key === 'ArrowRight' ? 5 : -5))
                return true
            case 'Home':
            case 'End':
                this.seek(key === 'Home' ? 0 : this.duration())
                return true
            case 'ArrowUp':
            case 'ArrowDown':
                this.setVolume(Math.max(0, Math.min(1, this.volume() + (key === 'ArrowUp' ? 0.1 : -0.1))))
                return true
            case 'm':
                this.toggleMuted()
                return true
            default:
                return false
        }
    }

    /** Sets up the element the source plays in, before the engine attaches to it. */
    protected prepare(element: HTMLElement, tracks: NbMediaTrack[]): void {
        if (element instanceof HTMLMediaElement) {
            element.preload = this.preload()
            element.autoplay = this.autoplay()
            element.loop = this.loop()
            element.muted = this.muted()
            element.defaultMuted = this.muted()
            const crossorigin = this.crossorigin()
            if (crossorigin) {
                element.crossOrigin = crossorigin
            }
            for (const track of tracks) {
                const child = element.ownerDocument.createElement('track')
                child.src = track.src
                child.kind = track.kind ?? 'subtitles'
                child.srclang = track.srclang ?? ''
                child.label = track.label ?? ''
                child.default = !!track.default
                element.append(child)
            }
        } else if (element instanceof HTMLIFrameElement) {
            element.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media'
            element.title = this.ariaLabel() ?? ''
        }
    }
}
