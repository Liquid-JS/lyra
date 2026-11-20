import { Service } from '@angular/core'

import { NbChatCustomMessageDirective } from './chat-custom-message.directive'

/**
 * Holds the `nbCustomMessage` templates declared in a chat, by message type.
 */
@Service({ autoProvided: false })
export class NbChatCustomMessageService {
    protected readonly customMessages = new Map<string, NbChatCustomMessageDirective>()

    register(type: string, instance: NbChatCustomMessageDirective) {
        this.customMessages.set(type, instance)
    }

    unregister(type: string): boolean {
        return this.customMessages.delete(type)
    }

    getInstance(type: string): NbChatCustomMessageDirective | undefined {
        return this.customMessages.get(type)
    }
}
