import { NgModule, ModuleWithProviders, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core'

import {
    NbSidebarComponent,
    NbSidebarFooterComponent,
    NbSidebarHeaderComponent
} from './sidebar.component'

import { NbSidebarService } from './sidebar.service'

const NB_SIDEBAR_COMPONENTS = [
    NbSidebarComponent,
    NbSidebarFooterComponent,
    NbSidebarHeaderComponent
]

/**
 * Provides the sidebar service, in place of `NbSidebarModule.forRoot()`.
 */
export function provideNbSidebar(): EnvironmentProviders {
    return makeEnvironmentProviders([NbSidebarService])
}

@NgModule({
    imports: [...NB_SIDEBAR_COMPONENTS],
    exports: [...NB_SIDEBAR_COMPONENTS]
})
export class NbSidebarModule {
    static forRoot(): ModuleWithProviders<NbSidebarModule> {
        return { ngModule: NbSidebarModule, providers: [provideNbSidebar()] }
    }
}
