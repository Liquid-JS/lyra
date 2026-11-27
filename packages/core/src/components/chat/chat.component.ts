import {
    afterNextRender,
    afterRenderEffect,
    Component,
    computed,
    contentChild,
    contentChildren,
    effect,
    ElementRef,
    inject,
    input,
    linkedSignal,
    untracked,
    viewChild
} from '@angular/core'

import { NbStatusService, injectNbDefaults, NbContainerAppearance, NbComponentSize, NbComponentOrCustomStatus, ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput, injectNbTexts, NbLocalize } from '@liquid-js/lyr-core/base'
import { NgTemplateOutlet } from '@angular/common'
import { NbChatFormRef } from './chat-form-ref'
import { NbChatMessageComponent } from './chat-message.component'
import { NbChatCustomMessageService } from './chat-custom-message.service'
import { NbChatState } from './chat-state'
import { NbChatTitleDirective } from './chat-title.directive'

/** @internal */
declare const $localize: NbLocalize

/**
 * A chat: a titled list of messages with a form to send one.
 *
 * Main features:
 * - message types: text, files and images, quotes, maps, and custom ones with their own templates
 * - drag & drop and pasting of images and files, with previews
 * - statuses, sizes and appearances
 *
 * Here's a complete example built as a bot-like app. Type `help` to receive the different message types.
 *
 * @stacked-example(Showcase, chat/chat-showcase.component)
 *
 * The messages are a `log` region named by the title, which scrolls by keyboard, and new messages animate in and
 * scroll into view.
 *
 * Basic chat configuration and usage:
 * ```ts
 * <nb-chat title="Lyra Conversational UI">
 *   @for (msg of messages; track msg) {
 *     <nb-chat-message [type]="msg.type"
 *                      [message]="msg.text"
 *                      [reply]="msg.reply"
 *                      [sender]="msg.user.name"
 *                      [date]="msg.date"
 *                      [files]="msg.files"
 *                      [quote]="msg.quote"
 *                      [latitude]="msg.latitude"
 *                      [longitude]="msg.longitude"
 *                      [avatar]="msg.user.avatar">
 *     </nb-chat-message>
 *   }
 *
 *   <nb-chat-form (send)="sendMessage($event)" dropFiles>
 *   </nb-chat-form>
 * </nb-chat>
 * ```
 * ### Installation
 *
 * Import `NbChatComponent`, `NbChatMessageComponent`, `NbChatFormComponent` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbChatComponent, NbChatMessageComponent, NbChatFormComponent],
 * })
 * export class PageComponent { }
 * ```
 *
 * and add `provideNbChat()` to the application providers:
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [provideNbChat({ messageGoogleMapKey: 'MAP_KEY' })],
 * });
 * ```
 * In a lazy loaded route, add `provideNbChat()` to the route's `providers` instead, so the route gets its own instance.
 *
 * With NgModules:
 *
 * Import `NbChatModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbChatModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 *
 * If you need to provide an API key for a `map` message type (which is required by Google Maps)
 * you may use `NbChatModule.forRoot({ ... })` call if this is a global app configuration
 * or `NbChatModule.forChild({ ... })` for a feature module configuration:
 *
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbChatModule.forRoot({ messageGoogleMapKey: 'MAP_KEY' }),
 *   ],
 * })
 * export class AppModule { }
 * ```
 *
 * ### Usage
 *
 * There are three main components:
 * ```ts
 * <nb-chat>
 * </nb-chat> // chat container
 *
 * <nb-chat-form>
 * </nb-chat-form> // chat form with drag&drop files feature
 *
 * <nb-chat-message>
 * </nb-chat-message> // chat message, available multiple types
 * ```
 *
 * An `nbChatTitle` template replaces the `title` text:
 * @stacked-example(Custom template as a title, chat/chat-template-title.component)
 *
 * A conversation between two users, with `reply` marking one side's messages:
 * @stacked-example(Conversation, chat/chat-conversation-showcase.component)
 *
 * `status` colours the header and the form:
 * @stacked-example(Colored Chat, chat/chat-colors.component)
 *
 * `size` gives the chat a fixed height:
 * @stacked-example(Chat Sizes, chat/chat-sizes.component)
 *
 * A chat looks like a card, to sit among them in a page. One that floats over the page, e.g. opened from a button in
 * a corner, has a shadow instead of a border with `appearance="floating"`:
 * @stacked-example(Floating Chat, chat/chat-floating.component)
 *
 * # Custom message types
 *
 * Besides built-in message types, you could provide custom ones with their own template to render.
 * As an example, let's add the `link` message type.
 * <br>
 * First, you need to provide a template for the `link` message type:
 * ```html
 * <nb-chat>
 *   <a *nbCustomMessage="'link'" href="https://example.com">example.com</a>
 * </nb-chat>
 * ```
 * Then, add the `nb-chat-message` component with the `link` type:
 * ```html
 * <nb-chat>
 *   <a *nbCustomMessage="'link'" href="https://example.com">example.com</a>
 *   <nb-chat-message type="link"></nb-chat-message>
 * </nb-chat>
 * ```
 *
 * <div class="note note-warning">
 *   <div class="note-title">Important!</div>
 *   <div class="note-body">
 *     Custom chat messages must be defined before the `nb-chat-message`.
 *   </div>
 * </div>
 *
 * Custom message templates could have arbitrary data associated with them. Let's extract hardcoded link
 * href and text. To pass some data to the custom message template, use the `customMessageData` input
 * of the `nb-chat-message` component:
 * ```html
 * ...
 * <nb-chat-message type="link" [customMessageData]="{ href: 'https://example.com', text: 'example.com' }">
 * </nb-chat-message>
 * ...
 * ```
 * When `customMessageData` is set, this object would become a template context and you'll be able
 * to reference it via `let varName` syntax:
 * ```html
 * <a *nbCustomMessage="'link'; let data" [href]="data.href">{{ data.text }}</a>
 * ```
 *
 * That's it, full example will look like this:
 * ```html
 * <nb-chat title="Lyra Conversational UI">
 *   <a *nbCustomMessage="'link'; let data" [href]="data.href">{{ data.text }}</a>
 *   <nb-chat-message type="link" [customMessageData]="{ href: 'https://example.com', text: 'example.com' }">
 *   </nb-chat-message>
 * </nb-chat>
 * ```
 *
 * If you want to style your custom template from the ground up you could turn off generic message styling
 * (such as round borders, color, background, etc.) via the `noStyles` input:
 * ```html
 *   <div *nbCustomMessage="'my-custom-type'; noStyles: true">...</div>
 * ```
 * When you decide to use your own styles, the `isReply` property of the custom message template context
 * would come in handy. This property allows you to determine whether the message is a reply or not.
 * For example, to change link text color (as replies have a different background):
 * ```html
 * <a *nbCustomMessage="'link'; let data; let isReply=isReply"
 *    [href]="data.href"
 *    [class.link-control]="!isReply">
 *   {{ data.label }}
 * </a>
 * ```
 *
 * Below, you could find a more complex example with multiple custom message types:
 * @stacked-example(Custom message, chat/chat-custom-message.component)
 * @styles
 *
 * chat-background-color:
 * chat-border-width:
 * chat-border-style:
 * chat-border-color:
 * chat-border-radius:
 * chat-shadow:
 * chat-floating-shadow:
 * chat-padding:
 * chat-scrollbar-color:
 * chat-scrollbar-background-color:
 * chat-scrollbar-width:
 * chat-text-color:
 * chat-text-font-family:
 * chat-text-font-size:
 * chat-text-font-weight:
 * chat-text-line-height:
 * chat-header-text-font-family:
 * chat-header-text-font-size:
 * chat-header-text-font-weight:
 * chat-header-text-line-height:
 * chat-tiny-height:
 * chat-small-height:
 * chat-medium-height:
 * chat-large-height:
 * chat-giant-height:
 * chat-basic-background-color:
 * chat-basic-text-color:
 * chat-primary-background-color:
 * chat-primary-text-color:
 * chat-success-background-color:
 * chat-success-text-color:
 * chat-info-background-color:
 * chat-info-text-color:
 * chat-warning-background-color:
 * chat-warning-text-color:
 * chat-danger-background-color:
 * chat-danger-text-color:
 * chat-control-background-color:
 * chat-control-text-color:
 * chat-divider-color:
 * chat-divider-style:
 * chat-divider-width:
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
 * chat-form-input-max-height:
 */
@Component({
    selector: 'nb-chat',
    styleUrls: ['./chat.component.scss'],
    templateUrl: './chat.component.html',
    providers: [NbChatCustomMessageService, NbChatState],
    host: {
        '[class]': 'hostClasses()'
    },
    imports: [NgTemplateOutlet]
})
export class NbChatComponent {
    protected readonly texts = injectNbTexts('chat', () => ({
        noMessages: $localize`:@@nb.chat.noMessages:No messages yet.`,
        messages: $localize`:@@nb.chat.messages:Messages`,
        messagePlaceholder: $localize`:@@nb.chat.messagePlaceholder:Type a message`,
        dropFilePlaceholder: $localize`:@@nb.chat.dropFilePlaceholder:Drop file to send`,
        removeFile: (name) => $localize`:@@nb.chat.removeFile:Remove ${name}:name:`
    }))

    protected readonly statusService = inject(NbStatusService)

    /**
     * The title in the header, which also names the list of messages; an `nbChatTitle` template replaces it.
     */
    readonly title = input<string>()

    /**
     * A fixed height: `tiny`, `small`, `medium`, `large` or `giant`. Unset by default.
     */
    readonly size = input<NbComponentSize>()

    /**
     * Colours the header and the form: `basic` (default), `primary`, `success`, `info`, `warning`, `danger`,
     * `control` or a custom status.
     */
    readonly status = input<NbComponentOrCustomStatus>('basic')

    /**
     * Text shown while there are no messages; "No messages yet." by default.
     */
    readonly noMessagesPlaceholder = input<string>()

    // The app's defaults for chats, which the appearance starts from.
    protected readonly nbDefaults = injectNbDefaults('chat')

    /**
     * Chat appearance: `outline`, a card's border, or `floating`, a shadow instead, for a chat over the page, e.g.
     * opened from a button in a corner.
     */
    readonly appearanceInput = input<NbContainerAppearance | undefined>(undefined, { alias: 'appearance' })
    /** The appearance in use: the input's, the app's default, or 'outline'. */
    readonly appearance = linkedSignal<NbContainerAppearance>(
        () => this.appearanceInput() ?? this.nbDefaults().appearance ?? 'outline'
    )

    /**
     * Scrolls to the latest message as messages arrive (default).
     */
    readonly scrollBottom = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty })

    readonly scrollable = viewChild<ElementRef<HTMLElement>>('scrollable')
    readonly messages = contentChildren(NbChatMessageComponent)
    readonly chatForm = contentChild(NbChatFormRef)
    readonly titleTemplate = contentChild(NbChatTitleDirective)
    private readonly state = inject(NbChatState)

    protected readonly hostClasses = computed(() => [
        this.size() && `size-${this.size()}`,
        `appearance-${this.appearance()}`,
        this.statusService.getStatusClass(this.status())
    ].filter(Boolean))

    constructor() {
    // The form takes the chat's status.
        effect(() => {
            const status = this.status()
            untracked(() => this.chatForm()?.setStatus(status))
        })

        // Show the latest message once the messages render.
        afterRenderEffect(() => {
            this.messages()
            untracked(() => this.updateView())
        })

        // The messages it renders with are there already; later ones arrive, and animate in.
        afterNextRender(() => this.state.settled.set(true))
    }

    updateView() {
        if (this.scrollBottom()) {
            this.scrollListBottom()
        }
    }

    scrollListBottom() {
        const scrollable = this.scrollable()?.nativeElement
        if (!scrollable) {
            return
        }
        // To a message that arrives smoothly, alongside its animation; at once to the ones it renders with, or where motion
        // is reduced.
        const view = scrollable.ownerDocument.defaultView
        const smooth =
            this.state.settled() && !!view && !view.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        if (smooth && typeof scrollable.scrollTo === 'function') {
            scrollable.scrollTo({ top: scrollable.scrollHeight, behavior: 'smooth' })
        } else {
            scrollable.scrollTop = scrollable.scrollHeight
        }
    }
}
