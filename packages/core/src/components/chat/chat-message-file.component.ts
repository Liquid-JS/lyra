import { Component, computed, inject, input } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { NbIconComponent } from '@liquid-js/lyr-core/icon'
import { NbChatMessageTextComponent } from './chat-message-text.component'

export interface NbChatMessageFileIconPreview {
    url: string
    icon: string
    /** Accessible name of the file link, the file name from the URL by default. */
    name?: string
}
export interface NbChatMessageFileImagePreview {
    url: string
    type: string
    /** Accessible name of the file link, the file name from the URL by default. */
    name?: string
}
export type NbChatMessageFile = NbChatMessageFileIconPreview | NbChatMessageFileImagePreview

/**
 * A `file` message: its text, and each file as a link, images as previews and other files with their icon.
 */
@Component({
    selector: 'nb-chat-message-file',
    templateUrl: './chat-message-file.component.html',
    imports: [NbChatMessageTextComponent, NbIconComponent]
})
export class NbChatMessageFileComponent {
    protected readonly domSanitizer = inject(DomSanitizer)

    /**
     * The message text.
     */
    readonly message = input<string>()

    /**
     * The sender's name.
     */
    readonly sender = input<string>()

    /**
     * When the message was sent.
     */
    readonly date = input<Date>()

    /**
     * `DatePipe` format of the date; `shortTime` by default.
     */
    readonly dateFormat = input<string>('shortTime')

    /**
     * The files: `{ url, type }` for an image shown as a preview, `{ url, icon }` for another file.
     */
    readonly files = input<NbChatMessageFile[]>()

    readonly readyFiles = computed(() =>
        (this.files() || []).map((file) => {
            const isImage = this.isImage(file)
            return {
                ...file,
                icon: 'icon' in file ? file.icon : undefined,
                urlStyle: isImage && this.domSanitizer.bypassSecurityTrustStyle(`url(${file.url})`),
                isImage,
                name: file.name ?? this.getFileName(file.url)
            }
        })
    )

    protected getFileName(url: string): string {
        const path = (url ?? '').split(/[?#]/)[0]
        const name = path.slice(path.lastIndexOf('/') + 1)
        try {
            return decodeURIComponent(name) || url
        } catch {
            return name || url
        }
    }

    isImage(file: NbChatMessageFile): boolean {
        const type = 'type' in file ? file.type : undefined
        if (type) {
            return ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/avif', 'image/svg+xml'].includes(type)
        }
        return false
    }
}
