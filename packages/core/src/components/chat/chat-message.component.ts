import { Component, computed, inject, input, TemplateRef } from '@angular/core'
import { DomSanitizer, SafeStyle } from '@angular/platform-browser'

import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base'
import { NgTemplateOutlet } from '@angular/common'
import { NbChatMessageFile, NbChatMessageFileComponent } from './chat-message-file.component'
import { NbChatCustomMessageService } from './chat-custom-message.service'
import { NbChatState } from './chat-state'
import { NbChatCustomMessageDirective } from './chat-custom-message.directive'
import { NbChatAvatarComponent } from './chat-avatar.component'
import { NbChatMessageQuoteComponent } from './chat-message-quote.component'
import { NbChatMessageMapComponent } from './chat-message-map.component'
import { NbChatMessageTextComponent } from './chat-message-text.component'

/**
 * A message in an `nb-chat`, with its sender, time and avatar; a `reply` is the other side of the conversation.
 *
 * `type` sets what the message holds:
 * - `text` (default) - the message text
 * - `file` - `files`, images as previews and other files with an icon, grouped when there are several
 * - `quote` - a `quote` of another message above the text
 * - `map` - a Google Maps picture of `latitude` and `longitude`
 * - a custom type, rendered with the chat's `nbCustomMessage` template of that type
 *
 * @stacked-example(Available Types, chat/chat-message-types-showcase.component)
 *
 * Message with attached files:
 * ```html
 * <nb-chat-message
 *   type="file"
 *   [files]="[ { url: '...' } ]"
 *   message="Hello world!">
 * </nb-chat-message>
 * ```
 *
 * Map message:
 * ```html
 * <nb-chat-message
 *   type="map"
 *   [latitude]="53.914"
 *   [longitude]="27.59"
 *   message="Here I am">
 * </nb-chat-message>
 * ```
 * @styles
 *
 * chat-message-background:
 * chat-message-text-color:
 * chat-message-reply-background-color:
 * chat-message-reply-text-color:
 * chat-message-avatar-background-color:
 * chat-message-sender-text-color:
 * chat-message-quote-background-color:
 * chat-message-quote-text-color:
 * chat-message-file-text-color:
 * chat-message-file-background-color:
 * chat-message-max-width:
 */
@Component({
    selector: 'nb-chat-message',
    templateUrl: './chat-message.component.html',
    styleUrls: ['./chat-message.component.scss'],
    imports: [
        NbChatAvatarComponent,
        NbChatMessageFileComponent,
        NbChatMessageQuoteComponent,
        NbChatMessageMapComponent,
        NbChatMessageTextComponent,
        NgTemplateOutlet
    ],
    host: {
        '[animate.enter]': 'enterAnimation',
        'animate.leave': 'nb-chat-message-leave',
        '[class.reply]': 'reply()',
        '[class.not-reply]': 'notReply()'
    }
})
export class NbChatMessageComponent {
    protected readonly domSanitizer = inject(DomSanitizer)
    protected readonly customMessageService = inject(NbChatCustomMessageService)
    private readonly chatState = inject(NbChatState, { optional: true })

    /** Animates in when it arrives in a chat that has rendered, not with the chat's first messages. */
    protected readonly enterAnimation = this.chatState?.settled() === false ? '' : 'nb-chat-message-enter'

    protected readonly builtInMessageTypes: string[] = ['text', 'file', 'map', 'quote']

    get _addReplyClass(): boolean {
        return this._areDefaultStylesEnabled() && this.reply()
    }

    get _addNotReplyClass(): boolean {
        return this._areDefaultStylesEnabled() && this.notReply()
    }

    get _addNoSpaceClass(): boolean {
        return this._areDefaultStylesEnabled() && !this.message()
    }

    readonly notReply = computed(() => !this.reply())

    /**
     * Marks a message from the other side of the conversation: aligned to the other edge, in the reply colours, without
     * an avatar.
     */
    readonly reply = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * The message text.
     */
    readonly message = input<string>()

    /**
     * The sender's name, shown with the message; its initials stand in for a missing `avatar`.
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
     * The files of a `file` message: `{ url, type }` for an image shown as a preview, `{ url, icon }` for another file.
     */
    readonly files = input<NbChatMessageFile[]>()

    /**
     * The quoted text of a `quote` message.
     */
    readonly quote = input<string>()

    /**
     * Latitude of a `map` message.
     */
    readonly latitude = input<number>()

    /**
     * Longitude of a `map` message.
     */
    readonly longitude = input<number>()

    /**
     * URL of the sender's picture, shown beside a message that isn't a `reply`.
     */
    readonly avatar = input<string>()

    readonly avatarStyle = computed<SafeStyle | undefined>(() => {
        const avatar = this.avatar()
        return avatar ? this.domSanitizer.bypassSecurityTrustStyle(`url(${avatar})`) : undefined
    })

    /**
     * Message type: `text` (default), `file`, `map`, `quote`, or a custom one with an `nbCustomMessage` template.
     */
    readonly type = input<string>()

    /**
     * What a custom message's template gets as its `$implicit` context.
     */
    readonly customMessageData = input<unknown>()

    getInitials(): string {
        const sender = this.sender()
        if (sender) {
            const names = sender.split(' ')
            return names
                .map((n) => n.charAt(0))
                .splice(0, 2)
                .join('')
                .toUpperCase()
        }
        return ''
    }

    _isBuiltInMessageType(): boolean {
    // Unset type defaults to "text" type
        const type = this.type()
        return type == null || this.builtInMessageTypes.includes(type)
    }

    _getTemplate(): TemplateRef<unknown> {
        const customMessage = this.getCustomMessage(this.type())
        return customMessage.templateRef
    }

    _getTemplateContext(): { $implicit: unknown, isReply: boolean } {
        return { $implicit: this.customMessageData(), isReply: this.reply() }
    }

    _areDefaultStylesEnabled(): boolean {
        const customMessageDirective = this.getCustomMessage(this.type())
        return !customMessageDirective.noStyles()
    }

    protected getCustomMessage(type?: string): NbChatCustomMessageDirective {
        const customMessageDirective = type ? this.customMessageService.getInstance(type) : undefined
        if (!customMessageDirective) {
            throw new Error(
                `nb-chat: Can't find template for custom type '${type}'. ` +
                    `Make sure you provide it in the chat component with *nbCustomMessage='${type}'.`
            )
        }
        return customMessageDirective
    }
}
