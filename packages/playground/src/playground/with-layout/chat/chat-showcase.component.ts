import { Component, inject, signal } from '@angular/core';
import { ChatShowcaseService } from './chat-showcase.service';
import { NbChatComponent, NbChatMessageComponent, NbChatFormComponent, NbChatFormFile } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-chat-showcase',
  templateUrl: './chat-showcase.component.html',
  providers: [ChatShowcaseService],
  styles: [
    `
      ::ng-deep nb-layout-column {
        justify-content: center;
        display: flex;
      }
      nb-chat {
        width: 500px;
      }
    `,
  ],
  imports: [NbChatComponent, NbChatMessageComponent, NbChatFormComponent],
})
export class ChatShowcaseComponent {
  protected readonly chatShowcaseService = inject(ChatShowcaseService);

  readonly messages = signal<any[]>(this.chatShowcaseService.loadMessages());

  sendMessage(event: { message: string; files: NbChatFormFile[] }) {
    const files = !event.files
      ? []
      : event.files.map((file) => {
        return {
          url: file.src,
          type: file.type,
          icon: 'file-text-outline',
        };
      });

    const message = {
      text: event.message,
      date: new Date(),
      reply: true,
      type: files.length ? 'file' : 'text',
      files: files,
      user: {
        name: 'John Doe',
        avatar: 'https://i.gifer.com/no.gif',
      },
    };
    this.messages.update((messages) => [...messages, message]);
    const botReply = this.chatShowcaseService.reply(event.message);
    if (botReply) {
      setTimeout(() => {
        this.messages.update((messages) => [...messages, botReply]);
      }, 500);
    }
  }
}
