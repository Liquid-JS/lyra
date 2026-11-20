import { Component, signal } from '@angular/core';
import {
  NbBadgeComponent,
  NbButtonComponent,
  NbCardComponent,
  NbCardHeaderComponent,
  NbChatComponent,
  NbChatFormComponent,
  NbChatMessageComponent,
  NbIconComponent,
  NbListComponent,
  NbListItemComponent,
  NbUserComponent,
} from '@liquid-js/lyr-core';

import { Channel, CHANNELS, Message, MESSAGES, photoOf } from './hub-data';

/** The company chat: the channels and direct messages, and the open channel's conversation. */
@Component({
  selector: 'npg-hub-chat',
  templateUrl: './hub-chat.component.html',
  styleUrls: ['./hub-chat.component.scss'],
  imports: [
    NbBadgeComponent,
    NbButtonComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbChatComponent,
    NbChatFormComponent,
    NbChatMessageComponent,
    NbIconComponent,
    NbListComponent,
    NbListItemComponent,
    NbUserComponent,
  ],
})
export class HubChatComponent {
  readonly channels = CHANNELS;
  readonly photoOf = photoOf;
  readonly open = signal<Channel>(CHANNELS[0]);
  readonly messages = signal<Message[]>(MESSAGES);

  readonly channelsOnly = CHANNELS.filter((channel) => !channel.direct);
  readonly direct = CHANNELS.filter((channel) => channel.direct);

  select(channel: Channel) {
    this.open.set(channel);
  }

  send({ message }: { message: string }) {
    if (message.trim()) {
      this.messages.update((messages) => [...messages, { sender: 'Jane Doe', text: message, date: new Date(), reply: true }]);
    }
  }
}
