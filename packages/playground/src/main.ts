import { provideCheckNoChangesConfig, provideZonelessChangeDetection } from '@angular/core'
import { bootstrapApplication, REMOVE_STYLES_ON_COMPONENT_DESTROY } from '@angular/platform-browser'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideRouter } from '@angular/router'
import { provideNbTheme } from '@liquid-js/lyr-core'
import { provideNbIcons } from '@liquid-js/lyr-icons'
import { provideHighlightOptions } from 'nxt-highlightjs'

import { AppComponent } from './app/app.component'

bootstrapApplication(AppComponent, {
    providers: [
        provideZonelessChangeDetection(),
        // Catch views that changed without being marked, including changes made outside any event.
        provideCheckNoChangesConfig({ exhaustive: true, interval: 1000 }),
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter([
            {
                path: '',
                loadChildren: () => import('./playground/playground.routes').then((m) => m.PLAYGROUND_ROUTES)
            }
        ]),
        // The built-in themes: with none chosen, the one that fits the system's colour scheme.
        provideNbTheme({
            name: 'default',
            themes: [
                { name: 'default', scheme: 'light' },
                { name: 'dark', scheme: 'dark' },
                { name: 'cosmic', scheme: 'dark' },
                { name: 'corporate', scheme: 'light' },
                { name: 'material-light', scheme: 'light', label: 'Material light' },
                { name: 'material-dark', scheme: 'dark', label: 'Material dark' }
            ]
        }),
        provideNbIcons(),
        // Highlights code in the markdown examples.
        provideHighlightOptions({
            coreLibraryLoader: () => import('highlight.js/lib/core').then((m) => m.default),
            languages: {
                typescript: () => import('highlight.js/lib/languages/typescript').then((m) => m.default),
                xml: () => import('highlight.js/lib/languages/xml').then((m) => m.default),
                scss: () => import('highlight.js/lib/languages/scss').then((m) => m.default),
                bash: () => import('highlight.js/lib/languages/bash').then((m) => m.default)
            }
        }),
        {
            provide: REMOVE_STYLES_ON_COMPONENT_DESTROY,
            useValue: false
        }
    ]
}).catch((err) => console.info(err))
