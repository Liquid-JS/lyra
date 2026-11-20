import { Routes } from '@angular/router'
import { provideNbChat } from '@liquid-js/lyr-core'

export const CHAT_ROUTES: Routes = [
    {
        path: '',
        providers: [
            provideNbChat()
        ],
        children: [
            {
                path: 'chat-colors.component',
                loadComponent: () => import('./chat-colors.component').then((m) => m.ChatColorsComponent)
            },
            {
                path: 'chat-conversation-showcase.component',
                loadComponent: () => import('./chat-conversation-showcase.component').then((m) => m.ChatConversationShowcaseComponent)
            },
            {
                path: 'chat-floating.component',
                loadComponent: () => import('./chat-floating.component').then((m) => m.ChatFloatingComponent)
            },
            {
                path: 'chat-drop.component',
                loadComponent: () => import('./chat-drop.component').then((m) => m.ChatDropComponent)
            },
            {
                path: 'chat-message-types-showcase.component',
                loadComponent: () => import('./chat-message-types-showcase.component').then((m) => m.ChatMessageTypesShowcaseComponent)
            },
            {
                path: 'chat-showcase.component',
                loadComponent: () => import('./chat-showcase.component').then((m) => m.ChatShowcaseComponent)
            },
            {
                path: 'chat-sizes.component',
                loadComponent: () => import('./chat-sizes.component').then((m) => m.ChatSizesComponent)
            },
            {
                path: 'chat-test.component',
                loadComponent: () => import('./chat-test.component').then((m) => m.ChatTestComponent)
            },
            {
                path: 'chat-custom-message.component',
                loadComponent: () => import('./chat-custom-message.component').then((m) => m.ChatCustomMessageComponent)
            },
            {
                path: 'chat-template-title.component',
                loadComponent: () => import('./chat-template-title.component').then((m) => m.ChatTemplateTitleComponent)
            }
        ]
    }
]
