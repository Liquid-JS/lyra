import { Component } from '@angular/core'
import {
    NbChatComponent,
    NbChatFormComponent,
    NbChatMessageComponent,
    NbChatMessageFile,
    NbComponentStatus
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
    status: NbComponentStatus
    messages: ChatMessage[]
}

@Component({
    selector: 'nb-chat-colors',
    templateUrl: './chat-colors.component.html',
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
    imports: [NbChatComponent, NbChatMessageComponent, NbChatFormComponent]
})
export class ChatColorsComponent {
    readonly chats: Chat[] = [
        {
            status: 'success',
            title: 'Lyra Conversational UI Success',
            messages: [
                {
                    text: 'Success!',
                    date: new Date(),
                    reply: false,
                    user: {
                        name: 'Bot',
                        avatar: 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/robot-face.png'
                    }
                }
            ]
        },
        {
            status: 'danger',
            title: 'Lyra Conversational UI Danger',
            messages: [
                {
                    text: 'Danger!',
                    date: new Date(),
                    reply: false,
                    user: {
                        name: 'Bot',
                        avatar: 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/robot-face.png'
                    }
                }
            ]
        },
        {
            status: 'primary',
            title: 'Lyra Conversational UI Primary',
            messages: [
                {
                    text: 'Primary!',
                    date: new Date(),
                    reply: false,
                    user: {
                        name: 'Bot',
                        avatar: 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/robot-face.png'
                    }
                }
            ]
        },
        {
            status: 'info',
            title: 'Lyra Conversational UI Info',
            messages: [
                {
                    text: 'Info!',
                    date: new Date(),
                    reply: false,
                    user: {
                        name: 'Bot',
                        avatar: 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/robot-face.png'
                    }
                }
            ]
        },
        {
            status: 'warning',
            title: 'Lyra Conversational UI Warning',
            messages: [
                {
                    text: 'Warning!',
                    date: new Date(),
                    reply: false,
                    user: {
                        name: 'Bot',
                        avatar: 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/robot-face.png'
                    }
                }
            ]
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
