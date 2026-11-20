import { Component } from '@angular/core'
import { NbCardModule } from '@liquid-js/lyr-core'
import { NbAudioComponent } from '@liquid-js/lyr-extras/media'

@Component({
    selector: 'nb-audio-showcase',
    templateUrl: './audio-showcase.component.html',
    styleUrls: ['./audio-showcase.component.scss'],
    imports: [NbCardModule, NbAudioComponent]
})
export class AudioShowcaseComponent {}
