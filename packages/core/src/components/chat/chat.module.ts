import { ModuleWithProviders, NgModule, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core'

import { NbButtonModule } from '@liquid-js/lyr-core/button'
import { NbInputModule } from '@liquid-js/lyr-core/input'
import { NbIconModule } from '@liquid-js/lyr-core/icon'

import { NbChatComponent } from './chat.component'
import { NbChatMessageComponent } from './chat-message.component'
import { NbChatFormComponent } from './chat-form.component'
import { NbChatMessageTextComponent } from './chat-message-text.component'
import { NbChatMessageFileComponent } from './chat-message-file.component'
import { NbChatMessageQuoteComponent } from './chat-message-quote.component'
import { NbChatMessageMapComponent } from './chat-message-map.component'
import { NbChatOptions } from './chat.options'
import { NbChatAvatarComponent } from './chat-avatar.component'
import { NbChatCustomMessageDirective } from './chat-custom-message.directive'
import { NbChatTitleDirective } from './chat-title.directive'

const NB_CHAT_COMPONENTS = [
    NbChatComponent,
    NbChatMessageComponent,
    NbChatFormComponent,
    NbChatMessageTextComponent,
    NbChatMessageFileComponent,
    NbChatMessageQuoteComponent,
    NbChatMessageMapComponent,
    NbChatAvatarComponent
]

const NB_CHAT_DIRECTIVES = [NbChatCustomMessageDirective, NbChatTitleDirective]

/**
 * Provides the chat options, in place of `NbChatModule.forRoot()` or `forChild()`.
 */
export function provideNbChat(options?: NbChatOptions): EnvironmentProviders {
    return makeEnvironmentProviders([{ provide: NbChatOptions, useValue: options || {} }])
}

@NgModule({
    imports: [NbIconModule, NbInputModule, NbButtonModule, ...NB_CHAT_COMPONENTS, ...NB_CHAT_DIRECTIVES],
    exports: [...NB_CHAT_COMPONENTS, ...NB_CHAT_DIRECTIVES]
})
export class NbChatModule {
    static forRoot(options?: NbChatOptions): ModuleWithProviders<NbChatModule> {
        return { ngModule: NbChatModule, providers: [provideNbChat(options)] }
    }

    static forChild(options?: NbChatOptions): ModuleWithProviders<NbChatModule> {
        return { ngModule: NbChatModule, providers: [provideNbChat(options)] }
    }
}
