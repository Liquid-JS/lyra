import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core'
import { provideClientHydration, REMOVE_STYLES_ON_COMPONENT_DESTROY, withEventReplay } from '@angular/platform-browser'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideRouter } from '@angular/router'
import {
    provideNbDialog,
    provideNbMenu,
    provideNbSidebar,
    provideNbTheme,
    provideNbToastr,
    provideNbWindow
} from '@liquid-js/lyr-core'
import { provideNbIcons } from '@liquid-js/lyr-icons'
import { provideHighlightOptions } from 'nxt-highlightjs'

import { structure } from '../structure'
import { routes } from './app.routes'
import { STRUCTURE } from './app.options'
import { provideDocs } from './docs-data'
import { themeEditorState } from './blocks/components/theme-editor-block/theme-editor-state'

/** The docs app's setup, in the browser and when its pages are prerendered. */
export const appConfig: ApplicationConfig = {
    providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptorsFromDi()),
        // A prerendered page carries on in the browser where it left off, and replays what was clicked before it did.
        provideClientHydration(withEventReplay()),
        provideRouter(routes),
        // The theme editor's saved themes.
        themeEditorState.providers,
        provideNbTheme(),
        provideNbMenu(),
        provideNbSidebar(),
        provideNbDialog(),
        provideNbWindow(),
        provideNbToastr(),
        provideNbIcons(),
        // The languages of the articles' and examples' code; the markdown examples highlight theirs too.
        provideHighlightOptions({
            coreLibraryLoader: () => import('highlight.js/lib/core').then((m) => m.default),
            languages: {
                typescript: () => import('highlight.js/lib/languages/typescript').then((m) => m.default),
                xml: () => import('highlight.js/lib/languages/xml').then((m) => m.default),
                scss: () => import('highlight.js/lib/languages/scss').then((m) => m.default),
                css: () => import('highlight.js/lib/languages/css').then((m) => m.default),
                json: () => import('highlight.js/lib/languages/json').then((m) => m.default),
                bash: () => import('highlight.js/lib/languages/bash').then((m) => m.default),
                nginx: () => import('highlight.js/lib/languages/nginx').then((m) => m.default)
            }
        }),
        { provide: STRUCTURE, useValue: structure },
        provideDocs(),
        {
            provide: REMOVE_STYLES_ON_COMPONENT_DESTROY,
            useValue: false
        }
    ]
}
