import { Component } from '@angular/core'
import { NbChatComponent, NbChatMessageComponent } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-chat-message-type-showcase',
    templateUrl: './chat-message-types-showcase.component.html',
    styles: [
        `
      nb-chat {
        margin: 0 auto;
        width: 500px;
      }
    `
    ],
    imports: [NbChatComponent, NbChatMessageComponent]
})
export class ChatMessageTypesShowcaseComponent {
    date = new Date()
}
