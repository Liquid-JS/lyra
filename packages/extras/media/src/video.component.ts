import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  NbButtonComponent,
  NbIconComponent,
  NbOptionComponent,
  NbOverlayHostDirective,
  NbSelectComponent,
  NbSliderComponent,
  NbSpinnerComponent,
} from '@liquid-js/lyr-core';

import { NbMediaController } from './media-controller';
import { NbMediaPlayer } from './media-player';
import type { NbMediaTrack } from './media-types';
import { nbHoldPausedFrame } from './paused-frame';

/** A quality of the video, as the quality menu lists it. */
interface Quality {
  id: string;
  label: string;
}

/**
 * Plays a video with Lyra's controls: play, the position, volume, speed, quality, captions, picture in picture and full
 * screen, as far as the video and the browser have them.
 *
 * ```html
 * <nb-video src="lesson.mp4" poster="lesson.jpg"
 *   [tracks]="[{ src: 'lesson.en.vtt', srclang: 'en', label: 'English' }]" />
 * ```
 *
 * @stacked-example(Showcase, media/video-showcase.component)
 *
 * Video files play in the browser. Streams and embeds play with an engine from Video.js 10, which
 * `provideNbMediaPlayer` sets for their kind of source and loads when a player first needs it:
 *
 * ```ts
 * provideNbMediaPlayer(withMediaEngines({ hls: () => import('@videojs/hlsjs-video').then((m) => m.HlsJsAdapter) }))
 * ```
 *
 * @stacked-example(A stream in several qualities, media/video-stream.component)
 *
 * It tells when it plays, pauses and ends, its position as it plays, and when it can't play its source:
 *
 * ```html
 * <nb-video src="lesson.mp4" (ended)="next()" (timeUpdate)="progress.set($event)" (error)="report($event)" />
 * ```
 *
 * `startTime` starts each source further in, e.g. where the viewer left off, and `seek(time)` goes to a position, also
 * before the video has loaded.
 *
 * Without `controls`, it's just the video, e.g. one playing silently in the background:
 *
 * ```html
 * <nb-video src="clouds.mp4" [controls]="false" autoplay muted loop />
 * ```
 *
 * It's 16:9 until its `aspect-ratio` says otherwise. With the focus on it, the keyboard controls it: space or `k`
 * plays and pauses, the left and right arrows seek, Home and End go to the start and the end, up and down set the
 * volume, `m` mutes, `c` shows captions and `f` goes full screen.
 *
 * ### Installation
 *
 * The player needs `@videojs/core`, `@videojs/media` and `@videojs/store`, under the Apache 2.0 licence, which an app
 * installs only when it uses it; import `NbVideoComponent` from `@liquid-js/lyr-extras/media`:
 *
 * ```bash
 * npm install @videojs/core @videojs/media @videojs/store
 * ```
 */
@Component({
  selector: 'nb-video',
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Its own media logic, as the base class's providers aren't inherited.
  providers: [NbMediaController],
  imports: [
    NbButtonComponent,
    NbIconComponent,
    NbOptionComponent,
    NbOverlayHostDirective,
    NbSelectComponent,
    NbSliderComponent,
    NbSpinnerComponent,
  ],
})
export class NbVideoComponent extends NbMediaPlayer {
  protected readonly kind = 'video';

  /** The picture it shows before it plays. */
  readonly poster = input<string | undefined>(undefined);

  /** The captions showing now, which the player draws itself, above its controls. */
  protected readonly cue = signal('');
  /** Shows the paused frame in Safari's full screen, in the video's place. */
  protected readonly still = viewChild.required<ElementRef<HTMLCanvasElement>>('still');

  /** The qualities to pick from: each size once, the largest first. */
  protected readonly qualities = computed<Quality[]>(() => {
    const seen = new Set<string>();
    const texts = this.texts();
    return [...(this.state().videoRenditionList ?? [])]
      .sort((a, b) => (b.height ?? 0) - (a.height ?? 0) || (b.bitrate ?? 0) - (a.bitrate ?? 0))
      .map((rendition) => ({
        id: rendition.id,
        label: rendition.height
          ? texts.qualityHeight(String(rendition.height))
          : rendition.bitrate
            ? texts.qualityBitrate(String(Math.round(rendition.bitrate / 1000)))
            : rendition.id,
      }))
      .filter(({ label }) => !seen.has(label) && !!seen.add(label));
  });
  /** The quality picked, or `auto` when the player picks it by itself. */
  protected readonly quality = computed(
    () => this.state().videoRenditionList?.find((rendition) => rendition.selected)?.id ?? 'auto',
  );
  protected readonly hasCaptions = computed(() =>
    (this.state().textTrackList ?? []).some((track) => track.kind === 'subtitles' || track.kind === 'captions'),
  );

  constructor() {
    super();
    afterRenderEffect(() => {
      const element = this.controller.element();
      const poster = this.poster() ?? '';
      if (element instanceof HTMLVideoElement && element.poster !== poster) {
        element.poster = poster;
      }
    });
    afterRenderEffect((onCleanup) => {
      const element = this.controller.element();
      if (element instanceof HTMLVideoElement) {
        onCleanup(this.followCues(element));
      }
    });
    // Safari's full screen doesn't take clicks while a video is paused; see `nbHoldPausedFrame`.
    afterRenderEffect((onCleanup) => {
      const element = this.controller.element();
      if (element instanceof HTMLVideoElement) {
        onCleanup(nbHoldPausedFrame(element, this.frame().nativeElement, this.still().nativeElement));
      }
    });
  }

  /** Shows the captions, or hides them. */
  toggleCaptions(): void {
    this.store?.toggleSubtitles?.();
  }

  /** Shows the video on the whole screen, with its controls, or leaves it. */
  toggleFullscreen(): void {
    const store = this.store;
    if (store?.fullscreenAvailability !== 'available') {
      return;
    }
    void (store.isFullscreen ? store.exitFullscreen?.() : store.requestFullscreen?.())?.catch(() => {});
  }

  /** Shows the video in a floating window, or brings it back. */
  togglePictureInPicture(): void {
    const store = this.store;
    if (store?.pictureInPictureAvailability !== 'available') {
      return;
    }
    void (store.isPictureInPicture ? store.exitPictureInPicture?.() : store.requestPictureInPicture?.())?.catch(
      () => {},
    );
  }

  /**
   * Follows the captions or subtitles showing, which the browser would draw at the bottom of the video, under the
   * controls; the template draws them instead. Returns what stops it.
   */
  protected followCues(video: HTMLVideoElement): () => void {
    const tracks = video.textTracks;
    const update = () => {
      const lines = new Array<string>();
      for (const track of tracks) {
        if (track.mode === 'showing' && (track.kind === 'subtitles' || track.kind === 'captions')) {
          for (const cue of track.activeCues ?? []) {
            // A cue's text may have tags, e.g. <i> or a speaker's <v>.
            lines.push(cue instanceof VTTCue ? (cue.getCueAsHTML().textContent ?? '') : '');
          }
        }
      }
      this.cue.set(lines.filter(Boolean).join('\n'));
    };
    const events = new AbortController();
    const options = { signal: events.signal };
    const follow = (track: TextTrack) => track.addEventListener('cuechange', update, options);
    for (const track of tracks) {
      follow(track);
    }
    tracks.addEventListener('addtrack', (event) => event.track && follow(event.track), options);
    tracks.addEventListener('change', update, options);
    update();
    return () => {
      events.abort();
      this.cue.set('');
    };
  }

  protected setQuality(id: string | null): void {
    this.store?.selectVideoRendition?.(id ?? 'auto');
  }

  protected override handleKey(key: string): boolean {
    switch (key) {
      case 'f':
        this.toggleFullscreen();
        return true;
      case 'c':
        this.toggleCaptions();
        return true;
      default:
        return super.handleKey(key);
    }
  }

  protected override prepare(element: HTMLElement, tracks: NbMediaTrack[]): void {
    super.prepare(element, tracks);
    if (element instanceof HTMLVideoElement) {
      element.playsInline = true;
      const poster = this.poster();
      if (poster) {
        element.poster = poster;
      }
    }
  }
}
