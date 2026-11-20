import { injectNbTexts, NbLocalize } from '@liquid-js/lyr-core'

/** @internal */
declare const $localize: NbLocalize

/**
 * The texts of the video and audio players. `provideNbTexts({ mediaPlayer: { ... } })` changes them, and they're
 * translated with Angular's i18n, as `$localize` messages with ids like `@@nb.mediaPlayer.play`.
 */
export interface NbMediaPlayerTexts {
    /** Label of the button that plays. */
    play: string
    /** Label of the button that pauses. */
    pause: string
    /** Label of the button that mutes. */
    mute: string
    /** Label of the button that unmutes. */
    unmute: string
    /** Names the volume slider. */
    volume: string
    /** Names the slider of the position in the media. */
    position: string
    /** The position and the length, for assistive technologies, given both as text. */
    time: (current: string, duration: string) => string
    /** Names the playback speed menu. */
    speed: string
    /** Names the quality menu. */
    quality: string
    /** The quality the player picks by itself. */
    qualityAuto: string
    /** A quality by the video's height in pixels, e.g. "720p". */
    qualityHeight: (height: string) => string
    /** A quality by its bitrate in kilobits a second, for audio or a stream without a height, e.g. "128 kbps". */
    qualityBitrate: (kbps: string) => string
    /** Label of the button that shows captions. */
    captions: string
    /** Label of the button that hides captions. */
    captionsOff: string
    /** Label of the button that shows the video in a floating window. */
    pictureInPicture: string
    /** Label of the button that brings the video back from its floating window. */
    exitPictureInPicture: string
    /** Label of the button that shows the video on the whole screen. */
    fullscreen: string
    /** Label of the button that leaves the whole screen. */
    exitFullscreen: string
    /** Marks a live stream. */
    live: string
    /** Shown when the media can't be played. */
    error: string
}

declare module '@liquid-js/lyr-core' {
    interface NbTexts {
        mediaPlayer: NbMediaPlayerTexts
    }
}

/** The default texts, in the app's language. @internal */
export function nbMediaPlayerTexts(): NbMediaPlayerTexts {
    return {
        play: $localize`:@@nb.mediaPlayer.play:Play`,
        pause: $localize`:@@nb.mediaPlayer.pause:Pause`,
        mute: $localize`:@@nb.mediaPlayer.mute:Mute`,
        unmute: $localize`:@@nb.mediaPlayer.unmute:Unmute`,
        volume: $localize`:@@nb.mediaPlayer.volume:Volume`,
        position: $localize`:@@nb.mediaPlayer.position:Position`,
        time: (current: string, duration: string) =>
            $localize`:@@nb.mediaPlayer.time:${current}:current: of ${duration}:duration:`,
        speed: $localize`:@@nb.mediaPlayer.speed:Playback speed`,
        quality: $localize`:@@nb.mediaPlayer.quality:Quality`,
        qualityAuto: $localize`:@@nb.mediaPlayer.qualityAuto:Auto`,
        qualityHeight: (height: string) => $localize`:@@nb.mediaPlayer.qualityHeight:${height}:height:p`,
        qualityBitrate: (kbps: string) => $localize`:@@nb.mediaPlayer.qualityBitrate:${kbps}:kbps: kbps`,
        captions: $localize`:@@nb.mediaPlayer.captions:Show captions`,
        captionsOff: $localize`:@@nb.mediaPlayer.captionsOff:Hide captions`,
        pictureInPicture: $localize`:@@nb.mediaPlayer.pictureInPicture:Picture in picture`,
        exitPictureInPicture: $localize`:@@nb.mediaPlayer.exitPictureInPicture:Leave picture in picture`,
        fullscreen: $localize`:@@nb.mediaPlayer.fullscreen:Full screen`,
        exitFullscreen: $localize`:@@nb.mediaPlayer.exitFullscreen:Leave full screen`,
        live: $localize`:@@nb.mediaPlayer.live:Live`,
        error: $localize`:@@nb.mediaPlayer.error:This media can't be played.`
    }
}

/** @internal */
export function injectNbMediaPlayerTexts() {
    return injectNbTexts('mediaPlayer', nbMediaPlayerTexts)
}
