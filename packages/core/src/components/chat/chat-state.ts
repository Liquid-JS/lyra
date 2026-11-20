import { Injectable, signal } from '@angular/core';

/**
 * A chat's state its messages read: whether the chat has rendered its first messages, so only messages added after
 * them animate in.
 */
@Injectable()
export class NbChatState {
  readonly settled = signal(false);
}
