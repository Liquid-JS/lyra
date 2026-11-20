import { Component } from '@angular/core'
import { NbCardModule } from '@liquid-js/lyr-core'
import { NbMediaTrack, NbVideoComponent } from '@liquid-js/lyr-extras/media'

@Component({
    selector: 'nb-video-showcase',
    templateUrl: './video-showcase.component.html',
    styleUrls: ['./video-showcase.component.scss'],
    imports: [NbCardModule, NbVideoComponent]
})
export class VideoShowcaseComponent {
    readonly captions: NbMediaTrack[] = [
        { src: 'assets/showcase/media/meadow.en.vtt', kind: 'captions', srclang: 'en', label: 'English' }
    ]
}
