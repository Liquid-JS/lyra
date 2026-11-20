import { Component, input } from '@angular/core'

@Component({
    selector: 'nb-custom-message-table',
    templateUrl: './chat-custom-message-table.component.html',
    styleUrls: ['./chat-custom-message-table.component.scss'],
    host: { '[class.reply]': 'isReply()' }
})
export class ChatCustomMessageTableComponent {
    readonly columns = input<string[]>([])

    readonly rows = input<Array<{ firstName: string, lastName: string, age: number }>>([])

    readonly isReply = input<boolean>()
}
