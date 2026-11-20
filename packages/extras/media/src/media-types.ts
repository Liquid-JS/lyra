import type { PlayerTarget } from '@videojs/core/dom';
import type {
  AdapterType,
  Media,
  MediaBufferState,
  MediaControlsState,
  MediaErrorState,
  MediaFullscreenState,
  MediaPictureInPictureState,
  MediaPlaybackRateState,
  MediaPlaybackState,
  MediaQualityState,
  MediaSourceState,
  MediaStreamTypeState,
  MediaTextTrackState,
  MediaTimeState,
  MediaVolumeState,
} from '@videojs/media';
import type { Store } from '@videojs/store';

/**
 * What a player shows and can do, from Video.js: playback, time, volume and speed for all of them; quality, captions,
 * full screen and picture in picture where the media has them.
 */
export type NbMediaState = MediaPlaybackState
  & MediaTimeState
  & MediaVolumeState
  & Omit<MediaPlaybackRateState, 'playbackRates'>
  & MediaBufferState
  & MediaSourceState
  & MediaErrorState
  & Partial<
    MediaQualityState
      & MediaTextTrackState
      & MediaFullscreenState
      & MediaPictureInPictureState
      & MediaControlsState
      & MediaStreamTypeState
  >;

/** A player's Video.js store: its state, with the methods that change it, e.g. `play()` and `seek(time)`. */
export type NbMediaStore = Store<PlayerTarget, NbMediaState>;

/** A source with its type, when the URL doesn't tell, and its options for the engine, e.g. `drm`. */
export interface NbMediaSource {
  src: string;
  /** The MIME type, e.g. `application/x-mpegurl` for a stream whose URL has no `.m3u8`. */
  type?: string;
  [option: string]: unknown;
}

/** Why a player can't play its source: the media's error, or that no engine plays its kind of source. */
export interface NbMediaError {
  message: string;
  /** The media's error code, e.g. `4` when the browser can't play the source's format. */
  code?: number;
}

/** A text track: captions or subtitles in a WebVTT file. */
export interface NbMediaTrack {
  src: string;
  /** `subtitles` translate the speech; `captions` also describe the sounds. `subtitles` when not set. */
  kind?: 'subtitles' | 'captions';
  /** The track's language, e.g. `en`. */
  srclang?: string;
  /** The track's name, e.g. `English`. */
  label?: string;
  /** Whether it shows from the start. */
  default?: boolean;
}

/**
 * The kinds of source Video.js tells apart, which pick the engine that plays one: `video` and `audio` files, `hls`
 * and `dash` streams, and embeds such as `youtube` and `vimeo`.
 */
export type NbMediaSourceKind = AdapterType;

/** What every Video.js 10 media adapter has in common, which is all the players use of one. */
export interface NbMediaAdapter {
  src: string;
  /** The source with its options, e.g. `drm` or the engine's own settings, where the adapter takes them. */
  source?: unknown;
  attach(target: HTMLElement): void;
  detach(): void;
  destroy(): void;
}

export type NbMediaAdapterConstructor = new () => NbMediaAdapter;

/** The element an engine plays in: a `video` or `audio` element, or an `iframe` for an embed. */
export type NbMediaElementKind = 'video' | 'audio' | 'iframe';

/** An engine: a Video.js media adapter, or one with the element it plays in when its kind of source doesn't say. */
export type NbMediaEngine =
  | NbMediaAdapterConstructor
  | { adapter: NbMediaAdapterConstructor; element: NbMediaElementKind };

/** A player as an extension sees it, each time it starts playing a source. */
export interface NbMediaPlayerContext {
  /** The engine's media, which the store controls and which dispatches the media's events. */
  readonly media: Media;
  /** The element the media plays in: a `video`, `audio` or `iframe` element. */
  readonly element: HTMLElement;
  /** The player's frame, which holds the media and the controls, and goes full screen. */
  readonly container: HTMLElement;
  /** The player's store. */
  readonly store: NbMediaStore;
  /** The source it plays. */
  readonly source: NbMediaSource;
}

/**
 * Adds to a player while it plays a source, e.g. analytics that listen to the media's events. It runs each time a
 * player starts playing a source, and what it returns runs when the player stops playing it.
 */
export type NbMediaExtension = (player: NbMediaPlayerContext) => void | (() => void);
