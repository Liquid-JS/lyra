import { Component } from '@angular/core'
import {
    NbChatComponent,
    NbChatFormComponent,
    NbChatMessageComponent,
    NbChatMessageFile,
    NbComponentSize
} from '@liquid-js/lyr-core'

interface ChatMessage {
    text: string
    date: Date
    reply: boolean
    type?: string
    files?: NbChatMessageFile[]
    user: { name: string, avatar: string }
}

interface Chat {
    title: string
    size: NbComponentSize
    messages: ChatMessage[]
}

@Component({
    selector: 'nb-chat-sizes',
    styles: [
        `
      ::ng-deep nb-layout-column {
        justify-content: center;
        display: flex;
      }
      nb-chat {
        width: 500px;
        margin: 0.5rem 0 2rem 2rem;
      }
    `
    ],
    templateUrl: './chat-size.component.html',
    imports: [NbChatComponent, NbChatMessageComponent, NbChatFormComponent]
})
export class ChatSizesComponent {
    readonly chats: Chat[] = [
        {
            title: 'Lyra Conversational UI Small',
            messages: [
                {
                    text: 'Small!',
                    date: new Date(),
                    reply: true,
                    user: {
                        name: 'Bot',
                        avatar: 'https://i.gifer.com/no.gif'
                    }
                }
            ],
            size: 'small'
        },
        {
            title: 'Lyra Conversational UI Medium',
            messages: [
                {
                    text: 'Medium!',
                    date: new Date(),
                    reply: true,
                    user: {
                        name: 'Bot',
                        avatar: 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/robot-face.png'
                    }
                }
            ],
            size: 'large'
        }
    ]

    sendMessage(messages: ChatMessage[], event: { message: string }) {
        messages.push({
            text: event.message,
            date: new Date(),
            reply: true,
            user: {
                name: 'John Doe',
                avatar: 'https://techcrunch.com/wp-content/uploads/2015/08/safe_image.gif'
            }
        })
    }
}
