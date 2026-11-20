import { Component } from '@angular/core'
import { NbChatComponent, NbChatMessageComponent, NbChatFormComponent, NbChatFormFile } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-chat-conversation-showcase',
    styles: [
        `
      ::ng-deep nb-layout-column {
        display: flex;
        justify-content: center;
      }
      :host {
        display: flex;
      }
      nb-chat {
        width: 300px;
        margin: 1rem;
      }
    `
    ],
    templateUrl: './chat-conversation-showcase.component.html',
    imports: [NbChatComponent, NbChatMessageComponent, NbChatFormComponent]
})
export class ChatConversationShowcaseComponent {
    messages = new Array<any>()

    sendMessage(event: { message: string, files: NbChatFormFile[] }, userName: string, avatar: string, reply: boolean) {
        const files = !event.files
            ? []
            : event.files.map((file) => ({
                url: file.src,
                type: file.type,
                icon: 'file-text-outline'
            }))

        this.messages.push({
            text: event.message,
            date: new Date(),
            reply,
            type: files.length ? 'file' : 'text',
            files,
            user: {
                name: userName,
                avatar
            }
        })
    }
}
