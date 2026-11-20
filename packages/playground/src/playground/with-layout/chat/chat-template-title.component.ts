import { Component } from '@angular/core';
import { ChatShowcaseService } from './chat-showcase.service';
import {
  NbChatComponent,
  NbChatTitleDirective,
  NbChatMessageComponent,
  NbChatFormComponent,
} from '@liquid-js/lyr-core';

@Component({
  templateUrl: './chat-template-title.component.html',
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
  imports: [NbChatComponent, NbChatTitleDirective, NbChatMessageComponent, NbChatFormComponent],
})
export class ChatTemplateTitleComponent {
  messages: any[] = [
    {
      text: 'Custom template was provided as a title!',
      date: new Date(),
      reply: false,
      user: {
        name: 'Bot',
        avatar: 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/robot-face.png',
      },
    },
  ];

  sendMessage(event: { message: string }) {
    this.messages.push({
      text: event.message,
      date: new Date(),
      reply: true,
      user: {
        name: 'John Doe',
        avatar: 'https://techcrunch.com/wp-content/uploads/2015/08/safe_image.gif',
      },
    });
  }
}
