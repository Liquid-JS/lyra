import { Component } from '@angular/core'

import { ChartShowcaseComponent } from '../playground/with-layout/chart/chart-showcase.component'
import { MarkdownEditorShowcaseComponent } from '../playground/with-layout/markdown/markdown-editor-showcase.component'
import { MarkdownViewerShowcaseComponent } from '../playground/with-layout/markdown/markdown-viewer-showcase.component'
import { AudioShowcaseComponent } from '../playground/with-layout/media/audio-showcase.component'
import { VideoShowcaseComponent } from '../playground/with-layout/media/video-showcase.component'
import { QrCodeShowcaseComponent } from '../playground/with-layout/qr-code/qr-code-showcase.component'

/** The extras as the playground shows them, each tagged whole. */
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
            <div [attr.data-kit]="kit('audio')"
                style="width: 28rem">
                <nb-audio-showcase />
            </div>
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
        AudioShowcaseComponent,
        VideoShowcaseComponent
    ]
})
export class ExtrasSpecimenComponent {
    readonly kit = (component: string) => JSON.stringify({ component })
}
