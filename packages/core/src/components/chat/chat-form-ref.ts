import { NbComponentOrCustomStatus } from '@liquid-js/lyr-core/base'

/**
 * An `nb-chat-form`, for the chat it's in, which gives it its status. Querying this instead of the form component keeps
 * the form's code out of an app whose chats only show messages.
 */
export abstract class NbChatFormRef {
    abstract setStatus(status: NbComponentOrCustomStatus): void
}
