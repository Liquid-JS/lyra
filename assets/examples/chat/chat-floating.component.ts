import { Component, signal } from '@angular/core'
import {
    NbButtonComponent,
    NbChatComponent,
    NbChatFormComponent,
    NbChatMessageComponent,
    NbIconComponent
} from '@liquid-js/lyr-core'

interface Message {
    text: string
    date: Date
    reply: boolean
    sender: string
}

@Component({
    selector: 'nb-chat-floating',
    template: `
    <p>Questions about your order? Our support team is online from 9 am to 5 pm.</p>

    @if (open()) {
    <nb-chat appearance="floating"
      title="Support"
      size="medium"
      class="floating-chat">
      @for (message of messages(); track message) {
      <nb-chat-message [message]="message.text"
        [reply]="message.reply"
        [sender]="message.sender"
        [date]="message.date" />
      }
      <nb-chat-form (send)="send($event.message)" />
    </nb-chat>
    }

    <button nbButton
      type="button"
      status="primary"
      shape="round"
      size="large"
      class="chat-toggle"
      [attr.aria-label]="open() ? 'Close the chat' : 'Chat with support'"
      [attr.aria-expanded]="open()"
      (click)="open.set(!open())">
      <nb-icon [icon]="open() ? 'close-outline' : 'message-circle-outline'" />
    </button>
  `,
    styles: [
        `
      :host {
        display: block;
        min-height: 36rem;
      }

      .floating-chat {
        position: fixed;
        inset-inline-end: 1.5rem;
        bottom: 6rem;
        width: min(22rem, calc(100vw - 3rem));
      }

      .chat-toggle {
        position: fixed;
        inset-inline-end: 1.5rem;
        bottom: 1.5rem;
      }
    `
    ],
    imports: [NbButtonComponent, NbChatComponent, NbChatFormComponent, NbChatMessageComponent, NbIconComponent]
})
export class ChatFloatingComponent {
    readonly open = signal(true)
    readonly messages = signal<Message[]>([
        { text: 'Hi! How can we help?', date: new Date(), reply: false, sender: 'Jane Doe' }
    ])

    send(text: string) {
        this.messages.update((messages) => [...messages, { text, date: new Date(), reply: true, sender: 'You' }])
    }
}
