import { Component, input } from '@angular/core';
import { SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'nb-chat-avatar',
  templateUrl: './chat-avatar.component.html',
  host: {
    class: 'avatar',
    '[style.background-image]': 'avatarStyle()',
  },
})
export class NbChatAvatarComponent {

  readonly initials = input<string>();

  readonly avatarStyle = input<SafeStyle>();
}
