import { Component, OnInit } from '@angular/core';
import {
  NbChatComponent,
  NbChatCustomMessageDirective,
  NbButtonComponent,
  NbChatMessageComponent,
  NbChatFormComponent,
} from '@liquid-js/lyr-core';
import { ChatCustomMessageTableComponent } from './components/chat-custom-message-table.component';

@Component({
  templateUrl: './chat-custom-message.component.html',
  styleUrls: ['./chat-custom-message.component.scss'],
  imports: [
    NbChatComponent,
    NbChatCustomMessageDirective,
    NbButtonComponent,
    ChatCustomMessageTableComponent,
    NbChatMessageComponent,
    NbChatFormComponent,
  ],
})
export class ChatCustomMessageComponent implements OnInit {

  readonly tableData = {
    columns: ['First Name', 'Last Name', 'Age'],
    rows: [
      { firstName: 'Robert', lastName: 'Baratheon', age: 46 },
      { firstName: 'Jaime', lastName: 'Lannister', age: 31 },
    ],
  };

  messages = new Array<any>();

  ngOnInit() {
    this.loadMessages();
  }

  sendMessage(event: any) {
    this.messages.push({
      text: event.message,
      date: new Date(),
      reply: true,
      type: 'text',
      user: {
        name: 'John Smith',
        avatar: 'https://i.gifer.com/no.gif',
      },
    });
  }

  private loadMessages() {
    this.messages = [
      {
        type: 'link',
        text: 'Now you able to use links!',
        customMessageData: {
          href: 'https://liquid-js.github.io/lyra/',
          text: 'Go to Lyra',
        },
        reply: false,
        date: new Date(),
        user: {
          name: 'Jane Doe',
          avatar: 'https://i.gifer.com/no.gif',
        },
      },
      {
        type: 'link',
        customMessageData: {
          href: 'https://github.com/Liquid-JS/lyra',
          text: 'Go to Lyra on GitHub',
        },
        reply: true,
        date: new Date(),
        user: {
          name: 'Richard Roe',
          avatar: 'https://i.gifer.com/no.gif',
        },
      },
      {
        type: 'button',
        customMessageData: 'Click to scroll down',
        reply: false,
        date: new Date(),
        user: {
          name: 'Mary Major',
          avatar: '',
        },
      },
      {
        type: 'table',
        text: `Now let's try to add a table`,
        customMessageData: this.tableData,
        reply: false,
        date: new Date(),
        user: {
          name: 'Sam Taylor',
          avatar: 'https://i.gifer.com/no.gif',
        },
      },
      {
        type: 'table',
        text: `And one more table but now in the reply`,
        customMessageData: this.tableData,
        reply: true,
        date: new Date(),
        user: {
          name: 'Sam Taylor',
          avatar: 'https://i.gifer.com/no.gif',
        },
      },
    ];
  }
}
