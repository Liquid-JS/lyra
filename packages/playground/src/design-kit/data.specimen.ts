import { Component } from '@angular/core'

import { NbChatComponent, NbChatFormComponent, NbChatMessageComponent } from '@liquid-js/lyr-core'
import { TableShowcaseComponent } from '../playground/with-layout/table/table-showcase.component'
import { TreeGridShowcaseComponent } from '../playground/with-layout/tree-grid/tree-grid-showcase.component'

/** The table and tree grid as the playground shows them, each tagged whole, and a short conversation. */
@Component({
    template: `
        <div class="specimens">
            <div [attr.data-kit]="kit('table')"
                style="width: 48rem">
                <nb-table-showcase />
            </div>
            <div [attr.data-kit]="kit('tree-grid')"
                style="width: 48rem">
                <nb-tree-grid-showcase />
            </div>
            <nb-chat [attr.data-kit]="kit('chat')"
                title="Support"
                size="large"
                [scrollBottom]="false"
                style="width: 28rem">
                <nb-chat-message message="Hi! How can we help?"
                    sender="Alex Taylor"
                    [date]="sent" />
                <nb-chat-message message="My invoice shows the wrong address."
                    sender="Jane Doe"
                    [date]="sent"
                    reply />
                <nb-chat-message message="Sorry about that, I've fixed it and sent a new one."
                    sender="Alex Taylor"
                    [date]="sent" />
                <nb-chat-form messagePlaceholder="Type a message" />
            </nb-chat>
        </div>
    `,
    imports: [TableShowcaseComponent, TreeGridShowcaseComponent, NbChatComponent, NbChatMessageComponent, NbChatFormComponent]
})
export class DataSpecimenComponent {
    readonly kit = (component: string) => JSON.stringify({ component })
    readonly sent = new Date(2026, 2, 18, 9, 30)
}
