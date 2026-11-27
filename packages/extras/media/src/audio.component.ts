import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core'
import {
    NbButtonComponent,
    NbIconComponent,
    NbOptionComponent,
    NbSelectComponent,
    NbSliderComponent
} from '@liquid-js/lyr-core'

import { NbMediaController } from './media-controller'
import { NbMediaPlayer } from './media-player'

/**
 * Plays audio in a compact bar with Lyra's controls: play, the position, volume and speed.
 *
 * ```html
 * <nb-audio src="episode.mp3" aria-label="Episode 12" />
 * ```
 *
 * @stacked-example(Showcase, media/audio-showcase.component)
 *
 * Audio files play in the browser. Streams play with an engine from Video.js 10, which `provideNbMediaPlayer` sets for
 * their kind of source and loads when a player first needs it.
 *
 * It tells when it plays, pauses and ends, its position as it plays, and when it can't play its source, with the
 * `play`, `pause`, `ended`, `timeUpdate` and `error` events. Without `controls`, it plays unseen, e.g. a sound that
 * `togglePlay()` plays.
 *
 * With the focus on it, the keyboard controls it: space or `k` plays and pauses, the left and right arrows seek, Home
 * and End go to the start and the end, up and down set the volume and `m` mutes.
 *
 * ### Installation
 *
 * The player needs `@videojs/core`, `@videojs/media` and `@videojs/store`, under the Apache 2.0 licence, which an app
 * installs only when it uses it; import `NbAudioComponent` from `@liquid-js/lyr-extras/media`:
 *
 * ```bash
 * npm install @videojs/core @videojs/media @videojs/store
 * ```
 *
 * The app's build lists about 50 small chunks of Video.js's own translations, e.g. `bg` or `ru`, which `@videojs/core`
 * keeps within reach of its captions. They load only if a player asks Video.js for a language, which Lyra's don't, as
 * their controls take Lyra's texts.
 */
@Component({
    selector: 'nb-audio',
    templateUrl: './audio.component.html',
    styleUrl: './audio.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Its own media logic, as the base class's providers aren't inherited.
    providers: [NbMediaController],
    imports: [NbButtonComponent, NbIconComponent, NbOptionComponent, NbSelectComponent, NbSliderComponent]
})
export class NbAudioComponent extends NbMediaPlayer {
    protected readonly kind = 'audio'
}
