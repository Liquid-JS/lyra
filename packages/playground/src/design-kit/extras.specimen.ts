import { Component } from '@angular/core'
import { NbAudioComponent } from '@liquid-js/lyr-extras/media'

import { ChartShowcaseComponent } from '../playground/with-layout/chart/chart-showcase.component'
import { MarkdownEditorShowcaseComponent } from '../playground/with-layout/markdown/markdown-editor-showcase.component'
import { MarkdownViewerShowcaseComponent } from '../playground/with-layout/markdown/markdown-viewer-showcase.component'
import { VideoShowcaseComponent } from '../playground/with-layout/media/video-showcase.component'
import { QrCodeShowcaseComponent } from '../playground/with-layout/qr-code/qr-code-showcase.component'

/** The extras as the playground shows them, each tagged whole, and an audio player, also as wide as a phone. */
@Component({
    template: `
        <div class="specimens">
            <div [attr.data-kit]="kit('markdown-viewer')"
                style="width: 40rem">
                <nb-markdown-viewer-showcase />
            </div>
            <div [attr.data-kit]="kit('markdown-editor')"
                style="width: 40rem">
                <nb-markdown-editor-showcase />
            </div>
            <div [attr.data-kit]="kit('qr-code')"
                style="width: 24rem">
                <nb-qr-code-showcase />
            </div>
            <div [attr.data-kit]="kit('chart')"
                style="width: 40rem">
                <nb-chart-showcase />
            </div>
            @for (player of players; track player.device) {
            <nb-audio [attr.data-kit]="kitWith('audio', player)"
                src="assets/showcase/media/melody.m4a"
                aria-label="Episode 12, Morning melody"
                [style.width]="player.width" />
            }
            <div [attr.data-kit]="kit('video')"
                style="width: 40rem">
                <nb-video-showcase />
            </div>
        </div>
    `,
    imports: [
        MarkdownViewerShowcaseComponent,
        MarkdownEditorShowcaseComponent,
        QrCodeShowcaseComponent,
        ChartShowcaseComponent,
        NbAudioComponent,
        VideoShowcaseComponent
    ]
})
export class ExtrasSpecimenComponent {
    readonly kit = (component: string) => JSON.stringify({ component })
    readonly kitWith = (component: string, { device }: { device: string }) => JSON.stringify({ component, device })
    // A player as wide as a phone's screen, less its margins, drops its volume and speed.
    readonly players = [
        { device: 'laptop', width: '28rem' },
        { device: 'phone', width: '21.375rem' }
    ]
}
