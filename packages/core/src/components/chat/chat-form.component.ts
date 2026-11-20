import {
    afterRenderEffect,
    Component,
    computed,
    ElementRef,
    inject,
    input,
    model,
    output,
    signal,
    viewChild
} from '@angular/core'
import { DomSanitizer, SafeStyle } from '@angular/platform-browser'

import { NbComponentOrCustomStatus, ɵisComposing as isComposing, injectNbTexts, NbLocalize, ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base'
import { NbIconComponent } from '@liquid-js/lyr-core/icon'
import { NbInputDirective } from '@liquid-js/lyr-core/input'
import { NbButtonComponent } from '@liquid-js/lyr-core/button'
import { NbChatFormRef } from './chat-form-ref'

/** @internal */
declare const $localize: NbLocalize

/**
 * A file dropped or pasted in `nb-chat-form`. An image gets its data URL in `src` and a background-image style of it
 * in `urlStyle` once it's read.
 */
export type NbChatFormFile = File & { src?: string, urlStyle?: SafeStyle }

/**
 * The message field and send button at the bottom of an `nb-chat`.
 *
 * ```ts
 * <nb-chat-form showButton="true" buttonIcon="paper-plane-outline">
 * </nb-chat-form>
 * ```
 *
 * The message can have several lines: Enter sends it and Shift+Enter starts a new line. The field grows with the
 * message, up to `chat-form-input-max-height`, and then scrolls.
 *
 * With `dropFiles` it handles files drag&drop with a file preview, and adds files and images pasted into the
 * field, e.g. a screenshot.
 *
 * Drag & drop available for files and images:
 *
 * @stacked-example(Drag & Drop Chat, chat/chat-drop.component)
 *
 * `send` emits the message and its files; the form is then cleared.
 *
 * ```ts
 * <nb-chat-form (send)="onNewMessage($event)">
 * </nb-chat-form>
 *
 * // ...
 *
 * onNewMessage({ message: string, files: any[] }) {
 *   this.service.sendToServer(message, files);
 * }
 * ```
 */
@Component({
    selector: 'nb-chat-form',
    templateUrl: './chat-form.component.html',
    imports: [NbIconComponent, NbInputDirective, NbButtonComponent],
    providers: [{ provide: NbChatFormRef, useExisting: NbChatFormComponent }],
    host: {
        '[class.file-over]': 'fileOver()',
        '(drop)': 'onDrop($event)',
        '(dragover)': 'onDragOver($event)',
        '(dragleave)': 'onDragLeave($event)'
    }
})
export class NbChatFormComponent implements NbChatFormRef {
    protected readonly texts = injectNbTexts('chat', () => ({
        noMessages: $localize`:@@nb.chat.noMessages:No messages yet.`,
        messages: $localize`:@@nb.chat.messages:Messages`,
        messagePlaceholder: $localize`:@@nb.chat.messagePlaceholder:Type a message`,
        dropFilePlaceholder: $localize`:@@nb.chat.dropFilePlaceholder:Drop file to send`,
        removeFile: (name) => $localize`:@@nb.chat.removeFile:Remove ${name}:name:`
    }))

    protected readonly domSanitizer = inject(DomSanitizer)

    readonly status = signal<NbComponentOrCustomStatus>('basic')
    readonly inputFocus = signal(false)
    readonly inputHover = signal(false)
    readonly fileOver = signal(false)

    readonly droppedFiles = signal<NbChatFormFile[]>([])
    imgDropTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/avif', 'image/svg+xml']

    /**
     * The message text. Two-way bindable; cleared once the message is sent.
     */
    readonly message = model<string>('')

    /**
     * Placeholder of the field; "Type a message" by default.
     */
    readonly messagePlaceholder = input<string>()
    /**
     * Text of the send button, in place of its icon.
     */
    readonly buttonTitle = input<string>('')

    /**
     * Icon of the send button, shown while `buttonTitle` is empty.
     */
    readonly buttonIcon = input<string>('paper-plane-outline')

    /**
     * Shows the send button (default). Enter sends the message either way.
     */
    readonly showButton = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty })

    /**
     * Takes files dropped on the form or pasted into the field, shown as previews above it and sent with the message.
     */
    readonly dropFiles = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * Placeholder of the field while a file is dragged over the form; "Drop file to send" by default.
     */
    readonly dropFilePlaceholder = input<string>()

    /**
     * Emits the message and the files dropped or pasted with it; images come with their previews.
     */
    readonly send = output<{
        message: string
        files: NbChatFormFile[]
    }>()

    /**
     * Emits the text as the user types.
     */
    readonly onInputChange = output<string>()

    private readonly messageInput = viewChild.required<ElementRef<HTMLTextAreaElement>>('messageInput')
    private readonly sendButton = viewChild('sendButton', { read: ElementRef<HTMLElement> })

    constructor() {
    // The send button sits in the field's corner, and the field's text stops before it: the theme knows an icon
    // button's width, and a button with a title tells it its own.
        afterRenderEffect((onCleanup) => {
            const button = this.sendButton()?.nativeElement
            const row = button?.parentElement
            if (!button || !row || typeof ResizeObserver === 'undefined') {
                return
            }
            const observer = new ResizeObserver(() =>
                row.style.setProperty('--nb-chat-send-width', `${button.offsetWidth}px`)
            )
            observer.observe(button)
            onCleanup(() => {
                observer.disconnect()
                row.style.removeProperty('--nb-chat-send-width')
            })
        })

        // The field fits the message with `field-sizing: content`; where that isn't supported, it's measured. The theme
        // limits its height, and an empty field has the height of one line.
        if (typeof CSS === 'undefined' || CSS.supports('field-sizing', 'content')) {
            return
        }
        afterRenderEffect(() => {
            const field = this.messageInput().nativeElement
            field.style.height = ''
            if (this.message()) {
                const borders = field.offsetHeight - field.clientHeight
                field.style.height = `${field.scrollHeight + borders}px`
            }
        })
    }

    onDrop(event: DragEvent) {
        if (this.dropFiles()) {
            event.preventDefault()
            event.stopPropagation()

            this.fileOver.set(false)
            if (event.dataTransfer && event.dataTransfer.files) {
                this.addFiles(event.dataTransfer.files)
            }
        }
    }

    /** @internal Adds pasted files, e.g. a screenshot, like dropped ones. */
    onPaste(event: ClipboardEvent) {
        const files = event.clipboardData?.files
        if (this.dropFiles() && files?.length) {
            event.preventDefault()
            this.addFiles(files)
        }
    }

    /** @internal */
    onInput(event: Event) {
        const value = (event.target as HTMLTextAreaElement).value
        this.message.set(value)
        this.onModelChange(value)
    }

    /**
     * @internal
     * Enter sends the message; Shift+Enter, and Enter that ends a composition, e.g. of a Japanese word, don't.
     */
    onEnter(event: Event) {
        const keyboardEvent = event as KeyboardEvent
        if (keyboardEvent.shiftKey || isComposing(keyboardEvent)) {
            return
        }
        event.preventDefault()
        this.sendMessage()
    }

    protected addFiles(files: FileList) {
        for (const file of Array.from(files)) {
            const res: NbChatFormFile = file

            if (this.imgDropTypes.includes(file.type)) {
                const fr = new FileReader()
                fr.onload = () => {
                    // A data URL, as it's read with `readAsDataURL`.
                    res.src = String(fr.result)
                    res.urlStyle = this.domSanitizer.bypassSecurityTrustStyle(`url(${res.src})`)
                    // A new array, so the preview renders with the loaded image.
                    this.droppedFiles.update((droppedFiles) => [...droppedFiles])
                }

                fr.readAsDataURL(file)
            }
            this.droppedFiles.update((droppedFiles) => [...droppedFiles, res])
        }
    }

    removeFile(file: File) {
        this.droppedFiles.update((files) => files.filter((droppedFile) => droppedFile !== file))
    }

    onDragOver(event: DragEvent) {
        event.preventDefault()
        event.stopPropagation()
        if (this.dropFiles()) {
            this.fileOver.set(true)
        }
    }

    onDragLeave(event: DragEvent) {
        event.preventDefault()
        event.stopPropagation()
        if (this.dropFiles()) {
            this.fileOver.set(false)
        }
    }

    sendMessage() {
        const files = this.droppedFiles()
        if (files.length || String(this.message()).trim().length) {
            this.send.emit({ message: this.message(), files })
            this.message.set('')
            this.droppedFiles.set([])
        }
    }

    setStatus(status: NbComponentOrCustomStatus) {
        this.status.set(status)
    }

    readonly inputStatus = computed<NbComponentOrCustomStatus>(() => {
        if (this.fileOver()) {
            return this.highlightStatus()
        }

        if (this.inputFocus() || this.inputHover()) {
            return this.status()
        }

        return 'basic'
    })

    readonly buttonStatus = computed(() => this.highlightStatus())

    protected readonly highlightStatus = computed<NbComponentOrCustomStatus>(() => {
        const status = this.status()
        return status === 'basic' || status === 'control' ? 'primary' : status
    })

    onModelChange(value: string) {
        this.onInputChange.emit(value)
    }
}
