import { Component, Injector, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'

import { HTMLVideoAdapter } from '@videojs/media/dom'

import { NbIconLibraries, NbThemeModule } from '@liquid-js/lyr-core'
import {
    NB_MEDIA_PLAYER_CONFIG,
    NbAudioComponent,
    nbFormatMediaTime,
    NbMediaEngineLoader,
    NbMediaError,
    NbMediaExtension,
    NbMediaPlayerContext,
    NbMediaSource,
    NbMediaTrack,
    NbVideoComponent,
    provideNbMediaPlayer,
    withMediaEngines,
    withMediaExtensions
} from '@liquid-js/lyr-extras/media'
import { nbMediaPlayerTexts } from './texts'

// The players' icons, which these specs don't look at.
function useEmptyIcons() {
    const icons = TestBed.inject(NbIconLibraries)
    icons.registerSvgPack('test', {})
    icons.setDefaultPack('test')
}

describe('the media player\'s texts', () => {
    it('names qualities by height, or by bitrate, in texts an app can translate', () => {
        const texts = nbMediaPlayerTexts()
        expect(texts.qualityHeight('720')).toBe('720p')
        expect(texts.qualityBitrate('128')).toBe('128 kbps')
    })
})

describe('nbFormatMediaTime', () => {
    it('gives minutes and seconds, and hours from an hour', () => {
        expect(nbFormatMediaTime(0)).toBe('0:00')
        expect(nbFormatMediaTime(65.9)).toBe('1:05')
        expect(nbFormatMediaTime(2832)).toBe('47:12')
        expect(nbFormatMediaTime(3600)).toBe('1:00:00')
        expect(nbFormatMediaTime(7084)).toBe('1:58:04')
    })

    it('gives 0:00 for what isn\'t a time yet', () => {
        expect(nbFormatMediaTime(Number.NaN)).toBe('0:00')
        expect(nbFormatMediaTime(-3)).toBe('0:00')
        expect(nbFormatMediaTime(Infinity)).toBe('0:00')
    })
})

describe('provideNbMediaPlayer', () => {
    it('adds to the engines and extensions set above it', () => {
        const hls: NbMediaEngineLoader = () => HTMLVideoAdapter as never
        const dash: NbMediaEngineLoader = () => HTMLVideoAdapter as never
        const first: () => NbMediaExtension = () => () => {}
        const second: () => NbMediaExtension = () => () => {}
        const parent = Injector.create({
            providers: [provideNbMediaPlayer(withMediaEngines({ hls }), withMediaExtensions(first))]
        })
        const child = Injector.create({
            parent,
            providers: [provideNbMediaPlayer(withMediaEngines({ dash }), withMediaExtensions(second))]
        })

        const config = child.get(NB_MEDIA_PLAYER_CONFIG)
        expect(config.engines).toEqual({ hls, dash })
        expect(config.extensions).toEqual([first, second])
        expect(parent.get(NB_MEDIA_PLAYER_CONFIG).engines).toEqual({ hls })
    })
})

@Component({
    template: `
    <nb-video
      [src]="src()"
      [poster]="poster()"
      [tracks]="tracks()"
      [controls]="controls()"
      [startTime]="start()"
      aria-label="Lesson"
      (play)="events.push('play')"
      (pause)="events.push('pause')"
      (ended)="events.push('ended')"
      (timeUpdate)="events.push('time ' + $event)"
      (error)="errors.push($event)"
    />
    @if (two()) {
      <nb-video [src]="src()" />
    }
  `,
    imports: [NbVideoComponent]
})
class VideoHostComponent {
    readonly src = signal<string | NbMediaSource>('lesson.mp4')
    readonly poster = signal<string | undefined>('lesson.jpg')
    readonly tracks = signal<NbMediaTrack[]>([])
    readonly two = signal(false)
    readonly controls = signal(true)
    readonly start = signal(0)
    readonly events = new Array<string>()
    readonly errors = new Array<NbMediaError>()
}

describe('NbVideoComponent', () => {
    let fixture: ComponentFixture<VideoHostComponent>
    let host: VideoHostComponent
    let hls: ReturnType<typeof vi.fn<NbMediaEngineLoader>>
    let calls: NbMediaPlayerContext[]
    let cleanups: number

    const players = () => [...fixture.nativeElement.querySelectorAll('nb-video')] as HTMLElement[]
    const video = (player = players()[0]) => player.querySelector('.media > video') as HTMLVideoElement | null
    const render = async () => {
        fixture.detectChanges()
        await fixture.whenStable()
        fixture.detectChanges()
    }

    beforeEach(async () => {
    // A stand-in for an engine such as hls.js: the native one, loaded when a player first needs it.
        hls = vi.fn<NbMediaEngineLoader>(async () => HTMLVideoAdapter as never)
        calls = []
        cleanups = 0
        const extension: NbMediaExtension = (player) => {
            calls.push(player)
            return () => cleanups++
        }
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot()],
            providers: [
                provideNbMediaPlayer(
                    withMediaEngines({ hls }),
                    withMediaExtensions(() => extension)
                )
            ]
        })
        useEmptyIcons()
        fixture = TestBed.createComponent(VideoHostComponent)
        host = fixture.componentInstance
        await render()
        await vi.waitFor(() => expect(video()).toBeTruthy())
    })

    it('plays a file in a video element of its own, set up from the inputs', () => {
        const element = video()
        expect(element?.getAttribute('src')).toBe('lesson.mp4')
        expect(element?.getAttribute('poster')).toBe('lesson.jpg')
        expect(element?.playsInline).toBe(true)
        expect(element?.controls).toBe(false)
        expect(players()[0].querySelector('.frame')?.getAttribute('aria-label')).toBe('Lesson')
    })

    it('shows the controls, labelled', () => {
        const labels = [...players()[0].querySelectorAll('.controls button')].map((b) => b.getAttribute('aria-label'))
        expect(labels).toContain('Play')
        expect(labels).toContain('Mute')
        expect(players()[0].querySelector('nb-slider[aria-label="Position"], .controls nb-slider')).toBeTruthy()
    })

    it('adds captions as tracks of the video', async () => {
        host.tracks.set([{ src: 'lesson.en.vtt', srclang: 'en', label: 'English', kind: 'captions' }])
        await render()
        await vi.waitFor(() => expect(video()?.querySelector('track')).toBeTruthy())

        const track = video()?.querySelector('track')
        expect(track?.getAttribute('src')).toBe('lesson.en.vtt')
        expect(track?.kind).toBe('captions')
        expect(track?.srclang).toBe('en')
        expect(track?.label).toBe('English')
    })

    it('follows the poster', async () => {
        host.poster.set('cover.jpg')
        await render()
        expect(video()?.getAttribute('poster')).toBe('cover.jpg')
    })

    it('loads an engine only when a source needs it, and only once', async () => {
        expect(hls).not.toHaveBeenCalled()

        host.src.set('stream.m3u8')
        host.two.set(true)
        await render()
        await vi.waitFor(() => expect(players().map((player) => video(player)?.getAttribute('src'))).toEqual([
            'stream.m3u8',
            'stream.m3u8'
        ]))

        expect(hls).toHaveBeenCalledTimes(1)
    })

    it('tells when no engine plays a kind of source', async () => {
        host.src.set('stream.mpd')
        await render()
        await vi.waitFor(() => expect(players()[0].querySelector('.message')).toBeTruthy())

        expect(players()[0].querySelector('.message')?.getAttribute('role')).toBe('alert')
        expect(players()[0].querySelector('.message')?.textContent).toContain('This media can\'t be played.')
        expect(video()).toBeNull()
    })

    it('runs its extensions for each source, and undoes them when it changes', async () => {
        expect(calls.length).toBe(1)
        expect(calls[0].element).toBe(video())
        expect(calls[0].source).toEqual({ src: 'lesson.mp4' })
        expect(calls[0].container).toBe(players()[0].querySelector('.frame'))

        host.src.set('other.mp4')
        await render()
        await vi.waitFor(() => expect(calls.length).toBe(2))

        expect(cleanups).toBe(1)
        expect(calls[1].source).toEqual({ src: 'other.mp4' })
    })

    it('tells when the media plays, pauses and ends, and its position', () => {
        const element = video()
        for (const type of ['play', 'timeupdate', 'pause', 'ended']) {
            element?.dispatchEvent(new Event(type))
        }
        expect(host.events).toEqual(['play', 'time 0', 'pause', 'ended'])
    })

    it('tells, once, when it can\'t play its source', async () => {
        host.src.set('stream.mpd')
        await render()
        await vi.waitFor(() => expect(host.errors.at(-1)?.message).toContain('No engine plays dash sources'))
        const count = host.errors.length

        await render()
        expect(host.errors.length).toBe(count)
    })

    it('is just the video without controls', async () => {
        host.controls.set(false)
        await render()

        const player = players()[0]
        const frame = player.querySelector('.frame')
        expect(player.querySelector('.controls')).toBeNull()
        expect(player.querySelector('.big-play')).toBeNull()
        expect(frame?.hasAttribute('tabindex')).toBe(false)
        expect(frame?.hasAttribute('role')).toBe(false)

        frame?.dispatchEvent(new KeyboardEvent('keydown', { key: 'm', bubbles: true }))
        await render()
        expect(video()?.muted).toBe(false)
    })

    // The media's length is known: the video says it has its metadata, and records where it's sent.
    function loadMetadata(element: HTMLVideoElement) {
        const positions = new Array<number>()
        Object.defineProperties(element, {
            readyState: { get: () => HTMLMediaElement.HAVE_METADATA, configurable: true },
            currentTime: {
                get: () => positions.at(-1) ?? 0,
                set: (time: number) => positions.push(time),
                configurable: true
            }
        })
        element.dispatchEvent(new Event('loadedmetadata'))
        return positions
    }

    it('starts each source at its start time, once it knows its length', async () => {
        host.start.set(90)
        host.src.set('other.mp4')
        await render()
        await vi.waitFor(() => expect(video()?.getAttribute('src')).toBe('other.mp4'))

        const positions = loadMetadata(video() as HTMLVideoElement)
        await vi.waitFor(() => expect(positions).toContain(90))
    })

    it('goes where it\'s sent before it has loaded, once it has', async () => {
        const player: NbVideoComponent = fixture.debugElement.query(By.directive(NbVideoComponent)).componentInstance
        player.seek(30)

        const positions = loadMetadata(video() as HTMLVideoElement)
        await vi.waitFor(() => expect(positions).toContain(30))
    })

    it('undoes its extensions when it goes', () => {
        fixture.destroy()
        expect(cleanups).toBe(1)
    })
})

@Component({
    template: '<nb-audio src="episode.mp3" aria-label="Episode 12" />',
    imports: [NbAudioComponent]
})
class AudioHostComponent {}

describe('NbAudioComponent', () => {
    let fixture: ComponentFixture<AudioHostComponent>
    let element: HTMLElement

    const audio = () => element.querySelector('.media > audio') as HTMLAudioElement | null

    beforeEach(async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] })
        useEmptyIcons()
        fixture = TestBed.createComponent(AudioHostComponent)
        element = fixture.nativeElement.querySelector('nb-audio')
        fixture.detectChanges()
        await fixture.whenStable()
        await vi.waitFor(() => expect(audio()).toBeTruthy())
        fixture.detectChanges()
    })

    it('plays in an audio element of its own', () => {
        expect(audio()?.getAttribute('src')).toBe('episode.mp3')
        expect(element.querySelector('.frame')?.getAttribute('aria-label')).toBe('Episode 12')
    })

    it('mutes from the keyboard, and from its button', async () => {
        const frame = element.querySelector('.frame') as HTMLElement
        frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'm', bubbles: true }))
        await vi.waitFor(() => expect(audio()?.muted).toBe(true))
        fixture.detectChanges()

        const unmute = element.querySelector('button[aria-label="Unmute"]') as HTMLButtonElement
        expect(unmute).toBeTruthy()
        unmute.click()
        await vi.waitFor(() => expect(audio()?.muted).toBe(false))
    })

    it('gives its play button the app\'s shape, as other buttons have', async () => {
        const play = element.querySelector('button.play') as HTMLElement
        expect(play.classList).toContain('shape-rectangle')
        expect(play.classList).not.toContain('shape-round')
    })
})
