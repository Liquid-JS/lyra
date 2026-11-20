import { Component, signal } from '@angular/core'
import { NbChatComponent, NbChatFormComponent, NbChatMessageComponent } from '@liquid-js/lyr-core'

import { illustration } from '../shared/showcase-images'

interface Message {
    text: string
    reply: boolean
    sender: string
    date: Date
}

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000)

/** A mobile app's conversation with a customer, filling the screen. */
@Component({
    selector: 'npg-mobile-messages',
    template: `
    <nb-chat title="Jane Doe" size="giant">
      @for (message of messages(); track $index) {
        <nb-chat-message
          type="text"
          [message]="message.text"
          [reply]="message.reply"
          [sender]="message.sender"
          [date]="message.date"
          [avatar]="message.reply ? undefined : avatar" />
      }
      <nb-chat-form (send)="send($event)" />
    </nb-chat>
  `,
    styles: `
    :host {
      display: block;
      max-width: 36rem;
      margin: 0 auto;
    }

    nb-chat {
      margin: 0;
      height: calc(100vh - 11rem);
    }
  `,
    imports: [NbChatComponent, NbChatFormComponent, NbChatMessageComponent]
})
export class MobileMessagesComponent {
    readonly avatar = illustration('Jane Doe', 'notionists')
    readonly messages = signal<Message[]>([
        { text: 'Hi, are we still on for the review at ten?', reply: false, sender: 'Jane Doe', date: minutesAgo(40) },
        { text: 'Yes, see you then. I will bring the numbers for the quarter.', reply: true, sender: 'You', date: minutesAgo(38) },
        { text: 'Great. Could you include the open invoices too?', reply: false, sender: 'Jane Doe', date: minutesAgo(12) },
        { text: 'Of course, I will add them now.', reply: true, sender: 'You', date: minutesAgo(10) }
    ])

    send({ message }: { message: string }) {
        if (message.trim()) {
            this.messages.update((messages) => [...messages, { text: message, reply: true, sender: 'You', date: new Date() }])
        }
    }
}
