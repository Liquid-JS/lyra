import { Component, input } from '@angular/core'
import { DatePipe } from '@angular/common'

/**
 * The text of a message, with its sender and time.
 */
@Component({
    selector: 'nb-chat-message-text',
    templateUrl: './chat-message-text.component.html',
    imports: [DatePipe]
})
export class NbChatMessageTextComponent {

    /**
     * The sender's name.
     */
    readonly sender = input<string>()

    /**
     * The message text.
     */
    readonly message = input<string>()

    /**
     * When the message was sent.
     */
    readonly date = input<Date>()

    /**
     * `DatePipe` format of the date; `shortTime` by default.
     */
    readonly dateFormat = input<string>('shortTime')

}
