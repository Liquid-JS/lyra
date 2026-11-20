import { Component } from '@angular/core'
import { NbCardModule } from '@liquid-js/lyr-core'
import { NbVideoComponent, provideNbMediaPlayer, withMediaEngines } from '@liquid-js/lyr-extras/media'

@Component({
    selector: 'nb-video-stream',
    templateUrl: './video-stream.component.html',
    styleUrls: ['./video-stream.component.scss'],
    imports: [NbCardModule, NbVideoComponent],
    providers: [
    // hls.js plays HLS streams where the browser doesn't, and is only downloaded when a player first plays one.
        provideNbMediaPlayer(withMediaEngines({ hls: () => import('@videojs/hlsjs-video').then((m) => m.HlsJsAdapter) }))
    ]
})
export class VideoStreamComponent {}
