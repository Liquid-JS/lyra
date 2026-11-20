import { Component } from '@angular/core'
import { NbChatComponent, NbChatMessageComponent, NbChatFormComponent, NbChatFormFile } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-chat-drop',
    styles: [
        `
      ::ng-deep nb-layout-column {
        justify-content: center;
        display: flex;
      }
      nb-chat {
        width: 500px;
        height: 80vw;
      }
    `
    ],
    templateUrl: './chat-drop.component.html',
    imports: [NbChatComponent, NbChatMessageComponent, NbChatFormComponent]
})
export class ChatDropComponent {
    messages: any[] = [
        {
            text: 'Drag & drop a file or a group of files.',
            date: new Date(),
            reply: true,
            user: {
                name: 'Bot',
                avatar: 'https://i.gifer.com/no.gif'
            }
        }
    ]

    sendMessage(event: { message: string, files: NbChatFormFile[] }) {
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
            files,
            type: files.length ? 'file' : 'text',
            reply: true,
            user: {
                name: 'John Doe',
                avatar: 'https://i.gifer.com/no.gif'
            }
        })
    }
}
