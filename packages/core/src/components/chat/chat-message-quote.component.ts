import { Component, input } from '@angular/core'
import { DatePipe } from '@angular/common'
import { NbChatMessageTextComponent } from './chat-message-text.component'

/**
 * A `quote` message: the quoted text above the message's own.
 */
@Component({
    selector: 'nb-chat-message-quote',
    templateUrl: './chat-message-quote.component.html',
    imports: [NbChatMessageTextComponent, DatePipe]
})
export class NbChatMessageQuoteComponent {

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
     * The quoted text.
     */
    readonly quote = input<string>()

}
