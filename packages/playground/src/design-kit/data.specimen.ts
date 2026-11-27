import { Component } from '@angular/core'

import { NbChatComponent, NbChatFormComponent, NbChatMessageComponent } from '@liquid-js/lyr-core'
import { TableShowcaseComponent } from '../playground/with-layout/table/table-showcase.component'
import { TreeGridShowcaseComponent } from '../playground/with-layout/tree-grid/tree-grid-showcase.component'

/** The table and tree grid as the playground shows them, each tagged whole, and a conversation, also as wide as a phone. */
@Component({
    template: `
        <div class="specimens">
            <div [attr.data-kit]="kit('table')"
                style="width: 48rem">
                <nb-table-showcase />
            </div>
            <div [attr.data-kit]="kit('tree-grid')"
                style="width: 48rem">
                <nb-tree-grid-showcase />
            </div>
            @for (chat of chats; track chat.device) {
            <nb-chat [attr.data-kit]="kitWith('chat', chat)"
                title="Support"
                [scrollBottom]="false"
                [style.width]="chat.width"
                [style.height]="chat.height">
                @for (message of messages; track $index) {
                <nb-chat-message [message]="message.text"
                    [sender]="message.reply ? 'Jane Doe' : 'Alex Taylor'"
                    [date]="sent"
                    [reply]="message.reply" />
                }
                <nb-chat-form messagePlaceholder="Type a message" />
            </nb-chat>
            }
        </div>
    `,
    imports: [TableShowcaseComponent, TreeGridShowcaseComponent, NbChatComponent, NbChatMessageComponent, NbChatFormComponent]
})
export class DataSpecimenComponent {
    readonly kit = (component: string) => JSON.stringify({ component })
    readonly kitWith = (component: string, { device }: { device: string }) => JSON.stringify({ component, device })
    // A chat as wide as a phone's screen, less its margins, where its messages wrap; each as tall as its six messages,
    // which scroll in a shorter one.
    readonly chats = [
        { device: 'laptop', width: '28rem', height: '51.75rem' },
        { device: 'phone', width: '21.375rem', height: '55.5rem' }
    ]
    readonly sent = new Date(2026, 2, 18, 9, 30)
    // Six messages, as tall as they are: a chat drawn shorter shows those that fit, as code scrolls to the rest.
    readonly messages = [
        { text: 'Hi! How can we help?', reply: false },
        { text: 'My invoice shows the wrong address.', reply: true },
        { text: 'Sorry about that. Which address should it show?', reply: false },
        { text: '12 High Street, Oxford.', reply: true },
        { text: 'Thanks, I\'ve fixed it and sent you a new invoice.', reply: false },
        { text: 'Got it, thank you!', reply: true }
    ]
}
