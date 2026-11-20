import { Component } from '@angular/core';
import { NbComponentSize, NbChatComponent, NbChatMessageComponent, NbChatFormComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-chat-test',
  templateUrl: './chat-test.component.html',
  imports: [NbChatComponent, NbChatMessageComponent, NbChatFormComponent],
})
export class ChatTestComponent {
  messages = new Array<any>();
  sizes: NbComponentSize[] = ['tiny', 'small', 'medium', 'large', 'giant'];
  statuses = ['primary', 'success', 'info', 'warning', 'danger'];

  chats: any[];

  constructor() {
    this.chats = this.prepareChats();
  }

  private prepareChats(): any[] {
    return this.statuses.flatMap((status) => this.sizes.map((size) => ({ size, status })));
  }

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
